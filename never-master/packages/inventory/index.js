require('./gun')
global.fastSlotsCache = {}; 
global.secondarySlotsCache = {}; 
mp.events.add('getInventory', (player) => {
    const characterId = player.getVariable('selectedCharacterId');
    
    DB.query(`SELECT inventory, fastslots, secondarySlots FROM characters WHERE id = ?`, [characterId], (err, results) => {
        if (err) {
            console.error(err);
            return;
        }

        if (results.length > 0) {
            let inventory = JSON.parse(results[0].inventory);
            let fastSlots = JSON.parse(results[0].fastslots);
            let secondarySlots = JSON.parse(results[0].secondarySlots || '[{"id": null, "slot": 0}, {"id": null, "slot": 1}]');

            global.fastSlotsCache[characterId] = fastSlots; 
            global.secondarySlotsCache[characterId] = secondarySlots; 
            player.call('showInventory', [inventory, fastSlots, secondarySlots]);
        }
    });
});

mp.events.add('moveItemToInventoryFromSecondary', (player, itemId) => {
    const characterId = player.getVariable('selectedCharacterId');

    DB.query(`SELECT inventory, secondarySlots FROM characters WHERE id = ?`, [characterId], (err, results) => {
        if (err) {
            console.error('Ошибка при запросе базы данных:', err);
            return;
        }

        if (results.length > 0) {
            let inventory = JSON.parse(results[0].inventory);
            let secondarySlots = global.secondarySlotsCache[characterId] || JSON.parse(results[0].secondarySlots || '[{"id": null, "slot": 0}, {"id": null, "slot": 1}]');

            const slotIndex = secondarySlots.findIndex(slot => slot.id === itemId);
            if (slotIndex !== -1) {
                secondarySlots[slotIndex].id = null;

                inventory.push(itemId);

                DB.query(`UPDATE characters SET inventory = ?, secondarySlots = ? WHERE id = ?`, 
                    [JSON.stringify(inventory), JSON.stringify(secondarySlots), characterId], (err) => {
                        if (err) {
                            console.error('Ошибка при обновлении базы данных:', err);
                        } else {
                            global.secondarySlotsCache[characterId] = secondarySlots;

                            player.call('showInventory', [inventory, global.fastSlotsCache[characterId] || [], secondarySlots]);
                        }
                    });
            }
        } else {
            console.log('Ошибка: Игрок не найден в базе данных');
        }
    });
});


mp.events.add('moveItemToFastSlot', (player, itemId) => {
    const characterId = player.getVariable('selectedCharacterId');

    DB.query(`SELECT inventory, fastslots FROM characters WHERE id = ?`, [characterId], (err, results) => {
        if (err) {
            console.error('Ошибка при запросе базы данных:', err);
            return;
        }

        if (results.length > 0) {
            let inventory = JSON.parse(results[0].inventory);
            let fastSlots = JSON.parse(results[0].fastslots);


            if (itemId.startsWith('armor')) {
                mp.events.call('moveItemToSecondaryFast', player, itemId);  
                return;
            }
            if (itemId.startsWith('health')) {
                mp.events.call('moveItemToSecondaryFast', player, itemId);  
                return;
            }
            const isAlreadyInFastSlot = fastSlots.some(slot => slot.id === itemId);
            if (isAlreadyInFastSlot) {
                mp.events.call('notification', player, 'error', 'Ошибка', 'Это оружие уже находится в быстром слоте');
                return;
            }

            const itemIndex = inventory.indexOf(itemId);
            if (itemIndex !== -1) {
                inventory.splice(itemIndex, 1); 

                const emptySlotIndex = fastSlots.findIndex(slot => slot.id === null || slot.id === undefined);
                if (emptySlotIndex !== -1) {
                    fastSlots[emptySlotIndex] = { id: itemId, slot: emptySlotIndex };

                    global.fastSlotsCache[characterId] = fastSlots;

                    DB.query(`UPDATE characters SET inventory = ?, fastslots = ? WHERE id = ?`, 
                        [JSON.stringify(inventory), JSON.stringify(fastSlots), characterId], (err) => {
                            if (err) {
                                console.error('Ошибка при обновлении базы данных:', err);
                            } else {
                                player.call('showInventory', [inventory, fastSlots, global.secondarySlotsCache[characterId]]);
                            }
                        });
                } else {
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Нет свободных быстрых слотов');
                }
            } else {
                console.log(`Ошибка: Предмет ${itemId} не найден в инвентаре`);
            }
        } else {
            console.log('Ошибка: Игрок не найден в базе данных');
        }
    });
});
mp.events.add('moveItemToSecondaryFast', (player, itemId) => {
    const characterId = player.getVariable('selectedCharacterId');
    let secondarySlots = global.secondarySlotsCache[characterId] || [];

    const emptySlotIndex = secondarySlots.findIndex(slot => slot.id === null);

    if (emptySlotIndex === -1) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Все слоты заняты');
        return;
    }

    if (secondarySlots.some(slot => slot.id === itemId)) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Этот предмет уже есть в слоте');
        return;
    }

    DB.query(`SELECT inventory FROM characters WHERE id = ?`, [characterId], (err, results) => {
        if (err) {
            console.error('Ошибка при запросе базы данных:', err);
            return;
        }

        if (results.length > 0) {
            let inventory = JSON.parse(results[0].inventory);

            const itemIndex = inventory.indexOf(itemId);
            if (itemIndex !== -1) {
                inventory.splice(itemIndex, 1); 
                secondarySlots[emptySlotIndex].id = itemId; 

                DB.query(`UPDATE characters SET inventory = ?, secondarySlots = ? WHERE id = ?`, 
                    [JSON.stringify(inventory), JSON.stringify(secondarySlots), characterId], (err) => {
                        if (err) {
                            console.error('Ошибка при обновлении базы данных:', err);
                        } else {
                            global.secondarySlotsCache[characterId] = secondarySlots; 
                            player.call('showInventory', [inventory, global.fastSlotsCache[characterId], secondarySlots]);
                        }
                    });
            } else {
                console.log(`Ошибка: Предмет ${itemId} не найден в инвентаре`);
            }
        }
    });
});

