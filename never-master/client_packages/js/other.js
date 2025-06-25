
mp.events.add('interfaceToggle', (toogle) => {
    mp.events.call('toggleMenu', toogle)
    mp.events.call('toggleInventory', toogle)
    mp.events.call('togglePhone', toogle)
});

const pedsData = [
    {
        model: 'a_f_m_beach_01',
        position: new mp.Vector3(-47.83, 782.67, 227.23),
        heading: -66.3767,
        dimension: 11829,
        animDict: "anim@amb@nightclub@mini@dance@dance_solo@female@var_a@",
        animName: "high_center"
    },
    {
        model: 'a_f_y_beach_02',
        position: new mp.Vector3(-45.43, 781.68, 227.23),
        heading: 69.3971,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_15_v1_female^3"
    },
    {
        model: 'a_f_y_beach_01',
        position: new mp.Vector3(-45.12, 783.11, 227.23),
        heading: 84.6549,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_17_v1_female^5"
    },
    {
        model: 's_f_y_baywatch_01',
        position: new mp.Vector3(-46.71, 781.04, 227.23),
        heading: -10.2670,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_17_v1_female^6"
    },
    {
        model: 's_f_y_bartender_01',
        position: new mp.Vector3(-42.39, 790.23, 227.11),
        heading: 9.0245,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_09_v1_female^1"
    },
    {
        model: 'csb_sss',
        position: new mp.Vector3(-42.76, 792.43, 227.11),
        heading: -171.8812,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_13_v1_male^1"
    },
    {
        model: 'ig_kaylee',
        position: new mp.Vector3(-43.12, 787.08, 227.23),
        heading: -96.7779,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_13_v2_male^3"
    },
    {
        model: 'a_m_y_beach_02',
        position: new mp.Vector3(-40.28, 787.51, 227.23),
        heading: 140.3636,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@black_madonna_entourage@",
        animName: "hi_dance_facedj_09_v2_male^5"
    },
    {
        model: 'a_m_y_beachvesp_02',
        position: new mp.Vector3(-41.46, 785.38, 227.23),
        heading: -39.1097,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@black_madonna_entourage@",
        animName: "li_dance_facedj_11_v1_male^1"
    },
    {
        model: 'a_m_m_beach_01',
        position: new mp.Vector3(-38.66, 794.01, 227.23),
        heading: -82.3795,
        dimension: 11829,
        animDict: "abigail_mcs_1_concat-5",
        animName: "player_zero_dual-5"
    },
    {
        model: 's_f_y_baywatch_01',
        position: new mp.Vector3(-47.85, 806.72, 227.11),
        heading: -179.0775,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_17_v1_female^5"
    },
    {
        model: 'a_m_y_beach_02',
        position: new mp.Vector3(-47.17, 805.12, 227.11),
        heading: 26.8378,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_11_v1_male^4"
    },
    {
        model: 'a_m_o_beach_02',
        position: new mp.Vector3(-48.76, 805.53, 226.98),
        heading: -82.9123,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@low_intesnsity",
        animName: "li_dance_facedj_13_v2_male^1"
    },
    {
        model: 'a_f_y_beach_02',
        position: new mp.Vector3(-60.73, 803.86, 226.98),
        heading: -25.1811,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_13_v1_female^3"
    },
    {
        model: 'a_f_m_beach_01',
        position: new mp.Vector3(-61.57, 806.26, 226.98),
        heading: -151.8964,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_15_v1_female^2"
    },
    {
        model: 'a_f_y_bevhills_02',
        position: new mp.Vector3(-45.34, 810.62, 231.33),
        heading: -170.5978,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
        animName: "hi_dance_facedj_17_v1_female^1"
    },
    {
        model: 'a_m_y_beach_01',
        position: new mp.Vector3(-53.62, 781.14, 227.23),
        heading: -98.1129,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_13_v1_male^1"
    },
    {
        model: 'a_m_y_beach_03',
        position: new mp.Vector3(-52.19, 779.00, 227.23),
        heading: -11.7911,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_13_v2_male^3"
    },
    {
        model: 'u_m_y_abner',
        position: new mp.Vector3(-50.93, 778.82, 227.23),
        heading: 15.5677,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_13_v2_male^6"
    },
    {
        model: 's_m_y_baywatch_01',
        position: new mp.Vector3(-49.84, 779.67, 227.23),
        heading: 46.8569,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_17_v1_male^6"
    },
    {
        model: 'a_m_y_beach_01',
        position: new mp.Vector3(-57.59, 807.25, 226.98),
        heading: -19.5031,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_13_v2_male^2"
    },
    {
        model: 'u_f_y_spyactress',
        position: new mp.Vector3(-57.45, 809.56, 226.98),
        heading: -150.7448,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_15_v1_female^6"
    },
    {
        model: 'ig_tracydisanto',
        position: new mp.Vector3(-56.16, 809.39, 226.98),
        heading: 153.0775,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_13_v2_female^1"
    },
    {
        model: 'a_f_y_topless_01',
        position: new mp.Vector3(-44.64, 798.79, 227.23),
        heading: 157.7873,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_09_v1_female^6"
    },
    {
        model: 'u_m_y_staggrm_01',
        position: new mp.Vector3(-45.35, 796.85, 227.11),
        heading: 11.6028,
        dimension: 11829,
        animDict: "anim@amb@nightclub@dancers@crowddance_facedj@med_intensity",
        animName: "mi_dance_facedj_09_v2_male^4"
    },

    {
        model: 'g_m_y_armgoon_02',
        position: new mp.Vector3(-58.79, 784.78, 227.23),
        heading: -170.8327,
        dimension: 11829,
        animDict: "abigail_mcs_1_concat-5",
        animName: "player_zero_dual-5"
    },
    
    {
        model: 'u_m_y_zombie_01',
        position: new mp.Vector3(-53.93, 820.83, 240.16),
        heading: -173.4797,
        dimension: 11829,
        animDict: "special_ped@zombie@base",
        animName: "base"
    }
];

