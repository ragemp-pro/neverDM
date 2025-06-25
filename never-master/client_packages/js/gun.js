mp.keys.bind(0x45, true, function () {
    const player = mp.players.local;
    
    let closestObject = null;
    let minDistance = 2.0; 

    mp.objects.forEachInRange(player.position, 2.0, (object) => {
        let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, object.position.x, object.position.y, object.position.z);
        if (dist < minDistance) {
            closestObject = object;
            minDistance = dist;
        }
    });

    if (closestObject) {
        mp.events.callRemote('pickUpWeapon', closestObject);
    }
}); 

mp.events.add('playPickupAnimation', () => {
    const player = mp.players.local;

    if (!mp.game.streaming.hasAnimDictLoaded('pickup_object')) {
        mp.game.streaming.requestAnimDict('pickup_object');
        while (!mp.game.streaming.hasAnimDictLoaded('pickup_object')) {
            mp.game.wait(0);
        }
    }

    player.taskPlayAnim('pickup_object', 'pickup_low', 8.0, 1, -1, 0, 0, false, false, false);

    setTimeout(() => {
        if (player.isPlayingAnim('pickup_object', 'pickup_low', 3)) {
            player.clearTasksImmediately();
        }
    }, 2000);
});
