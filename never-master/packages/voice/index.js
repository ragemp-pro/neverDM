mp.events.add("add_voice_listener", (player, target) => {
    if (target) {
        player.enableVoiceTo(target);
    }
});

mp.events.add("remove_voice_listener", (player, target) => {
    if (target) {
        player.disableVoiceTo(target);
    }
});

mp.events.add("updateVoiceStatus", (player, status) => {
    player.setVariable("voiceActive", status); 
    player.call('setMicrophone', [status]);
/* 
    if (status) {
        player.playAnimation('facials@gen_male@base', 'mood_talking_1', 1, 45);
    } else {
        player.playAnimation('facials@gen_male@base', 'mood_normal_1', 1, 45);
    } */
});
