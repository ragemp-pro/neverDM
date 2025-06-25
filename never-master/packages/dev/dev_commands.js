mp.events.addCommand('pos', (player) => {
    let pos;
    pos = player.position;
    rot = player.heading;
    player.outputChatBox(`X: ${pos.x.toFixed(4)} Y: ${pos.y.toFixed(4)} Z: ${pos.z.toFixed(4)}`);
    player.outputChatBox(`Head rotate: ${rot.toFixed(4)}`);

    console.log(`x: ${pos.x.toFixed(4)}, y: ${pos.y.toFixed(4)}, z: ${pos.z.toFixed(4)}, heading: ${rot.toFixed(4)}`);
    console.log(`${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)} Head rotate: ${rot.toFixed(4)}`);
})
mp.events.addCommand('tpc', (player, _, x, y, z) => {
    if (x == undefined || y == undefined || z == undefined) return player.outputChatBox('/tpc [x] [y] [z]');
    player.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
})

mp.events.addCommand('anim', (player, _, dict, name) => {
    player.playAnimation(dict, name, 1, 1);
    player.outputChatBox(`Анимация ${dict} ${name} запущена.`);

});

mp.events.addCommand('anims', (player) => {
    player.stopAnimation();
});
mp.events.addCommand('weapon', (player, _, weapon) => {
    player.call('weaponHASH', [weapon.toLowerCase()]);
});
mp.events.addCommand('d', (player) => {
    player.health = 0
})
mp.events.addCommand('dm', (player) => {
    player.notify(`Вы в ~r~${player.dimension} ~w~дименшине.`);
})

mp.events.addCommand('dp', (player) => {
    const DP = player.getVariable('DP');
    player.outputChatBox(`У вас ${DP} DP`);
})
mp.events.addCommand('vip', (player) => {
    const vip = player.getVariable('vip');
    player.outputChatBox(`${vip}`);
})
mp.events.addCommand('setc', (player, _, component, drawable, texture, pallete) => {
    if (component == undefined || drawable == undefined) return player.outputChatBox('/setc [компонент] [номер] [цвет]');
    player.setClothes(parseInt(component), parseInt(drawable), parseInt(texture), parseInt(pallete));
});
mp.events.addCommand('sacs', (player, _, cloth, draw, text) => {
        if (cloth === undefined || draw === undefined || text === undefined) {
            player.outputChatBox('/sacs [компонент] [номер] [цвет]');
            return;
        }
        player.setProp(parseInt(cloth), parseInt(draw), parseInt(text));
    }
);
mp.events.add('playerCommand', (player, command) => {
	player.outputChatBox(`"${command}" такой команды не существует`);
})

