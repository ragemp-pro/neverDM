let isInClothesShop = false;
let clothesbrowser;

mp.events.add('EnterSphereClothes', () => {
    isInClothesShop = true;
});

mp.events.add('ExitSphereClothes', () => {
    isInClothesShop = false;
});

mp.events.add('close-clothes', () => {
    mp.events.callRemote('exitClothesShop'); 
    if (clothesbrowser) {
        clothesbrowser.execute(`document.body.classList.add('fade-out');`);
    
        setTimeout(() => {
            clothesbrowser.destroy(); 
            clothesbrowser = null; 
        }, 300);
        setTimeout(() => {
            mp.players.local.freezePosition(false);
            mp.gui.cursor.visible = false;
            mp.game.ui.displayHud(true);
            mp.game.ui.displayRadar(true);
            mp.events.call('showHUD');
            mp.events.call('setGreenZone', true);
            chatActive(true);
            mp.events.call('interfaceToggle', true)
        }, 1500);
    }
});

mp.keys.bind(0x45, true, function() { 
    if (isInClothesShop) {
        mp.events.call('hideHUD');
        chatActive(false);
        mp.players.local.freezePosition(true);
        mp.gui.cursor.visible = true;
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
        mp.events.call('interfaceToggle', false)
        mp.events.callRemote('enterClothesShop'); 
        setTimeout(() => {
            clothesbrowser = mp.browsers.new('package://browsers/clothes/index.html');
        }, 1500);
    }
});

mp.events.add('displayBoughtClothes', (clothes) => {
    if (clothesbrowser) {
        clothesbrowser.execute(`clothesShop.displayBoughtClothes(${JSON.stringify(clothes)})`);
    }
});

mp.events.add('tryOnClothes', (component, drawable, texture) => {
    mp.events.callRemote('tryOnClothes', component, drawable, texture);
});

mp.events.add('buyOnClothes', (name, component, drawable, texture, price) => {
    mp.events.callRemote('buyOnClothes', name, component, drawable, texture, price);
});

mp.events.add('requestBoughtClothes', () => {
    mp.events.callRemote('getBoughtClothes');
});

mp.events.add('putOnClothes', (name, component, drawable, texture) => {
    mp.events.callRemote('putOnClothes', name, component, drawable, texture);
});
