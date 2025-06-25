mp.events.add('render', () => {
    let player = mp.players.local;
    const mode = player.getVariable('mode');

    if (mode === 0) {
        mp.discord.update('Играет в gang war', `на never project (${player.remoteId})`);
    } else if (mode === 1) {
        mp.discord.update('Играет в revolver dm', `на never project (${player.remoteId})`);
    } else if (mode === 2) {
        mp.discord.update('Играет в carabin dm', `на never project (${player.remoteId})`);
    } else if (mode === 3) {
        mp.discord.update('Играет в sniper dm', `на never project (${player.remoteId})`);
    } else {
        mp.discord.update('Проводит время', `на never project (${player.remoteId})`);
    }
});
