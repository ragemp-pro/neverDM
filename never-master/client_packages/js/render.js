mp.events.add('render', () => {
    mp.game.ui.hideHudComponentThisFrame(7);
    mp.game.ui.hideHudComponentThisFrame(9);
    mp.game.ui.hideHudComponentThisFrame(19);
    mp.game.ui.hideHudComponentThisFrame(20);
    mp.game.ui.hideHudComponentThisFrame(22);
    mp.game.controls.disableControlAction(0, 12, true);
    mp.game.controls.disableControlAction(0, 14, true);
    mp.game.controls.disableControlAction(0, 15, true);
    mp.game.controls.disableControlAction(0, 16, true);
    mp.game.controls.disableControlAction(0, 17, true);
    mp.game.controls.disableControlAction(0, 37, true);
    mp.game.controls.disableControlAction(0, 53, true);
    mp.game.controls.disableControlAction(0, 54, true);
    mp.game.controls.disableControlAction(0, 56, true);
    mp.game.controls.disableControlAction(0, 99, true);
    mp.game.controls.disableControlAction(0, 115, true);
    mp.game.controls.disableControlAction(0, 116, true);
    mp.game.controls.disableControlAction(0, 157, true);
    mp.game.controls.disableControlAction(0, 158, true);
    mp.game.controls.disableControlAction(0, 159, true);
    mp.game.controls.disableControlAction(0, 160, true);
    mp.game.controls.disableControlAction(0, 161, true);
    mp.game.controls.disableControlAction(0, 162, true);
    mp.game.controls.disableControlAction(0, 163, true);
    mp.game.controls.disableControlAction(0, 164, true);
    mp.game.controls.disableControlAction(0, 165, true);
    mp.game.controls.disableControlAction(0, 261, true);
    mp.game.controls.disableControlAction(0, 262, true);
    mp.game.controls.disableControlAction(0, 100, true);
    mp.game.controls.disableControlAction(0, 69, true); 
    mp.game.controls.disableControlAction(0, 70, true);
    mp.game.controls.disableControlAction(0, 92, true)
    mp.game.ui.hideHudComponentThisFrame(0);
    mp.vehicles.forEachInRange(mp.players.local.position, 35, (vehicle) => {
        if (vehicle && vehicle.doesExist()) {
            mp.game.entity.setNoCollisionEntity(vehicle.handle, mp.players.local.handle, true);
        }
    });
    mp.game.controls.disableControlAction(0, 37, true);
    mp.game.controls.disableControlAction(0, 14, true);
    mp.game.controls.disableControlAction(0, 15, true);
    mp.game.controls.disableControlAction(0, 243, true);
    mp.game.controls.disableControlAction(2, 140, true);
    mp.game.controls.disableControlAction(2, 141, true);
    mp.game.controls.disableControlAction(2, 263, true);
    mp.game.controls.disableControlAction(2, 264, true);
    mp.game.controls.disableControlAction(2, 142, true);
    mp.game.ui.hideHudComponentThisFrame(7);
    mp.game.ui.hideHudComponentThisFrame(9);
    mp.game.ui.hideHudComponentThisFrame(2);
    mp.game.player.restoreStamina(100.0);
    mp.game.controls.disableControlAction(0, 36, true);
    mp.game.ui.hideHudComponentThisFrame(3);
    mp.game.ui.hideHudComponentThisFrame(4);
    mp.game.ui.hideHudComponentThisFrame(6);
    mp.game.gameplay.setFadeOutAfterDeath(false);
});

mp.game.streaming.requestIpl("vw_casino_main");

mp.nametags.enabled = false;
let animationStep = 0;
let animationLastUpdate = 0;

const animationFrames = [
    "leaderboard_audio_inactive",
    "leaderboard_audio_1",
    "leaderboard_audio_2",
    "leaderboard_audio_3"
];

mp.nametags.enabled = false;

