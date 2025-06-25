function isPlayerInSphere(player) {
    return global.spheres.some(sphere => sphere.isPointWithin(player.position));
}

mp.events.add('playerDeath', (player, reason, killer) => {
    if (isPlayerInSphere(player)) {
        
        const teleportPoint = global.getRandomTeleportPoint();
        player.spawn(teleportPoint); 
        player.health = 100;

        const mode = player.getVariable('mode');
        killer.health = 100;
        switch (mode) {
            case 1:
                player.giveWeapon(mp.joaat('weapon_revolver'), 9999);
                break;
            case 2:
                player.giveWeapon(mp.joaat('weapon_carbinerifle'), 9999);
                break;
            case 3:
                player.giveWeapon(mp.joaat('weapon_sniperrifle'), 9999);
                break;
            default:
                mp.events.call('notification', player, 'info', 'Режим', 'Нет подходящего оружия для этого режима');
                break;
        }

        return;
    }
    player.setVariable('isDead', true);
    player.data.isCrouched = false;

    if (killer && killer.type === 'player' && killer === player) { 
        const Name = player.getVariable('characterName');
        const Surname = player.getVariable('characterSurname');
        const PlayerId = player.getVariable('selectedCharacterId');
        console.log(`[SERVER] Самоубийство: ${Name} ${Surname}#${PlayerId} (ID: ${player.id})`);

        player.call('playerDeathclient', [true, null]); 
    } else if (killer && killer.type === 'player') {
        const killerName = killer.getVariable('characterName');
        const killerSurname = killer.getVariable('characterSurname');
        const killerId = killer.getVariable('selectedCharacterId');
        const playerName = player.getVariable('characterName');
        const PlayerId = player.getVariable('selectedCharacterId');

        const playerSurname = player.getVariable('characterSurname');
        console.log(`[SERVER] Убийство: ${killerName} ${killerSurname} #${killerId} убил ${playerName} ${playerSurname} #${PlayerId}`);
        mp.events.call('notification', killer, 'info', 'Информация', `Убийство игрока ${playerName} ${playerSurname} #${player.getVariable('selectedCharacterId')}`);

        player.call('playerDeathclient', [false, `${killerName} ${killerSurname} #${killerId}`]); 
    } else {
        const Name = player.getVariable('characterName');
        const Surname = player.getVariable('characterSurname');
        const PlayerId = player.getVariable('selectedCharacterId');
        console.log(`[SERVER] Смерть от неизвестного источника: ${Name} ${Surname}#${PlayerId} (ID: ${player.id})`);
        player.call('playerDeathclient', [true, null]);
    }
});

mp.events.add('spawnPlayerServer', (player, destination) => {
    player.setVariable('isDead', false);
    const fractionId = player.getVariable('fraction');
    if (destination === 'spawn') {
        player.spawn(new mp.Vector3(fractions[fractionId].position)); 
        player.health = 100; 

        player.giveWeapon(mp.joaat('gadget_parachute'),1000);

        player.setClothes(9, 0, 1, 1);  

        mp.events.call('notification', player, 'success', 'Успешно', "Вы возрадились на фракции");
        console.log(`[SERVER] Игрок ${player.name}#${player.static} (ID: ${player.id}) возродился на спавне`);
    } else if (destination === 'hospital') {
        player.spawn(new mp.Vector3(354.46, -1407.20, 32.51)); 
        player.health = 100; 
        player.heading = 49.6644; 
        player.giveWeapon(mp.joaat('gadget_parachute'),1000);

        player.setClothes(9, 0, 1, 1);  

        mp.events.call('notification', player, 'success', 'Успешно', "Вы возрадились в больнице");
        console.log(`[SERVER] Игрок ${player.name}#${player.static} (ID: ${player.id}) возродился в больнице`);
    }
});
