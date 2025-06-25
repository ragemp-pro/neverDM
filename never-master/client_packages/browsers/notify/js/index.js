var notify = new Vue({
    el: "#notify",
    data: {
        notifications: [],
        notificationVolume: 0.1,
        playbackSpeed: 1.0
    },
    methods: {
        addNotification(type, title, message) {
            if (this.notifications.length >= 3) {
                this.notifications.shift(); 
            }
            
            let soundFile = 'sounds/notification.mp3';
            switch (type) {
                case 'alert': soundFile = 'sounds/alert.mp3'; break;
                case 'success': soundFile = 'sounds/success.mp3'; break;
                case 'error': soundFile = 'sounds/error.mp3'; break;
                case 'info': soundFile = 'sounds/info.mp3'; break;
            }
            
            let audio = new Audio(soundFile);
            audio.volume = this.notificationVolume;
            audio.playbackRate = this.playbackSpeed;
            audio.play();
            
            let newNotification = { type, title, message, visible: true };
            this.notifications.push(newNotification);
            
            setTimeout(() => {
                newNotification.visible = false; 
                setTimeout(() => {
                    this.notifications.shift(); 
                }, 1000);
            }, 5000);
        }
    }
});
