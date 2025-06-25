const pedsData = [
    {
        model: 'csb_mp_agent14',           
        position: new mp.Vector3(214.34, -1386.06, 30.59),  
        heading: -90,                         
        dimension: 0,
        name: 'John',
        dialog: 'Че надо?',  
        button1: 'Мне нужна работа',          
        button2: 'Я пойду',           
        trigger1: function() {        
            mp.events.callRemote('starthijacking') 
        },
        trigger2: function() {        
            mp.events.call('stopDialog') 
        }
    }
];

let interactingWithPed = null;
let dialogbrowser = null; 

function createPed(pedData) {
    let bot = mp.peds.new(
        mp.game.joaat(pedData.model),  
        pedData.position,               
        pedData.heading,               
        pedData.dimension              
    );

    let nameLabel = mp.labels.new(
        pedData.name, 
        pedData.position.add(new mp.Vector3(0, 0, 1.1)),  
        { 
            los: false,  
            drawDistance: 5.0, 
            font: 4, 
            color: [255, 255, 255, 255], 
            scale: 0 
        }
    );

    let marker = mp.markers.new(27, pedData.position.subtract(new mp.Vector3(0, 0, 1)), 1, {
        color: [255, 255, 255, 255],
        dimension: pedData.dimension
    });

    bot.nameLabel = nameLabel;
    bot.marker = marker;

    return bot;
}

pedsData.forEach(createPed);

mp.keys.bind(0x45, true, function () { 
    const player = mp.players.local;

    let closestPed = null;
    let minDistance = 2.0; 
    if (interactingWithPed !== null) {
        return;  
    }
    mp.peds.forEachInRange(player.position, 2.0, (ped) => {
        let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, ped.position.x, ped.position.y, ped.position.z);
        if (dist < minDistance) {
            closestPed = ped;
            minDistance = dist;
        }
    });

    if (closestPed) {
        interactingWithPed = closestPed; 
		mp.gui.cursor.show(true, true);

        const pedData = pedsData.find(ped => ped.name === closestPed.nameLabel.text);
        mp.events.call('openHtmlDialog', pedData);  

        const pedPosition = closestPed.position;
        mp.events.call('createCameraSmooth', pedPosition.x + 0.9, pedPosition.y, pedPosition.z + 0.7, pedPosition.x, pedPosition.y, pedPosition.z + 0.7);
    }
});

mp.keys.bind(0x1B, true, function () { 
    if (interactingWithPed) {
        mp.events.call('stopDialog')
    }
});

mp.events.add('openHtmlDialog', function(pedData) {
    if (dialogbrowser) {
        dialogbrowser.destroy(); 
    }
    mp.events.call('interfaceToggle', false);
    chatActive(false);
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
    mp.events.call('hideHUD');
    dialogbrowser = mp.browsers.new('package://browsers/dialog/index.html');

    dialogbrowser.execute(`
        dialog.updateDialog({
            name: "${pedData.name}",
            dialog: \`${pedData.dialog}\`,
            button1: "${pedData.button1}",
            button2: "${pedData.button2}",
            trigger1: function() {
                mp.trigger('dialogButtonPressed', 1);
            },
            trigger2: function() {
                mp.trigger('dialogButtonPressed', 2);
            }
        });
    `);
    
});

mp.events.add('dialogButtonPressed', function(buttonNumber) {
    const pedData = pedsData.find(ped => ped.name === interactingWithPed.nameLabel.text);
    
    if (buttonNumber === 1) {
        pedData.trigger1();  
    } else if (buttonNumber === 2) {
        pedData.trigger2();  
    }
});

mp.events.add('stopDialog', () => {
	mp.gui.cursor.show(false, false);
    
    dialogbrowser.execute(`document.body.classList.add('fade-out');`);
    setTimeout(() => {
        if (dialogbrowser) {
            dialogbrowser.destroy();  
            dialogbrowser = null; 
        }
        mp.events.call('interfaceToggle', true);
        chatActive(true);
        mp.game.ui.displayHud(true);
        mp.game.ui.displayRadar(true);
        mp.events.call('showHUD');
    }, 300);
    interactingWithPed = null; 

    mp.events.call('removeCameraSmooth');
});
mp.events.add('setWaypoint', (x, y) => {
    mp.game.ui.setNewWaypoint(x, y); 
});
let hijackedVehicle = null;  
let hijackedMarker = null;   
function isPlayerNearVehicle(vehicle) {
    const player = mp.players.local;
    const dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, vehicle.position.x, vehicle.position.y, vehicle.position.z);
    return dist < 5.0;  
}

mp.events.add('createHijackedVehicleMarker', (vehicleId, x, y, z) => {
    const player = mp.players.local;
    hijackedVehicle = mp.vehicles.at(vehicleId);
    hijackedVehicleLOCK = true;
    if (hijackedVehicle) {
        hijackedMarker = mp.markers.new(36, new mp.Vector3(x, y, z + 2), 1, {
            color: [255, 0, 0, 255],
            dimension: player.dimension
        });
    }
});
let hasShownNotify = false; 

mp.events.add('render', () => {
    if (hijackedVehicle && hijackedMarker) {
        hijackedMarker.position = new mp.Vector3(hijackedVehicle.position.x, hijackedVehicle.position.y, hijackedVehicle.position.z + 2);
        
        const player = mp.players.local;
        const dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, hijackedVehicle.position.x, hijackedVehicle.position.y, hijackedVehicle.position.z);
        
        if (dist < 5.0 && hijackedVehicleLOCK && !hasShownNotify) {
            mp.events.call('notify', 'info', 'Информация', "Нажмите на кнопку 'G', чтобы взломать замок машины");
            hasShownNotify = true;  
        }
        
        if (dist >= 5.0 && hasShownNotify) {
            hasShownNotify = false;
        }
    }
});


mp.keys.bind(0x47, true, () => {  
    const player = mp.players.local;

    if (!hijackedVehicle || !isPlayerNearVehicle(hijackedVehicle)) {
        return;  
    }

    if (hijackedVehicleLOCK === false) {
        return;
    }

    if (Hijackingbrowser === null) {
        mp.events.callRemote('checkVehicleOwner');
    }
});
mp.events.add('removeHijackedVehicleMarker', () => {
    if (hijackedMarker) {
        hijackedMarker.destroy();  
        hijackedMarker = null;     
    }
});

let Hijackingbrowser = null
mp.events.add('openHijackingDialog', (vehicle) => {
    Hijackingbrowser = mp.browsers.new('package://browsers/hijacking/index.html');
    mp.gui.cursor.show(true, true);
    mp.events.call('interfaceToggle', false);
    chatActive(false);
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
    mp.events.call('hideHUD');
});
mp.events.add('HijackingSuccess', () => {
    Hijackingbrowser.execute(`document.body.classList.add('fade-out');`);
    
    setTimeout(() => {
        if (Hijackingbrowser) {
            Hijackingbrowser.destroy();  
            Hijackingbrowser = null; 
        }
        mp.events.call('interfaceToggle', true);
        chatActive(true);
        mp.game.ui.displayHud(true);
        mp.game.ui.displayRadar(true);
        mp.events.call('showHUD');
        mp.gui.cursor.show(false, false);
        
    }, 300);
    mp.events.callRemote('unlockcar', hijackedVehicle)
    mp.events.call('notify', 'success', 'Успешно', 'Вы взломали замок')
    mp.events.call('notify', 'info', 'Информация', 'Едьте до указанной точки, там вы сможете сдать машину')
    hijackedVehicleLOCK = false;
    mp.game.ui.setNewWaypoint(467.03, -584.88); 
});
