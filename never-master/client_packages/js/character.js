let characterBrowser = null;
let hudBrowser = null;

mp.events.add('showCharacterSelection', (characters) => {
    if (characterBrowser === null) {
        characterBrowser = mp.browsers.new('package://browsers/characters/index.html');
        mp.gui.cursor.visible = true;
        mp.events.callRemote('getAccountInfo');
        
        mp.events.call('interfaceToggle', false);
        mp.events.callRemote('setNoClipStatus', true);
        

    }
    characterBrowser.execute(`loadCharacters(${JSON.stringify(characters)});`);
});
mp.events.add('updateAccountInfo', (login, socialClub, DP) => {
    if (characterBrowser !== null) {

        characterBrowser.execute(`chooseCharacters.login = "${login}"`);
        characterBrowser.execute(`chooseCharacters.socialClub = "${socialClub}"`);
        characterBrowser.execute(`chooseCharacters.DP = ${DP}`);
    }
});


mp.events.add('updateCharacterList', (characters) => {
    if (characterBrowser !== null) {
        characterBrowser.execute(`chooseCharacters.loadCharacters(${JSON.stringify(characters)});`);

    }
});
mp.events.add('UIfrac', () => {
    mp.game.cam.doScreenFadeOut(200);
    mp.gui.cursor.visible = false;

    setTimeout(() => {
        mp.events.callRemote('fracPos')
        mp.game.cam.doScreenFadeIn(200);
        mp.events.callRemote('setNoClipStatus', false);
        mp.players.local.freezePosition(false);
        mp.events.call('removeCamera');
        mp.events.callRemote('dimzero')
        mp.events.add('render', () => {
            mp.game.time.setClockTime(15, 0, 0); 
        });
    }, 1000);

    setTimeout(() => {
        chatActive(true);
        mp.game.ui.displayHud(true);
        mp.game.ui.displayRadar(true);
        mp.events.call('interfaceToggle', true);
        mp.events.call('showHUD');
        mp.events.call('setGreenZone', true);
    }, 1250);
});

mp.events.add('selectCharacter', (characterId) => {
    if (characterBrowser) {
        characterBrowser.destroy(); 
        characterBrowser = null; 
    }
    mp.events.callRemote('selectCharacter', characterId);
    const warning = () => {
        mp.gui.chat.push(`!{#FFA500} Администрация никогда не запросит Ваши данные аккаунта и не потребует устанавливать посторонние программы.`),
        mp.gui.chat.push(`!{#FFA500} Если кто-то говорит, что он администратор, попросите его включить админ-режим, это отобразит корону над его ником.`)
    };
    warning(), setInterval(() => {
        warning()
    }, 900000);
});

let castomBrowser = null;
mp.events.add('create-character', () => {
    if (characterBrowser) {
        characterBrowser.execute(`document.body.classList.add('fade-out');`);
    
            setTimeout(() => {
                characterBrowser.destroy(); 
                characterBrowser = null; 
            }, 300);
        }
    mp.events.callRemote('setNoClipStatus', false);
    mp.events.callRemote('create-character');
    setTimeout(() => {
        castomBrowser = mp.browsers.new('package://browsers/customization/index.html');

    }, 3000); 
});

mp.events.add('createNewCharacter', (firstName, lastName, customizationData, clothesAndHairJSON, appearanceDetails) => {
    if (firstName && lastName) {
        mp.events.callRemote('createCharacter', firstName, lastName, customizationData, clothesAndHairJSON, appearanceDetails);
    } else {
        mp.events.call('notify', 'error', 'Ошибка', 'Введите имя и фамилию');
    }
});

mp.events.add('close-castom', () => {
    if (castomBrowser) {
        castomBrowser.execute(`document.body.classList.add('fade-out');`);
    
            setTimeout(() => {
                castomBrowser.destroy(); 
                castomBrowser = null; 
            }, 300);
        }
    mp.events.call('createCameraWithInterp', -64.62, 800.64, 227.64, -53.65, 664.07, 230.62);
    setTimeout(() => {
        mp.events.callRemote('character-show')
    }, 1800);
    setTimeout(() => {
        mp.events.call('showCharacterSelection');
        mp.events.callRemote('loadCharacters');
    }, 3000);
});

