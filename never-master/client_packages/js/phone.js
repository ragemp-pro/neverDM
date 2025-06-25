let phoneOpen = false;
let phoneBrowser = null;
let phoneEnabled = true;
let phoneCheckMode = true;
let phoneCooldown = false; 

mp.events.add('setTimeOnClient', (hours, minutes, day, month, year) => {
    const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    
    const now = new Date(year, month - 1, day); 
    const dayName = days[now.getDay()];
    const formattedDate = `${dayName}, ${day} ${months[month - 1]}`;
    const formattedTime = `${hours}:${minutes}`;

    if (phoneBrowser) {
        phoneBrowser.execute(`
            document.getElementById("date").textContent = "${formattedDate}";
            document.getElementById("time").textContent = "${formattedTime}";
        `);
    }
});

mp.keys.bind(0x26, false, function() {
    const mode = mp.players.local.getVariable('mode'); 

    if (!phoneEnabled || mode !== 0 || !phoneCheckMode || phoneCooldown) return;

    if (!phoneOpen) {
        phoneBrowser = mp.browsers.new('package://browsers/phone2/index.html');
        phoneOpen = true;
        mp.gui.cursor.show(true, true);
        mp.events.call('toggleInventory', false);
        mp.events.call('toggleMenu', false);
        mp.events.callRemote('animationPhone');
        mp.events.callRemote('getTime');
    } else {
        phoneOpen = false;
        mp.gui.cursor.show(false, false);
        mp.events.call('toggleInventory', true);
        mp.events.call('toggleMenu', true);
        mp.events.callRemote('animationPhoneStop');
        if (phoneBrowser) {
            phoneBrowser.execute(`
                const iphoneContainer = document.querySelector('.iphone-container');
                if (iphoneContainer) {
                    iphoneContainer.classList.add('slidedown');
                }
            `);
        
            setTimeout(() => {
                phoneBrowser.destroy(); 
                phoneBrowser = null; 
            }, 800);
        }
        
        
    }

    phoneCooldown = true;
    setTimeout(() => {
        phoneCooldown = false;
    }, 2000); 
});


mp.events.add('togglePhone', (state) => {
    phoneEnabled = state;

    if (phoneOpen) {
        phoneBrowser.destroy();
        phoneOpen = false;

    }
});

mp.events.add('loadTopRichPlayers', () => {
    mp.events.callRemote('loadTopRichPlayers');
});
mp.events.add('loadPlayerMoney', () => {
    mp.events.callRemote('loadPlayerMoney');
});
mp.events.add('transferMoney', (recipientId, amount) => {
    mp.events.callRemote('transferMoney', recipientId, amount);
});
mp.events.add('updatePlayerMoney', (money) => {
    if (phoneBrowser) {
        phoneBrowser.execute(`
            document.getElementById("balance").textContent = "${money.toLocaleString()} $";
        `);
    }
});

mp.events.add('updateTopRichPlayers', (richPlayers) => {
    if (phoneBrowser) {
        const richPlayersHtml = richPlayers.map(player => `
            <div class="forbes-entry">
                <span class="nickname">${player.nickname}</span>
                <span class="amount">${player.amount.toLocaleString()}</span>
            </div>
        `).join('');

        phoneBrowser.execute(`
            document.getElementById("forbes").innerHTML = \`${richPlayersHtml}\`;
        `);
    }
});

mp.events.add('loadGarageCars::CEF', () => {
    mp.events.callRemote('loadGarageCars');
});

mp.events.add('updateGarageCars', (cars) => {
    if (phoneBrowser) {
        const carsHtml = cars.map(car => `<div class="car" onclick="spawnCar('${car.model}')"><h1>${car.name}</h1></div>`).join('');

        phoneBrowser.execute(`
            const carList = document.getElementById("car-list");
            carList.innerHTML = \`${carsHtml}\`;
            document.getElementById("garage-content").style.display = "block";

            window.spawnCar = function(carModel) {
                mp.trigger('spawnCarFromClient', carModel);
            };
        `);
    }
});

mp.events.add('spawnCarFromClient', (carModel) => {
    mp.events.callRemote('spawnCar', carModel);
});

mp.events.add('stopphone', () => {
    if (phoneOpen) {
        phoneBrowser.destroy();
        mp.gui.cursor.show(false, false);
        mp.events.call('toggleInventory', true);
        mp.events.call('toggleMenu', true);
        phoneOpen = false;
    }
});
