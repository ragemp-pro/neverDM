var inventory = new Vue({
    el: '#inventory',
    data: {
      weaponNames: {
        "weapon_rpg": "РПГ",
        "weapon_combatmg": "Combat MG",
        "weapon_gusenberg": "Gusenberg",
        "armor": "Бронежилет",
        "health": "Аптечка",
        "weapon_combatmg_mk2": "Combat MG Mk II",
        "weapon_mg": "MG",
        "weapon_sniperrifle": "Sniper Rifle",
        "weapon_heavysniper_mk2": "Heavy Sniper Mk II",
        "weapon_marksmanrifle": "Marksman Rifle",
        "weapon_marksmanrifle_mk2": "Marksman Rifle Mk II",
        "weapon_precisionrifle": "Precision Rifle",
        "weapon_carbinerifle": "Carbine Rifle",
        "weapon_assaultrifle": "Assault Rifle",
        "weapon_grenadelauncher": "Grenade Launcher",
        "weapon_heavyshotgun": "Heavy Shotgun",
        "weapon_revolver": "Heavy Revolver",
        "weapon_revolver_mk2": "Heavy Revolver Mk II",
        "weapon_specialcarbine": "Special Carbine",
        "weapon_stungun_mp": "Тайзер",
      },
      inventory: [],
      fastSlots: [],
      secondarySlots: [],
    },
    mounted() {
/*       this.loadInventory([
        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",
                "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",        "weapon_revolver",
        "weapon_sniperrifle",
        "armor",
        "health",
      ]); */
  
/*       this.loadFastSlots([
        { id: "weapon_rpg", slot: 0 },
        { id: null, slot: 1 },
        { id: "weapon_carbinerifle", slot: 2 }
      ]);
  
      this.loadSecondarySlots([
        { id: "armor" },
        { id: "health" }
      ]); */
    },
    methods: {
      getItemName(id) {
        return this.weaponNames[id] || id.replace("weapon_", "").replace(/_/g, " ");
      },
      getFontSize(id) {
        return this.getItemName(id).length > 14 ? '0.8vh' : '1vh';
      },
      loadInventory(inventory) {
        const sorted = inventory.sort((a, b) => {
          if (a === "weapon_revolver") return -1;
          if (b === "weapon_revolver") return 1;
          return 0;
        });
        this.inventory = sorted;
      },
      loadFastSlots(fastSlots) {
        this.fastSlots = [null, null, null];
        fastSlots.forEach(slot => {
          this.$set(this.fastSlots, slot.slot, slot);
        });
      },
      loadSecondarySlots(secondarySlots) {
        this.secondarySlots = secondarySlots;
      }
    }
  });
  