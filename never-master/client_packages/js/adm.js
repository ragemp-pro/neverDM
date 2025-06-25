let admmenuBrowser = null;

function isPlayerAdmin() {
    return mp.players.local.getVariable('isAdmin') === true;
}
mp.keys.bind(0x74, true, () => {
    if (!isPlayerAdmin()) {
        return;
    }

    if (admmenuBrowser) {
        admmenuBrowser.destroy();
        admmenuBrowser = null;
        mp.gui.cursor.show(false, false);
        mp.events.call('interfaceToggle', true);
        chatActive(true);
    } else {
        admmenuBrowser = mp.browsers.new('package://browsers/adm/index.html');
        mp.events.callRemote('getReportsADM');
        mp.events.callRemote('loadPlayerCommands');
        mp.events.callRemote('getTodayCommands');
        
        mp.events.callRemote('getAdminStats');

        mp.gui.cursor.show(true, true);
        mp.events.call('interfaceToggle', false);
        chatActive(false);
        mp.events.call('bindSendButtonADM');
    }
});


mp.events.add('showadmmenuData', (admmenuData) => {
    if (admmenuBrowser) {
        admmenuBrowser.execute(`
            document.getElementById('data-static').innerHTML = \`
                <span>${admmenuData.name || ''} ${admmenuData.surname || ''} #${admmenuData.id || ''}</span>
                <span>user static: #${admmenuData.user || ''}</span>
                <span>money: $${admmenuData.money || 0}</span>
                <span>fraction: ${admmenuData.fraction || ''}</span>
                <span>cars: ${admmenuData.cars || 'Нет машин'}</span>
                <span>inventory: ${admmenuData.inventory || 'Инвентарь пуст'}</span>
                <span>fast slots: ${admmenuData.fastSlots || 'Нет быстрых слотов'}</span>
                <span>death: ${admmenuData.deaths || 0}</span>
                <span>kills: ${admmenuData.kills || 0}</span>
            \`;
        `);
    }
});

mp.events.add('displayAdminStats', (adminDataJSON) => {
    if (admmenuBrowser) {
        const adminData = JSON.parse(adminDataJSON);

        admmenuBrowser.execute(`
            document.getElementById('stats').innerHTML = \`
                <span>${adminData.name} #${adminData.user}</span>
                <span>level: ${adminData.level}</span>
                <span>reports: ${adminData.reports}</span>
            \`;
        `);
    }
});


mp.events.add('searchadmmenu', (staticId) => {
    mp.events.callRemote('searchadmmenu', staticId); 
});

mp.events.add('searchvehadmmenu', (Id) => {
    let vehicle = mp.vehicles.at(Id);

    if (vehicle) {
        const spawnerId = vehicle.getVariable('spawnerId');
        const model = mp.game.vehicle.getDisplayNameFromVehicleModel(vehicle.model);
        if (admmenuBrowser) {
            admmenuBrowser.execute(`
                document.getElementById('data-veh').innerHTML = \`
                    <span>id: ${Id}</span>
                    <span>creator: #${spawnerId}(character)</span>
                    <span>model: ${model}</span>
                    <div id="data-buttons-veh">
                        <button onclick="mp.trigger('teleportToVehicle', ${Id});">Телепортировать</button>
                        <button onclick="mp.trigger('teleportToPlayer', ${Id});">Телепортироваться</button>
                        <button onclick="mp.trigger('deleteVehicle', ${Id});">Удалить</button>
                    </div>
                \`;
            `);
        mp.events.callRemote('logVEH', Id)
        }
    } else {
        mp.events.call('notify', 'error', 'Ошибка', 'Машина не найдена');

    }
});

mp.events.add('teleportToVehicle', (vehicleId) => {
    mp.events.callRemote('teleportToVehicle', vehicleId); 

});

mp.events.add('teleportToPlayer', (vehicleId) => {
    mp.events.callRemote('teleportToPlayer', vehicleId); 

});

mp.events.add('deleteVehicle', (vehicleId) => {
    mp.events.callRemote('deleteVehicle', vehicleId); 
});
mp.events.add('showReportsADM', (reportData) => {
    if (admmenuBrowser) {
        const reports = JSON.parse(reportData);
        let reportHtml = reports.map(report => `<div class="adm-report" data-id="${report.id}">Репорт #${report.id}</div>`).join('');
        admmenuBrowser.execute(`
            document.getElementById('adm-reports').innerHTML = \`${reportHtml}\`;

            document.querySelectorAll('.adm-report').forEach(reportElement => {
                reportElement.addEventListener('click', function() {
                    const reportId = this.getAttribute('data-id');
                    mp.trigger('loadReportMessagesADM', reportId); 
                    document.getElementById('adm-report-content').style.display = 'block';
                    document.getElementById('adm-report-number').innerHTML = 'Репорт #' + reportId;
                });
            });
        `);
    }
});

