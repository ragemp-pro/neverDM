const axios = require('axios');
mp.events.add("packagesLoaded", () => {
    console.log('[TELEGRAM] Telegram connected');
});
const TELEGRAM_BOT_TOKEN = ''; // токен бота в тг

function sendTelegramMsg(chat_id, msg) {
    axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chat_id,
        text: msg,
        parse_mode: 'Markdown' 
    })
    .then(response => {
    })
    .catch(error => {
        if (error.response) {
            console.error('Ошибка данных:', error.response.data);
            console.error('Ошибка статуса:', error.response.status);
            console.error('Ошибка заголовков:', error.response.headers);
        } else if (error.request) {
            console.error('Запрос был сделан, но ответа не было:', error.request);
        } else {
            console.error('Произошла ошибка при настройке запроса:', error.message);
        }
    });
}

mp.events.addCommand('tg', (player, _, code) => {
    if (!code) {
        player.outputChatBox('Введите код.');
        return;
    }

    player.outputChatBox(`Вы ввели код: ${code}`);

    DB.query('SELECT * FROM telegram WHERE code = ?', [code], (err, results) => {
        if (err) {
            console.error('Ошибка базы данных: ', err);
            player.outputChatBox('Произошла ошибка при проверке кода.');
            return;
        }

        if (results.length === 0) {
            player.outputChatBox('Код не найден.');
            return;
        }

        const codeData = results[0];

        if (codeData.status === 0) {
            DB.query('UPDATE telegram SET status = 1 WHERE code = ?', [code], (updateErr) => {
                if (updateErr) {
                    console.error('Ошибка обновления статуса кода: ', updateErr);
                    player.outputChatBox('Произошла ошибка при активации кода.');
                    return;
                }

                DB.query('SELECT telegram FROM users WHERE id = ?', [player.static], (userErr, userResults) => {
                    if (userErr) {
                        console.error('Ошибка базы данных при проверке Telegram ID: ', userErr);
                        player.outputChatBox('Произошла ошибка при проверке аккаунта.');
                        return;
                    }

                    if (userResults.length > 0 && userResults[0].telegram) {
                        player.outputChatBox('У вас уже привязан аккаунт.');
                        return;
                    }

                    DB.query('UPDATE users SET telegram = ? WHERE id = ?', [codeData.idTG, player.static], (updateUserErr) => {
                        if (updateUserErr) {
                            console.error('Ошибка обновления Telegram ID в users: ', updateUserErr);
                            player.outputChatBox('Произошла ошибка при привязке аккаунта.');
                            return;
                        }
                        
                        sendTelegramMsg(codeData.idTG, `🔗 Привязка аккаунта \n\nТелеграм привязан к аккаунту \`${player.name}#${player.static}\`, если это не вы, то срочно обратитесь в тех. поддержку.`);

                        player.outputChatBox('Код успешно активирован!');
                    });
                });
            });
        } else if (codeData.status === 1) {
            player.outputChatBox('Код уже активирован.');
        }
    });
});
