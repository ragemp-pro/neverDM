mp.events.add('loadCharacters', (player) => {
    const userId = player.getVariable('static');
    DB.query('SELECT * FROM characters WHERE user = ?', [userId], (err, characters) => {
        if (err) {
            console.error('Ошибка при получении персонажей: ' + err);
            return;
        }
        player.call('updateCharacterList', [characters]);
    });
});

mp.events.add('getAccountInfo', (player) => {
    const login = player.name;
    const socialClub = player.socialClub;
    const DP = player.getVariable('DP');

    player.call('updateAccountInfo', [login, socialClub, DP]);
});

mp.events.add('createCharacter', (player, firstName, lastName, customizationDataJSON, clothesAndHairJSON, appearanceDetailsJSON) => {
    const userId = player.getVariable('static');
    const customizationData = JSON.parse(customizationDataJSON);
    const clothesData = JSON.parse(clothesAndHairJSON);
    const appearanceDetails = JSON.parse(appearanceDetailsJSON);

    if (!firstName || !lastName) {
        return mp.events.call('notification', player, 'error', 'Ошибка', 'Заполните все поля');
    }

    if (firstName.length < 2 || lastName.length < 2) {
        return mp.events.call('notification', player, 'error', 'Ошибка', 'Имя и фамилия должны содержать минимум 2 символа');
    }
    if (firstName.length > 20 || lastName.length > 20) {
        return mp.events.call('notification', player, 'error', 'Ошибка', 'Имя и фамилия не могут быть длиннее 20 символов');
    }
    if (!/^[A-Z][a-zA-Z]*$/.test(firstName) || !/^[A-Z][a-zA-Z]*$/.test(lastName)) {
        return mp.events.call('notification', player, 'error', 'Ошибка', 'Имя и фамилия должны начинаться с заглавной буквы');
    }

    if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
        return mp.events.call('notification', player, 'error', 'Ошибка', 'Имя и фамилия могут содержать только английские буквы');
    }
    if (/\d/.test(firstName) || /\d/.test(lastName)) {
        return mp.events.call('notification', player, 'error', 'Ошибка', 'Имя и фамилия не могут содержать цифры');
    }

    DB.query('SELECT COUNT(*) as count FROM characters WHERE name = ? AND surname = ?', [firstName, lastName], (err, result) => {
        if (err) {
            console.error('Ошибка при проверке уникальности имени и фамилии: ' + err);
            return;
        }

        if (result[0].count > 0) {
            return mp.events.call('notification', player, 'error', 'Ошибка', 'Это имя и фамилия уже заняты.');
        }

        DB.query('SELECT COUNT(*) as count FROM characters WHERE user = ?', [userId], (err, result) => {
            if (err) {
                console.error('Ошибка при проверке количества персонажей: ' + err);
                return;
            }

            const characterCount = result[0].count;

            if (characterCount >= 3) {
                return mp.events.call('notification', player, 'error', 'Ошибка', 'Вы не можете создать больше трех персонажей.');
            }

            DB.query(
                'INSERT INTO characters (user, name, surname, level, exp, money, features, clothes, appearance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [userId, firstName, lastName, 1, 1, 1000, JSON.stringify(customizationData), JSON.stringify(clothesData), JSON.stringify(appearanceDetails)], 
                (err) => {
                    if (err) {
                        console.error('Ошибка при создании персонажа: ' + err);
                        return mp.events.call('notification', player, 'error', 'Ошибка', 'Ошибка при создании персонажа.');
                    }
                    
                    mp.events.call('loadCharacters', player); 
                    player.call('close-castom');
                }
            );
        });
    });
});

