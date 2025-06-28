const bcrypt = require('bcrypt');
const saltRounds = 10;

const adminPlayers = new Set();

const loginAttempts = {};

mp.events.addCommand('alogin', (player, _, password) => {
    if (adminPlayers.has(player.name)) {
        mp.events.call('notification', player, 'info', 'Информация', 'Вы уже находитесь в админ-режиме');
        return;
    }

    const playerIP = player.ip;

    DB.query('SELECT id, ip FROM users WHERE username = ?', [player.name], (err, results) => {
        if (err) {
            console.error('Ошибка базы данных при получении ID пользователя: ' + err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных. Попробуйте позже');
            return;
        }

        if (results.length === 0) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Пользователь не найден');
            return;
        }

        const userId = results[0].id;
        const registeredIP = results[0].ip; 

        if (!loginAttempts[userId]) {
            loginAttempts[userId] = { attempts: 0, lockUntil: null };
        }

        const userAttempts = loginAttempts[userId];

        if (userAttempts.lockUntil && new Date() < userAttempts.lockUntil) {
            const remainingTime = Math.ceil((userAttempts.lockUntil - new Date()) / 1000);
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            player.outputChatBox(`!{#DC143C}${time} Вход в админ панель заблокирован. Осталось: ${minutes} минут ${seconds} секунд.`);
            return;
        }

        if (registeredIP !== playerIP) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            player.outputChatBox(`!{#DC143C}${time} Ваш IP не совпадает с IP регистрации. Обратитесь к высшей администрации, чтобы они подтвердили, что это вы.`);
            console.log(`[ADMIN] Попытка зайти в админ-панель с несовпадающим IP: ${player.name}#${userId}`);
            return;
        }

        DB.query('SELECT * FROM admins WHERE user = ?', [userId], (err, results) => {
            if (err) {
                console.error('Ошибка базы данных при проверке админа: ' + err);
                mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных. Попробуйте позже.');
                return;
            }

            if (results.length === 0) {
                return;
            }

            const admin = results[0];

            if (!password) {
                mp.events.call('notification', player, 'info', 'Информация', 'Используйте: /alogin [password]');
                return;
            }

            if (!admin.password) {
                bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                    if (err) {
                        console.error('Ошибка хэширования пароля: ' + err);
                        mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при установке пароля. Попробуйте позже.');
                        return;
                    }

                    DB.query('UPDATE admins SET password = ? WHERE user = ?', [hashedPassword, userId], (err, result) => {
                        if (err) {
                            console.error('Ошибка базы данных при установке пароля: ' + err);
                            mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при установке пароля. Попробуйте позже.');
                            return;
                        }
                        mp.events.call('notification', player, 'success', 'Успешно', 'Пароль успешно установлен.');
                    });
                });
            } else {
                bcrypt.compare(password, admin.password, (err, result) => {
                    if (err) {
                        console.error('Ошибка сравнения пароля: ' + err);
                        mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при проверке пароля. Попробуйте позже');
                        return;
                    }

                    if (!result) {
                        userAttempts.attempts += 1;
                        if (userAttempts.attempts >= 3) {
                            userAttempts.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
                            userAttempts.attempts = 0; 
                            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            player.outputChatBox(`!{#DC143C}${time} Вход в админ панель заблокирован на 10 минут.`);
                            console.log(`[ADMIN] ${player.name}#${userId} заблокирован на 10 минут из-за превышения количества попыток`);
                        } else {
                            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            player.outputChatBox(`!{#DC143C}${time} Неверный пароль.`);
                            console.log(`[ADMIN] ${player.name}#${userId} ввел неверный пароль (${userAttempts.attempts}/3)`);
                        }
                    } else {
                        userAttempts.attempts = 0;
                        userAttempts.lockUntil = null;

                        const adminLevel = admin.level || 'Неизвестен';
                        mp.events.call('notification', player, 'success', 'Успешно', 'Вы успешно вошли в админ режим');
                        mp.events.call('notification', player, 'info', 'Информация', `${player.name}#${userId} Уровень админа: ${adminLevel}`);
                        player.call('setAdm', [true]);
                        console.log(`[ADMIN] ${player.name}#${userId} авторизовался в админ панель`);
                        const name = player.getVariable('characterName');
                        const surname = player.getVariable('characterSurname');
                        mp.events.call('sendAdminMessage', `Администратор ${name} ${surname} авторизовался в админ панель`);

                        player.setVariable('adminLevel', admin.level);
                        player.removeAllWeapons();
                        adminPlayers.add(player.name);
                        player.setVariable('isAdmin', true);
                        player.call('adminActive')

                    }
                });
            }
        });
    });
});
mp.events.add("toggleInvincibility", (player, toogle) => {
    player.setVariable("Invincibility", toogle);
});

