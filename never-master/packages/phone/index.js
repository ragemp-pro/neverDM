mp.events.add('getTime', (player) => {
    const now = new Date();
    now.setHours(now.getUTCHours() + 3); 
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    player.call('setTimeOnClient', [hours, minutes, day, month, year]);
});

mp.events.add('animationPhone', (player) => {
    if (player.vehicle) {
        return; 
    }
    player.playAnimation("anim@cellphone@in_car@ds", "cellphone_text_read_base", 1, 49);
});

mp.events.add('animationPhoneStop', (player) => {
    if (player.vehicle) {
        return; 
    }
    player.stopAnimation();
});

mp.events.add('loadGarageCars', (player) => {
    const userId = player.getVariable('selectedCharacterId');

    DB.query('SELECT cars FROM characters WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Ошибка при получении списка машин: ', err);
            return;
        }
        
        if (result.length === 0 || !result[0].cars) {
            player.call('updateGarageCars', [[]]); 
            return;
        }

        let cars;
        try {
            cars = JSON.parse(result[0].cars).map(car => ({
                model: car.model,
                name: car.name
            }));
        } catch (parseError) {
            console.error('Ошибка при разборе JSON:', parseError);
            return;
        }

        player.call('updateGarageCars', [cars]);
    });
});

const allowedSpawnZones = [
    {
        x: -50.74, y: -1110.82, z: 26.43, radius: 30, fractionId: null
    },
    {
        x: -180.8170, y: -1141.9517, z: 23.1037, radius: 35, fractionId: null
    },
    {
        x: 351.42, y: -1404.66, z: 32.51, radius: 50, fractionId: null
    },
    {
        x: 467.03, y: -584.88, z: 28.44, radius: 25, fractionId: null
    },
    {
        x: 214.34, y: -1386.06, z: 30.59, radius: 25, fractionId: null
    },
    {
        x: -220.55, y: -1484.65, z: 31.29, radius: 25, fractionId: 1
    },
    {
        x: -215.90, y: -1390.27, z: 31.25, radius: 25, fractionId: 4
    },
    {
        x: -9.65, y: -1406.45, z: 29.30, radius: 25, fractionId: 5
    },
    {
        x: 493.89, y: -1512.67, z: 29.28, radius: 25, fractionId: 3
    },
    {
        x: 106.54, y: -1939.99, z: 20.80, radius: 25, fractionId: 2
    },
    {
        x: 442.88, y: -982.71, z: 30.69, radius: 50, fractionId: 6
    }
];

function isPlayerInAllowedZone(player) {
    const playerPos = player.position;
    const playerFraction = player.getVariable('fraction');

    for (const zone of allowedSpawnZones) {
        const dist = Math.sqrt(
            Math.pow(playerPos.x - zone.x, 2) +
            Math.pow(playerPos.y - zone.y, 2) +
            Math.pow(playerPos.z - zone.z, 2)
        );

        if (dist <= zone.radius && (zone.fractionId === null || zone.fractionId === playerFraction)) {
            return true; 
        }
    }

    return false;
}

mp.events.add('spawnCar', (player, carModel) => {
    const now = Date.now();
    if (!isPlayerInAllowedZone(player)) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Здесь нельзя заспавнить машину');
        return;
    }

    if (player.lastSpawnTime && now - player.lastSpawnTime < 15000) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Машину можно спавнить раз в 15 секунд');
        return;
    }

    player.lastSpawnTime = now;

    if (player.spawnedVehicle && mp.vehicles.exists(player.spawnedVehicle)) {
        player.spawnedVehicle.destroy();
    }

    const playerPos = player.position;

    const vehicle = mp.vehicles.new(mp.joaat(carModel), new mp.Vector3(playerPos.x, playerPos.y, playerPos.z), {
        dimension: player.dimension,
        heading: player.heading 
    });


    vehicle.setColor(111, 111);
    vehicle.numberPlate = `never${player.id}`;
    vehicle.owner = player;
    player.spawnedVehicle = vehicle;
    const playerId = player.getVariable('static');
    const characid = player.getVariable('selectedCharacterId');
    player.giveWeapon(mp.joaat('gadget_parachute'), 1000);
    player.putIntoVehicle(vehicle, 0);
    vehicle.rotation = new mp.Vector3(0, 0, player.heading);

    vehicle.setVariable('spawnerId', characid);
    console.log(`[SERVER] Спавн машины ${carModel} игроком ${player.name}#${playerId}`);
});

