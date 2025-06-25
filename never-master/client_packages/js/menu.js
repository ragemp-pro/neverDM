let isInputActive = false;  
let isCameraActive = false;  
let menubrowser = null;
let lastMenuOpenTime = 0;  
const menuCooldown = 5 * 1000; 
let cameraEnabled = true; 
let sceneryCamera = null;  

let forceOpenMenu = false;

mp.events.add('openMenuLobby', () => {
    if (isCameraActive) return; 
    forceOpenMenu = true;

    mp.events.call('fade')
    mp.events.call('hideHUD');
    chatActive(false);
    mp.events.call('toggleInventory', false);
    mp.events.call('togglePhone', false);
    mp.players.local.freezePosition(true);
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);

    setTimeout(() => {
        const characid = mp.players.local.getVariable('selectedCharacterId');
        mp.events.callRemote('setNoClipStatus', true);
        
        mp.events.callRemote('getReports', characid);
        mp.events.callRemote('getCars', characid);
        mp.events.callRemote('getPlayerCounts');
        menubrowser = mp.browsers.new('package://browsers/menu/index.html');
        mp.events.call('openTab', ['fractionTab']);

        mp.gui.cursor.visible = true;
    }, 1250);

    lastMenuOpenTime = Date.now();
    isCameraActive = true;
});

mp.events.add('browserDomReady', (browser) => {
    browser.execute(`
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => {
                mp.trigger('inputFocus', true);  
            });
            input.addEventListener('blur', () => {
                mp.trigger('inputFocus', false);  
            });
        });
    `);
});

mp.events.add('inputFocus', (isFocused) => {
    isInputActive = isFocused;
});

mp.keys.bind(0x4D, true, function() {
    const currentTime = Date.now();

    if (!cameraEnabled || isInputActive) return; 

    if (!isCameraActive) {
        if (currentTime - lastMenuOpenTime < menuCooldown) {
            return;
        }
    }

    const playerVehicle = mp.players.local.vehicle;
    
    if (isCameraActive) {
        if (forceOpenMenu) return;
        mp.events.call('removeCameraMenu');

        if (menubrowser) {
            menubrowser.execute(`
                document.querySelector('.sidebar').classList.add('close');
                document.querySelector('.content').classList.add('close');
                document.querySelector("#Carcontent").classList.add("close")
                document.querySelector("#Fractioncontent").classList.add("close")
                document.querySelector("#Gamescontent").classList.add("close")
                document.querySelector("#ShopContent").classList.add("close")
                document.querySelector("#GunsContent").classList.add("close")
                document.querySelector("#vipContent").classList.add("close")


            `);
            cameraCheckInterval = setInterval(() => {
                if (!sceneryCamera) {
                    clearInterval(cameraCheckInterval);
                    cameraCheckInterval = null;
                    mp.events.call('destroyBrowser');
                }
            }, 1500);
        }
    } else {
        if (playerVehicle) {
            playerVehicle.setForwardSpeed(0);
        }

        const characid = mp.players.local.getVariable('selectedCharacterId');
        mp.events.callRemote('getReports', characid);
        mp.events.callRemote('getCars', characid);
        mp.events.callRemote('getPlayerCounts');
        mp.events.callRemote('getDP')
        menubrowser = mp.browsers.new('package://browsers/menu/index.html');
        mp.events.callRemote('MenuOppened');
        mp.events.call('hideHUD');
        chatActive(false);
        mp.events.call('toggleInventory', false);
        mp.events.call('togglePhone', false);
        mp.players.local.freezePosition(true);
        mp.gui.cursor.visible = true;
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);

        lastMenuOpenTime = Date.now();
    }
});
mp.events.add('toggleMenu', (state) => {
    cameraEnabled = state;
    if (!cameraEnabled && isCameraActive) {
        mp.events.call('removeCameraMenu');
    }
});

mp.events.add('destroyBrowser', () => {
    try {
        if (menubrowser) { 
            menubrowser.destroy();
            menubrowser = null;
        }
    } catch (error) {
    }
    mp.events.call('toggleInventory', true)
    mp.events.call('togglePhone', true)
    mp.events.call('showHUD');
    
    chatActive(true);
    mp.players.local.freezePosition(false);
    mp.gui.cursor.visible = false;
    mp.game.ui.displayHud(true);
    mp.game.ui.displayRadar(true);
});

mp.events.add('onCEFReportClick', () => {
    mp.events.call('addReport');
});
mp.events.add('addReport', () => {
    const characid = mp.players.local.getVariable('selectedCharacterId');

    mp.events.callRemote('addReport', characid);
});

