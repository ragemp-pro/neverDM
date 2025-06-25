let hijackedVehicles = {};
const hijackingPositions = [
    { position: new mp.Vector3(30.03, -1744.15, 29.30), heading: 47.1720 },
    { position: new mp.Vector3(280.97, -2560.09, 5.70), heading: -156.4743 },
    { position: new mp.Vector3(210.19, -3317.80, 5.79), heading: -89.3867 },
    { position: new mp.Vector3(451.61, -907.17, 28.44), heading: -0.3204 },
    { position: new mp.Vector3(404.34, -1918.74, 24.90), heading: -131.3444 },
    { position: new mp.Vector3(827.95, -1258.62, 26.28), heading: -2.0851 },
    { position: new mp.Vector3(161.85, -1455.95, 29.14), heading: -44.0658 },
    { position: new mp.Vector3(124.91, -1080.89, 29.19), heading: -179.3640 },

];

mp.events.add('starthijacking', (player) => {
    if (hijackedVehicles[player.id]) {
        mp.events.call('notification', player, 'error', 'Ошибка', "Вы уже взяли машину для угона");
        return;
    }

    let randomIndex = Math.floor(Math.random() * hijackingPositions.length);
    let randomPosition = hijackingPositions[randomIndex].position;
    let heading = hijackingPositions[randomIndex].heading;

    const carModels = [
        "burrito3",
        "brioso",
        "hustler",
        "rebla",
        "visione",
        "ztype",
        "btype3"
    ];

    const randomCarModel = carModels[Math.floor(Math.random() * carModels.length)];

    let hijackedVehicle = mp.vehicles.new(mp.joaat(randomCarModel), new mp.Vector3(randomPosition.x, randomPosition.y, randomPosition.z), {
        dimension: player.dimension,
        heading: heading
    });

    hijackedVehicle.setVariable('isHijacked', true);
    hijackedVehicle.setVariable('spawnerId', player.getVariable('selectedCharacterId'));  
    hijackedVehicle.locked = true;

    let primaryColor = Math.floor(Math.random() * 158);  
    let secondaryColor = Math.floor(Math.random() * 158); 

    hijackedVehicle.setColor(primaryColor, secondaryColor);

    hijackedVehicles[player.id] = { vehicle: hijackedVehicle, hijacker: player };

    player.call('stopDialog');
    player.call('setWaypoint', [randomPosition.x, randomPosition.y]);

    mp.events.call('notification', player, 'success', 'Успешно', `Вы взяли машину для угона`);
    mp.events.call('notification', player, 'info', 'Информация', `Едьте по метке на карте, там будет машина ${randomCarModel}`);

    mp.players.call('createHijackedVehicleMarker', [hijackedVehicle.id, randomPosition.x, randomPosition.y, randomPosition.z]);

    console.log(`[SERVER] Игрок ${player.name}#${player.static} взял угонку. Модель машины: ${randomCarModel}`);
});


mp.events.add('checkVehicleOwner', (player) => {
    if (hijackedVehicles[player.id]) {
        let hijackedVehicle = hijackedVehicles[player.id].vehicle;
        if (hijackedVehicle.getVariable('spawnerId') === player.getVariable('selectedCharacterId')) {
            player.call('openHijackingDialog', hijackedVehicle);
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', "Это не ваша машина для угона");
        }
    }
});

mp.events.add('unlockcar', (player, veh) => {
    veh.locked = false;
});

let changemarker = mp.markers.new(36, new mp.Vector3(467.03, -584.88, 28.44), 3, {
    color: [255, 255, 255, 255],
    dimension: 0
});

let changemarkerColshape = mp.colshapes.newCircle(467.03, -584.88, 3);

mp.events.add('playerEnterColshape', (player, colshape) => {
    if (colshape === changemarkerColshape) {
        if (hijackedVehicles[player.id]) {
            let hijackedVehicle = hijackedVehicles[player.id].vehicle;
            if (player.vehicle === hijackedVehicle) {
                hijackedVehicle.destroy();
                delete hijackedVehicles[player.id];

                let reward = Math.floor(Math.random() * (100000 - 15000 + 1)) + 15000;

                let formattedReward = reward.toLocaleString('ru-RU').replace(/,/g, ' ');

                mp.events.call('notification', player, 'success', 'Успешно', `+ ${formattedReward} $`);

                const characterId = player.getVariable('selectedCharacterId');

                DB.query('UPDATE characters SET money = money + ? WHERE id = ?', [reward, characterId], (err) => {
                    if (err) {
                        console.error('Ошибка при добавлении денег: ' + err);
                    } else {
                        console.log(`[SERVER] Игрок ${player.name}#${player.static} сдал угонку, награда: ${formattedReward} $`);
                    }
                });

                mp.players.call('removeHijackedVehicleMarker');
            }
        }
    }
});