mp.events.add('moveToInventory', (player, itemId) => {
    const characterId = player.getVariable('selectedCharacterId');

    DB.query(`SELECT inventory, fastslots FROM characters WHERE id = ?`, [characterId], (err, results) => {
        if (err) {
            console.error(err);
            return;
        }

        if (results.length > 0) {
            let inventory = JSON.parse(results[0].inventory);
            let fastSlots = JSON.parse(results[0].fastslots);

            const fastSlotIndex = fastSlots.findIndex(slot => slot.id === itemId);
            if (fastSlotIndex !== -1) {
                player.removeAllWeapons();

                fastSlots[fastSlotIndex] = { id: null, slot: fastSlotIndex };
                inventory.push(itemId); 

                global.fastSlotsCache[characterId] = fastSlots;

                DB.query(`UPDATE characters SET inventory = ?, fastslots = ? WHERE id = ?`, 
                    [JSON.stringify(inventory), JSON.stringify(fastSlots), characterId], (err) => {
                        if (err) {
                            console.error(err);
                        } else {
                            player.call('showInventory', [inventory, fastSlots, global.secondarySlotsCache[characterId]]);
                        }
                    });
            }
        }
    });
});

mp.events.add('useHealthItem', (player, itemId) => {
    const characterId = player.getVariable('selectedCharacterId');

    DB.query(`SELECT inventory FROM characters WHERE id = ?`, [characterId], (err, results) => {
        if (err) {
            console.error('Ошибка при запросе базы данных:', err);
            return;
        }

        if (results.length > 0) {
            let inventory = JSON.parse(results[0].inventory);

            const itemIndex = inventory.indexOf(itemId);
            if (itemIndex !== -1) {
                inventory.splice(itemIndex, 1);

                if (player.health < 100) {
                    player.health = Math.min(100, player.health + 50); 
                } else {
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Ваше здоровье уже полное');
                    return;
                }
                DB.query(`UPDATE characters SET inventory = ? WHERE id = ?`, [JSON.stringify(inventory), characterId], (err) => {
                    if (err) {
                        console.error('Ошибка при обновлении базы данных:', err);
                    } else {
                        player.call('showInventory', [inventory, [], []]);
                    }
                });
            } else {
                console.log(`Ошибка: Предмет ${itemId} не найден в инвентаре`);
            }
        } else {
            console.log('Ошибка: Игрок не найден в базе данных');
        }
    });
});