mp.events.add('playerDeath', (player) => {
    if (player.spawnedVehicle) {
        player.spawnedVehicle.destroy();
        player.spawnedVehicle = null;
    }

    if (player.lastSpawnTime) {
        player.lastSpawnTime = 0; 
    }
});

mp.events.add('playerQuit', (player) => {

    if (player.spawnedVehicle) {
        player.spawnedVehicle.destroy();
        player.spawnedVehicle = null;
        
    } 
});

mp.events.add('loadPlayerMoney', (player) => {
    const charId = player.getVariable('selectedCharacterId'); 

    DB.query('SELECT money FROM characters WHERE id = ?', [charId], (err, results) => {
        if (err) {
            console.error('Ошибка при получении денег персонажа:', err);
            return;
        }

        if (results.length > 0) {
            const money = results[0].money;
            player.call('updatePlayerMoney', [money]);
        } else {
            console.log('Персонаж не найден');
        }
    });
});

mp.events.add('loadTopRichPlayers', (player) => {
    DB.query('SELECT name, surname, money FROM characters ORDER BY money DESC LIMIT 10', (err, results) => {
        if (err) {
            console.error('Ошибка при получении списка самых богатых игроков:', err);
            return;
        }
        
        const richPlayers = results.map(row => ({
            nickname: `${row.name} ${row.surname}`, 
            amount: row.money
        }));
        
        player.call('updateTopRichPlayers', [richPlayers]);
    });
});

mp.events.add('transferMoney', (player, recipientId, amount) => {
    const senderId = player.getVariable('selectedCharacterId');

    if (senderId === recipientId) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Нельзя переводить деньги самому себе');
        return;
    }

    if (amount < 5000) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Минимальная сумма перевода 5 000 $');
        return;
    }

    DB.query('SELECT money FROM characters WHERE id = ?', [senderId], (err, senderResult) => {
        if (err || senderResult.length === 0) {
            console.error('Ошибка при получении денег отправителя:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка на стороне сервера');
            return;
        }

        const senderMoney = senderResult[0].money;
        if (amount <= 0) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Сумма перевода должна быть положительной');
            return;
        }

        if (amount > senderMoney) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Недостаточно средств для перевода');
            return;
        }

        DB.query('SELECT money FROM characters WHERE id = ?', [recipientId], (err, recipientResult) => {
            if (err || recipientResult.length === 0) {
                console.error('Получатель не найден:', err);
                mp.events.call('notification', player, 'error', 'Ошибка', 'Получатель не найден');
                return;
            }

            const recipientMoney = recipientResult[0].money;

            DB.query('UPDATE characters SET money = ? WHERE id = ?', [senderMoney - amount, senderId], (err) => {
                if (err) {
                    console.error('Ошибка при обновлении баланса отправителя:', err);
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при обновлении баланса');
                    return;
                }

                DB.query('UPDATE characters SET money = ? WHERE id = ?', [recipientMoney + amount, recipientId], (err) => {
                    if (err) {
                        console.error('Ошибка при обновлении баланса получателя:', err);
                        mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при обновлении баланса');
                        return;
                    }

                    const formattedAmount = amount.toLocaleString('ru-RU').replace(/,/g, ' ');

                    mp.events.call('notification', player, 'success', 'Успешно', `Перевод ${formattedAmount} $ пользователю #${recipientId} выполнен успешно`);
                    console.log(`[SERVER] Перевод от ${player.name} #${senderId}, получатель: #${recipientId}, сумма: $${formattedAmount}`);
                    player.call('loadPlayerMoney');

                    const targetPlayer = mp.players.toArray().find(p => p.getVariable('selectedCharacterId') === recipientId);
                    if (targetPlayer) {
                        mp.events.call('notification', targetPlayer, 'info', 'Информация', `Вы получили перевод $${formattedAmount} от пользователя #${senderId}`);
                        targetPlayer.call('loadPlayerMoney');
                    }
                });
            });
        });
    });
});