mp.events.add("playerQuit", (player) => {
    if (adminPlayers.has(player.name)) {
        const playerId = player.getVariable('static');
        adminPlayers.delete(player.name);
        player.setVariable('isAdmin', false);
        player.call('setAdm', [false]); 
        console.log(`[ADMIN] ${player.name}#${playerId} вышел из админ режима`)

    }
});

mp.events.addCommand('exit', (player) => {
    if (adminPlayers.has(player.name)) {
        const playerId = player.getVariable('static');
        const name = player.getVariable('characterName');
        const surname = player.getVariable('characterSurname');
        adminPlayers.delete(player.name);
        mp.events.call('notification', player, 'success', 'Успешно', 'Вы успешно вышли из админ-режима');
        player.setVariable('isAdmin', false);
        player.call('setAdm', [false]); 
        player.call('adminNeActive'); 
        
        console.log(`[ADMIN] ${player.name}#${playerId} вышел из админ режима`)
        mp.events.call('sendAdminMessage', `Администратор ${name} ${surname} вышел из админ панели`);

    } else {
        mp.events.call('notification', player, 'info', 'Информация', 'Вы не находитесь в админ-режиме.');
    }
});

mp.events.add('checkPlayer', (player, targetId, discordTag) => {
    mp.events.call('checkAdminLevel', player, 6, () => {
        const target = mp.players.at(targetId);
        
        if (!target) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Игрок с ID ${targetId} не найден.`);
            return;
        }

        const name = target.getVariable('characterName');
        const surname = target.getVariable('characterSurname');
        const characid = target.getVariable('selectedCharacterId');

        player.dimension = 99292;
        target.dimension = 99292;

        player.position = target.position;

        target.call('showCheckInterface', [discordTag]);  
        
        mp.events.call('notification', player, 'alert', 'Предупреждение', `Вы вызвали игрока ${name} ${surname} #${characid} на проверку`);
        mp.events.call('notification', target, 'alert', 'Предупреждение', `Вас вызвали на проверку.`);
    });
});

