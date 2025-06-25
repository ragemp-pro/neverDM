let checkInterval = null;
let cam = null;
let targetPlayer = null;
let zoomLevel = 2.5;  
const minZoom = 1.5; 
const maxZoom = 20.0; 
let angleX = 0;  
let angleY = 0.3;  
let sensitivityX = 0.5; 
let sensitivityY = 0.5; 
let spectateBrowser = null;

mp.events.add('spectate', (targetId) => {
    targetPlayer = mp.players.atRemoteId(targetId);
    if (!targetPlayer) return;

    if (checkInterval !== null) {
        clearInterval(checkInterval);
        checkInterval = null;
    }

    checkInterval = setInterval(() => {
        if (targetPlayer && targetPlayer.handle !== 0) {
            if (checkInterval !== null) {
                clearInterval(checkInterval);
                checkInterval = null; 
            }

            if (!cam || !mp.cameras.exists(cam)) {
                cam = mp.cameras.new('spec', new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 50);
            }
            mp.events.call('interfaceToggle', false);

            cam.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 0, true, true);

            mp.events.callRemote('setNoClipStatus', true);

            mp.events.add('render', onCameraControl);
/* 
            if (!spectateBrowser) {
                spectateBrowser = mp.browsers.new('package://browsers/spec/index.html'); 
            }

            spectateBrowser.execute(`document.title = "${charName} ${charSurname} #${characid}";`);
            spectateBrowser.execute(`
                document.getElementById('title').innerText = "${charName} ${charSurname} #${characid}";
                document.getElementById('data').innerHTML = "<span>user static: #${userStatic}</span><span>money: $${money}</span><span>kills: ${kills}</span><span>deaths: ${deaths}</span><span>hours: ${hours}</span>";
            `); */
        }
    }, 100);
});

mp.events.add('spoff', () => {
    if (cam && mp.cameras.exists(cam)) {
        cam.setActive(false);
        cam.destroy();
        cam = null;
        mp.game.cam.renderScriptCams(false, false, 0, false, false);
    }

    mp.events.callRemote('setNoClipStatus', false);
    mp.events.callRemote('spoff');

    mp.events.remove('render', onCameraControl);

    if (spectateBrowser) {
        spectateBrowser.destroy();
        spectateBrowser = null;
    }

    mp.events.call('interfaceToggle', true);

    if (checkInterval !== null) {
        clearInterval(checkInterval);
        checkInterval = null; 
    }
});

function onCameraControl() {
    if (cam && targetPlayer) {
        const mouseX = mp.game.controls.getDisabledControlNormal(0, 1); 
        const mouseY = mp.game.controls.getDisabledControlNormal(0, 2);  

        angleX += mouseX * sensitivityX; 
        angleY = Math.max(-1.5, Math.min(1.5, angleY + mouseY * sensitivityY));  

        const scrollInput = mp.game.controls.getDisabledControlNormal(0, 241) - mp.game.controls.getDisabledControlNormal(0, 242); 
        zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel - scrollInput * 0.5)); 

        const playerPos = targetPlayer.position;

        const camX = playerPos.x + zoomLevel * Math.sin(angleX) * Math.cos(angleY);
        const camY = playerPos.y + zoomLevel * Math.cos(angleX) * Math.cos(angleY);
        const camZ = playerPos.z + zoomLevel * Math.sin(angleY) + 1.0; 

        cam.setCoord(camX, camY, camZ);
        cam.pointAtCoord(playerPos.x, playerPos.y, playerPos.z + 1.0);

        const adminPosZ = playerPos.z - 5.0;  
        mp.players.local.setCoordsNoOffset(playerPos.x, playerPos.y, adminPosZ, false, false, false);

        drawHeadingLine(targetPlayer);
    }
}

function drawHeadingLine(player) {
    const headPos = player.getBoneCoords(12844, 0, 0, 0);

    const forwardVector = player.getForwardVector();
    
    const length = 0.5;

    const endX = headPos.x + length * forwardVector.x; 
    const endY = headPos.y + length * forwardVector.y; 
    const endZ = headPos.z + forwardVector.z; 
    mp.game.graphics.drawLine(headPos.x, headPos.y, headPos.z, endX, endY, endZ, 255, 255, 255, 255);
}
