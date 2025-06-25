const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const moment = require('moment'); 
const saltRounds = 10;

mp.events.add('getLatestNews', (player) => {
    const query = 'SELECT * FROM news ORDER BY published_at DESC LIMIT 3';

    DB.query(query, (err, results) => {
        if (err) {
            console.error('Ошибка получения новостей: ', err);
            player.call('showNotification', ['Ошибка', 'Не удалось загрузить новости']);
            return;
        }

        const news = results.map(row => ({
            id: row.id,
            content: row.content,
            image_url: row.image_url || 'img/404.png', 
            published_at: moment(row.published_at).format('HH:mm DD.MM.YYYY') 
        }))

        player.call('updateNews', [JSON.stringify(news)]);
    });
});

const secretKey = "16$#6u&jy*%ouzz*29ypt0(n2psi5+#c7ge1hl%2dceg_%uql&"; 
const usernamePattern = /^[a-zA-Z0-9]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const lastFailedRequestTime = new Map();

function canRetry(player, actionType) {
    const now = Date.now();
    const lastAttempt = lastFailedRequestTime.get(`${player.id}_${actionType}`) || 0;
    return now - lastAttempt >= 3000; 
}

function updateLastFailedRequest(player, actionType) {
    lastFailedRequestTime.set(`${player.id}_${actionType}`, Date.now());
}
mp.events.add('registerPlayer', (player, username, email, password) => {
    if (!canRetry(player, 'register')) {
        mp.events.call('notificationAUTH', player, 'Слишком быстро', 'Подождите 3 секунды');
        return;
    }
    if (!username || !email || !password) {
        mp.events.call('notificationAUTH', player, 'Все поля должны быть заполнены', 'Заполните все инпуты');
        updateLastFailedRequest(player, 'register');
        return;
    }

    if (username.length < 3 || username.length > 20 || !usernamePattern.test(username)) {
        mp.events.call('notificationAUTH', player, 'Логин должен содержать от 3 до 20 символов и быть корректным', 'Заполните инпут корректно');
        updateLastFailedRequest(player, 'register');
        return;
    }

    if (!emailPattern.test(email)) {
        mp.events.call('notificationAUTH', player, 'Неверный формат электронной почты', 'Заполните инпут корректно');
        updateLastFailedRequest(player, 'register');
        return;
    }

    if (password.length < 8) {
        mp.events.call('notificationAUTH', player, 'Пароль должен содержать минимум 8 символов', 'Заполните инпут корректно');
        updateLastFailedRequest(player, 'register');
        return;
    }

    const social = player.socialClub || 'unknown';

    DB.query('SELECT * FROM users WHERE username = ? OR email = ? OR social = ?', [username, email, social], (err, results) => {
        if (err) {
            console.error('Ошибка базы данных при проверке: ' + err);
            mp.events.call('notificationAUTH', player, 'Произошла ошибка при проверке пользователей', 'Обратитесь в тех. поддержку');
            updateLastFailedRequest(player, 'register');
            return;
        }

        if (results.some(row => row.username === username)) {
            mp.events.call('notificationAUTH', player, 'Логин уже занят', 'Добавьте в логин цифры, либо буквы');
            updateLastFailedRequest(player, 'register');
            return;
        }

        if (results.some(row => row.email === email)) {
            mp.events.call('notificationAUTH', player, 'Этот адрес электронной почты уже используется', 'Введите другую почту');
            updateLastFailedRequest(player, 'register');
            return;
        }

        if (results.some(row => row.social === social)) {
            mp.events.call('notificationAUTH', player, 'Этот Social Club уже привязан к другому аккаунту', 'Войдите в аккаунт или используйте другой Social Club');
            updateLastFailedRequest(player, 'register');
            return;
        }

        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.error('Ошибка хэширования пароля: ' + err);
                mp.events.call('notificationAUTH', player, 'Произошла ошибка при регистрации', 'Обратитесь в тех. поддержку');
                updateLastFailedRequest(player, 'register');
                return;
            }

            const ip = player.ip;
            const hwid = player.serial;
            const socialid = player.rgscId || 'unknown';

            DB.query('INSERT INTO users (username, email, password, ip, social, rgscId, hwid) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, email, hashedPassword, ip, social, socialid, hwid], (err, result) => {
                if (err) {
                    console.error('Ошибка базы данных при вставке: ' + err);
                    mp.events.call('notificationAUTH', player, 'Произошла ошибка при регистрации', 'Обратитесь в тех. поддержку');
                    updateLastFailedRequest(player, 'register');
                    return;
                }

                const userId = result.insertId;

                player.setVariable('authorize', true);
                player.setVariable('static', userId);
                player.setVariable('DP', 0);
                player.setVariable('vip', 0);

                player.name = username;
                player.static = userId;

                console.log(`[AUTH] Пользователь ${player.id} зарегистрировал аккаунт ${username}#${userId}`);

                const token = jwt.sign({ id: userId, username: username }, secretKey); 
                player.call('authSuccess', [username, token]); 
            });
        });
    });
});