mp.events.add('createCameraMenu', (x, y, z) => {
    if (sceneryCamera) {
        sceneryCamera.destroy();
    }
    
    const playerPos = mp.players.local.position;
    const playerHeading = mp.players.local.getHeading(); 

    let distanceFromPlayer = 5.0; 
    let cameraHeight = playerPos.z + 0.5; 
    
    const headingRad = playerHeading * (Math.PI / 180);

    const cameraX = playerPos.x - distanceFromPlayer * Math.sin(headingRad);
    const cameraY = playerPos.y + distanceFromPlayer * Math.cos(headingRad);

    sceneryCamera = mp.cameras.new('default', new mp.Vector3(cameraX, cameraY, cameraHeight), new mp.Vector3(0, 0, 0), 40);

    sceneryCamera.pointAtCoord(playerPos.x, playerPos.y, playerPos.z + 0.6);
    sceneryCamera.setActive(true);
    
    mp.game.cam.renderScriptCams(true, true, 1500, true, false); 
    isCameraActive = true; 
});

mp.events.add('removeCameraMenu', () => {
    if (sceneryCamera) {
        mp.game.cam.renderScriptCams(false, true, 1500, true, false);
        sceneryCamera.setActive(false);
        sceneryCamera.destroy();
        sceneryCamera = null;
        isCameraActive = false; 
    }
});

mp.events.add('sendReports', (reportsJSON) => {
    const reports = JSON.parse(reportsJSON);

    let reportsHTML = '';
    reports.forEach(report => {
        const statusText = report.status === 0 ? 'Открыт' : 'Закрыт';
        const statusClass = report.status === 0 ? 'status-open' : 'status-closed';
        const formattedTime = formatDate(report.time);

        reportsHTML += `
            <div id="report-div" data-id="${report.id}" class="${report.status === 1 ? 'closed-report' : ''}">
                <div>Репорт #${report.id} <span class="${statusClass}">${statusText}</span></div>
                <div class="report-created">${formattedTime}</div>
            </div>
        `;
    });

    menubrowser.execute(`
        document.getElementById('reportss').innerHTML = \`${reportsHTML}\`;

        document.querySelectorAll('#report-div').forEach(reportDiv => {
            const reportId = reportDiv.getAttribute('data-id');
            const isClosed = reportDiv.classList.contains('closed-report');

            if (!isClosed) {
                reportDiv.addEventListener('click', function() {
                    // Открытие блока report-content
                    document.getElementById('report-content').style.display = 'block';

                    // Скрытие блока reports
                    document.getElementById('reports').style.display = 'none';

                    // Обновление текста внутри report-number с номером репорта
                    document.getElementById('report-number').innerHTML = \`
                        <div id="back"><img src="./img/back.svg"></div>
                        Репорт #\${reportId}
                        <div id="delete"><img src="./img/delete.svg"></div>
                    \`;

                    document.getElementById('back').addEventListener('click', function() {
                        document.getElementById('report-content').style.display = 'none';
                        document.getElementById('reports').style.display = 'block';
                    });

                    document.getElementById('delete').addEventListener('click', function() {
                        mp.trigger('deleteReport', reportId);  // Вызываем клиентский эвент на удаление репорта
                    });

                    mp.trigger('loadMessages', reportId);  
                    mp.trigger('bindSendButton');  
                });
            } else {
                reportDiv.style.cursor = 'not-allowed';  
            }
        });
    `);
});

mp.events.add('deleteReport', (reportId) => {
    const characid = mp.players.local.getVariable('selectedCharacterId');
    mp.events.callRemote('deleteReport', reportId, characid); 
});


mp.events.add('loadMessages', (reportId) => {
    mp.events.callRemote('getReportMessages', reportId); 
});

mp.events.add('displayMessages', (messagesJSON) => {
    if (!isCameraActive) return; 

    const messages = JSON.parse(messagesJSON);
    let messagesHTML = '';

    messages.forEach(message => {
        const messageClass = message.moderator === 0 ? 'user-message' : 'mod-message';
        messagesHTML += `<div class="message ${messageClass}">${message.message}</div>`;
    });

    menubrowser.execute(`document.getElementById('messages').innerHTML = \`${messagesHTML}\`;`);
});

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

mp.events.add('bindSendButton', () => {

    const characterId = mp.players.local.getVariable('selectedCharacterId'); 
    
    menubrowser.execute(`
        const sendButton = document.getElementById('send');
        const messageInput = document.getElementById('message-input'); // Поле ввода сообщения
        if (sendButton && messageInput) {
            sendButton.addEventListener('click', function() {
                const message = messageInput.value.trim(); 
                const reportId = document.querySelector('#report-number').textContent.replace('Репорт #', '').trim(); // Получаем ID репорта

                if (message !== '') {
                    mp.trigger('sendMessage', message, reportId, '${characterId}');
                    messageInput.value = ''; 
                }
            });

            messageInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    const message = messageInput.value.trim(); 
                    const reportId = document.querySelector('#report-number').textContent.replace('Репорт #', '').trim(); 

                    if (message !== '') {
                        mp.trigger('sendMessage', message, reportId, '${characterId}');
                        messageInput.value = ''; 
                    }
                }
            });
        } else {
            mp.gui.chat.push('Send button or message input not found'); 
        }
    `);
});

