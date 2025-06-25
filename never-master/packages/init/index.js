require('./blips')
require('./database')
mp.events.add('updateOnline', (player) => {
    player.call('updateOnline', [mp.players.length])
});
setInterval(() => {
    mp.players.call('updateOnline', [mp.players.length])
}, 5000);
let dimensionCounter = 1; 
mp.events.add('playerJoin', (player) => {
    player.call('welcomeScreen');
    player.isAuthenticated = false;
    player.position = new mp.Vector3(-55.88, 821.46, 231.32);
    player.dimension = 11829;
    player.call('createCamera', [-55.54, 818.30, 228.38, -45.89, 767.35, 228.15]);
});


mp.events.add('create-character', (player) => {
    player.position = new mp.Vector3(-74.73, 802.56, 227.60);
    player.heading = -107.1370;
    player.setClothes(parseInt(11), parseInt(7), parseInt(1), parseInt(0));
    player.setClothes(parseInt(4), parseInt(3), parseInt(1), parseInt(0));
    player.setClothes(parseInt(6), parseInt(32), parseInt(1), parseInt(0));
    player.setClothes(parseInt(8), parseInt(15), parseInt(1), parseInt(0));
    player.setClothes(parseInt(3), parseInt(15), parseInt(0), parseInt(0));

    player.call('createCameraWithInterp', [-71.85, 801.71, 227.59, -74.73, 802.56, 227.60]);

    player.call('delayedDimensionChange');
});

mp.events.add('changeDimension', (player) => {
    player.dimension = ++dimensionCounter;
});

mp.events.add('authSuccess', (player, username) => {
    if (!player.isAuthenticated) {
        player.isAuthenticated = true;
    }
});

mp.events.add('character-show', (player) => {
    player.dimension = 11829;
});

mp.events.add('authFailed', (player) => {
    if (!player.isAuthenticated) {
    }
});

mp.events.add('notification', (player, type, title, message) => {
    player.call('notify', [type, title, message]);
});
mp.events.add('notificationAUTH', (player, title, message) => {
    player.call('notificationAUTH', [title, message]);
});
mp.events.add('lobby', (player) => {
    player.heading = -178.5447;
    player.call('openMenuLobby')
    player.call('lobby')
})

mp.events.add('dimzero', (player) => {
    player.dimension = 0;
});

mp.events.add('updateHair', (player, id) => {
    player.setClothes(parseInt(2), parseInt(id), parseInt(0), parseInt(0));
});

mp.events.add('fracPos', (player) => {
    const frac = player.getVariable('fraction');

    player.position = fractions[frac].position;
})

mp.events.add('updateCustomization', (player, customizationDataJSON) => {
    const customizationData = JSON.parse(customizationDataJSON);

    player.setCustomization(
        customizationData.gender,
        Number(customizationData.motherBlend),
        Number(customizationData.fatherBlend),
        0, 
        Number(customizationData.motherBlend),
        Number(customizationData.fatherBlend),
        0, 
        customizationData.shapeMix,
        customizationData.skinMix,
        0, 
        customizationData.eyeColor,
        customizationData.hairColor,
        customizationData.highlightColor,
        customizationData.faceFeatures
    );
});

mp.events.add('applyClothes', (player, componentId, drawableId, texture) => {
    player.setClothes(parseInt(componentId), parseInt(drawableId), parseInt(texture), 0);
});

mp.events.add('setstyle', (player, OverlayID, style, color) => {
    style = parseInt(style);
    color = parseInt(color);
    OverlayID = parseInt(OverlayID);

    player.setHeadOverlay(OverlayID, [style, 1.0, color, color]); 
});

mp.events.add('playerArmourDepleted', (player) => {
    player.setClothes(9, 0, 1, 1);  
});