mp.events.add('loginPlayer', (player, username, password) => {
    if (!canRetry(player, 'login')) {
        mp.events.call('notificationAUTH', player, 'Слишком быстро', 'Подождите 3 секунды');
        return;
    }
    if (!username || !password) {
        mp.events.call('notificationAUTH', player, 'Введите имя пользователя и пароль', 'Заполните все инпуты');
        return;
    }

    DB.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Ошибка базы данных при проверке: ' + err);
            mp.events.call('notificationAUTH', player, 'Произошла ошибка при проверке пользователя', 'Обратитесь в тех. поддержку');
            updateLastFailedRequest(player, 'login');
            return;
        }

        if (results.length === 0) {
            mp.events.call('notificationAUTH', player, 'Неверное имя пользователя или пароль', 'Ввели верные данные? Обратитесь в тех. поддержку');
            updateLastFailedRequest(player, 'login');
        } else {
            const user = results[0];
            if (!user.social || user.social === 'unknown') {
                const newSocial = player.socialClub || 'unknown';
                DB.query('UPDATE users SET social = ? WHERE id = ?', [newSocial, user.id], (updateErr) => {
                    if (updateErr) {
                        console.error('Ошибка обновления socialClub: ' + updateErr);
                        mp.events.call('notificationAUTH', player, 'Произошла ошибка при обновлении socialClub', 'Обратитесь в тех. поддержку');
                        return;
                    }
                    console.log(`[AUTH] SocialClub пользователя ${username} обновлен: ${newSocial}`);
                });
                user.social = newSocial;
            }
            if (user.social !== player.socialClub) {
                mp.events.call('notificationAUTH', player, 'SocialClub не совпадает', 'Обратитсеь в тех. поддержку, они сменят SocialClub');
                player.call('authFailed');
                return;
            }
            DB.query('SELECT * FROM bans WHERE user = ? AND status = 1', [user.id], (banErr, banResults) => {
                if (banErr) {
                    console.error('Ошибка базы данных при проверке бана: ' + banErr);
                    mp.events.call('notification', player, 'error', 'Произошла ошибка при проверке бана', 'Обратитсеь в тех. поддержку');
                    updateLastFailedRequest(player, 'login');
                    return;
                }

                if (banResults.length > 0) {
                    const ban = banResults[0];
                    const currentDate = moment();
                    const unbanDate = moment(ban.temp);

                    if (currentDate.isAfter(unbanDate)) {
                        DB.query('UPDATE bans SET status = 0 WHERE user = ?', [user.id], (updateErr) => {
                            if (updateErr) {
                                console.error('Ошибка базы данных при обновлении статуса бана: ' + updateErr);
                                mp.events.call('notificationAUTH', player, 'Произошла ошибка при обновлении статуса бана', 'Обратитсеь в тех. поддержку');
                                return;
                            }

                            console.log(`[SERVER] Бан пользователя ${user.id} истек`);
                        });
                    } else {
                        DB.query('SELECT username FROM users WHERE id = ?', [ban.moderator], (modErr, modResults) => {
                            if (modErr || modResults.length === 0) {
                                console.error('Ошибка при получении логина модератора: ' + modErr);
                                player.call('authFailed');
                                return;
                            }

                            const moderatorUsername = modResults[0].username;  

                            const unbanDateStr = unbanDate.format('HH:mm, DD.MM.YY');

                            player.call('banb', [
                                `${user.username}`,
                                `${user.id}`,
                                `${moderatorUsername}`,
                                `${moment(ban.time).format('HH:mm, DD.MM.YY')}`,
                                `${unbanDateStr}`,
                                `${ban.reason}`
                            ]);
                        });
                        return;
                    }
                }

                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        console.error('Ошибка сравнения пароля: ' + err);
                        mp.events.call('notificationAUTH', player, 'Произошла ошибка при авторизации', 'Обратитсеь в тех. поддержку');
                        updateLastFailedRequest(player, 'login');
                        return;
                    }

                    if (!result) {
                        mp.events.call('notificationAUTH', player, 'Неверное имя пользователя или пароль', 'Произошла ошибка при авторизации');
                        updateLastFailedRequest(player, 'login');
                    } else {
                        const token = jwt.sign({ id: user.id, username: username }, secretKey); 

                        player.loggedIn = true;
                        const ip = player.ip;

                        DB.query('UPDATE users SET last_ip = ?, updated_at = NOW() WHERE username = ?', [ip, username], (err) => {
                            if (err) {
                                console.error('Ошибка базы данных при обновлении IP-адреса: ' + err);
                                mp.events.call('notificationAUTH', player, 'Произошла ошибка при обновлении IP-адреса', 'Обратитсеь в тех. поддержку');
                                updateLastFailedRequest(player, 'login');
                                return;
                            }

                            const prefix = user.prefix;
                            const DP = user.DP; 
                            player.chip = user.chip;
                            player.setVariable('prefix', prefix);  
                            player.setVariable('DP', DP);  

                            player.setVariable('authorize', true);
                            player.setVariable('static', user.id);
                            player.setVariable('vip', user.vip);

                            player.name = user.username;
                            player.static = user.id;

                            console.log(`[AUTH] Пользователь ${player.id} авторизовался как ${user.username}#${user.id}`);
                            player.call('authSuccess', [user.username, token]); 
                        });
                    }
                });
            });
        }
    });
});

