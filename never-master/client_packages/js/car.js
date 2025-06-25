
let isInColshape = false;
let carbrowser = null;
let buyButtonHandlerAttached = false; 
 
mp.events.add('EnterSphereCar', () => {
    isInColshape = true;
});

mp.events.add('ExitSphereCar', () => {
    isInColshape = false;
});

function closeCarBrowser() {
    if (carbrowser) {
        setTimeout(() => {
            carbrowser.destroy();
            carbrowser = null;
        }, 300);
        setTimeout(() => {
            mp.events.callRemote('exitDealership');
            buyButtonHandlerAttached = false; 
            mp.events.call('interfaceToggle', true)
            mp.players.local.freezePosition(false);
            mp.game.ui.displayHud(true);
            mp.game.ui.displayRadar(true);
            mp.events.call('showHUD');
            mp.events.call('setGreenZone', true);
            chatActive(true);
        }, 1500);
        mp.gui.cursor.visible = false;
        mp.events.callRemote('exitDealership');
    }
}

mp.events.add('previewCar', (name) => {
    mp.events.callRemote('spawnPreviewCar', name);
});

mp.keys.bind(0x45, true, () => { 
    if (isInColshape) {
        mp.events.call('createCameraSmooth', 75.84, -1395.57, 29.74, 71.73, -1398.88, 29.38);
        
        setTimeout(() => {
            carbrowser = mp.browsers.new('package://browsers/car2/index.html');
        }, 1500);
        mp.events.call('hideHUD');
        chatActive(false);
        mp.players.local.freezePosition(true);
        mp.gui.cursor.visible = true;
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
        mp.events.callRemote('enterDealership');
        mp.events.call('interfaceToggle', false)
    }
});

mp.events.add('closeCarBrowser', () => { 
    carbrowser.execute(`document.body.classList.add('fade-out');`);
    closeCarBrowser();
});

mp.events.add('buyCar', (model, price, name) => {
    mp.events.callRemote('buyCarFromServer', model, price, name);
});