mp.events.add('render', (nametags) => {
    if (nametags && nametags.forEach) {
        const localPlayer = mp.players.local;
        const maxDistance = 17 * 17; 

        nametags.forEach(([player, x, y, distance]) => {
            if (player.handle === 0 || player === localPlayer) return;

            if (distance > maxDistance) return;

            const isAdmin = player.getVariable('isAdmin');
            const isDead = player.getVariable('isDead');
            const voiceActive = player.getVariable('voiceActive');
            const name = player.getVariable('characterName') || 'Незнакомец';
            const surname = player.getVariable('characterSurname') || '';
            const characid = player.getVariable('selectedCharacterId');
            const fracId = player.getVariable('fraction');
            const isFlying = player.getVariable('isFlying');
            if (isFlying) return;
            const fractionData = {
                1: { name: 'The Families', color: [50, 205, 50, 255] },
                2: { name: 'The Ballas Gang', color: [128, 0, 128, 255] },
                3: { name: 'Los Santos Vagos', color: [255, 215, 0, 255] },
                4: { name: 'Marabunta Grande', color: [64, 224, 208, 255] },
                5: { name: 'The Bloods Street', color: [255, 0, 0, 255] },
                6: { name: 'FIB', color: [128, 128, 128, 255] },
            };

            const fractionInfo = fractionData[fracId] || { name: '', color: [255, 255, 255, 255] };

            let voiceIconOffsetX = 0;

            if (isAdmin) {
                const textureDict = "commonmenu";
                const iconTexture = "mp_hostcrown";

                if (!mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
                    mp.game.graphics.requestStreamedTextureDict(textureDict, true);
                }

                if (mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
                    mp.game.graphics.drawSprite(textureDict, iconTexture,
                        x, y - 0.015, 0.012, 0.018, 0, 255, 255, 255, 255);
                    voiceIconOffsetX = 0.013;
                }
            }

            if (isDead) {
                const textureDict = "commonmenutu";
                const iconTexture = "deathmatch";

                if (!mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
                    mp.game.graphics.requestStreamedTextureDict(textureDict, true);
                }

                if (mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
                    mp.game.graphics.drawSprite(textureDict, iconTexture,
                        x + voiceIconOffsetX, y - 0.015, 0.012, 0.018, 0, 255, 0, 0, 255);
                    voiceIconOffsetX += 0.013;
                }
            }

            if (voiceActive) {
                const textureDict = "mpleaderboard";

                if (!mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
                    mp.game.graphics.requestStreamedTextureDict(textureDict, true);
                }

                if (mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
                    const now = Date.now();
                    if (now - animationLastUpdate > 500) {
                        animationStep = (animationStep + 1) % animationFrames.length;
                        animationLastUpdate = now;
                    }

                    const iconTexture = animationFrames[animationStep];

                    mp.game.graphics.drawSprite(
                        textureDict,
                        iconTexture,
                        x + voiceIconOffsetX,
                        y - 0.015,
                        0.012,
                        0.018,
                        0, 255, 255, 255, 255
                    );
                }
            }

            mp.game.graphics.drawText(`(${player.remoteId}) ${name} ${surname} #${characid}`,
                [x, y], {
                    font: 4,
                    color: [255, 255, 255, 255],
                    scale: [0.35, 0.35],
                    outline: true
                });

            mp.game.graphics.drawText(fractionInfo.name,
                [x, y + 0.02], {
                    font: 4,
                    color: fractionInfo.color,
                    scale: [0.3, 0.3],
                    outline: true
                });
        });
    }
});


let sceneryCamera = null;

mp.game.gxt.set("PM_PAUSE_HDR", "never | discord.gg/neverproject");

mp.events.add('createCamera', (x, y, z, pointX, pointY, pointZ) => {
    if (sceneryCamera) {
        sceneryCamera.destroy();
    }
    sceneryCamera = mp.cameras.new('default', new mp.Vector3(x, y, z), new mp.Vector3(0, 0, 0), 40);
    sceneryCamera.pointAtCoord(pointX, pointY, pointZ);
    sceneryCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
});

mp.events.add('createCameraWithInterp', (x, y, z, pointX, pointY, pointZ) => {
    const duration = 3000;

    const targetCamera = mp.cameras.new('default', new mp.Vector3(x, y, z), new mp.Vector3(0, 0, 0), 40);
    targetCamera.pointAtCoord(pointX, pointY, pointZ);

    if (sceneryCamera) {
        targetCamera.setActiveWithInterp(sceneryCamera.handle, duration, 1, 1);
    } else {
        targetCamera.setActive(true);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
    }

    sceneryCamera = targetCamera;
});


