let inventoryOpen = false;
let inventoryBrowser = null;
let inventoryEnabled = true; 
let lastInventoryOpenTime = 0;  
const inventoryOpenCooldown = 3000;
let inventoryCheckMode = true; 

mp.keys.bind(0x49, false, function() { 
    let currentTime = new Date().getTime();
    const mode = mp.players.local.getVariable('mode'); 

    if (!inventoryEnabled || mode !== 0 || !inventoryCheckMode || (!inventoryOpen && currentTime - lastInventoryOpenTime < inventoryOpenCooldown)) {
        return;  
    }

    if (!inventoryOpen) {
        if (inventoryBrowser === null) {
            inventoryBrowser = mp.browsers.new('package://browsers/inventory/index.html'); 
        }
        inventoryOpen = true;
        lastInventoryOpenTime = currentTime;  
        mp.gui.cursor.show(true, true);
        mp.events.callRemote('getInventory');
        mp.events.call('toggleMenu', false);
        mp.events.call('togglePhone', false);
        chatActive(false);
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
        mp.game.graphics.transitionToBlurred(250); 
        mp.events.call('hideHUD');
    } else {
        mp.events.call('hideInventory');  
    }
});

mp.events.add('toggleInventory', (state) => {
    inventoryEnabled = state; 
    if (!inventoryEnabled && inventoryOpen) { 
        mp.events.call('hideInventory'); 
    }
});
mp.events.add('showInventory', (inventory, fastSlots, secondarySlots) => {
    if (inventoryBrowser !== null) {
        
        const itemCount = inventory.length;

        inventoryBrowser.execute(`inventory.loadInventory(${JSON.stringify(inventory)});`);
        inventoryBrowser.execute(`inventory.loadFastSlots(${JSON.stringify(fastSlots)});`);
        inventoryBrowser.execute(`inventory.loadSecondarySlots(${JSON.stringify(secondarySlots)});`);

        inventoryBrowser.execute(`
            function assignSlotEvents() {
                const contextMenu = document.getElementById('context-menu');
                const slots = document.querySelectorAll('.slot');
                const fastSlotsElements = document.querySelectorAll('.fast');
                const secondaryFastSlots = document.querySelectorAll('.secondary');
                let activeSlot = null;

                document.getElementById('slots-count').innerHTML = '${itemCount}';

                function showContextMenu(slot) {
                    if (activeSlot) {
                        activeSlot.classList.remove('active');
                    }
                    activeSlot = slot;
                    activeSlot.classList.add('active');

                    const slotRect = slot.getBoundingClientRect();
                    contextMenu.style.left = \`\${slotRect.left}px\`;
                    contextMenu.style.top = \`\${slotRect.bottom}px\`;

                    const itemId = slot.querySelector('img').src.split('/').pop().replace('.png', '');
                    const dropItemButton = document.getElementById('drop-item');
                    const useItemButton = document.getElementById('use-item');

                    if (itemId.startsWith('armor')) {
                        useItemButton.style.display = 'block';
                        dropItemButton.style.display = 'none';
                    } else if (itemId.startsWith('health')) {
                        useItemButton.style.display = 'block';
                        dropItemButton.style.display = 'none';
                    } else if (itemId.startsWith('weapon_revolver')) {
                        dropItemButton.style.display = 'none';
                    } else {
                        useItemButton.style.display = 'none';
                        dropItemButton.style.display = 'block'; 
                    }

                    contextMenu.style.display = 'block';
                    setTimeout(() => {
                        contextMenu.classList.add('show');
                    }, 10);
                }

                function hideContextMenu() {
                    if (activeSlot) {
                        activeSlot.classList.remove('active');
                    }
                    contextMenu.classList.remove('show');
                    setTimeout(() => {
                        contextMenu.style.display = 'none';
                    }, 300);
                }

                slots.forEach(slot => {
                    slot.addEventListener('click', (e) => {
                        e.preventDefault();
                        const itemId = slot.querySelector('img').src.split('/').pop().replace('.png', '');
                        mp.trigger('moveItemToFastSlot', itemId);
                        hideContextMenu();
                    });

                    slot.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        showContextMenu(slot);
                    });
                });

                fastSlotsElements.forEach(fastSlot => {
                    fastSlot.addEventListener('click', () => {
                        const img = fastSlot.querySelector('img');
                        if (img) {
                            const itemId = img.src.split('/').pop().replace('.png', '');
                            mp.trigger('moveItemToInventory', itemId);
                        }
                    });
                });

                secondaryFastSlots.forEach(slot => {
                    slot.addEventListener('click', () => {
                        const itemId = slot.dataset.itemId;
                        if (itemId) {
                            mp.trigger('moveItemToInventoryFromSecondary', itemId);
                        }
                    });
                });

                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.slot') && !e.target.closest('#context-menu')) {
                        hideContextMenu();
                    }
                });

                document.getElementById('drop-item').addEventListener('click', () => {
                    if (activeSlot) {
                        const itemId = activeSlot.querySelector('img').src.split('/').pop().replace('.png', '');
                        if (itemId !== 'weapon_revolver') {
                            mp.trigger('dropItem', itemId);
                        } else {
                            mp.trigger('notification', 'error', 'Ошибка', 'Нельзя выбросить это оружие');
                        }
                        hideContextMenu();
                    }
                });

                document.getElementById('quick-slot-item').addEventListener('click', () => {
                    if (activeSlot) {
                        const itemId = activeSlot.querySelector('img').src.split('/').pop().replace('.png', '');
                        mp.trigger('moveItemToFastSlot', itemId);
                        hideContextMenu();
                    }
                });

                document.getElementById('use-item').addEventListener('click', () => {
                    if (activeSlot) {
                        const itemId = activeSlot.querySelector('img').src.split('/').pop().replace('.png', '');
                        if (itemId.startsWith('armor')) {
                            mp.trigger('useArmor', itemId);  
                        } else {
                            mp.trigger('useItem', itemId);
                        }
                        hideContextMenu();
                    }
                });
            }

            assignSlotEvents();
        `);

        inventoryOpen = true;
    }
});

