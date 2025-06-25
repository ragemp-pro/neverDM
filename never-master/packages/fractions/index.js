global.fractions = {
    1: { name: 'The Families', position: new mp.Vector3(-233.39, -1490.78, 32.96), storage: new mp.Vector3(-237.97, -1514.15, 32.36)},  
    2: { name: 'The Ballas Gang', position: new mp.Vector3(87.66, -1954.63, 20.75), storage: new mp.Vector3(102.78, -1957.76, 19.74)},  
    3: { name: 'Los Santos Vagos', position: new mp.Vector3(482.51, -1525.92, 29.30), storage: new mp.Vector3(487.81, -1524.35, 28.29)},  
    4: { name: 'Marabunta Grande', position: new mp.Vector3(-217.54, -1379.94, 31.26), storage: new mp.Vector3(-199.55, -1380.49, 30.26)},  
    5: { name: 'The Bloods Street', position: new mp.Vector3(6.34, -1405.57, 29.27), storage: new mp.Vector3(9.07, -1405.74, 28.28)},  
    6: { name: 'FIB', position: new mp.Vector3(442.88, -982.71, 30.69), storage: new mp.Vector3(460.46, -981.17, 29.69)} 
};

Object.values(global.fractions).forEach(fraction => {
    if (fraction.storage) {
        mp.markers.new(1, fraction.storage, 1, {
            "color": [255, 255, 255, 255], 
            "dimension": 0
        });
    }
});