mp.events.add('loadReportMessagesADM', (reportId) => {
    mp.events.callRemote('getReportMessagesADM', reportId); 
});

mp.events.add('displayReportMessagesADM', (messagesJSON) => {
    if (admmenuBrowser) {
        const messages = JSON.parse(messagesJSON);
        
        let messagesHtml = messages.map(message => {
            return `<div class="adm-message">${message.sender}: ${message.text}</div>`;
        }).join(''); 
        
        admmenuBrowser.execute(`
            document.getElementById('adm-messages').innerHTML = \`${messagesHtml}\`;
        `);
    }
});


mp.events.add('bindSendButtonADM', () => {
    const characterId = mp.players.local.getVariable('selectedCharacterId'); 

    admmenuBrowser.execute(`
        document.getElementById('adm-send-message').addEventListener('click', function() {
            const message = document.getElementById('adm-message-input').value;
            const reportId = document.getElementById('adm-report-number').textContent.replace('Репорт #', '').trim();

            if (message.trim() !== '') {
                mp.trigger('sendModeratorMessageADM', message, reportId, '${characterId}'); // Передаем characterId в trigger
                document.getElementById('adm-message-input').value = ''; // Очищаем поле ввода после отправки
            }
        });
    `);
});

mp.events.add('sendModeratorMessageADM', (message, reportId, characterId) => {
    if (characterId === undefined || characterId === null) {
        characterId = mp.players.local.getVariable('selectedCharacterId');
    }
    mp.events.callRemote('sendModeratorMessageADM', message, reportId, characterId);
});


mp.events.add('showReportsADM', (reportData) => {
    if (admmenuBrowser) {
        const reports = JSON.parse(reportData);
        let reportHtml = reports.map(report => `<div class="adm-report" data-id="${report.id}">Репорт #${report.id}</div>`).join('');
        admmenuBrowser.execute(`
            document.getElementById('adm-reports').innerHTML = \`${reportHtml}\`;

            document.querySelectorAll('.adm-report').forEach(reportElement => {
                reportElement.addEventListener('click', function() {
                    const reportId = this.getAttribute('data-id');
                    mp.trigger('loadReportMessagesADM', reportId);
                    admMenu.openReport(reportId)
                });
            });
        `);
    }
});

mp.events.add('closeReportADM', (reportId) => {
    const characid = mp.players.local.getVariable('selectedCharacterId');
    mp.events.callRemote('closeReportADM', reportId, characid);
});

mp.events.add('executeCommand', (command, params) => {
    mp.events.callRemote('executeServerCommand', command, params); 
});

mp.events.add('displayTodayCommands', (commandsJSON) => {
    if (admmenuBrowser) {  
        const commands = JSON.parse(commandsJSON);

        admmenuBrowser.execute(`
            let outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';  

            if (${commands.length} === 0) {
                outputDiv.innerHTML = '<span>Нет команд за сегодняшний день.</span>';
            } else {
                ${JSON.stringify(commands)}.forEach(command => {
                    let span = document.createElement('span');
                    span.textContent = command;
                    outputDiv.appendChild(span);
                });

                ${JSON.stringify(commands)}.forEach(command => {
                    mp.gui.chat.push('Команда: ' + command);
                });
            }
        `);
    }
});

mp.events.add('freezePlayer', (freeze) => {
    mp.players.local.freezePosition(freeze);
});

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

mp.events.add('showKickScreen', (adminName, reason) => {
    const currentDate = formatDate(new Date()); 

    let kickBrowser = mp.browsers.new('package://browsers/kick/index.html');

    kickBrowser.execute(`
        document.getElementById('title').textContent = 'Вы были кикнуты';
        document.querySelector('.center-content:nth-child(2)').textContent = 'Администратор: ${adminName}';
        document.querySelector('.center-content:nth-child(3)').textContent = 'Причина: ${reason}';
        document.querySelector('.date').textContent = '${currentDate}';
    `);

    mp.gui.cursor.show(true, true);
    chatActive(false);
    mp.players.local.freezePosition(true);
    mp.gui.cursor.visible = true;
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
    mp.events.call('interfaceToggle', false);

    let interval = setInterval(() => {
        if (kickBrowser) {
            kickBrowser.destroy();
            kickBrowser = null;
            mp.gui.cursor.show(false, false); 
            clearInterval(interval); 

            mp.events.callRemote('kickPlayerConfirmed');
        }
    }, 5000); 
});

let checkBrowser = null;

mp.events.add('showCheckInterface', (discordTag) => {
    if (checkBrowser === null) {
        checkBrowser = mp.browsers.new('package://browsers/check/index.html');
        mp.events.call('interfaceToggle', false);
        mp.players.local.freezePosition(true); 
		mp.gui.cursor.show(true, true);
        chatActive(false)
        mp.players.local.freezePosition(true);
        mp.gui.cursor.visible = true;
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
    }

    checkBrowser.execute(`checkCheat.discordTag = "${discordTag}"`);
});
