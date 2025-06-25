const weaponsProps = {
    0xC1B3C3D1: { model: 'w_pi_revolver', label: 'Heavy Revolver', weaponName: 'weapon_revolver' },
    0x83BF0278: { model: 'w_ar_carbinerifle', label: 'Carbine Rifle', weaponName: 'weapon_carbinerifle' },
    0x3AABBBAA: { model: 'w_sg_heavyshotgun', label: 'Heavy Shotgun', weaponName: 'weapon_heavyshotgun' },
    0xCB96392F: { model: 'w_pi_revolvermk2', label: 'Heavy Revolver Mk II', weaponName: 'weapon_revolver_mk2' },
    0xBFEFFF6D: { model: 'w_ar_assaultrifle', label: 'Assault Rifle', weaponName: 'weapon_assaultrifle' },
    0xC0A3098D: { model: 'w_ar_specialcarbine', label: 'Special Carbine', weaponName: 'weapon_specialcarbine' },
    0x7FD62962: { model: 'w_mg_combatmg', label: 'Combat MG', weaponName: 'weapon_combatmg' },
    0x9D07F764: { model: 'w_mg_mg', label: 'MG', weaponName: 'weapon_mg' },
    0x05FC3C11: { model: 'w_sr_sniperrifle', label: 'Sniper Rifle', weaponName: 'weapon_sniperrifle' },
    0xA914799: { model: 'w_sr_heavysnipermk2', label: 'Heavy Sniper Mk II', weaponName: 'weapon_heavysniper_mk2' },
    0xB1CA77B1: { model: 'w_lr_rpg', label: 'RPG', weaponName: 'weapon_rpg' },
    0xC734385A: { model: 'w_sr_marksmanrifle', label: 'Marksman Rifle', weaponName: 'weapon_marksmanrifle' },
    0x6A6C02E0: { model: 'w_sr_marksmanriflemk2', label: 'Marksman Rifle Mk II', weaponName: 'weapon_marksmanrifle_mk2' },
    0x6E7DDDEC: { model: 'w_sr_precisionrifle_reh', label: 'Precision Rifle', weaponName: 'weapon_precisionrifle' },
    0xDBBD7280: { model: 'w_mg_combatmgmk2', label: 'Combat MG Mk II', weaponName: 'weapon_combatmg_mk2' },
    0x61012683: { model: 'w_sb_gusenberg', label: 'Gusenberg Sweeper', weaponName: 'weapon_gusenberg' },

};

mp.events.add('playerDeath', (player) => {
    if (player.dimension !== 0 || player.vehicle) return;

    if (player.weapon !== undefined && weaponsProps[player.weapon]) {
        const weaponData = weaponsProps[player.weapon];
        const weaponProp = weaponData.model;
        const weaponLabel = weaponData.label;
        const weaponName = weaponData.weaponName;
        const position = player.position;
        const rotation = player.heading;

        if (weaponName === 'weapon_revolver') {
            return;
        }
        
        const groundPosition = new mp.Vector3(position.x, position.y, position.z - 0.9);
        const objectRotation = new mp.Vector3(90, 0, rotation);

        const object = mp.objects.new(mp.joaat(weaponProp), groundPosition, {
            rotation: objectRotation,
            dimension: player.dimension
        });

        const labelPosition = new mp.Vector3(groundPosition.x, groundPosition.y, groundPosition.z + 0.3);
        const label = mp.labels.new(weaponLabel, labelPosition, {
            los: true,
            font: 4,
            drawDistance: 5,
            scale: [0.05, 0.05],
            dimension: player.dimension
        });

        object.weaponName = weaponName; 
        object.weaponLabel = label; 

        mp.events.call('notification', player, 'alert', 'Предупреждение', `С Вас выпало оружие ${weaponLabel}`);


        const characterId = player.getVariable('selectedCharacterId');
        DB.query('SELECT fastSlots FROM characters WHERE id = ?', [characterId], (err, result) => {
            if (err) {
                console.error('Ошибка при получении быстрых слотов: ' + err);
                return;
            }

            if (result.length > 0) {
                let fastSlots = JSON.parse(result[0].fastSlots || '[]');

                for (let i = 0; i < fastSlots.length; i++) {
                    if (fastSlots[i] && fastSlots[i].id === weaponName) {
                        fastSlots[i] = { id: null, slot: i }; 
                        break;
                    }
                }

                DB.query('UPDATE characters SET fastSlots = ? WHERE id = ?', [JSON.stringify(fastSlots), characterId], (err) => {
                    if (err) {
                        console.error('Ошибка при обновлении быстрых слотов: ' + err);
                    } else {
                        console.log(`[GUNS] Пользователь #${characterId} потерял оружие ${weaponLabel}(${weaponName})`)
                        global.fastSlotsCache[characterId] = fastSlots;
                    }
                });
            }
        });

    }
});

