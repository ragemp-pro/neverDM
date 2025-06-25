const Use3d = true;
const UseAutoVolume = false;
const MaxRange = 10.0;

const voiceKey = 0x4E; 

mp.keys.bind(voiceKey, true, function() {
    mp.voiceChat.muted = false; 
    mp.players.local.setVariable("voiceActive", true);  
    mp.events.callRemote("updateVoiceStatus", true);   
});

mp.keys.bind(voiceKey, false, function() {
    mp.voiceChat.muted = true;  
    mp.players.local.setVariable("voiceActive", false);  
    mp.events.callRemote("updateVoiceStatus", false);    
});

let g_voiceMgr = {
    listeners: [],

    add: function(player) {
        this.listeners.push(player);
        player.isListening = true;
        mp.events.callRemote("add_voice_listener", player);  
        player.voiceAutoVolume = UseAutoVolume ? true : false;
        player.voiceVolume = 1.0;
        if (Use3d) player.voice3d = true;
    },

    remove: function(player, notify) {
        let idx = this.listeners.indexOf(player);
        if (idx !== -1) this.listeners.splice(idx, 1);
        player.isListening = false;
        if (notify) mp.events.callRemote("remove_voice_listener", player);  
    }
};

mp.events.add("playerQuit", (player) => {
    if (player.isListening) {
        g_voiceMgr.remove(player, false);
    }
});

setInterval(() => {
    let localPlayer = mp.players.local;
    let localPos = localPlayer.position;

    mp.players.forEachInStreamRange(player => {
        if (player !== localPlayer && !player.isListening) {
            let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, localPos.x, localPos.y, localPos.z);
            if (dist <= MaxRange) g_voiceMgr.add(player);
        }
    });

    g_voiceMgr.listeners.forEach((player) => {
        if (player.handle !== 0) {
            let dist = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, localPos.x, localPos.y, localPos.z);
            if (dist > MaxRange) g_voiceMgr.remove(player, true);
            else if (!UseAutoVolume) player.voiceVolume = 1 - (dist / MaxRange);
        } else {
            g_voiceMgr.remove(player, true);
        }
    });
}, 1500);