mp.events.add('showHUD', () => {
    if (hudBrowser === null) {
        hudBrowser = mp.browsers.new('package://browsers/hud/index.html');
    }
    mp.game.ui.displayHud(true);
    mp.game.ui.displayRadar(true);

    if (isGreenZoneEnabled) {
        hudBrowser.execute(`showGreenZoneIcon(${isGreenZoneEnabled});`);
    }
    if (isMicrophoneEnabled) {
        hudBrowser.execute(`showMicrophoneIcon(${isMicrophoneEnabled});`);
    }
    if (isAdmEnabled) {
        hudBrowser.execute(`showAdmIcon(${isAdmEnabled});`);
    }
    let player = mp.players.local;

    const name = player.getVariable('characterName');
    const surname = player.getVariable('characterSurname');
    const characid = player.getVariable('selectedCharacterId');
    const characterInfo = `(${player.remoteId}) ${name} ${surname} #${characid}`;
    mp.events.callRemote('updateOnline')
    hudBrowser.execute(`
        document.getElementById('subheading').innerText = "${characterInfo}";
    `);
});
    /* mp.keys.bind(0x75, false, function() {
        hudBrowser.execute(`toggleHintsVisibility()`);
}); */
mp.events.add('updateOnline', (online) => {
    if (hudBrowser) {
        hudBrowser.execute(`
            document.getElementById('nn').innerHTML = '<img src="img/online.svg" id="online-icon"> ' + ${online};
        `);
    }
})

mp.events.add('hideHUD', () => {
    if (hudBrowser !== null) {
        hudBrowser.destroy();
        hudBrowser = null;
    }
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
});

let isGreenZoneEnabled = false;
let isMicrophoneEnabled = false;
let isAdmEnabled = false;

mp.events.add('delayedDimensionChange', () => {
    setTimeout(() => {
        mp.events.callRemote('changeDimension');
    }, 1000); 
});

mp.events.add('setGreenZone', (state) => {
    isGreenZoneEnabled = state; 
    if (hudBrowser !== null) {
        hudBrowser.execute(`hud.setGreenZone(${state});`); 
    }
});

mp.events.add('setMicrophone', (state) => {
    isMicrophoneEnabled = state;
    if (hudBrowser !== null) {
        hudBrowser.execute(`hud.setMic(${state});`); 
    }
});

mp.events.add('setAdm', (state) => {
    isAdmEnabled = state;
    if (hudBrowser !== null) {
        hudBrowser.execute(`hud.setAdm(${state});`); 
    }
});

mp.events.add('updateCustomization', (customizationDataJSON) => {
    const customizationData = JSON.parse(customizationDataJSON);

    mp.players.local.setHeadBlendData(
        customizationData.motherBlend,
        customizationData.fatherBlend,
        0,
        customizationData.motherBlend,
        customizationData.fatherBlend,
        0,
        customizationData.shapeMix,
        customizationData.skinMix,
        0,
        true // <-- ВАЖНО: должен быть boolean
    );

    mp.players.local.setEyeColor(customizationData.eyeColor);
    mp.players.local.setHairColor(customizationData.hairColor, customizationData.highlightColor);

    if (Array.isArray(customizationData.faceFeatures)) {
        customizationData.faceFeatures.forEach((val, idx) => {
            mp.players.local.setFaceFeature(idx, val);
        });
    }
});

mp.events.add('updateHair', (id) => {
    mp.players.local.setComponentVariation(2, id, 0, 2); // Hair = component 2
});

mp.events.add('applyClothes', (componentId, drawableId, texture) => {
    mp.players.local.setComponentVariation(componentId, drawableId, texture, 2);
});

mp.events.add('setstyle', (OverlayID, style, color) => {
    mp.players.local.setHeadOverlay(OverlayID, style, 1.0, color, color);
});
