global.chatActive = (toggle) => {
    chat.execute(`chatActive(${toggle})`)
}
global.chat = mp.browsers.new("package://browsers/chat/index.html")
mp.gui.chat.show(false);
chat.markAsChat();

mp.events.add('cursorCEF', (toggle) => {
    mp.gui.cursor.show(toggle, toggle);
});

mp.events.add('chat:clear', () => {
    chat.execute(`$('ul').empty();`); 
});
