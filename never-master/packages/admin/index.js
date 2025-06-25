require('./admincommands')
const moment = require('moment');

mp.events.add('getAdminStats', (player) => {
    const playerId = player.getVariable('static');

    DB.query('SELECT user, level, reports FROM admins WHERE user = ?', [playerId], (err, result) => {
        if (err) {
            console.error('Ошибка запроса:', err);
            return;
        }

        if (result.length) {
            const adminData = result[0];
            adminData.name = player.name;
            player.call('displayAdminStats', [JSON.stringify(adminData)]);
        } else {
            console.warn(`Администратор с ID ${playerId} не найден`);
        }
    });
});


mp.events.add('searchadmmenu', (player, staticId) => {
    if (!staticId) {
        mp.events.call('notification', player, 'error', 'Ошибка', `Введите статический айди`);
        return;
    }
    const playerId = player.getVariable('static');

    console.log(`[ADMIN] searchadmmenu ${staticId}, администратор: ${player.name}#${playerId}`);
    
    DB.query(`SELECT * FROM characters WHERE id = ?`, [staticId], (err, result) => {
        if (err) {
            console.error('Ошибка запроса:', err); 
            mp.events.call('notification', player, 'error', 'Ошибка', `Ошибка при поиске персонажа.`);
            return;
        }
    
        if (!result.length) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Персонаж с #${staticId} не найден.`);
            return;
        }
    
        const characterData = result[0];
        player.call('showadmmenuData', [characterData]);
    });
});

mp.events.add('searchvehadmmenu', (player, id) => {
    let vehicle = mp.vehicles.at(id);
    
    if (vehicle) {
        const spawnerId = vehicle.getVariable('spawnerId');
        player.call('getmodelcar', vehicle, vehicle.model)
        console.log(`Машина найдена! | creator: ${spawnerId}, ${vehicle.model}`);
    } else {
        console.log('Машина не найдена');
    }
});
mp.events.add('consoletest', (player, id) => {
    console.log(`search car - ${id}`);

});
mp.events.add('getReportsADM', (player) => {
    DB.query(`SELECT * FROM reports WHERE status = 0`, (err, reports) => {
        if (err) {
            console.error('Ошибка при получении репортов:', err); 
            return;
        }

        if (reports.length === 0) {
        } else {
            const reportList = reports.map(report => ({
                id: report.id,
                creator: report.creator,
                time: report.time
            }));

            player.call('showReportsADM', [JSON.stringify(reportList)]);
        }
    });
});

mp.events.add('getReportMessagesADM', (player, reportId) => {
    DB.query(`
        SELECT reportmsg.message, reportmsg.moderator, characters.name, characters.surname, characters.id 
        FROM reportmsg 
        JOIN characters ON reportmsg.sender = characters.id 
        WHERE report = ?`, [reportId], (err, results) => {
        if (err) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Ошибка при получении сообщений репорта`);
            return;
        }

        const messages = results.map(msg => {
            return {
                sender: msg.moderator === 1 ? `Модератор ${msg.name} ${msg.surname} #${msg.id}` : `${msg.name} ${msg.surname} #${msg.id}`,
                text: msg.message
            };
        });

        player.call('displayReportMessagesADM', [JSON.stringify(messages)]);
    });
});

mp.events.add('sendModeratorMessageADM', (player, message, reportId, characterId) => {
    const playerId = player.getVariable('static');

    console.log(`[ADMIN] Отправил сообщение в репорт #${reportId}, администратор: ${player.name}#${playerId}`);
    if (!message || !reportId || !characterId) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Все поля должны быть заполнены.');
        return;
    }

    DB.query(`INSERT INTO reportmsg (report, sender, message, moderator) VALUES (?, ?, ?, 1)`, [reportId, characterId, message], (err) => {
        if (err) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Ошибка при отправке сообщения`);
            return;
        }

        mp.events.call('notification', player, 'info', 'Информация', `Сообщение отправлено в репорт #${reportId}`);
        
        mp.events.call('getReportMessagesADM', player, reportId);

        DB.query(`SELECT creator FROM reports WHERE id = ?`, [reportId], (err, results) => {
            if (err || results.length === 0) {
                console.error('Ошибка при получении создателя репорта:', err);
                return;
            }

            const reportCreatorStatic = String(results[0].creator); 
            
            let reportCreatorPlayer = mp.players.toArray().find(p => String(p.getVariable('selectedCharacterId')) === reportCreatorStatic);

            if (reportCreatorPlayer) {
                mp.events.call('getReportMessages', reportCreatorPlayer, reportId);
                mp.events.call('notification', reportCreatorPlayer, 'info', 'Информация', `Вам ответил администратор в репорте #${reportId}`);
            }
        });
    });
});