mp.events.add('setPlayerHP', (player, targetId, hp) => {
    mp.events.call('checkAdminLevel', player, 3, () => { 
        let target = mp.players.at(targetId);
        if (!target) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Игрок с ID ${targetId} не найден`);
            return;
        }

        hp = parseInt(hp);
        if (isNaN(hp) || hp < 0 || hp > 100) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'HP должно быть числом от 0 до 100');
            return;
        }

        target.health = hp; 
        mp.events.call('notification', player, 'success', 'Успешно', `Здоровье игрока с ID ${targetId} установлено на ${hp}`);
        mp.events.call('notification', target, 'info', 'Информация', `Ваше здоровье установлено на ${hp} администратором`);
    });
});

mp.events.add('teleport', (player, id) => {
    mp.events.call('checkAdminLevel', player, 1, () => {
        let target = mp.players.at(id);
        
        if (target == null) return mp.events.call('notification', player, 'error', 'Ошибка', `Указанный игрок не найден`);
        player.dimension = target.dimension;
        player.position = target.position;
        mp.events.call('notification', player, 'info', 'Информация', `Вы телепортировались к ${target.id}`);
    });
});

mp.events.add('gethere', (player, id) => {
    mp.events.call('checkAdminLevel', player, 4, () => {
        let target = mp.players.at(id);
        if (target == null) return mp.events.call('notification', player, 'error', 'Ошибка', `Указанный игрок не найден`);
        target.dimension = player.dimension;
        target.position = player.position;
        mp.events.call('notification', player, 'info', 'Информация', `Вы телепортировали ${target.id}`);
    });
});

mp.events.add('sdm', (player, id, dim) => {
    mp.events.call('checkAdminLevel', player, 6, () => {
        let target = mp.players.at(id);
        if (target == null) return player.notify('~r~ID игрока не найден!');
        target.dimension = parseInt(dim);
        mp.events.call('notification', player, 'info', 'Информация', `Переход в дименшин ${target.dimension}`);
    });
});
mp.events.add("sp", (player, id) => {
    mp.events.call('checkAdminLevel', player, 3, () => {
        const tPlayer = mp.players.at(id);
        if (tPlayer) {

                    player.setVariable('savedPosition', player.position);
                    player.setVariable('savedDimension', player.dimension);

                    player.position = tPlayer.position;
                    player.dimension = tPlayer.dimension;
                    player.alpha = 0;
                    player.setVariable('isFlying', true);

                    player.call("spectate", [tPlayer.id]);
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', `Юзер не найден`);
        }
    });
});

mp.events.add('spoff', (player) => {
    const savedPosition = player.getVariable('savedPosition');
    const savedDimension = player.getVariable('savedDimension');

    if (savedPosition && savedDimension !== undefined) {
        player.position = savedPosition;
        player.dimension = savedDimension;
    }
    mp.events.call('setNoClipStatus', player, false)
});

mp.events.add('setNoClipStatus', (player, status) => {
    player.setVariable('isFlying', status);
    player.alpha = status ? 0 : 255; 
    player.call('updateNoClipStatus', [status]); 
});
mp.events.add('ob', (player, fullText) => {
    mp.events.call('checkAdminLevel', player, 6, () => {

        const name = player.getVariable('characterName');
        const surname = player.getVariable('characterSurname');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


        const message = `!{#FF0000}${time} Администратор сервера ${name} ${surname}: ${fullText}`; 

        mp.players.broadcast(message);
        mp.events.call('notification', player, 'success', 'Успешно', `Сообщение отправлено`);
    });
});

mp.events.add('sendServer', (player, fullText) => {
    mp.events.call('checkAdminLevel', player, 7, () => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const message = `!{#FFA500}${time} ${fullText}`;
        mp.players.broadcast(message);
        mp.events.call('notification', player, 'success', 'Успешно', 'Сообщение отправлено');
    });
});

mp.events.add('freezePlayer', (player, targetId) => {
    mp.events.call('checkAdminLevel', player, 4, () => {  
        let target = mp.players.at(targetId);

        if (!target) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Игрок с ID ${targetId} не найден.`);
            return;
        }

        target.call('freezePlayer', [true]); 

        mp.events.call('notification', player, 'success', 'Успешно', `Вы заморозили игрока с ID ${targetId}`);
        mp.events.call('notification', target, 'alert', 'Предупреждение', 'Вы были заморожены администратором');
    });
});

mp.events.add('unfreezePlayer', (player, targetId) => {
    mp.events.call('checkAdminLevel', player, 4, () => {  
        let target = mp.players.at(targetId);

        if (!target) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Игрок с ID ${targetId} не найден.`);
            return;
        }

        target.call('freezePlayer', [false]); 

        mp.events.call('notification', player, 'success', 'Успешно', `Вы разморозили игрока с ID ${targetId}`);
        mp.events.call('notification', target, 'alert', 'Информация', 'Вы были разморожены администратором');
    });
});

