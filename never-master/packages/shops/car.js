let sphereCar = mp.colshapes.newSphere(-52.41, -1112.23, 25.44, 15);

let dimensionCounter = 1;

mp.events.add("playerEnterColshape", (player, shape) => {
    if (shape === sphereCar) { 
        player.call('EnterSphereCar'); 
        mp.events.call('notification', player, 'info', 'Информация', "Нажмите 'E', чтобы зайти в автосалон");
    }
});

mp.events.add("playerExitColshape", (player, shape) => {
    if (shape === sphereCar) {
        player.call('ExitSphereCar'); 
    }
});

mp.events.add('enterDealership', (player) => {
    player.dimension = dimensionCounter++;
    player.call('createCameraSmooth', [-52.27, -1098.00, 27.42, -47.02, -1098.56, 26.37]);
});

mp.events.add('exitDealership', (player) => {
    player.dimension = 0;
    player.call('removeCameraSmooth');
});

mp.events.add('buyCarFromServer', (player, model, price, name) => {
    const characid = player.getVariable('selectedCharacterId');

    DB.query('SELECT money, cars FROM characters WHERE id = ?', [characid], (err, results) => {
        if (err) throw err;

        const money = results[0].money;
        let cars = JSON.parse(results[0].cars); 

        const carExists = cars.some(car => car.model === model);

        if (carExists) {
            mp.events.call('notification', player, 'error', 'Ошибка', `У вас уже есть машина ${name}`);
            return; 
        }

        if (money >= price) {
            const newMoney = money - price;

            const newCar = {
                model: model,
                name: name,
                price: price
            };
            cars.push(newCar);
            pricez = formatPrice(price)
            DB.query('UPDATE characters SET money = ?, cars = ? WHERE id = ?', [newMoney, JSON.stringify(cars), characid], (err, results) => {
                if (err) throw err;

                mp.events.call('notification', player, 'success', 'Успешно', `Покупка машины ${name}, за ${pricez}`);
            });
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', "Недостаточно средств на покупку машины");
        }
    });
});
function formatPrice(price) {
    return price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' $';
}

let previewCars = {}; 
mp.events.add('spawnPreviewCar', (player, name) => {
    if (previewCars[player.id]) {
        previewCars[player.id].destroy();
    }

    let vehicle = mp.vehicles.new(mp.joaat(name), new mp.Vector3(-44.72, -1098.61, 26.42), {
        dimension: player.dimension,
        heading: 116.9239
    });

    vehicle.setColor(111, 111);

    previewCars[player.id] = vehicle;
});