mp.events.add('closeReportADM', (player, reportId, characid) => {
    const playerId = player.getVariable('static');

    console.log(`[ADMIN] Закрыл репорт #${reportId}, администратор: ${player.name}#${playerId}`);

    if (!reportId || !characid) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Необходимо указать репорт и ID персонажа.');
        return;
    }

    DB.query(`UPDATE reports SET status = 1, moderator = ? WHERE id = ?`, [characid, reportId], (err) => {
        if (err) {
            mp.events.call('notification', player, 'error', 'Ошибка', `Ошибка при закрытии репорта`);
            console.error('Ошибка при закрытии репорта:', err);
            return;
        }

        DB.query(`UPDATE admins SET reports = reports + 1 WHERE user = ?`, [characid], (err) => {
            if (err) {
                console.error('Ошибка при обновлении количества репортов администратора:', err);
                return;
            }

            mp.events.call('notification', player, 'success', 'Успешно', `Репорт #${reportId} был закрыт`);
        });

        mp.events.call('getReportsADM', player); 
    });
});


mp.events.add('executeServerCommand', (player, command, rawParams) => {
    const params = JSON.parse(rawParams);

    const name = player.getVariable('characterName');
    const surname = player.getVariable('characterSurname');
    const characid = player.getVariable('selectedCharacterId');

    let commandText = `${command} ${params.join(' ')}`;
    const playerId = player.getVariable('static');

    console.log(`[ADMIN] ${command} ${params.join(' ')}, администратор: ${player.name}#${playerId}`);


    const query = `
        INSERT INTO commands_log (name, surname, characid, command) 
        VALUES (?, ?, ?, ?)
    `;

    DB.query(query, [name, surname, characid, commandText], (err, result) => {
        if (err) {
            console.error('Error inserting command into database:', err);
            return;
        }
    });

    switch (command) {
        case 'check':
            const checkTargetId = params[0];
            const discordTag = params[1];
            mp.events.call('checkPlayer', player, checkTargetId, discordTag);
            break;
        case 'tp':
            const tpTargetId = params[0];
            mp.events.call('teleport', player, tpTargetId);
            break;
        case 'gh':
            const gethereTargetId = params[0];
            mp.events.call('gethere', player, gethereTargetId);
            break;
        case 'freeze':
            const freezeTargetId = params[0];
            mp.events.call('freezePlayer', player, freezeTargetId);
            break;
        case 'setskin':
            const setskinTargetId = params[0];
            const modelsetskin = params[1];
            mp.events.call('setskin', player, setskinTargetId, modelsetskin);
            break;
        case 'rescue':
            const rescueTargetId = params[0];
            mp.events.call('rescue', player, rescueTargetId);
            break;
        case 'unfreeze':
            const unfreezeTargetId = params[0];
            mp.events.call('unfreezePlayer', player, unfreezeTargetId);
            break;            
        case 'sdm':
            const sdmTargetId = params[0];
            const IDDM = params[1];
            mp.events.call('sdm', player, sdmTargetId, IDDM);
            break;
        case 'clear':
            mp.events.call('clearChat', player);
            break;
        case 'specoff':
            player.call('spoff', player);
            break;
        case 'kick':
            const kicktargetid = params[0];
            const kickreason = params[1];
            mp.events.call('kickPlayer', player, kicktargetid, kickreason);
            break;
        case 'weapon':
            const weapontargetid = params[0];
            const weapon = params[1];
            mp.events.call('giveweapon', player, weapontargetid, weapon);
            break;
        case 'ob':
            const textOB = params[0];
            mp.events.call('ob', player, textOB);
            break;
        case 'veh':
            const vehMODEL = params[0];
            mp.events.call('spawnvehicle', player, vehMODEL);
            break;
        case 'observer':
            const textOBSERVER = params[0];
            mp.events.call('sendServer', player, textOBSERVER);
            break;
        case 'spec':
            const spTargetId = params[0];
            mp.events.call('sp', player, spTargetId);
            break;
        case 'ban':
            const banTargetId = params[0];
            const termBan = params[1];
            const reason = params[2];
            mp.events.call('ban', player, banTargetId, termBan, reason);
            break;
        case 'unban':
            const ubanTargetId = params[0];
            mp.events.call('unban', player, ubanTargetId,);
            break;
        case 'hp':
            const hpTargetId = params[0];
            const hp = params[1];
            mp.events.call('setPlayerHP', player, hpTargetId, hp);
            break;
        case 'dsocial':
            const doscialTargetId = params[0];
            mp.events.call('deletesocial', player, doscialTargetId);
            break;
        case 'gdp':
            const gdpTargetId = params[0];
            const gdpDP = params[0];
            mp.events.call('givedonatpoint', player, gdpTargetId, gdpDP);
            break;
        case 'slap':
            const slapTargetId = params[0];
            mp.events.call('slapPlayer', player, slapTargetId);
            break;
        case 'skipfrac':
            const skipfraccharacid = params[0];
            mp.events.call('skipresettime', player, skipfraccharacid);
            break;
        default:
            mp.events.call('notification', player, 'error', 'Ошибка', `Команда не найдена`);
            break;
    }
});

