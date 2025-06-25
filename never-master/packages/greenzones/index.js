global.greenZones = [
    { x: -196.13, y: -792.34, z: 30.45, radius: 15 },
    { x: 351.42, y: -1404.66, z: 32.51, radius: 40 },
    { x: -41.96, y: -1101.49, z: 26.42, radius: 25 },
    { x: 78.91, y: -1391.81, z: 29.38, radius: 15 },
    { x: 136.48, y: -1708.06, z: 29.29, radius: 10 },
    { x: -220.55, y: -1484.65, z: 31.29, radius: 25 },
    { x: 106.54, y: -1939.99, z: 20.80, radius: 25 },
    { x: 493.89, y: -1512.67, z: 29.28, radius: 25 },
    { x: -215.90, y: -1390.27, z: 31.25, radius: 25 },
    { x: -9.65, y: -1406.45, z: 29.30, radius: 25 },
    { x: 442.88, y: -982.71, z: 30.69, radius: 25 },
    { x: 214.34, y: -1386.05, z: 30.58, radius: 25 },

];

const greenZoneColshapes = [];

greenZones.forEach(zone => {
    const colshape = mp.colshapes.newSphere(zone.x, zone.y, zone.z, zone.radius);
    greenZoneColshapes.push(colshape);
});

mp.events.add('playerEnterColshape', (player, colshape) => {
    if (greenZoneColshapes.includes(colshape)) {
        player.call('setGreenZone', [true]);
    }   
});

mp.events.add('playerExitColshape', (player, colshape) => {
    if (greenZoneColshapes.includes(colshape)) {
        player.call('setGreenZone', [false]); 

    }
});
