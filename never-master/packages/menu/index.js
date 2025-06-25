const lastReportTime = {};

mp.events.add('MenuOppened', (player) => {
    const playerPos = player.position;
    player.call('createCameraMenu', [playerPos.x + 3, playerPos.y + 3, playerPos.z + 2]); 
});

mp.events.add('addReport', (player, characid) => {
    const currentTime = Date.now();
    const twoMinutes = 2 * 60 * 1000; 

    if (lastReportTime[characid] && (currentTime - lastReportTime[characid]) < twoMinutes) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Репорт можно создавать раз в две минуты');
        return;
    }

    const checkQuery = `SELECT id FROM reports WHERE creator = ? AND status = 0`;

    DB.query(checkQuery, [characid], (err, activeReports) => {
        if (err) {
            console.error('Ошибка при проверке активных репортов:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Произошла ошибка при проверке активных репортов');
            return;
        }

        if (activeReports.length > 0) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'У вас уже есть активный репорт');
        } else {
            const insertQuery = `INSERT INTO reports (creator) VALUES (?)`;

            DB.query(insertQuery, [characid], (err, result) => {
                if (err) {
                    console.error('Ошибка при создании репорта:', err);
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Произошла ошибка при создании репорта');
                    return;
                }


                lastReportTime[characid] = currentTime;

                mp.events.call('notification', player, 'success', 'Успешно', `Репорт #${result.insertId} создан`);

                mp.events.call('getReports', player, characid);
            });
        }
    });
});

mp.events.add('getReports', (player, characid) => {
    const query = `SELECT id, time, status FROM reports WHERE creator = ? ORDER BY time DESC`;

    DB.query(query, [characid], (err, results) => {
        if (err) {
            console.error('Ошибка при получении репортов:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Произошла ошибка при получении списка репортов');
            return;
        }

        if (results.length > 0) {
            player.call('sendReports', [JSON.stringify(results)]); 
        } else {
            player.call('sendReports', ['[]']); 
        }
    });
});

mp.events.add('getReportMessages', (player, reportId) => {
    const query = `SELECT message, moderator FROM reportmsg WHERE report = ? ORDER BY id ASC`;

    DB.query(query, [reportId], (err, results) => {
        if (err) {
            console.error('Ошибка при получении сообщений репорта:', err);
            return;
        }

        player.call('displayMessages', [JSON.stringify(results)]);
    });
});

mp.events.add('sendMessage', (player, message, reportId, characterId) => {
    const query = `INSERT INTO reportmsg (report, sender, message, moderator) VALUES (?, ?, ?, 0)`;  
    DB.query(query, [reportId, characterId, message], (err, result) => {
        if (err) {
            console.error('Ошибка при отправке сообщения:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Сообщение не отправлено');

            return;
        }

        mp.events.call('notification', player, 'success', 'Успешно', `Вы отправили сообщение в репорт #${reportId}`);

        mp.events.call('getReportMessages', player, reportId);
    });
});

