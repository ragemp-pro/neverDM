let deathBrowser = null;
mp.events.add('playerDeathclient', (isSuicide, killerInfo) => {
    if (!deathBrowser) {
        deathBrowser = mp.browsers.new('package://browsers/death/index.html');
        mp.gui.cursor.show(true, true);
        mp.events.call('hideHUD');
        chatActive(false);
        mp.events.call('interfaceToggle', false);
        mp.gui.cursor.visible = true;
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
        if (isSuicide) {
            deathBrowser.execute(`deathScreen.setDeathMessage(true);`);
        } else {
            deathBrowser.execute(`deathScreen.setDeathMessage(false, '${killerInfo}');`);
        }
    }

    mp.events.add('spawnPlayer', () => {
        if (deathBrowser) {
            deathBrowser.destroy();
            deathBrowser = null; 
            mp.gui.cursor.show(false, false);

        }
    });
});

mp.events.add('spawnPlayer', (destination) => {
    if (deathBrowser) {
        deathBrowser.destroy();
        deathBrowser = null; 
        mp.gui.cursor.show(false, false); 
        mp.events.call('showHUD');
        mp.events.call('setGreenZone', true);
        chatActive(true);
        mp.game.ui.displayHud(true);
        mp.game.ui.displayRadar(true);
        mp.events.call('interfaceToggle', true);
    }

    if (destination === 'spawn') {
        mp.events.callRemote('spawnPlayerServer', 'spawn');
    } else if (destination === 'hospital') {
        mp.events.callRemote('spawnPlayerServer', 'hospital'); 
    }
});