function createAnimatedPed(pedData) {
    let bot = mp.peds.new(
        mp.game.joaat(pedData.model),
        pedData.position,
        pedData.heading,
        pedData.dimension
    );

    mp.game.streaming.requestAnimDict(pedData.animDict);

    const timer = setInterval(() => {
        if (mp.game.streaming.hasAnimDictLoaded(pedData.animDict)) {
            clearInterval(timer);

            bot.taskPlayAnim(
                pedData.animDict,
                pedData.animName,
                8.0, 1.0,
                -1,
                1,
                1.0,
                false, false, false
            );

            setInterval(() => {
                if (!bot.isPlayingAnim(pedData.animDict, pedData.animName, 3)) {
                    bot.taskPlayAnim(
                        pedData.animDict,
                        pedData.animName,
                        8.0, 1.0,
                        -1,
                        1,
                        1.0,
                        false, false, false
                    );
                }
            }, 1000); 
        }
    }, 200);
}

pedsData.forEach(createAnimatedPed);

let welcomeBrowser = null;

mp.events.add('welcomeScreen', () => {
    welcomeBrowser = mp.browsers.new('package://browsers/welcome/index.html');
    mp.events.call('musicWelcome', true, 'home');

    mp.events.callRemote('setNoClipStatus', true);
    mp.events.call('interfaceToggle', false);
    chatActive(false);
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);

    mp.events.add('render', () => {
        mp.game.time.setClockTime(23, 0, 0); 
    });

    mp.events.add('render', () => {
        if (welcomeBrowser && mp.game.controls.isControlJustPressed(0, 24)) { 
            welcomeBrowser.execute(`startAuth();`);
        }
    });
});


mp.events.add('auth', () => {
    setTimeout(() => {
        if (welcomeBrowser !== null) {
            welcomeBrowser.destroy();
            welcomeBrowser = null;
        }
    }, 300); 
    setTimeout(() => {
        mp.events.call('showAuthWindow')
    }, 1000); 
});
let musicBrowser = null;

mp.events.add('musicWelcome', (playMusic, trackName) => {
    if (playMusic) {
        if (!musicBrowser) {
            musicBrowser = mp.browsers.new('package://browsers/song/index.html');
            musicBrowser.execute(`document.getElementById('audioPlayer').src = './sounds/${trackName}.mp3';`);
        }
    } else {
        if (musicBrowser) {
            musicBrowser.destroy();
            musicBrowser = null;
        }
    }
});
let customizationBrowser = null;

mp.events.add("client:openCustomizationMenu", () => {
    if (customizationBrowser == null) {
        customizationBrowser = mp.browsers.new("package://browsers/edit/index.html");
    }
    mp.gui.cursor.show(true, true);
});

mp.events.add("client:receiveCustomizationData", (customizationDataJSON) => {

    mp.events.callRemote("server:applyCustomization", customizationDataJSON);
});

mp.events.add('fade', () => {
    mp.game.cam.doScreenFadeOut(200);
    setTimeout(() => {
        mp.game.cam.doScreenFadeIn(200);

    }, 1000);
});

mp.events.add('lobby', () => {
    setTimeout(() => {
        mp.events.call('removeCamera');

    }, 800);
    setTimeout(() => {
        mp.events.add('render', () => {
            mp.game.time.setClockTime(15, 0, 0); 
        });
        mp.events.call('createCamera', -1696.17, -1031.31, 15, -1707.39, -1094.66, 12.79);
        mp.players.local.position = new mp.Vector3(-1707.39, -1094.66, 12.79);
        mp.events.callRemote('dimzero')

    }, 1000);
});

let ban = null;

mp.events.add("banb", (username, staticId, moderator, banStart, banEnd, reason) => {
    if (ban == null) {
        ban = mp.browsers.new('package://browsers/ban/index.html');
    }

    ban.execute(`
        ban.updateBlockMessage("${username}", "${staticId}", "${moderator}", "${banStart}", "${banEnd}", "${reason}");
    `);
});

setInterval(() => {
    mp.events.callRemote('addHours')
}, 3600000);
