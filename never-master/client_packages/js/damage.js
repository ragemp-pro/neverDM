let defaultPercent = { "max": 85, "min": 40, "head": 99 };

const weaponDamages = {
    3249783761: {
        "name": "Heavy Revolver",
        "max": 45,
        "head": 90
    },
    3415619887: {
        "name": "Heavy Revolver Mk II",
        "max": 55,
        "head": 95,
    },
    1785463520: {
        "name": "Marksman Rifle MKII",
        "max": 35,
        "head": 45,
    },
    324215364: {
        "name": "Micro SMG",
        "max": 14,
        "min": 10,
        "head": 21
    },
    736523883: {
        "name": "SMG",
        "max": 14,
        "min": 10,
        "head": 21
    },
    171789620: {
        "name": "Combat PDW",
        "max": 14,
        "min": 10,
        "head": 21
    },
    2144741730: {
        "name": "Combat MG",
        "max": 15,
        "min": 10,
        "head": 17
    },
    3686625920: {
        "name": "Combat MG MK2",
        "max": 17,
        "min": 13,
        "head": 20
    },
    3220176749: {
        "name": "Assault Rifle",
        "max": 14,
        "min": 10,
        "head": 21
    },
    487013001: {
        "name": "Pump Shotgun",
        "max": 45,
        "min": 35,
        "head": 50
    },
    100416529: {
        "name": "Sniper Rifle",
        "max": 55,
        "head": 100
    },
    487013001: {
        "name": "Battle Axe",
        "max": 50,
        "min": 40,
        "head": -1
    },
    205991906: {
        "name": "Heavy Sniper",
        "max": 55,
        "head": 90
    },
    177293209: {
        "name": "Heavy Sniper Mk II",
        "max": 125,
        "head": 150,
    },
    1649403952: {
        "name": "Compact Rifle",
        "max": 14,
        "min": 10,
        "head": 21
    },
    4024951519: {
        "name": "Assault SMG",
        "max": 14,
        "min": 10,
        "head": 21
    },
    2210333304: {
        "name": "Carbine Rifle",
        "max": 14,
        "min": 10,
        "head": 21
    },
    1627465347: {
        "name": "Gusenberg Sweeper",
        "max": 14,
        "min": 10,
        "head": 21
    },
    3675956304: {
        "name": "Machine Pistol",
        "max": 14,
        "min": 10,
        "head": 21
    },
    984333226: {
        "name": "Heavy Shotgun",
        "max": 40,
        "head": 45
    },
    2017895192: {
        "name": "Sawed-Off Shotgun",
        "max": 40,
        "min": 30,
        "head": 45
    },
    1593441988: {
        "name": "Combat Pistol",
        "max": 14,
        "min": 10,
        "head": 21
    },
    137902532: {
        "name": "Vintage Pistol",
        "max": 11,
        "min": 10,
        "head": 12
    },
    2640438543: {
        "name": "Bullpup Shotgun",
        "max": 40,
        "min": 30,
        "head": 45
    },
    453432689: {
        "name": "Pistol",
        "max": 12,
        "min": 9,
        "head": 18
    },
    2548703416: {
        "name": "Double Action",
        "max": 12,
        "min": 9,
        "head": 18
    },
    3523564046: {
        "name": "Heavy Pistol",
        "max": 12,
        "min": 10,
        "head": 18
    },
    2937143193: {
        "name": "Advanced Rifle",
        "max": 14,
        "min": 10,
        "head": 21
    },
    2578377531: {
        "name": "Pistol .50",
        "max": 10,
        "min": 5,
        "head": 12
    },
    3218215474: {
        "name": "SNS Pistol",
        "max": 10,
        "min": 5,
        "head": 12
    },
    2634544996: {
        "name": "MG",
        "max": 17,
        "min": 14,
        "head": 25
    },
    3231910285: {
        "name": "Special Carbine",
        "max": 14,
        "min": 10,
        "head": 21
    },
    3342088282: {
        "name": "Marksman Rifle",
        "max": 25,
        "head": 35
    },
    1853742572: {
        "name": "Precision Rifle",
        "max": 75,
        "head": 90
    },
};

const ignoreWeapons = {
    911657153: "Stun Gun",
};

let randomInt = (min, max) => Math.random() * (max - min) + min;

mp._events.add('incomingDamage', (sourceEntity, sourcePlayer, targetEntity, weapon, boneIndex, damage) => { 
    if (targetEntity.type === 'player' && sourcePlayer && !(weapon in ignoreWeapons)) {
        const invincibility = targetEntity.getVariable('Invincibility');
        const isAdmin = targetEntity.getVariable('isAdmin');
        
        if (invincibility === true) {
            return true; 
        }
        if (isAdmin === true) {
            return true; 
        }
        let max = defaultPercent.max;
        let min = defaultPercent.min;
        let head = defaultPercent.head;
        let wp = "";
        if (weapon in weaponDamages) {
            max = weaponDamages[weapon].max;
            min = weaponDamages[weapon].min;
            head = weaponDamages[weapon].head;
            wp = weaponDamages[weapon].name;
        }
        let percent = randomInt(min, max) / 100;
        let cDamage = damage - (damage * percent);
        if (wp == "Heavy Revolver") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 51;
        } else if (wp == "Combat PDW") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 9;
        } else if (wp == "Assault Rifle") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 18;
        } else if (wp == "Combat MG") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 10;
        } else if (wp == "Combat MG MK2") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 15;
        } else if (wp == "SMG") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 12;
        } else if (wp == "Micro SMG") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 8;
        } else if (wp == "Sniper Rifle") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 65;
        } else if (wp == "Heavy Sniper") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 45;
        } else if (wp == "Heavy Sniper Mk II") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 65;
        } else if (wp == "Compact Rifle") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 7;
        } else if (wp == "Assault SMG") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 7;
        } else if (wp == "Carbine Rifle") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 5;
        } else if (wp == "Gusenberg Sweeper") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 8;
        } else if (wp == "Machine Pistol") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 8;
        } else if (wp == "Heavy Shotgun") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 35;
        } else if (wp == "Sawed-Off Shotgun") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 40;
        } else if (wp == "Combat Pistol") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 10;
        } else if (wp == "Vintage Pistol") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 12;
        } else if (wp == "Bullpup Shotgun") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 4;
        } else if (wp == "Pistol") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 7;
        } else if (wp == "Double Action") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 28;
        } else if (wp == "Heavy Pistol") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 18;
        } else if (wp == "Advanced Rifle") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 10;
        } else if (wp == "Pistol .50") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 9;
        } else if (wp == "SNS Pistol") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 9;
        } else if (wp == "Heavy Revolver Mk II") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 75;
        } else if (wp == "Marksman Rifle MKII") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 50;
        } else if (wp == "Marksman Rifle") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 40;
        } else if (wp == "Precision Rifle") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 84;
        } else if (wp == "MG") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 15;
        } else if (wp == "Special Carbine") {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = head;
            else cDamage = 9;
        } else {
            if ((boneIndex === 16 || boneIndex === 18)) cDamage = damage - (damage * percent) / 10;
        }
        
        let newDamage = targetEntity.getHealth() - parseInt(cDamage);
        targetEntity.applyDamageTo(parseInt(cDamage), true);
        mp.events.callRemote("server.player.damage", sourcePlayer, parseInt(cDamage), boneIndex, newDamage);
        let currentHealth = targetEntity.getHealth();
		if (currentHealth > 0) {
			return true;
		}
	}
});
