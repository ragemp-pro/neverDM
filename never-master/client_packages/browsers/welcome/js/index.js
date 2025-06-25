let authStarted = false;

function startAuth() {
    if (authStarted) return; 

    authStarted = true;
    setTimeout(() => {
        mp.trigger('auth');
    }, 0); 
    const bg = document.getElementById('bg');
    const disc = document.getElementById('disc');

    bg.classList.add('fade-out'); 
    disc.classList.add('fade-out');

}


document.addEventListener('keydown', startAuth);
document.addEventListener('mousedown', startAuth);