mp.events.add('useArmor', (itemId) => {
    mp.events.callRemote('useArmor', itemId); 
});
mp.events.add('useHealthItem', (itemId) => {
    mp.events.callRemote('useHealthItem', itemId); 
});
mp.events.add('useItem', (itemId) => {
    if (itemId.startsWith('health')) { 
        mp.events.call('useHealthItem', itemId); 
    } else {
        mp.trigger('useItem', itemId);  
    }
});

mp.events.add('dropItem', (itemId) => {
    mp.events.callRemote('dropItem', itemId); 
});

mp.events.add('moveItemToInventory', (itemId) => {
    mp.events.callRemote('moveToInventory', itemId);
});
mp.events.add('moveItemToInventoryFromSecondary', (itemId) => {
    mp.events.callRemote('moveItemToInventoryFromSecondary', itemId); 
});
mp.events.add('moveItemToFastSlot', (itemId) => {
    mp.events.callRemote('moveItemToFastSlot', itemId); 
});
mp.events.add('hideInventory', () => {
    mp.game.graphics.transitionFromBlurred(250);
    if (inventoryBrowser !== null) {
        inventoryBrowser.execute(`
            document.body.style.animation = 'fadeOut 0.3s ease-in forwards';
        `);
        setTimeout(() => {
            if (inventoryBrowser) {
                inventoryBrowser.destroy();
                inventoryBrowser = null;
            }
            mp.events.call('toggleMenu', true);
            mp.events.call('togglePhone', true);
            mp.gui.cursor.show(false, false);
            inventoryOpen = false;
            chatActive(true);
            mp.game.ui.displayHud(true);
            mp.game.ui.displayRadar(true);
            mp.events.call('showHUD');
        }, 300); 
    }
});

const lastUsedTimes = {
    0x32: 0, 
    0x33: 0,
    0x31: 0  
  };

function checkCooldownAndInvoke(keyCode, weaponHash) {
    const currentTime = Date.now();
    const lastUsedTime = lastUsedTimes[keyCode];

    if (currentTime - lastUsedTime >= 3000) {
        mp.game.invoke('0xBF0FD6E56C964FCB', mp.players.local.handle, weaponHash >> 0, 99999, true, true);
        lastUsedTimes[keyCode] = currentTime;
    }
}

mp.events.add('receiveWeaponHash', (weaponHash, slotNumber) => {
    if (weaponHash) {
        const keyCode = slotNumber === 0 ? 0x31 : slotNumber === 1 ? 0x32 : 0x33;
        checkCooldownAndInvoke(keyCode, mp.game.joaat(weaponHash)); 
    } else {
        mp.players.local.removeAllWeapons();  
    }
});

mp.keys.bind(0x31, false, () => {
    let player = mp.players.local;

    const mode = player.getVariable('mode'); 
    if (mode === 0) {  
        mp.events.callRemote('useFastSlot', 0);
    }
});

mp.keys.bind(0x32, false, () => {
    let player = mp.players.local;

    const mode = player.getVariable('mode');
    if (mode === 0) {
        mp.events.callRemote('useFastSlot', 1);
    }
});

mp.keys.bind(0x33, false, () => {
    let player = mp.players.local;

    const mode = player.getVariable('mode');
    if (mode === 0) {
        mp.events.callRemote('useFastSlot', 2);
    } 
});

let lastUseTimeSlot4 = 0; 
let lastUseTimeSlot5 = 0; 
const cooldownTime = 15000;

mp.keys.bind(0x34, false, () => { 
    let player = mp.players.local;
    const mode = player.getVariable('mode');
    const currentTime = Date.now();     

    if (mode === 0 && (currentTime - lastUseTimeSlot4) >= cooldownTime) {
        lastUseTimeSlot4 = currentTime; 
        mp.events.callRemote('useFastSlot', 4);
    } else if (mode === 0) {
        const remainingTime = Math.ceil((cooldownTime - (currentTime - lastUseTimeSlot4)) / 1000);
        mp.events.call('notify', 'error', 'Ошибка', `Подождите ${remainingTime} секунд`)
    }
});

mp.keys.bind(0x35, false, () => { 
    let player = mp.players.local;
    const mode = player.getVariable('mode');
    const currentTime = Date.now(); 
    if (mode === 0 && (currentTime - lastUseTimeSlot5) >= cooldownTime) {
        lastUseTimeSlot5 = currentTime; 
        mp.events.callRemote('useFastSlot', 5); 
    } else if (mode === 0) {
        const remainingTime = Math.ceil((cooldownTime - (currentTime - lastUseTimeSlot5)) / 1000);
        mp.events.call('notify', 'error', 'Ошибка', `Подождите ${remainingTime} секунд`)
    }
});
