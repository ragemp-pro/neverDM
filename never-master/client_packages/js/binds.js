var ShowCursor = false;

mp.keys.bind(0x71, false, function() { 
	ShowCursor = !ShowCursor;
	if (ShowCursor){
		mp.gui.cursor.show(true, true);
	} else {
		mp.gui.cursor.show(false, false);
	}
});

let hudVisible = true;

mp.keys.bind(0x73, false, function() {
    if (hudVisible) {
        mp.events.call('interfaceToggle', false);
        chatActive(false);
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
        mp.events.call('hideHUD');
    } else {
        mp.events.call('interfaceToggle', true);
        chatActive(true);
        mp.game.ui.displayHud(true);
        mp.game.ui.displayRadar(true);
        mp.events.call('showHUD');
    }
    hudVisible = !hudVisible; 
});

/* const movementClipSet = "move_ped_crouched";
const strafeClipSet = "move_ped_crouched_strafing";
const clipSetSwitchTime = 0.25;

const loadClipSet = (clipSetName) => {
    mp.game.streaming.requestClipSet(clipSetName);
    while (!mp.game.streaming.hasClipSetLoaded(clipSetName)) mp.game.wait(0);
}; */


/* let waypointPosition = null; 

mp.events.add("playerCreateWaypoint", (position) => {
    mp.console.logInfo(`New waypoint created at: ${position.x}, ${position.y}, ${position.z}`);
    waypointPosition = position; 
});

mp.keys.bind(0x58, true, function() { 
    let player = mp.players.local;

    if (player.vehicle && waypointPosition) { 
        let vehicle = player.vehicle;
        let driver = vehicle.getPedInSeat(-1);

        if (driver === player.handle) { 
            mp.gui.chat.push("Автопилот активирован. Следуем к вайпоинту.");

            mp.game.invoke('0xE2A2AA2F659D77A7', player.handle, vehicle.handle, waypointPosition.x, waypointPosition.y, waypointPosition.z, 1000000000000000000000.0, 1, vehicle.model, 1074528293, 1000000000000000000000.0, true);


            mp.events.call('render', function() {
                if (mp.game.system.vdist2(player.position.x, player.position.y, player.position.z, waypointPosition.x, waypointPosition.y, waypointPosition.z) < 5.0) {
                    mp.game.invoke('0xE2A2AA2F659D77A7', player.handle, vehicle.handle, player.position.x, player.position.y, player.position.z, 0.0, 1, vehicle.model, 786603, 1.0, false); 
                    mp.gui.chat.push("Вы достигли вайпоинта. Автопилот отключен.");
                    mp.events.remove('render');
                    waypointPosition = null; 
                }
            });
        }
    } else {
        mp.gui.chat.push("Вы должны быть в машине и установить вайпоинт!");
    }
});

 */