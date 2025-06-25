
var admMenu = new Vue({
    el: '#admMenu',
    data: {
    activeTab: 'reports',
    username: 'ounezz #123',
    level: 13,
    reports: 250,

    carId: '',
    characterId: '',

    reportOpen: false,
    reportId: '',
    admMessage: '',
    quickMessages: [
        'Здравствуйте, ', 'Уже лечу', 'Иду', 'Слежу', 'Проверю',
        'Произошла ошибка', 'Не можем ничем помочь', 'Актуально?',
        'Можете оставить жалобу в дискорде', 'Приятной игры'
    ],

    commandInput: '',
    helpText: '',
    helpColor: '#fff',
    lastCommand: '',
    isHelpValid: false,

    commands: {
        'ban': {
            description: ['статический айди аккаунта', 'количество дней блокировки', 'причина'],
            types: ['int', 'int', 'str']
        },
        'unban': {
            description: ['статический айди аккаунта'],
            types: ['int']
        },
        'dsocial': {
            description: ['статический айди аккаунта'],
            types: ['int']
        },
        'gdp': {
            description: ['статический айди аккаунта', 'DP'],
            types: ['int', 'int']
        },
        'kick': {
            description: ['id человека', 'причина'],
            types: ['int', 'str']
        },
        'check': {
            description: ['id человека', 'discord для связи'],
            types: ['int', 'str']
        },
        'ob': {
            description: ['сообщение'],
            types: ['str']
        },
        'observer': {
            description: ['сообщение'],
            types: ['str']
        },
        'slap': {
            description: ['id человека'],
            types: ['int']
        },
        'freeze': {
            description: ['id человека'],
            types: ['int']
        },
        'rescue': {
            description: ['id человека'],
            types: ['int']
        },
        'setskin': {
            description: ['id человека', 'модель педа'],
            types: ['int', 'str']
        },
        'weapon': {
            description: ['статический айди персонажа', 'модель оружия'],
            types: ['int', 'str']
        },
        'veh': {
            description: ['модель машины'],
            types: ['str']
        },
        'skipfrac': {
            description: ['статический айди персонажа'],
            types: ['int']
        },
        'unfreeze': {
            description: ['id человека'],
            types: ['int']
        },
        'spec': {
            description: ['id человека'],
            types: ['int']
        },
        'tp': {
            description: ['id человека'],
            types: ['int']
        },
        'gh': {
            description: ['id человека'],
            types: ['int']
        },
        'sdm': {
            description: ['id человека', 'дименшин'],
            types: ['int', 'int']
        },
        'hp': {
            description: ['id человека', 'количество ХП'],
            types: ['int', 'int']
        },
        'clear': {
            description: [],
            types: []
        },
        'specoff': {
            description: [],
            types: []
        }
    }
    },
    methods: {
    searchVeh() {
        mp.trigger('searchvehadmmenu', this.carId);
    },
    searchCharacter() {
        mp.trigger('searchadmmenu', this.characterId);
    },
    openReport(id) {
        this.reportId = id;
        this.reportOpen = true;
    },
    closeReport() {
        mp.trigger('closeReportADM', this.reportId);
        this.reportOpen = false;
    },
    sendMessage() {
        mp.trigger('sendModeratorMessageADM', this.admMessage, this.reportId)
        this.admMessage = '';
    },
    parseInput(input) {
        return input.match(/(?:[^\s"]+|"[^"]*")+/g)?.map(x => x.replace(/"/g, '')) || [];
    },
    isValidType(value, type) {
        return type === 'int' ? !isNaN(value) : isNaN(value);
    },
    handleCommandInput() {
        const input = this.commandInput.trim().toLowerCase();
        const parts = this.parseInput(input);
        const cmd = parts[0];
        const params = parts.slice(1);

        const found = Object.keys(this.commands).find(c => c.startsWith(cmd));
        if (!found) {
        this.helpText = 'Команда не найдена';
        this.helpColor = 'red';
        this.isHelpValid = false;
        return;
        }

        this.lastCommand = found;
        const cmdData = this.commands[found];
        const formatted = cmdData.description.map(p => `{${p}}`).join(' ');
        this.helpText = `${found} ${formatted}`;

        let valid = true;
        for (let i = 0; i < cmdData.types.length; i++) {
        if (!this.isValidType(params[i], cmdData.types[i])) {
            valid = false;
            break;
        }
        }

        this.helpColor = valid ? '#fff' : '#FFA500';
        this.isHelpValid = valid;
    },
    executeCommand() {
        if (!this.isHelpValid) return;
        const parts = this.parseInput(this.commandInput.trim());
        const cmd = parts[0];
        const args = parts.slice(1);
        mp.trigger('executeCommand', cmd, JSON.stringify(args));
        this.commandInput = '';
        this.helpText = '';
    },
    autocompleteCommand() {
        if (this.lastCommand) {
        this.commandInput = this.lastCommand + ' ';
        }
    }
    }
});