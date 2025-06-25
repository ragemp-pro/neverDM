let authBrowser = null;
let characterBrowser = null;

mp.events.add('showAuthWindow', () => {
    const savedToken = mp.storage.data.authToken;
    mp.gui.cursor.visible = true; 
    if (savedToken) {
        mp.events.callRemote('validateAuthToken', savedToken);

    } else {

        if (authBrowser === null) {
            mp.events.call('interfaceToggle', false)
            mp.events.call('createCameraWithInterp', -61.32, 811.13, 227.48, -45.89, 767.35, 228.15);
            setTimeout(() => {
                mp.events.callRemote('getLatestNews')

                authBrowser = mp.browsers.new('package://browsers/auth/index.html');
            }, 3000);
            chatActive(false);
            mp.players.local.freezePosition(true);
            mp.gui.cursor.visible = true;
            mp.game.ui.displayHud(false);
            mp.game.ui.displayRadar(false);

        }    
    }
});

mp.events.add('updateNews', (newsData) => {
    const script = `
        const newsContainer = document.querySelector('.news-container');
        newsContainer.innerHTML = '<h2>Что нового?</h2>'; 

        const news = ${newsData}; 

        news.forEach(item => {
            const newsHTML = \`
                <div class="news-item">
                    <img src="\${item.image_url}">
                    <div class="news-description">
                        <p>\${item.content}</p>
                        <span>\${item.published_at}</span>
                    </div>
                </div>
            \`;
            newsContainer.innerHTML += newsHTML;
        });
    `;
    authBrowser.execute(script);
});



function onAuthSuccess(username, authToken) {
    mp.storage.data.authToken = authToken;
    mp.storage.flush(); 
    mp.events.callRemote('authSuccess', username); 

}
mp.events.add('notificationAUTH', (title, description) => {
    if (authBrowser !== null) {
        const script = `
            auth.showNotification(
                { title: '${title}', description: '${description}' }
            );
        `;
        authBrowser.execute(script);
    }
});

mp.events.add('authSuccess', (username, authToken) => {
    if (authBrowser !== null) {
        authBrowser.execute(`document.getElementById('loginUsername').value = '${username}';`);
    }
    mp.events.callRemote('setNoClipStatus', false);
    mp.events.call('createCameraWithInterp', -64.62, 800.64, 227.64, -53.65, 664.07, 230.62);

    onAuthSuccess(username, authToken);
    mp.events.call('hideAuthWindow');
    chatActive(false);
    mp.players.local.freezePosition(true);
    mp.gui.cursor.visible = true;
    mp.game.ui.displayHud(false);
    mp.game.ui.displayRadar(false);
    setTimeout(() => {
        mp.events.call('showCharacterSelection');
        mp.events.callRemote('loadCharacters');
    }, 3000);

});


mp.events.add('hideAuthWindow', () => {
    if (authBrowser !== null) {
        authBrowser.execute(`document.body.classList.add('fade-out');`);

        setTimeout(() => {
            authBrowser.destroy();
            authBrowser = null;
        }, 300);
    }
});


mp.events.add('authFailed', () => {

    if (authBrowser === null) {
        mp.events.call('createCameraWithInterp', -61.32, 811.13, 227.48, -45.89, 767.35, 228.15);

        mp.events.call('interfaceToggle', false);
        
        setTimeout(() => {
            mp.events.callRemote('getLatestNews')
            authBrowser = mp.browsers.new('package://browsers/auth/index.html');
        }, 3000);
        chatActive(false);
        mp.players.local.freezePosition(true);
        mp.gui.cursor.visible = true;
        mp.game.ui.displayHud(false);
        mp.game.ui.displayRadar(false);
    }
});


mp.events.add('loginAttempt', (username, password) => {
    if (username && password) {
        mp.events.callRemote('loginPlayer', username, password);
    } else {
    }
});

mp.events.add('registerAttempt', (username, email, password) => {
    if (username && email && password) {
        mp.events.callRemote('registerPlayer', username, email, password);
    }
});