mp.events.add('deleteReport', (player, reportId, characid) => {
    const query = `UPDATE reports SET status = 1 WHERE id = ? AND creator = ? AND status = 0`;
    
    DB.query(query, [reportId, characid], (err, result) => {
        if (err) {
            console.error('Ошибка при обновлении статуса репорта:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось удалить репорт');

            return;
        }

        if (result.affectedRows > 0) {

            mp.events.call('notification', player, 'success', 'Успешно', `Репорт #${reportId} был закрыт`);
            mp.events.call('getReports', player, characid); 
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Репорт не найден или уже закрыт');

        }
    });
});
mp.events.add('getCars', (player, charId) => {
    const query = 'SELECT cars FROM characters WHERE id = ?'; 

    DB.query(query, [charId], (err, result) => {
        if (err) {
            console.error('Ошибка при получении списка машин:', err);
            return;
        }

        if (result.length > 0) {
            const cars = JSON.parse(result[0].cars); 
            player.call('displayCars', [JSON.stringify(cars)]); 
        } else {
            player.call('displayCars', ['[]']); 
        }
    });
});
mp.events.add('getDP', (player) => {
    const static = player.static;

    DB.query('SELECT DP FROM users WHERE id = ?', [static], (err, result) => {
        if (err) {
            console.error('Ошибка при получении DP:', err);
            return;
        }

        if (result && result.length > 0) {
            player.call('displayDP', [result[0].DP])
        } else {
            console.log('DP не найдено для игрока с id:', static);
        }
    });
});
mp.events.add('buyVIP', (player, vipType) => {
    const vipLevels = {
        silver: { id: 1, price: 300 },
        gold: { id: 2, price: 400 },
        platinum: { id: 3, price: 999 }
    };

    const static = player.static;
    const vip = vipLevels[vipType];

    if (!vip) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Некорректный тип вип');
        return;
    }

    DB.query('SELECT VIP, DP FROM users WHERE id = ?', [static], (err, result) => {
        if (err) {
            console.error('Ошибка при получении данных игрока:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось проверить вип статус или DP');
            return;
        }

        const currentVIP = result[0]?.VIP;
        const playerDP = result[0]?.DP;

        if (currentVIP >= vip.id) {
            mp.events.call('notification', player, 'error', 'Ошибка', `У вас уже есть вип ${Object.keys(vipLevels)[currentVIP - 1]}`);
            return;
        }

        if (playerDP >= vip.price) {
            DB.query('UPDATE users SET VIP = ? WHERE id = ?', [vip.id, static], (err) => {
                if (err) {
                    console.error('Ошибка при обновлении VIP статуса:', err);
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось обновить VIP статус');
                    return;
                }

                DB.query('UPDATE users SET DP = DP - ? WHERE id = ?', [vip.price, static], (err) => {
                    if (err) {
                        console.error('Ошибка при вычитании DP:', err);
                        mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось вычесть DP');
                        return;
                    }

                    mp.events.call('notification', player, 'success', 'Успешно', `Вы приобрели вип ${vipType}`);
                    mp.events.call('getDP', player)
                    player.setVariable('vip', vip.id);

                });
            });
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', `У вас недостаточно DP для покупки вип ${vipType}`);
        }
    });
});

mp.events.add('sellCar', (player, carModel, carPrice) => {
    const halfPrice = carPrice / 2; 
    const charId = player.getVariable('selectedCharacterId');

    const selectQuery = 'SELECT cars FROM characters WHERE id = ?';
    DB.query(selectQuery, [charId], (err, result) => {
        if (err) {
            console.error('Ошибка при получении списка машин:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось продать машину');
            return;
        }

        if (result.length > 0) {
            let cars = JSON.parse(result[0].cars); 

            const carIndex = cars.findIndex(car => car.model === carModel);
            if (carIndex === -1) {
                mp.events.call('notification', player, 'error', 'Ошибка', 'Машина не найдена');
                return;
            }

            const soldCar = cars.splice(carIndex, 1)[0];

            const updateQuery = 'UPDATE characters SET cars = ? WHERE id = ?';
            DB.query(updateQuery, [JSON.stringify(cars), charId], (err, updateResult) => {
                if (err) {
                    console.error('Ошибка при обновлении списка машин:', err);
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось продать машину');
                    return;
                }

                const updateMoneyQuery = 'UPDATE characters SET money = money + ? WHERE id = ?';
                DB.query(updateMoneyQuery, [halfPrice, charId], (err, moneyResult) => {
                    if (err) {
                        console.error('Ошибка при добавлении денег:', err);
                        mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось зачислить деньги');
                        return;
                    }
                    
                    function formatPriceWithSpaces(price) {
                        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                    }
                    
                    mp.events.call('notification', player, 'success', 'Успешно', `Вы продали машину ${soldCar.name} за ${formatPriceWithSpaces(halfPrice)} $`);
            

                    mp.events.call('getCars', player, charId);
                });
            });
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Машин не найдено');
        }
    });
});

const fractionCooldown = 2 * 24 * 60 * 60 * 1000;

