let sphereHelicopter = mp.colshapes.newSphere(-177.33, -1155.39, 23.11, 10);
let dimensionCounter = 1;

mp.events.add("playerEnterColshape", (player, shape) => {
    if (shape === sphereHelicopter) { 
        mp.events.call('notification', player, 'info', 'Информация', "Нажмите 'E', чтобы зайти в вертолётный центр");
        player.call('EnterSphereHelicopter')
    }
});

mp.events.add("playerExitColshape", (player, shape) => {
    if (shape === sphereHelicopter) {
        player.call('ExitSphereHelicopter')

    }
});

mp.events.add('enterHelicotper', (player) => {
    player.dimension = dimensionCounter++;
    player.call('createCameraSmooth', [-195.09, -1133.13, 25.12, -182.04, -1141.79, 23.09]);
});

mp.events.add('exitHelicotper', (player) => {
    player.dimension = 0;
    player.call('removeCameraSmooth');
});

let previewHelicopters = {}; 
mp.events.add('spawnPreviewhelicopter', (player, name) => {
    if (previewHelicopters[player.id]) {
        previewHelicopters[player.id].destroy();
    }

    let vehicle = mp.vehicles.new(mp.joaat(name), new mp.Vector3(-182.04, -1141.79, 23.09), {
        dimension: player.dimension,
        heading: 100
    });

    vehicle.setColor(111, 111);

    previewHelicopters[player.id] = vehicle;
});