mp.events.add('getTodayCommands', (player) => {
    const today = moment().format('YYYY-MM-DD');

    const query = `
        SELECT 
            DATE_FORMAT(executed_at, '%H:%i') AS time,
            name, surname, characid, command 
        FROM 
            commands_log 
        WHERE 
            DATE(executed_at) = ?
    `;

    DB.query(query, [today], (err, results) => {
        if (err) {
            console.error('Ошибка при получении команд за сегодняшний день:', err);
            return;
        }

        if (results.length === 0) {
        } else {
            const formattedResults = results.map(row => {
                return `${row.time} ${row.name || ''} ${row.surname || ''} #${row.characid || ''}: ${row.command}`;
            });

            player.call('displayTodayCommands', [JSON.stringify(formattedResults)]);
        }
    });
});

mp.events.add('teleportToVehicle', (player, vehicleId) => {
    let vehicle = mp.vehicles.at(vehicleId);
    if (vehicle) {
        let pos = player.position;
        vehicle.position = new mp.Vector3(pos.x, pos.y, pos.z);
        const playerId = player.getVariable('static');

        console.log(`[ADMIN] tptoveh ${vehicleId}, администратор: ${player.name}#${playerId}`);
    } 
});

mp.events.add('logVEH', (player, id) => {
    const playerId = player.getVariable('static');

    console.log(`[ADMIN] searchveh ${id}, администратор: ${player.name}#${playerId}`);
});

mp.events.add('teleportToPlayer', (player, vehicleId) => {
    let vehicle = mp.vehicles.at(vehicleId);
    if (vehicle) {
        let pos = vehicle.position;
        player.position = new mp.Vector3(pos.x, pos.y, pos.z);
        const playerId = player.getVariable('static');

        console.log(`[ADMIN] tpvehtoplayer ${vehicleId}, администратор: ${player.name}#${playerId}`);
    }
});

mp.events.add('deleteVehicle', (player, vehicleId) => {
    let vehicle = mp.vehicles.at(vehicleId);
    
    if (vehicle) {
        vehicle.destroy();
        const playerId = player.getVariable('static');

        console.log(`[ADMIN] deleteveh ${vehicleId}, администратор: ${player.name}#${playerId}`);
    }
});