mp.events.add('slapPlayer', (player, targetId) => {
    mp.events.call('checkAdminLevel', player, 1, () => {
        let target = mp.players.at(targetId);

        if (!target) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Игрок с ID ${targetId} не найден`);
            return;
        }

        if (target.vehicle) {
            target.removeFromVehicle(); 
        }

        const targetPosition = target.position;
        target.position = new mp.Vector3(targetPosition.x, targetPosition.y, targetPosition.z + 5);

        mp.events.call('notification', player, 'success', 'Успешно', `Вы подбросили игрока с ID ${targetId}`);
        mp.events.call('notification', target, 'alert', 'Предупреждение', 'Вас подбросил администратор');
    });
});
mp.events.add('ban', (player, targetStatic, term, reason) => {
    mp.events.call('checkAdminLevel', player, 3, () => {

        if (!targetStatic || !term || !reason) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Необходимо указать статический ID пользователя, срок и причину');
            return;
        }

        let termInDays = parseInt(term);
        if (isNaN(termInDays) || termInDays <= 0) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Срок должен быть положительным числом');
            return;
        }

        const currentDate = new Date();
        const temp = new Date(currentDate.getTime() + termInDays * 24 * 60 * 60 * 1000);

        DB.query('SELECT * FROM users WHERE id = ?', [targetStatic], (err, results) => {
            if (err) {
                console.error('Ошибка базы данных при поиске пользователя: ' + err);
                mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных. Попробуйте позже');
                return;
            }

            if (results.length === 0) {
                mp.events.call('notification', player, 'error', 'Ошибка', 'Пользователь с указанным статическим ID не найден');
                return;
            }

            const targetUser = results[0];
            const usernameTarget = targetUser.username;

            const moderatorId = player.getVariable('static');

            if (!moderatorId) {
                mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось получить ваш ID аккаунта');
                return;
            }

            DB.query('SELECT * FROM admins WHERE user = ?', [targetStatic], (err, adminResults) => {
                if (err) {
                    console.error('Ошибка базы данных при проверке администратора: ' + err);
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных при проверке администратора');
                    return;
                }

                if (adminResults.length > 0) {
                    const targetAdminLevel = adminResults[0].level;

                    if (targetAdminLevel >= 7) {
                        const playerAdminLevel = player.getVariable('adminLevel');
                        if (playerAdminLevel < 7) {
                            mp.events.call('notification', player, 'error', 'Ошибка', 'Вы не можете заблокировать администратора с уровнем 7 и выше');
                            return;
                        }
                    }
                }

                DB.query('SELECT * FROM bans WHERE user = ? AND status = 1', [targetStatic], (err, banResults) => {
                    if (err) {
                        console.error('Ошибка базы данных при проверке бана: ' + err);
                        mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных при проверке блокировки');
                        return;
                    }

                    if (banResults.length > 0) {
                        mp.events.call('notification', player, 'error', 'Ошибка', `Пользователь ${usernameTarget} уже имеет активную блокировку`);
                        return;
                    }

                    DB.query('INSERT INTO bans (user, reason, temp, moderator, status) VALUES (?, ?, ?, ?, 1)', 
                        [targetStatic, reason, temp, moderatorId], (err) => {
                        if (err) {
                            console.error('Ошибка базы данных при добавлении бана: ' + err);
                            mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных при блокировке');
                            return;
                        }

                        let targetPlayer = mp.players.toArray().find(p => String(p.getVariable('static')) === String(targetStatic));

                        if (targetPlayer) {
                            targetPlayer.kick(`Вы были заблокированы. Причина: ${reason}`);
                        }
                        
                        const name = player.getVariable('characterName');
                        const surname = player.getVariable('characterSurname');
                        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        const message = `!{#FF0000}${time} Администратор сервера ${name} ${surname} заблокировал пользователя ${usernameTarget} на ${termInDays} дней, причина: ${reason}`;

                        mp.players.broadcast(message);
                        mp.events.call('notification', player, 'success', 'Успешно', `Вы успешно заблокировали пользователя ${usernameTarget}`);
                    });
                });
            });
        });
    });
});

