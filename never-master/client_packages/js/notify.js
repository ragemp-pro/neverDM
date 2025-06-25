let browser = null;

mp.events.add("notify", (type, title, message) => {
    if (browser == null) {
        browser = mp.browsers.new('package://browsers/notify/index.html');
    }
    browser.execute(`notify.addNotification(${JSON.stringify(type)}, ${JSON.stringify(title)}, ${JSON.stringify(message)})`);
});

mp.events.add("HideNotify", () => {
    if (browser != null) {
        browser.destroy();
        browser = null;
    }
});