mp.events.add('useFastSlot', (player, slotNumber) => {
    const characterId = player.getVariable('selectedCharacterId');

    if (slotNumber === 4 || slotNumber === 5) { 
        let secondarySlots = global.secondarySlotsCache[characterId];

        if (!secondarySlots || secondarySlots.length === 0) {
            DB.query(`SELECT secondarySlots FROM characters WHERE id = ?`, [characterId], (err, results) => {
                if (err) {
                    console.error('Ошибка при запросе базы данных:', err);
                    return;
                }

                if (results.length > 0) {
                    secondarySlots = JSON.parse(results[0].secondarySlots || '[{"id": null, "slot": 0}, {"id": null, "slot": 1}]');
                    global.secondarySlotsCache[characterId] = secondarySlots;

                    mp.events.call('useFastSlot', player, slotNumber);
                }
            });
            return;
        }

        const selectedSlot = secondarySlots[slotNumber - 4];

        if (selectedSlot && selectedSlot.id) {
            const itemId = selectedSlot.id;

            if (itemId.startsWith('armor')) {
                if (player.armour === 100) {
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Бронежилет уже надет');
                    return;
                }
                if (player.getVariable('vip') == 0) {
                    player.setClothes(9, 1, 1, 1);
                } else {
                    player.setClothes(9, 28, 0, 1);
                }
                
                player.armour = 100;
                

                selectedSlot.id = null; 

                DB.query(`UPDATE characters SET secondarySlots = ? WHERE id = ?`, 
                    [JSON.stringify(secondarySlots), characterId], (err) => {
                        if (err) {
                            console.error('Ошибка при обновлении базы данных:', err);
                        } else {
                            global.secondarySlotsCache[characterId] = secondarySlots;
                            player.call('showInventory', [[], global.fastSlotsCache[characterId], secondarySlots]);
                        }
                    });
            } else if (itemId.startsWith('health')) {
                if (player.health === 100) {
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Ваше здоровье уже полно');
                    return;
                }
                player.health = Math.min(100, player.health + 50);
                selectedSlot.id = null; 

                DB.query(`UPDATE characters SET secondarySlots = ? WHERE id = ?`, 
                    [JSON.stringify(secondarySlots), characterId], (err) => {
                        if (err) {
                            console.error('Ошибка при обновлении базы данных:', err);
                        } else {
                            global.secondarySlotsCache[characterId] = secondarySlots;
                            player.call('showInventory', [[], global.fastSlotsCache[characterId], secondarySlots]);
                        }
                    });
            }
        }
    } else {
        let fastSlots = global.fastSlotsCache[characterId];

        if (!fastSlots || fastSlots.length === 0) {
            DB.query(`SELECT fastslots FROM characters WHERE id = ?`, [characterId], (err, results) => {
                if (err) {
                    console.error('Ошибка при запросе базы данных:', err);
                    return;
                }

                if (results.length > 0) {
                    fastSlots = JSON.parse(results[0].fastslots || '[]');
                    global.fastSlotsCache[characterId] = fastSlots;

                    mp.events.call('useFastSlot', player, slotNumber);
                }
            });
            return;
        }

        const selectedSlot = fastSlots.find(slot => slot.slot === slotNumber);
        if (selectedSlot && selectedSlot.id) {
            const itemId = selectedSlot.id;
            player.call('receiveWeaponHash', [itemId, slotNumber]);
        }
    }
});


mp.events.add('useArmor', (player, itemId) => {
    const characterId = player.getVariable('selectedCharacterId');

    DB.query(`SELECT inventory FROM characters WHERE id = ?`, [characterId], (err, results) => {
        if (err) {
            console.error('Ошибка при запросе базы данных:', err);
            return;
        }

        if (results.length > 0) {
            let inventory = JSON.parse(results[0].inventory);

            const itemIndex = inventory.indexOf(itemId);
            if (itemIndex !== -1) {
                if (player.armour === 100) {
                    mp.events.call('notification', player, 'error', 'Ошибка', 'Бронежилет уже надет');

                    return;
                }

                inventory.splice(itemIndex, 1);

                if (player.getVariable('vip') == 0) {
                    player.setClothes(9, 1, 1, 1);
                } else {
                    player.setClothes(9, 28, 0, 1);
                }
                
                player.armour = 100;
                

                DB.query(`UPDATE characters SET inventory = ? WHERE id = ?`, [JSON.stringify(inventory), characterId], (err) => {
                    if (err) {
                        console.error('Ошибка при обновлении базы данных:', err);
                    } else {
                        player.call('showInventory', [inventory, [], []]);
                    }
                });
            } else {
                console.log(`Ошибка: Предмет ${itemId} не найден в инвентаре`);
            }
        } else {
            console.log('Ошибка: Игрок не найден в базе данных');
        }
    });
});

mp.events.add('playerQuit', (player) => {
    const characterId = player.getVariable('selectedCharacterId');
    delete global.fastSlotsCache[characterId]; 
});