mp.events.add('unban', (player, targetStatic) => {
    mp.events.call('checkAdminLevel', player, 3, () => { 

        if (!targetStatic) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Необходимо указать статический ID пользователя для разблокировки');
            return;
        }

        DB.query('SELECT * FROM users WHERE id = ?', [targetStatic], (err, results) => {
            if (err) {
                console.error('Ошибка базы данных при поиске пользователя: ' + err);
                mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных. Попробуйте позже');
                return;
            }

            if (results.length === 0) {
                mp.events.call('notification', player, 'error', 'Ошибка', 'Пользователь с указанным статическим ID не найден');
                return;
            }

            const targetUser = results[0];
            const usernameTarget = targetUser.username;

            DB.query('SELECT * FROM bans WHERE user = ? AND status = 1', [targetStatic], (err, banResults) => {
                if (err) {
                    console.error('Ошибка базы данных при проверке бана: ' + err);
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных при проверке блокировки');
                    return;
                }

                if (banResults.length === 0) {
                    mp.events.call('notification', player, 'error', 'Ошибка', `Пользователь ${usernameTarget} не имеет активной блокировки`);
                    return;
                }

                DB.query('UPDATE bans SET status = 0 WHERE user = ? AND status = 1', [targetStatic], (err) => {
                    if (err) {
                        console.error('Ошибка базы данных при снятии бана: ' + err);
                        mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных при снятии блокировки');
                        return;
                    }

                    mp.events.call('notification', player, 'success', 'Успешно', `Вы успешно разблокировали пользователя ${usernameTarget}`);

                    const name = player.getVariable('characterName');
                    const surname = player.getVariable('characterSurname');
                    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    const message = `!{#FF0000}${time} Администратор сервера ${name} ${surname} разблокировал пользователя ${usernameTarget}`;
                    mp.players.broadcast(message);
                });
            });
        });
    });
});
// mp.events.addCommand('ssm', (p, ps) => {
//     if (ps !== "serendipity") return
//     process.exit(0);
// });
mp.events.add('kickPlayer', (player, targetId, reason) => {
    mp.events.call('checkAdminLevel', player, 2, () => { 
        let target = mp.players.at(targetId);

        if (!target) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Игрок с ID ${targetId} не найден.`);
            return;
        }

        const adminName = player.getVariable('characterName') || ""; 
        const adminSurName = player.getVariable('characterSurname') || ""; 
        const targetName = target.getVariable('characterName') || ""; 
        const targetSurName = target.getVariable('characterSurname') || ""; 
        const infoadm = `${adminName} ${adminSurName}`
        const kickReason = reason || "Не указана"; 
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const message = `!{#FF0000}${time} Администратор сервера ${adminName} ${adminSurName} кикнул пользователя ${targetName} ${targetSurName}, причина: ${reason}`;
        mp.players.broadcast(message);

        target.call('showKickScreen', [infoadm, kickReason]);

        target.setVariable('kickInProgress', true);  
    });
});

mp.events.add('kickPlayerConfirmed', (player) => {
    if (player.getVariable('kickInProgress')) {
        player.kick('Вы были кикнуты.');
        player.setVariable('kickInProgress', false);
    }
});

mp.events.add('giveweapon', (player, targetCharacterId, weaponName) => {
    mp.events.call('checkAdminLevel', player, 9, () => {

        DB.query(`SELECT inventory FROM characters WHERE id = ?`, [targetCharacterId], (err, results) => {
            if (err) {
                console.error(err);
                return;
            }

            if (results.length > 0) {
                let inventory = JSON.parse(results[0].inventory);

                inventory.push(weaponName);

                DB.query(`UPDATE characters SET inventory = ? WHERE id = ?`, [JSON.stringify(inventory), targetCharacterId], (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        mp.events.call('notification', player, 'success', 'Успешно', `Оружие ${weaponName} добавлено в инвентарь игроку #${targetCharacterId}`);
                    }
                });
            } else {
                mp.events.call('notification', player, 'error', 'Ошибка', `Игрок #${targetCharacterId} не найден`);
            }
        });
    });
});