mp.events.add('removeCamera', () => {
    if (sceneryCamera) {
        sceneryCamera.setActive(false);
        mp.game.cam.renderScriptCams(false, false, 0, true, false);
        sceneryCamera.destroy();
        sceneryCamera = null;
    }
});

mp.events.add('removeCameraSmooth', () => {
    if (sceneryCamera) {
        mp.game.cam.renderScriptCams(false, true, 1500, true, false);
        sceneryCamera.setActive(false);
        sceneryCamera.destroy();
        sceneryCamera = null;
        isCameraActive = false; 
    }
});

mp.events.add('createCameraSmooth', (targetX, targetY, targetZ, lookAtX, lookAtY, lookAtZ) => {
    if (sceneryCamera) {
        sceneryCamera.destroy();
    }

    const playerPos = mp.players.local.position;
    sceneryCamera = mp.cameras.new('default', playerPos, new mp.Vector3(0, 0, 0), 40);

    sceneryCamera.pointAtCoord(lookAtX, lookAtY, lookAtZ);
    sceneryCamera.setActive(true);

    const targetCamera = mp.cameras.new('default', new mp.Vector3(targetX, targetY, targetZ), new mp.Vector3(0, 0, 0), 40);
    targetCamera.pointAtCoord(lookAtX, lookAtY, lookAtZ);

    targetCamera.setActiveWithInterp(sceneryCamera.handle, 1500, 1, 1); 

    mp.game.cam.renderScriptCams(true, true, 1500, true, false);

    sceneryCamera = targetCamera;
});

let lastArmour = mp.players.local.getArmour(); 

mp.events.add('render', () => {
    const player = mp.players.local;
    const currentArmour = player.getArmour();

    if (currentArmour === 0 && lastArmour > 0) {
        mp.events.callRemote('playerArmourDepleted');
    }

    lastArmour = currentArmour;
});


let isAdmin = false; 

mp.events.add('toggleInvincibility', (toggle) => {
    isAdmin = toggle; 
    mp.players.local.setInvincible(toggle); 
    mp.events.callRemote('toggleInvincibility', toggle)
});
mp.events.add('adminActive', () => {
    isAdmin = true; 
    mp.players.local.setInvincible(true); 
});
mp.events.add('adminNeActive', () => {
    isAdmin = false; 
    mp.players.local.setInvincible(false); 
});
/* mp.events.add('render', () => {

    if (mp.game.invoke('0x68EDDA28A5976D07'))
    {
        mp.game.ui.hideHudComponentThisFrame(14);
        mp.game.graphics.drawRect(0.5, 0.5, 0.001, 0.001, 255, 255, 255, 255);
    }
}); */
mp.events.add('render', () => {
    if (isAdmin) {
        mp.players.local.setInvincible(true); 
    } else {
        mp.players.local.setInvincible(false); 
    }
});

/* mp.events.add('render', () => {
    const player = mp.players.local;
    const weaponHash = player.weapon;

    if (weaponHash !== mp.game.joaat('weapon_unarmed')) {
        const totalAmmo1 = mp.game.weapon.getWeaponClipSize(weaponHash);
        const totalAmmo2 = player.getWeaponAmmo(weaponHash);

        const totalAmmo = totalAmmo2 - totalAmmo1;

        const boneIndex = player.getBoneIndex(57005);
        const handPos = player.getWorldPositionOfBone(boneIndex);

        if (handPos) {
            const offsetZ = 0.15;
            const ammoText = `${totalAmmo}`;
            const ammoPosX = handPos.x;
            const ammoPosY = handPos.y;
            const ammoPosZ = handPos.z + offsetZ;

            mp.game.graphics.drawText(ammoText, [ammoPosX + 0.015, ammoPosY, ammoPosZ], {
                font: 0,
                color: [255, 255, 255, 255],
                scale: [0.25, 0.25],
                outline: true
            });

            const textureDict = "mphud";
            const iconTexture = "ammo_pickup";

            if (!mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
                mp.game.graphics.requestStreamedTextureDict(textureDict, true);
            }

            if (mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
                const iconOffsetX = 0.03; 
                mp.game.graphics.drawSprite(
                    textureDict,
                    iconTexture,
                    0.5, 0.5, // координаты по центру экрана
                    0.05, 0.05, 0, 255, 255, 255, 255
                );
                
            }
        }
    }
});
 */