mp.events.add('selectFraction', (player, fractionId) => {
    const charId = player.getVariable('selectedCharacterId');
    if (!charId) return;
    if (fractionId === 6) {
        const vip = player.getVariable('vip');
        if (vip === 0) { 
            mp.events.call('notification', player, 'error', 'Ошибка', 'Эта фракция доступна только для VIP игроков');
            return;
        }
    }
    const checkCooldownQuery = `SELECT fraction, last_fraction_change FROM characters WHERE id = ?`;

    DB.query(checkCooldownQuery, [charId], (err, result) => {
        if (err) {
            console.error('Ошибка при получении данных о фракции:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось выбрать фракцию');
            return;
        }

        const characterData = result[0];
        const currentTime = Date.now();

        if (characterData.fraction === fractionId) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Вы уже состоите в этой фракции');
            return;
        }

        if (characterData.last_fraction_change && (currentTime - characterData.last_fraction_change) < fractionCooldown) {
            const remainingTime = fractionCooldown - (currentTime - characterData.last_fraction_change);
            const hoursLeft = Math.ceil(remainingTime / (60 * 60 * 1000)); 
            mp.events.call('notification', player, 'error', 'Ошибка', `Вы сможете сменить фракцию через ${hoursLeft} часов`);
            return;
        }

        const updateFractionQuery = `UPDATE characters SET fraction = ?, last_fraction_change = ? WHERE id = ?`;

        DB.query(updateFractionQuery, [fractionId, currentTime, charId], (err) => {
            if (err) {
                console.error('Ошибка при обновлении фракции:', err);
                mp.events.call('notification', player, 'error', 'Ошибка', 'Не удалось сменить фракцию');
                return;
            }

            
            player.setVariable('fraction', fractionId);
            player.call('closeMenu')
            player.dimension = 0;
            player.setVariable('mode', 0);

            const fractionData = global.fractions[fractionId];
            const fractionName = fractionData.name;
            const fractionPosition = fractionData.position;
            
            const characid = player.getVariable('selectedCharacterId');
            const name = player.getVariable('characterName');
            const surname = player.getVariable('characterSurname');
            player.position = fractionPosition;
            console.log(`[SERVER] Игрок ${name} ${surname} #${characid} зашел за ${fractionName} (${fractionId})`)
            player.giveWeapon(mp.joaat('gadget_parachute'),1000);


        });
    });
});

const playerCounts = {
    gangWar: 0,
    revolverDM: 0,
    carabinDM: 0,
    sniperDM: 0
};

mp.events.add('getPlayerCounts', (player) => {
    const counts = {
        gangWar: 0,
        revolverDM: 0,
        carabinDM: 0,
        sniperDM: 0
    };

    mp.players.forEach((p) => {
        const mode = p.getVariable('mode');
        if (mode === 0) counts.gangWar++;
        else if (mode === 1) counts.revolverDM++;
        else if (mode === 2) counts.carabinDM++;
        else if (mode === 3) counts.sniperDM++;
    });

    player.call('updatePlayerCounts', [counts]);
});

mp.events.add('buyweapon', (player, weapon, price, name) => {
    if (!weapon || !price || isNaN(price)) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Некорректные данные для покупки');
        return;
    }

    price = parseInt(price);
    const charId = player.getVariable('selectedCharacterId');

    DB.query('SELECT money, inventory FROM characters WHERE id = ?', [charId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Ошибка при получении данных игрока:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при получении данных игрока');
            return;
        }

        const currentMoney = results[0].money;
        let inventory = JSON.parse(results[0].inventory || '[]'); 

        if (currentMoney >= price) {
            inventory.push(weapon);
            const updatedInventory = JSON.stringify(inventory);

            DB.query(
                'UPDATE characters SET money = money - ?, inventory = ? WHERE id = ?',
                [price, updatedInventory, charId],
                (err) => {
                    if (err) {
                        console.error('Ошибка при обновлении данных игрока:', err);
                        mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при обновлении данных');
                        return;
                    }

                    mp.events.call('notification', player, 'success', 'Успешно', `Вы купили ${name}, предмет добавлен в инвентарь`);
                    console.log(`[SERVER] Игрок ${player.name} купил ${name} за ${price} $`);
                }
            );
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Недостаточно средств для покупки');
        }
    });
});
mp.events.add('buyweapon10', (player, weapon, price, name) => {
    if (!weapon || !price || isNaN(price)) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Некорректные данные для покупки');
        return;
    }

    price = parseInt(price) * 10; 
    const charId = player.getVariable('selectedCharacterId');

    DB.query('SELECT money, inventory FROM characters WHERE id = ?', [charId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Ошибка при получении данных игрока:', err);
            mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при получении данных игрока');
            return;
        }

        const currentMoney = results[0].money;
        let inventory = JSON.parse(results[0].inventory || '[]'); 

        if (currentMoney >= price) {
            for (let i = 0; i < 10; i++) {
                inventory.push(weapon);
            }
            const updatedInventory = JSON.stringify(inventory);

            DB.query(
                'UPDATE characters SET money = money - ?, inventory = ? WHERE id = ?',
                [price, updatedInventory, charId],
                (err) => {
                    if (err) {
                        console.error('Ошибка при обновлении данных игрока:', err);
                        mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при обновлении данных');
                        return;
                    }

                    mp.events.call('notification', player, 'success', 'Успешно', `Вы купили 10x ${name}, предметы добавлены в инвентарь`);
                    console.log(`[SERVER] Игрок ${player.name} купил 10x ${name} за ${price} $`);
                }
            );
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Недостаточно средств для покупки');
        }
    });
});
