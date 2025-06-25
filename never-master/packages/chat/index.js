mp.events.add('playerChat', (player, msg) => {
    const name = player.getVariable('characterName');
    const surname = player.getVariable('characterSurname');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isAdmin = player.getVariable('isAdmin');
    const playerId = player.getVariable('selectedCharacterId');

    const prefix = player.getVariable('prefix') || ''; 


    const nearbyPlayers = mp.players.toArray();

    const ownMessage = isAdmin
        ? `${time} Администратор сервера ${name} ${surname} #${playerId}: ${msg}`
        : `${time} ${prefix} (${player.id}) ${name} ${surname} #${playerId}: ${msg}`;

    player.outputChatBox(ownMessage);
    console.log(`[SERVER] ${name} ${surname} #${playerId} написал сообщение: ${msg}`);
    
    nearbyPlayers.forEach(nearbyPlayer => {
        if (nearbyPlayer !== player && nearbyPlayer.dist(nearbyPlayer.position) <= 100) {
            const displayName = `${name} ${surname}`;

            const message = isAdmin
                ? `${time} Администратор сервера ${name} ${surname} #${playerId}: ${msg}`
                : `${time} ${prefix} (${player.id}) ${displayName} #${playerId}: ${msg}`;

            nearbyPlayer.outputChatBox(message);
        }
    });
});

mp.events.add('clearChat', () => {
    mp.players.call('chat:clear');
});

mp.events.add('clearChat', (player) => {
    mp.events.call('notification', player, 'success', 'Успешно', 'Очистка чата');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
    mp.players.call('chat:clear');
    mp.players.broadcast(`${time} Чат был очищен администрацией`);
});