mp.events.add('sendMessage', (message, reportId, characterId) => {
    mp.events.callRemote('sendMessage', message, reportId, characterId); 
});

mp.events.add('displayCars', (carsJSON) => {
    const cars = JSON.parse(carsJSON); 
    let carsHTML = '';

    cars.forEach(car => {
        carsHTML += `
            <div class="car" data-car-id="${car.model}"> 
                <span class="name-car">${car.name}</span>
                <span class="price-car">${car.price.toLocaleString()} $</span>
                <button class="sell-car">Продать</button>
            </div>
        `;
    });

    menubrowser.execute(`
        document.getElementById('cars').innerHTML = \`${carsHTML}\`;

        setTimeout(() => {
            document.querySelectorAll('.sell-car').forEach(button => {
                button.addEventListener('click', function() {
                    const carDiv = button.closest('.car');
                    const carModel = carDiv.getAttribute('data-car-id'); 
                    const priceText = carDiv.querySelector('.price-car').textContent;
                    const price = parseInt(priceText.replace(/[^0-9]/g, '')); 

                    mp.trigger('sellCar', carModel, price);
                });
            });
        }, 500); 
    `);
});
mp.events.add('displayDP', (dp) => {
    if (menubrowser) {
        menubrowser.execute(`
            document.querySelector('#menu-dp').innerText = '${dp} DP';
        `);
        menubrowser.execute(`
            document.querySelector('#vip-dp').innerText = '${dp} DP';
        `);
    }
});

mp.events.add('sellCar', (carModel, carPrice) => {
    mp.events.callRemote('sellCar', carModel, carPrice); 
});

mp.events.add('selectFraction', (selectedFractionId) => {
    mp.events.callRemote('selectFraction', selectedFractionId);
}); 
mp.events.add('getDP', () => {
    mp.events.callRemote('getDP');
}); 
mp.events.add('buyVIP', (vip) => {
    mp.events.callRemote('buyVIP', vip);
}); 
mp.events.add('openTab', (tabId) => {
    if (menubrowser) {
        menubrowser.execute(`menu.openTab("${tabId}")`);
    }
});

mp.events.add('closeMenu', () => {
    if (sceneryCamera) {
        mp.game.cam.renderScriptCams(false, false, 0, true, false);
        sceneryCamera.setActive(false);
        sceneryCamera.destroy();
        sceneryCamera = null;
        isCameraActive = false;
    }
    
    if (menubrowser) {
        menubrowser.execute(`
            document.querySelector('.sidebar').classList.add('close');
            document.querySelector('.content').classList.add('close');
            document.querySelector("#Carcontent").classList.add("close")
            document.querySelector("#Fractioncontent").classList.add("close")
            document.querySelector("#Gamescontent").classList.add("close")
            document.querySelector("#ShopContent").classList.add("close")
            document.querySelector("#GunsContent").classList.add("close")
            document.querySelector("#vipContent").classList.add("close")


        `);
        
        setTimeout(() => {
            if (menubrowser) {
                menubrowser.destroy();
                menubrowser = null;
            }
        }, 1500); 
    }
    mp.events.call('toggleInventory', true);
    mp.events.call('togglePhone', true);
    mp.events.call('showHUD');
    chatActive(true);
    mp.players.local.freezePosition(false);
    mp.gui.cursor.visible = false;
    mp.game.ui.displayHud(true);
    mp.game.ui.displayRadar(true);
    mp.events.callRemote('setNoClipStatus', false);
    forceOpenMenu = false;
    mp.events.call('removeCamera');
    isCameraActive = false;
});

mp.events.add('updatePlayerCounts', (counts) => {
    menubrowser.execute(`
        document.querySelector('#online-gangwar').innerHTML = '<div id="online"></div> ' + ${counts.gangWar};
        document.querySelector('#online-revolver').innerHTML = '<div id="online"></div> ' + ${counts.revolverDM};
        document.querySelector('#online-carabin').innerHTML = '<div id="online"></div> ' + ${counts.carabinDM};
        document.querySelector('#online-sniper').innerHTML = '<div id="online"></div> ' + ${counts.sniperDM};
    `);
});
mp.events.add('buyweapon', (weapon, price, name) => {
    mp.events.callRemote('buyweapon', weapon, price, name);
});
mp.events.add('buyweapon10', (weapon, price, name) => {
    mp.events.callRemote('buyweapon10', weapon, price, name);
});
