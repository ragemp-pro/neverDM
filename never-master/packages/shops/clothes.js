let sphereClothes = mp.colshapes.newSphere(78.24, -1391.43, 29.3, 5);
let dimensionCounter = 1;

mp.events.add("playerEnterColshape", (player, shape) => {
    if (shape === sphereClothes) { 
        player.call('EnterSphereClothes'); 
        mp.events.call('notification', player, 'info', 'Информация', "Нажмите 'E', чтобы зайти в магазин одежды");
    }
});

mp.events.add("playerExitColshape", (player, shape) => {
    if (shape === sphereClothes) {
        player.call('ExitSphereClothes'); 
    }
});

mp.events.add('enterClothesShop', (player) => {

    player.position = new mp.Vector3(71.73, -1398.88, 29.38);
    player.heading = -54.1899; 
    player.removeAllWeapons();
    player.call('createCameraSmooth', [75.84, -1395.57, 29.74, 71.73, -1398.88, 29.38]);

    player.dimension = dimensionCounter++; 
});

mp.events.add('exitClothesShop', (player) => {
    const characterId = player.getVariable('selectedCharacterId'); 

    if (!characterId) {
        console.warn('Персонаж не выбран');
        return;
    }

    DB.query('SELECT clothes FROM characters WHERE id = ?', [characterId], (err, result) => {
        if (err) {
            console.error('Ошибка при получении данных об одежде персонажа: ' + err);
            return;
        }

        if (result.length === 0) {
            console.warn('Одежда не найдена для данного персонажа');
            return;
        }

        const clothesData = result[0].clothes;

        let parsedClothes;
        try {
            parsedClothes = JSON.parse(clothesData); 
        } catch (parseError) {
            console.error('Ошибка при парсинге данных об одежде: ' + parseError);
            return;
        }

        parsedClothes.forEach(item => {
            if (item.component !== undefined && item.drawable !== undefined && item.texture !== undefined) {
                player.setClothes(
                    parseInt(item.component), 
                    parseInt(item.drawable), 
                    parseInt(item.texture), 
                    0 
                );
            } else {
                console.warn(`Некорректная запись одежды: ${JSON.stringify(item)}`);
            }
        });
    });

    player.dimension = 0;
    player.call('removeCameraSmooth');
});

mp.events.add('tryOnClothes', (player, component, drawable, texture) => {
    player.setClothes(parseInt(component), parseInt(drawable), parseInt(texture), 0);
});

mp.events.add('buyOnClothes', (player, name, component, drawable, texture, price) => {
    const characterId = player.getVariable('selectedCharacterId');

    if (!characterId) {
        console.warn('Персонаж не выбран');
        return;
    }

    DB.query('SELECT money, buyClothes, clothes FROM characters WHERE id = ?', [characterId], (err, result) => {
        if (err) {
            console.error('Ошибка при получении данных: ' + err);
            return;
        }

        if (result.length === 0) {
            console.warn('Данные персонажа не найдены');
            return;
        }

        let money = result[0].money;
        let buyClothes = result[0].buyClothes ? JSON.parse(result[0].buyClothes) : [];
        let currentClothes = result[0].clothes ? JSON.parse(result[0].clothes) : [];

        const alreadyBought = buyClothes.some(item => 
            item.component === component && item.drawable === drawable && item.texture === texture
        );

        const alreadyWorn = currentClothes.some(item => 
            item.component === component && item.drawable === drawable && item.texture === texture
        );

        if (alreadyBought) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Эта одежда уже куплена');
            return;
        }

        if (alreadyWorn) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Эта одежда уже надета');
            return;
        }

        if (money >= price) {
            money -= price;
            const newClothes = { "name": name, "component": component, "drawable": drawable, "texture": texture };
            buyClothes.push(newClothes);

            DB.query('UPDATE characters SET money = ?, buyClothes = ? WHERE id = ?', [money, JSON.stringify(buyClothes), characterId], (updateErr) => {
                if (updateErr) {
                    console.error('Ошибка при обновлении данных: ' + updateErr);
                    return;
                }

                mp.events.call('notification', player, 'success', 'Успех', `Вы купили ${name}`);
            });
        } else {
            mp.events.call('notification', player, 'error', 'Ошибка', "Недостаточно денег на покупку одежды");
        }
    });
});