mp.events.add('selectCharacter', (player, characterId) => {
    const userId = player.getVariable('static');

    DB.query(
        'SELECT name, surname, money, clothes, fraction, features, appearance, chip FROM characters WHERE id = ? AND user = ?', 
        [characterId, userId], 
        (err, result) => {
        if (err) {
            console.error('Ошибка при получении персонажа: ' + err);
            return;
        }

        if (result.length === 0) {
            mp.events.call('notification', player, 'error', 'Ошибка', 'Персонаж не найден.');
            return;
        }

        const character = result[0];
        const characterName = character.name;
        const characterSurname = character.surname;
        const clothes = character.clothes;
        const fractionId = character.fraction;

        player.setVariable('selectedCharacterId', characterId);
        player.setVariable('characterName', characterName);
        player.setVariable('characterSurname', characterSurname);
        player.setVariable('fraction', fractionId);
        player.chip = character.chip;
        player.setVariable('chip', character.chip);
        console.log(`Персонаж ${characterName} ${characterSurname} #${characterId} chip: ${character.chip}`);
        if (fractions[fractionId]) {
            player.call('UIfrac');
            player.setVariable('mode', 0);
            player.giveWeapon(mp.joaat('gadget_parachute'),1000);

        } else {
            player.call('fade');
            mp.events.call('lobby', player);
            player.giveWeapon(mp.joaat('gadget_parachute'),1000);

        }
        player.call('chat:clear')
        player.outputChatBox(`!{#FFA500} Администрация никогда не запросит Ваши данные аккаунта и не потребует устанавливать посторонние программы.`),
        player.outputChatBox(`!{#FFA500} Если кто-то говорит, что он администратор, попросите его включить админ-режим, это отобразит корону над его ником.`)
        player.outputChatBox(`${characterName} ${characterSurname}, добро пожаловать на never project`);
        console.log(`[CHARACTER] Пользователь ${player.name} #${userId} выбрал персонажа ${characterName} ${characterSurname} #${characterId}`);

        mp.events.call('getAccountInfo', player);

        if (clothes) {
            let parsedClothes;
            try {
                parsedClothes = JSON.parse(clothes); 
            } catch (parseError) {
                console.error('Ошибка при парсинге одежды: ' + parseError);
                return;
            }

            parsedClothes.forEach(item => {
                if (item.component !== undefined && item.drawable !== undefined && item.texture !== undefined) {
                    player.setClothes(
                        parseInt(item.component), 
                        parseInt(item.drawable), 
                        parseInt(item.texture), 
                        parseInt(item.pallete || 0)
                    );

                } else {
                    console.warn(`Некорректная запись одежды: ${JSON.stringify(item)}`);
                }
            });
        }

        if (character.features) {
            let customizationData;
            try {
                customizationData = JSON.parse(character.features);
            } catch (parseError) {
                console.error('Ошибка при парсинге данных внешности: ' + parseError);
                return;
            }

            player.setCustomization(
                customizationData.gender,
                Number(customizationData.motherBlend),
                Number(customizationData.fatherBlend),
                0, 
                Number(customizationData.motherBlend),
                Number(customizationData.fatherBlend),
                0, 
                customizationData.shapeMix,
                customizationData.skinMix,
                0, 
                customizationData.eyeColor,
                customizationData.hairColor,
                customizationData.highlightColor,
                customizationData.faceFeatures
            );
            player.setClothes(parseInt(8), parseInt(15), parseInt(1), parseInt(0));
            player.setClothes(parseInt(3), parseInt(15), parseInt(0), parseInt(0));

        }

        if (character.appearance) {
            let appearanceData;
            try {
                appearanceData = JSON.parse(character.appearance);
            } catch (parseError) {
                console.error('Ошибка при парсинге данных внешнего вида: ' + parseError);
                return;
            }

            mp.events.call('setstyle', player, 2, appearanceData.brows.style, appearanceData.brows.color);
            mp.events.call('setstyle', player, 1, appearanceData.beard.style, appearanceData.beard.color);
            mp.events.call('setstyle', player, 4, appearanceData.makeup.style, appearanceData.makeup.color);
        }
    });
});
