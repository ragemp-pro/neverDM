mp.events.add('playerDeath', (player, reason, killer) => {
    const characterId = player.getVariable('selectedCharacterId');
    const currentMode = player.getVariable('mode');

    if (currentMode !== 0) {
        return;
    }
    
    if (!characterId) {
        console.error('Персонаж не выбран для игрока ' + player.name);
        return;
    }

    if (killer && killer !== player) {
        const killerCharacterId = killer.getVariable('selectedCharacterId');
        const killerMode = killer.getVariable('mode');
        
        if (killerCharacterId && killerMode === 0) {
            DB.query('UPDATE characters SET kills = kills + 1, money = money + 7000 WHERE id = ?', [killerCharacterId], (err) => {
                if (err) {
                    console.error('Ошибка при обновлении киллов или денег для персонажа: ' + err);
                }
            });
        }
    }

    DB.query('UPDATE characters SET deaths = deaths + 1 WHERE id = ?', [characterId], (err) => {
        if (err) {
            console.error('Ошибка при обновлении количества смертей для персонажа: ' + err);
        }
    });
});

mp.events.add('addHours', (player) => {
    DB.query('UPDATE users SET hours = hours + 1 WHERE id = ?', [player.static], (err) => {
        if (err) {
            console.error('Ошибка при обновлении часов: ' + err);
        }
    });
});