mp.events.add('getBoughtClothes', (player) => {
    const characterId = player.getVariable('selectedCharacterId');

    if (!characterId) {
        console.warn('Персонаж не выбран');
        return;
    }
    DB.query('SELECT clothes FROM characters WHERE id = ?', [characterId], (err, result) => {
        if (err) {
            console.error('Ошибка при получении данных об одежде персонажа: ' + err);
            return;
        }

        if (result.length === 0) {
            console.warn('Одежда не найдена для данного персонажа');
            return;
        }

        const clothesData = result[0].clothes;

        let parsedClothes;
        try {
            parsedClothes = JSON.parse(clothesData); 
        } catch (parseError) {
            console.error('Ошибка при парсинге данных об одежде: ' + parseError);
            return;
        }

        parsedClothes.forEach(item => {
            if (item.component !== undefined && item.drawable !== undefined && item.texture !== undefined) {
                player.setClothes(
                    parseInt(item.component), 
                    parseInt(item.drawable), 
                    parseInt(item.texture), 
                    0 
                );
            } else {
                console.warn(`Некорректная запись одежды: ${JSON.stringify(item)}`);
            }
        });
    });
    DB.query('SELECT buyClothes FROM characters WHERE id = ?', [characterId], (err, result) => {
        if (err) {
            console.error('Ошибка при получении данных о купленной одежде: ' + err);
            return;
        }

        if (result.length === 0 || !result[0].buyClothes) {
            player.call('displayBoughtClothes', [[]]); 
            return;
        }

        const boughtClothes = JSON.parse(result[0].buyClothes);
        player.call('displayBoughtClothes', [boughtClothes]);

    });
});

mp.events.add('putOnClothes', (player, name, component, drawable, texture) => {
    const characterId = player.getVariable('selectedCharacterId');

    if (!characterId) {
        console.warn('Персонаж не выбран');
        return;
    }

    DB.query('SELECT clothes, buyClothes FROM characters WHERE id = ?', [characterId], (err, result) => {
        if (err) {
            console.error('Ошибка при получении данных одежды: ' + err);
            return;
        }

        if (result.length === 0) {
            console.warn('Одежда не найдена для данного персонажа');
            return;
        }

        let clothes = JSON.parse(result[0].clothes) || [];
        let buyClothes = JSON.parse(result[0].buyClothes) || [];

        const componentNames = {
            11: "Верх",
            4: "Низ",
            6: "Обувь"
        };
        const allowedComponents = Object.keys(componentNames).map(Number);

        if (!allowedComponents.includes(component)) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Этот компонент нельзя заменить');
            return;
        }

        let currentItemIndex = clothes.findIndex(item => item.component === component);

        if (currentItemIndex !== -1) {
            const itemName = componentNames[component];
            const currentItem = clothes[currentItemIndex];
            
            const itemNameWithDrawable = `${itemName} ${currentItem.drawable}`;

            if (!buyClothes.some(item => item.component === currentItem.component && item.drawable === currentItem.drawable && item.texture === currentItem.texture)) {
                buyClothes.push({ "name": itemNameWithDrawable, "component": currentItem.component, "drawable": currentItem.drawable, "texture": currentItem.texture });
            }

            clothes[currentItemIndex].drawable = drawable;
            clothes[currentItemIndex].texture = texture;
        } else {
            clothes.push({ "component": component, "drawable": drawable, "texture": texture });
        }

        buyClothes = buyClothes.filter(item => !(item.component === component && item.drawable === drawable && item.texture === texture));

        DB.query('UPDATE characters SET clothes = ?, buyClothes = ? WHERE id = ?', [JSON.stringify(clothes), JSON.stringify(buyClothes), characterId], (updateErr) => {
            if (updateErr) {
                console.error('Ошибка при обновлении одежды: ' + updateErr);
                return;
            }
            player.setClothes(parseInt(component), parseInt(drawable), parseInt(texture), 0);

            mp.events.call('notification', player, 'success', 'Успешно', `Одежда обновлена`);
            player.call('displayBoughtClothes', [buyClothes]);
        });
    });
});

