const originalConsoleLog = console.log;
let isPackagesLoaded = false;

console.log = function (message) {
    originalConsoleLog(message);
    
    if (!isPackagesLoaded) {
        return;
    }
    
    let type = 'GENERAL';
    const typeMatch = message.match(/^\[(.*?)\]/);
    
    if (typeMatch && typeMatch[1]) {
        type = typeMatch[1];
        message = message.replace(/^\[.*?\]\s*/, ''); 
    } else {
        return; 
    }
    
    const query = 'INSERT INTO logs (type, message) VALUES (?, ?)';
    DB.query(query, [type, message], (err) => {
        if (err) {
            originalConsoleLog('[LOGS] ERROR LOGGING:', err);
        }
    });

    mp.events.call('sendlog', type, message);
};


mp.events.add("packagesLoaded", () => {
    isPackagesLoaded = true;
});

mp.events.add("playerJoin", (player) => {
    console.log(`[SERVER] Игрок ID: ${player.id}, Social Club: ${player.socialClub} зашёл на сервер`);
});

mp.events.add("playerQuit", (player, exitType) => {
    const playerId = player.getVariable('static');
    console.log(`[SERVER] Игрок ${player.name}, static: ${playerId}, Social Club: ${player.socialClub} вышел с сервера. ${exitType}`);
});
