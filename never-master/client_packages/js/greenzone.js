let isInGreenZone = false;

mp.events.add('setGreenZone', (state) => {
    isInGreenZone = state;
    mp.events.callRemote('toggleInvincibility', state)

});

mp.events.add('render', () => {
    if (isInGreenZone) {
        mp.game.controls.disableControlAction(0, 24, true); 
        mp.game.controls.disableControlAction(0, 25, true);
        mp.game.controls.disableControlAction(0, 69, true);
        mp.game.controls.disableControlAction(0, 70, true);
        mp.game.controls.disableControlAction(2, 257, true);
        mp.game.controls.disableControlAction(0, 164, true);
        mp.players.local.setInvincible(true);
        
    } 
});