mp.events.add('pickUpWeapon', (player, object) => {
    if (player.dimension !== 0 || player.vehicle) return;
    if (player.health <= 0) {
        return;
    }

    if (object && object.weaponName) {
        const weaponLabel = object.weaponLabel.text;
        const weaponName = object.weaponName;

        object.weaponLabel.destroy();
        object.destroy();

        mp.events.call('notification', player, 'success', 'Успешно', `Вы подобрали оружие ${weaponLabel}`);

        const characterId = player.getVariable('selectedCharacterId');

        DB.query('SELECT inventory FROM characters WHERE id = ?', [characterId], (err, result) => {
            if (err) {
                console.error('Ошибка при получении инвентаря: ' + err);
                return;
            }

            if (result.length > 0) {
                let inventory = JSON.parse(result[0].inventory || '[]');  

                inventory.push(weaponName);

                DB.query('UPDATE characters SET inventory = ? WHERE id = ?', [JSON.stringify(inventory), characterId], (err) => {
                    if (err) {
                        console.error('Ошибка при обновлении инвентаря: ' + err);
                    } else {
                        console.log(`[GUNS] Пользователь #${characterId} подобрал оружие ${weaponLabel}(${weaponName})`);
                    }
                });
            }
        });

        player.call('playPickupAnimation');
    } else {
    }
});

let isDroppingItem = false;

mp.events.add('dropItem', (player, weaponName) => {
    if (player.dimension !== 0 || player.vehicle) return;
    if (isDroppingItem) {
        return;
    }

    isDroppingItem = true; 

    const characterId = player.getVariable('selectedCharacterId');
    
    DB.query('SELECT inventory FROM characters WHERE id = ?', [characterId], (err, results) => {
        if (err) {
            console.error(err);
            isDroppingItem = false; 
            return;
        }

        if (results.length > 0) {
            let inventory = JSON.parse(results[0].inventory);

            const itemIndex = inventory.indexOf(weaponName);
            if (itemIndex !== -1) {
                inventory.splice(itemIndex, 1);

                DB.query('UPDATE characters SET inventory = ? WHERE id = ?', [JSON.stringify(inventory), characterId], (err) => {
                    if (err) {
                        console.error(err);
                        isDroppingItem = false;
                    } else {
                        isDroppingItem = false;
                        const weaponEntry = Object.values(weaponsProps).find(entry => entry.weaponName === weaponName);

                        if (weaponEntry) {
                            const weaponProp = weaponEntry.model;
                            const weaponLabel = weaponEntry.label;

                            const position = player.position;
                            const rotation = player.heading;
                            const groundPosition = new mp.Vector3(position.x, position.y, position.z - 0.98);

                            const object = mp.objects.new(mp.joaat(weaponProp), groundPosition, {
                                rotation: new mp.Vector3(90, 0, rotation),
                                dimension: player.dimension
                            });

                            const labelPosition = new mp.Vector3(groundPosition.x, groundPosition.y, groundPosition.z + 0.3);
                            const label = mp.labels.new(weaponLabel, labelPosition, {
                                los: false,
                                font: 4,
                                drawDistance: 5,
                                scale: [0.05, 0.05],
                                dimension: player.dimension
                            });

                            object.weaponName = weaponName;
                            object.weaponLabel = label;

                            mp.events.call('notification', player, 'success', 'Успешно', `Вы выбросили оружие ${weaponLabel}`);

                            player.call('showInventory', [inventory]);

                            console.log(`[GUNS] Пользователь #${characterId} выбросил оружие ${weaponLabel}(${weaponName})`);
                        } 
                    }
                });
            } else {
                isDroppingItem = false; 
            }
        }
    });
});
