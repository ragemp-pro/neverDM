var menu = new Vue({
    el: '#menu',
    data: {
        currentContentId: null,
        weapons: [],
        tabContentMap: {
            reportsTab: 'Reportscontent',
            carTab: 'Carcontent',
            fractionTab: 'Fractioncontent',
            gamesTab: 'Gamescontent',
            settingsTab: 'SettingsContent',
            shopTab: 'ShopContent',
            gunsTab: 'GunsContent',
            vipsTab: 'vipContent'
        },
        fractionMapping: {
            'families': 1,
            'ballas': 2,
            'vagos': 3,
            'marabunta': 4,
            'bloods': 5,
            'FIB': 6
        },
        allWeapons: [
            {
                id: "armor",
                name: "Бронежилет",
                img: "./img/guns/armor.png",
                description: "Защищает от урона",
                price: 500
            },
            {
                id: "health",
                name: "Аптечка",
                img: "./img/guns/health.png",
                description: "Восполняет 50 ХП",
                price: 500
            },
            {
                id: "weapon_heavyshotgun",
                name: "Heavy Shotgun",
                img: "./img/guns/weapon_heavyshotgun.png",
                description: "Урон в голову: 45, урон в тело: 40",
                price: 2500
            },
            {
                id: "weapon_assaultrifle",
                name: "Assault Rifle",
                img: "./img/guns/weapon_assaultrifle.png",
                description: "Урон в голову: 21, минимальный урон: 10, максимальный урон: 14",
                price: 2000
            },
            {
                id: "weapon_specialcarbine",
                name: "Special Carbine",
                img: "./img/guns/weapon_specialcarbine.png",
                description: "Урон в голову: 21, минимальный урон: 10, максимальный урон: 14",
                price: 2500
            },
            {
                id: "weapon_combatmg",
                name: "Combat MG",
                img: "./img/guns/weapon_combatmg.png",
                description: "Урон в голову: 17, минимальный урон: 10, максимальный урон: 15",
                price: 100000
            },
            {
                id: "weapon_mg",
                name: "MG",
                img: "./img/guns/weapon_mg.png",
                description: "Урон в голову: 25, минимальный урон: 14, максимальный урон: 17",
                price: 150000
            },
            {
                id: "weapon_revolver_mk2",
                name: "Heavy Revolver Mk II",
                img: "./img/guns/weapon_revolver_mk2.png",
                description: "Урон в голову: 95, урон в тело: 55",
                price: 180000
            },
            {
                id: "weapon_marksmanrifle_mk2",
                name: "Marksman Rifle Mk II",
                img: "./img/guns/weapon_marksmanrifle_mk2.png",
                description: "Урон в голову: 45, урон в тело: 35",
                price: 1500000
            },
            {
                id: "weapon_combatmg_mk2",
                name: "Combat MG Mk II",
                img: "./img/guns/weapon_combatmg_mk2.png",
                description: "Урон в голову: 20, минимальный урон: 13, максимальный урон: 17",
                price: 1000000
            },
            {
                id: "weapon_gusenberg",
                name: "Gusenberg",
                img: "./img/guns/weapon_gusenberg.png",
                description: "Урон в голову: 21, минимальный урон: 10, максимальный урон: 14",
                price: 9999
            },
            {
                id: "weapon_marksmanrifle",
                name: "Marksman Rifle",
                img: "./img/guns/weapon_marksmanrifle.png",
                description: "Урон в голову: 35, урон в тело: 25",
                price: 700000
            },
            {
                id: "weapon_carbinerifle",
                name: "Carbine Rifle",
                img: "./img/guns/weapon_carbinerifle.png",
                description: "Урон в голову: 21, минимальный урон: 10, максимальный урон: 14",
                price: 1000
            },
            {
                id: "weapon_sniperrifle",
                name: "Sniper Rifle",
                img: "./img/guns/weapon_sniperrifle.png",
                description: "Урон в голову: 100, урон в тело: 55",
                price: 500000
            },
            {
                id: "weapon_precisionrifle",
                name: "Precision Rifle",
                img: "./img/guns/weapon_precisionrifle.png",
                description: "Урон в голову: 90, урон в тело: 75",
                price: 2000000
            },
            {
                id: "weapon_heavysniper_mk2",
                name: "Heavy Sniper Mk II",
                img: "./img/guns/weapon_heavysniper_mk2.png",
                description: "Урон в голову: 150, урон в тело: 125",
                price: 3000000
            }
        ]
    },
    mounted() {
        this.hideAllContent();
        this.initTabs();
        this.initWeapons();
        this.initEvents();
    },
    methods: {
        openTab(tab) {
            const contentId = this.tabContentMap[tab];
            if (contentId) {
                this.hideAllContent();
                this.currentContentId = contentId;
                const el = document.getElementById(contentId);
                if (el) el.style.display = 'flex';
            }
        },
        initTabs() {
            Object.keys(this.tabContentMap).forEach(tabId => {
                const element = document.getElementById(tabId);
                if (element) {
                    element.addEventListener('click', () => {
                        this.openTab(tabId);
                    });
                }
            });

            const vipsTab = document.getElementById('vips');
            if (vipsTab) {
                vipsTab.addEventListener('click', () => {
                    this.openTab('vipsTab');
                });
            }

            this.hideAllContent();
        },
        hideAllContent() {
            document.querySelectorAll('.content').forEach(content => {
                content.style.display = 'none';
            });
        },
        initEvents() {
            const addReport = document.getElementById('add-report');
            if (addReport) {
                addReport.addEventListener('click', () => {
                    mp.trigger('onCEFReportClick');
                });
            }

            const sendBtn = document.getElementById('send');
            if (sendBtn) {
                sendBtn.addEventListener('click', () => {
                    const messageInput = document.getElementById('message-input');
                    const message = messageInput.value;
                    const reportElement = document.querySelector('.report-div[data-active="true"]');
                    const reportId = reportElement?.getAttribute('data-id');
                    const characterId = mp.players.local.getVariable('selectedCharacterId');

                    if (message.trim() && reportId && characterId) {
                        mp.trigger('sendMessage', message, reportId, characterId);
                        messageInput.value = '';
                    }
                });
            }

            document.querySelectorAll('.frac').forEach(fractionDiv => {
                fractionDiv.addEventListener('click', () => {
                    const fractionId = fractionDiv.getAttribute('id');
                    const selectedFractionId = this.fractionMapping[fractionId];
                    if (selectedFractionId) {
                        mp.trigger('selectFraction', selectedFractionId);
                    }
                });
            });
        },
        initWeapons() {
            const sorted = this.allWeapons.slice().sort((a, b) => a.price - b.price);
            this.weapons = sorted;

            const listGuns = document.getElementById('list-guns');
            listGuns.innerHTML = '';

            this.weapons.forEach(weapon => {
                const gunElement = document.createElement('div');
                gunElement.className = 'gun';

                gunElement.innerHTML = `
                    <div id="info-guns">
                        <div id="info-gun">
                            <img src="./img/info.svg">
                            <div class="info-tooltip">${weapon.description}</div> 
                        </div>
                        <img src="${weapon.img}">
                        <h1>${weapon.name}</h1>
                        <span>${this.formatPrice(weapon.price)}</span>
                    </div>
                    <div class="buttons-guns">
                        <button id="buy-gun" onclick="mp.trigger('buyweapon', '${weapon.id}', ${weapon.price}, '${weapon.name}')">Купить</button>
                        <button class="quantity" onclick="mp.trigger('buyweapon10', '${weapon.id}', ${weapon.price}, '${weapon.name}')">x10</button>
                    </div>
                `;
                listGuns.appendChild(gunElement);
            });
        },
        formatPrice(price) {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(price);
        }
    }
});
