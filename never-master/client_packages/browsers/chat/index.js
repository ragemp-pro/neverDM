let chat = {
    active: true,
    activeInp: false,
    previuos: [],
};

let input = $('input');
let boxInput = $('label');
let txtIndex = 0;

$(document).ready(function () {
    boxInput.css("opacity", 0);

    $("body").keydown(function (k) {
        if (chat.active === false) {
            return;
        }
    
        if (k.key === 't' || k.key === 'е' || k.key === 'T') {
            if (chat.activeInp === false) {
                input.focus();
                boxInput.css("opacity", 100);
                chat.activeInp = true;
                mp.trigger("cursorCEF", true);
                mp.events.call('interfaceToggle', false);
                setTimeout(() => {
                    input.val("");
                }, 1 / 10000);
            }
        }
        else if (k.key === "Enter") {
            txtIndex = chat.previuos.length + 1;
            chatPush(input.val());
            mp.trigger("cursorCEF", false);
            input.val("");
            boxInput.css("opacity", 0);
            chat.activeInp = false;
            input.blur();
            mp.events.call('interfaceToggle', true); 
        }

        else if (k.key === "ArrowUp") {
            k.preventDefault();
            if (chat.active === true) {
                let txt = chat.previuos;
                if (txt.length != 0 && txtIndex != 0) {
                    txtIndex = txtIndex - 1;
                    input.val(txt[txtIndex]);
                }
                console.log(txtIndex);
            }
        }

        else if (k.key === "ArrowDown") {
            if (chat.active === true) {
                k.preventDefault();
                let txt = chat.previuos;
                if (txt.length != txtIndex) {
                    if (txtIndex === 0 && input.val() === txt[0]) {
                        txtIndex = txtIndex + 1;
                        input.val(txt[txtIndex]);
                    }
                    else if (txtIndex === 0) {
                        txtIndex = txtIndex + 1;
                        input.val(txt[0]);
                    } else {
                        txtIndex = txtIndex + 1;
                        input.val(txt[txtIndex]);
                    }
                }
                console.log(txtIndex);
            }
        }
    });
    
});

function chatPush(message) {
    if (chat.activeInp === true) {
        let value = $('input').val();
        if (value[0] === "/") {
            value = value.slice(1);
            mp.invoke('command', value);
            chat.previuos.push(message);
        }
        else {
            if (message != '' && message != undefined) {
                chat.previuos.push(message);
            }
            console.log(chat.previuos);
            mp.invoke('chatMessage', message);
        }
    }
}

function chatActive(toggle) {
    chat.active = toggle;
    if (!toggle) {
        $('ul').css("visibility", "hidden").css("opacity", 0);
        boxInput.css("visibility", "hidden").css("opacity", 0);
    } else {
        $('ul').css("visibility", "visible").css("opacity", 1);
        boxInput.css("visibility", "visible").css("opacity", 0);
    }
}

const addMessage = (text) => {
    $('ul').append(`<li style="font-size: 15px;">${text.replace(/(\d{1,2}:\d{2})/, `<span style="font-size: 12px;">$1</span>`)}</li>`);
    $('ul').scrollTop($('ul')[0].scrollHeight);
};

let api = {
    "chat:push": addMessage,
};

for (let fn in api) {
    mp.events.add(fn, api[fn]);
}