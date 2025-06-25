mp.events.add('outgoingDamage', (sourceEntity, targetEntity, sourcePlayer, weapon, boneIndex, damage) => {
    const currentMode = sourceEntity.getVariable('mode'); 
    
    if (currentMode !== 0) return; 

    if (sourceEntity.type === 'player' && targetEntity.type === 'player') {
        const attackerFraction = sourceEntity.getVariable('fraction');
        const victimFraction = targetEntity.getVariable('fraction');

        if (attackerFraction && victimFraction && attackerFraction === victimFraction) {
            return true; 
        }
    }
    
});