mp.events.add('validateAuthToken', (player, token) => {
    try {
        const decoded = jwt.verify(token, secretKey);

        DB.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
            if (err || results.length === 0) {
                player.call('authFailed'); 
                return;
            }


            const user = results[0];
            if (user.social !== player.socialClub) {
                player.call('authFailed');
                return;
            }
            DB.query('SELECT * FROM bans WHERE user = ? AND status = 1', [user.id], (banErr, banResults) => {
                if (banErr) {
                    console.error('Ошибка базы данных при проверке бана: ' + banErr);
                    player.call('authFailed');
                    return;
                }

                if (banResults.length > 0) {
                    const ban = banResults[0];
                    const currentDate = moment();
                    const unbanDate = moment(ban.temp);

                    if (currentDate.isAfter(unbanDate)) {
                        DB.query('UPDATE bans SET status = 0 WHERE user = ?', [user.id], (updateErr) => {
                            if (updateErr) {
                                console.error('Ошибка базы данных при обновлении статуса бана: ' + updateErr);
                                player.call('authFailed');
                                return;
                            }

                            console.log(`[SERVER] Бан пользователя ${user.id} истек`);
                        });
                    } else {
                        DB.query('SELECT username FROM users WHERE id = ?', [ban.moderator], (modErr, modResults) => {
                            if (modErr || modResults.length === 0) {
                                console.error('Ошибка при получении логина модератора: ' + modErr);
                                player.call('authFailed');
                                return;
                            }

                            const moderatorUsername = modResults[0].username;  

                            const unbanDateStr = unbanDate.format('HH:mm, DD.MM.YY');

                            player.call('banb', [
                                `${user.username}`,
                                `${user.id}`,
                                `${moderatorUsername}`,
                                `${moment(ban.time).format('HH:mm, DD.MM.YY')}`,
                                `${unbanDateStr}`,
                                `${ban.reason}`
                            ]);
                        });
                        return;
                    }
                }


                const ip = player.ip;
                DB.query('UPDATE users SET last_ip = ?, updated_at = NOW() WHERE id = ?', [ip, user.id], (updateErr) => {
                    if (updateErr) {
                        console.error('Ошибка базы данных при обновлении IP-адреса: ' + updateErr);
                    }
                });

                player.loggedIn = true;
                player.setVariable('authorize', true);
                player.setVariable('static', user.id);
                player.name = user.username;
                player.static = user.id;
                player.setVariable('vip', user.vip);

                const prefix = user.prefix;
                const DP = user.DP;

                player.setVariable('DP', DP); 
                player.setVariable('prefix', prefix);

                console.log(`[AUTH] Пользователь ${player.id} вошел по токену как ${user.username}#${user.id}`);
                
                player.call('authSuccess', [user.username, token]); 
            });
        });
    } catch (err) {
        player.call('authFailed');
    }
});