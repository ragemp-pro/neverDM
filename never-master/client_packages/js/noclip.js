const controlsIds = {
    F3: 114,
    F10: 12,
    W: 32,
    S: 33,
    A: 34,
    D: 35, 
    Space: 321,
    LCtrl: 326,
    LMB: 24,
    RMB: 25
};

global.fly = {
    flying: false,
    f: 2.0,
    w: 2.0,
    h: 2.0,
    point_distance: 1000,
};
global.gameplayCam = mp.cameras.new('gameplay');

let direction = null;
let coords = null;

function isPlayerAdmin() {
    return mp.players.local.getVariable('isAdmin') === true;
}

mp.keys.bind(controlsIds.F3, false, function () {
    if (!isPlayerAdmin()) {
        return;
    }

    const player = mp.players.local;
    const controls = mp.game.controls;
    const fly = global.fly;
    direction = global.gameplayCam.getDirection();
    coords = global.gameplayCam.getCoord();

    fly.flying = !fly.flying;

    mp.events.callRemote('setNoClipStatus', fly.flying);

    player.freezePosition(fly.flying);
    
    if (!fly.flying && !controls.isControlPressed(0, controlsIds.Space)) {
        const position = player.position;
        position.z = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, 0.0, false);
        player.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
    }
});

mp.events.add('updateNoClipStatus', (status) => {
    global.fly.flying = status;
    const player = mp.players.local;

    player.freezePosition(status);
    player.setAlpha(status ? 0 : 255); 
});

mp.events.add('render', () => {
    if (!global.fly.flying || !isPlayerAdmin()) return;

    const controls = mp.game.controls;
    const fly = global.fly;
    direction = global.gameplayCam.getDirection();
    coords = global.gameplayCam.getCoord();

    let updated = false;
    const position = mp.players.local.position;
    let speed;

    if (controls.isControlPressed(0, controlsIds.LMB)) speed = 1.0;
    else if (controls.isControlPressed(0, controlsIds.RMB)) speed = 0.02;
    else speed = 0.2;

    if (controls.isControlPressed(0, controlsIds.W)) {
        if (fly.f < 8.0) fly.f *= 1.025;
        position.x += direction.x * fly.f * speed;
        position.y += direction.y * fly.f * speed;
        position.z += direction.z * fly.f * speed;
        updated = true;
    } else if (controls.isControlPressed(0, controlsIds.S)) {
        if (fly.f < 8.0) fly.f *= 1.025;
        position.x -= direction.x * fly.f * speed;
        position.y -= direction.y * fly.f * speed;
        position.z -= direction.z * fly.f * speed;
        updated = true;
    } else fly.f = 2.0;

    if (controls.isControlPressed(0, controlsIds.A)) {
        if (fly.w < 8.0) fly.w *= 1.025;
        position.x += (-direction.y) * fly.w * speed;
        position.y += direction.x * fly.w * speed;
        updated = true;
    } else if (controls.isControlPressed(0, controlsIds.D)) {
        if (fly.w < 8.0) fly.w *= 1.05;
        position.x -= (-direction.y) * fly.w * speed;
        position.y -= direction.x * fly.w * speed;
        updated = true;
    } else fly.w = 2.0;

    if (controls.isControlPressed(0, controlsIds.Space)) {
        if (fly.h < 8.0) fly.h *= 1.025;
        position.z += fly.h * speed;
        updated = true;
    } else if (controls.isControlPressed(0, controlsIds.LCtrl)) {
        if (fly.h < 8.0) fly.h *= 1.05;
        position.z -= fly.h * speed;
        updated = true;
    } else fly.h = 2.0;

    if (updated) mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
});
