global.spheres = [
    mp.colshapes.newSphere(195.16, -933.03, 30.69, 90, 1), 
    mp.colshapes.newSphere(195.16, -933.03, 30.69, 90, 2), 
    mp.colshapes.newSphere(195.16, -933.03, 30.69, 90, 3)
];

global.teleportPoints = [
    new mp.Vector3(170.69, -917.68, 30.69),
    new mp.Vector3(157.87, -983.05, 30.07),
    new mp.Vector3(197.31, -993.44, 30.08),
    new mp.Vector3(219.77, -950.37, 30.08),
    new mp.Vector3(211.78, -968.83, 26.23),
    new mp.Vector3(233.36, -873.78, 30.48),
    new mp.Vector3(254.19, -872.38, 29.98)
];

global.getRandomTeleportPoint = function() {
    const randomIndex = Math.floor(Math.random() * global.teleportPoints.length);
    return global.teleportPoints[randomIndex];
};

mp.events.add('playerExitColshape', (player, colshape) => {
    if (spheres.includes(colshape) && player.dimension === colshape.dimension) {
        player.position = getRandomTeleportPoint();
    }
});

mp.events.add('changeMode', (player, changeMode) => {
    const currentMode = player.getVariable('mode');
    const characid = player.getVariable('selectedCharacterId');
    const name = player.getVariable('characterName');
    const surname = player.getVariable('characterSurname');

    if (currentMode === changeMode) {
        mp.events.call('notification', player, 'error', 'Ошибка', 'Вы уже находитесь в этом режиме.');
        return; 
    }

    if (changeMode === 0) {
        const fractionId = player.getVariable('fraction');
        if (!fractionId || !global.fractions[fractionId]) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Выберите фракцию перед входом в режим Gang War');
            return;
        }
        player.health = 100;
        player.dimension = 0;
        player.setVariable('mode', 0);
        player.removeAllWeapons();
        player.setClothes(9, 0, 1, 1);  
        player.armour = 0; 

        player.position = fractions[fractionId].position;
        mp.events.call('notification', player, 'success', 'Успешно', 'Вы зашли в режим Gang War');
        console.log(`[SERVER] Игрок ${name} ${surname} #${characid} перешел в режим Gang War`)
    }

    if (changeMode === 1) {
        player.health = 100;
        player.giveWeapon(mp.joaat('weapon_revolver'), 9999);
        player.setClothes(9, 0, 1, 1);  
        player.armour = 0; 

        player.position = getRandomTeleportPoint();
        mp.events.call('notification', player, 'success', 'Успешно', 'Вы зашли в режим revolver dm');
        console.log(`[SERVER] Игрок ${name} ${surname} #${characid} перешел в режим revolver dm`)

    }

    if (changeMode === 2) {
        player.health = 100;
        player.giveWeapon(mp.joaat('weapon_carbinerifle'), 9999);
        player.setClothes(9, 0, 1, 1);  
        player.armour = 0; 

        player.position = getRandomTeleportPoint();
        mp.events.call('notification', player, 'success', 'Успешно', 'Вы зашли в режим carabin dm');
        console.log(`[SERVER] Игрок ${name} ${surname} #${characid} перешел в режим carabin dm`)
    }

    if (changeMode === 3) {
        player.health = 100;
        player.giveWeapon(mp.joaat('weapon_sniperrifle'), 9999);
        player.setClothes(9, 0, 1, 1);  
        player.armour = 0; 
        player.position = getRandomTeleportPoint();
        mp.events.call('notification', player, 'success', 'Успешно', 'Вы зашли в режим sniper dm');
        console.log(`[SERVER] Игрок ${name} ${surname} #${characid} перешел в режим sniper dm`)
    }


    player.setVariable('mode', changeMode);
    player.dimension = changeMode;
    player.call('closeMenu')

});

// 0 - gang war / 1 - revolver dm / 2 - carabin dm / 3 - sniper dm
