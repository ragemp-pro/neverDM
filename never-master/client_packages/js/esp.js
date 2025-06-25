let espEnabled = false;

function isPlayerAdmin() {
    return mp.players.local.getVariable('isAdmin') === true;
}

mp.keys.bind(0x77, true, function () {
    if (!isPlayerAdmin()) {
        return;
    }

    toggleESP();
});
function toggleESP() {
    espEnabled = !espEnabled;

    if (espEnabled) {
        mp.game.graphics.notify('~g~ESP включено')
    } else {
        mp.game.graphics.notify('~r~ESP выключено'); 
        mp.game.graphics.clearDrawOrigin();
    }
}


mp.events.add("render", () => {
    if (!espEnabled) return;

    mp.players.forEach(player => {
        if (player.handle === 0  || player === mp.players.local ) return; 

        const health = player.getHealth();
        const armor = player.getArmour();

        const position = player.position;
        const screenPosition = mp.game.graphics.world3dToScreen2d(position.x, position.y, position.z);

        if (screenPosition) {
            const characid = player.getVariable('selectedCharacterId');
            const playerId = player.getVariable('static');
            const isAdmin = player.getVariable('isAdmin'); 
            const name = player.getVariable('characterName');
            const surname = player.getVariable('characterSurname');
            const voiceActive = player.getVariable('voiceActive');
            const frac = player.getVariable('fraction');


            const color = isAdmin ? [255, 165, 0, 255] : [255, 255, 255, 255]; 


            mp.game.graphics.drawText(`${name} ${surname} #${characid}\n ID: ${player.id} #${playerId} f: ${frac}\nHP: ${health} ARM: ${armor}\ndimension: ${player.dimension}\nvoice: ${voiceActive}`, 
            [screenPosition.x, screenPosition.y - 0.04], { 
                font: 4,
                color: color,
                scale: [0.25, 0.25],
                outline: false
            });
        }
    });

    mp.vehicles.forEach(vehicle => {
        if (vehicle.handle === 0) return;
        
        const vehicleId = vehicle.remoteId;
        const vehicleModel = mp.game.vehicle.getDisplayNameFromVehicleModel(vehicle.model);
        const spawnerId = vehicle.getVariable('spawnerId');
        const position = vehicle.position;
        const screenPosition = mp.game.graphics.world3dToScreen2d(position.x, position.y, position.z);
        
        if (screenPosition) {
            let hasOccupants = !vehicle.isSeatFree(-1); 
            if (!hasOccupants) {
                for (let i = 0; i < vehicle.getMaxNumberOfPassengers(); i++) {
                    if (!vehicle.isSeatFree(i)) {
                        hasOccupants = true;
                        break;
                    }
                }
            }
            
            const color = hasOccupants ? [255, 255, 255, 255] : [255, 255, 255, 150];
    
            mp.game.graphics.drawText(`ID: ${vehicleId} model: ${vehicleModel} creator: #${spawnerId}`, 
            [screenPosition.x, screenPosition.y - 0.02], {
                font: 4,
                color: color,
                scale: [0.25, 0.25],
                outline: true
            });
        }
    });
    
    
    
});