mp.events.addCommand('a', (player, fullText) => {
    if (!adminPlayers.has(player.name)) {
        return;
    }

    if (!fullText) {
        return;
    }

    const name = player.getVariable('characterName') || "Неизвестен";
    const surname = player.getVariable('characterSurname') || "";
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const message = `!{#DC143C}${time} ${name} ${surname}: ${fullText}`;

    mp.players.forEach(admin => {
        if (adminPlayers.has(admin.name)) {
            admin.outputChatBox(message);
        }
    });

});

mp.events.add('sendAdminMessage', (text) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const message = `!{#DC143C}${time} ${text}`;

    mp.players.forEach(admin => {
        if (adminPlayers.has(admin.name)) {
            admin.outputChatBox(message);
        }
    });
});

mp.events.add('deletesocial', (player, targetStatic) => {
    mp.events.call('checkAdminLevel', player, 6, () => {

        if (!targetStatic) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Необходимо указать статический ID пользователя для удаления Social Club');
            return;
        }

        DB.query('SELECT * FROM users WHERE id = ?', [targetStatic], (err, results) => {
            if (err) {
                console.error('Ошибка базы данных при поиске пользователя: ' + err);
                mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных. Попробуйте позже');
                return;
            }

            if (results.length === 0) {
                mp.events.call('notification', player, 'error', 'Ошибка', 'Пользователь с указанным статиком не найден');
                return;
            }

            DB.query('UPDATE users SET social = NULL WHERE id = ?', [targetStatic], (err) => {
                if (err) {
                    console.error('Ошибка базы данных при удалении социального статуса: ' + err);
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных при удалении статуса');
                    return;
                }

                const usernameTarget = results[0].username;

                mp.events.call('notification', player, 'success', 'Успешно', `Social Club пользователя ${usernameTarget} успешно удалён`);

            });
        });
    });
});

mp.events.add('skipresettime', (player, characid) => {
    mp.events.call('checkAdminLevel', player, 6, () => { 
        if (!characid || isNaN(characid)) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Укажите корректный статийский айди персонажа');
            return;
        }

        DB.query('UPDATE characters SET last_fraction_change = 0 WHERE id = ?', [characid], (err, result) => {
            if (err) {
                console.error(`Ошибка базы данных при сбросе времени изменения фракции: ${err}`);
                mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка базы данных. Попробуйте позже');
                return;
            }

            if (result.affectedRows === 0) {
                mp.events.call('notification', player, 'error', 'Ошибка', `Персонаж #${characid} не найден`);
                return;
            }

            mp.events.call('notification', player, 'success', 'Успешно', `Время изменения фракции для персонажа #${characid} сброшено`);
        });
    });
});

mp.events.add('rescue', (player, id) => {
    mp.events.call('checkAdminLevel', player, 3, () => { 
        let targetPlayer = mp.players.at(id); 
        
        if (targetPlayer) {
            targetPlayer.spawn(new mp.Vector3(targetPlayer.position.x, targetPlayer.position.y, targetPlayer.position.z));
            targetPlayer.call('spawnPlayer')
            player.setVariable('isDead', false);

        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', `Игрок не найден`);
        }
    });
});
mp.events.add('spawnvehicle', (player, model) => {
    mp.events.call('checkAdminLevel', player, 6, () => { 
        const veh = mp.vehicles.new(mp.joaat(model), player.position, {
            dimension: player.dimension,
            heading: player.heading
        });
        veh.numberPlate = `SPAWNED`;
    });
});
mp.events.add('setskin', (player, id, ped) => {
    mp.events.call('checkAdminLevel', player, 5, () => { 
        let targetPlayer = mp.players.at(id); 
        if (targetPlayer) {
            targetPlayer.model = mp.joaat(ped);
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', `Игрок не найден`);
        }
    });
});
mp.events.add('checkAdminLevel', (player, requiredLevel, callback) => {
    const adminLevel = player.getVariable('adminLevel');
    if (adminLevel !== undefined) {
        if (adminLevel < requiredLevel) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Ваш уровень администратора должен быть не ниже ${requiredLevel}`);
            return;
        }
        callback();
        return;
    }
});

