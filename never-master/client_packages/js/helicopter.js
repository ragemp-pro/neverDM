
let isInColshape = false;
let helicopterBrowser = null;
let buyButtonHandlerAttached = false; 

mp.events.add('EnterSphereHelicopter', () => {
    isInColshape = true;
});

mp.events.add('ExitSphereHelicopter', () => {
    isInColshape = false;
});

mp.keys.bind(0x45, true, () => { 
    if (isInColshape) {
        mp.events.call('hideHUD');
        chatActive(false);
        mp.players.local.freezePosition(true);
        mp.gui.cursor.visible = true;
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
        mp.events.callRemote('enterHelicotper');
        mp.events.call('interfaceToggle', false)
        setTimeout(() => {
            helicopterBrowser = mp.browsers.new('package://browsers/helicopter/index.html');
        }, 1500);
    }
});
mp.events.add('previewhelicopter', (name) => {
    mp.events.callRemote('spawnPreviewhelicopter', name);
});
mp.events.add('closeHelicopterBrowser', () => { 
    helicopterBrowser.execute(`document.body.classList.add('fade-out');`);
    if (helicopterBrowser) {
        setTimeout(() => {
            helicopterBrowser.destroy();
            helicopterBrowser = null;
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
});
