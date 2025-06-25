var auth = new Vue({
    el: '#auth',
    data: {
        loginUsername: '',
        loginPassword: '',
        registerUsername: '',
        registerEmail: '',
        registerPassword: '',
        formType: 'login',
        notificationQueue: [],
        isNotificationActive: false,
        currentNotificationText: '',
        notification: {
            title: '',
            description: ''
        }
    },
    mounted() {
        document.getElementById('loginUsername').addEventListener('input', e => this.loginUsername = e.target.value.trim());
        document.getElementById('loginPassword').addEventListener('input', e => this.loginPassword = e.target.value.trim());
        document.getElementById('registerUsername').addEventListener('input', e => this.registerUsername = e.target.value.trim());
        document.getElementById('registerEmail').addEventListener('input', e => this.registerEmail = e.target.value.trim());
        document.getElementById('registerPassword').addEventListener('input', e => this.registerPassword = e.target.value.trim());
    },
    methods: {
        login() {
            if (!this.loginUsername || !this.loginPassword) return;
            mp.trigger('loginAttempt', this.loginUsername, this.loginPassword);
        },
        register() {
            if (!this.registerUsername || !this.registerEmail || !this.registerPassword) return;
            mp.trigger('registerAttempt', this.registerUsername, this.registerEmail, this.registerPassword);
        },
        showRegisterForm() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        },
        showLoginForm() {
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        },
        activateInput(input) {
            input.parentNode.querySelector('i').classList.add('active');
            input.classList.add('active');
        },
        deactivateInput(input) {
            if (!input.value) {
                input.parentNode.querySelector('i').classList.remove('active');
            }
            input.classList.remove('active');
        },
        showNotification(message) {
            const messageText = `${message.title} - ${message.description}`;
            if (this.isNotificationActive && this.currentNotificationText === messageText) return;

            if (this.isNotificationActive) {
                this.notificationQueue.push(message);
                return;
            }

            this.displayNotification(message);
        },
        displayNotification(message) {
            const notify = document.getElementById('notify');
            const header = document.getElementById('notify-header');
            const sound = document.getElementById('notification-sound');

            this.isNotificationActive = true;
            this.currentNotificationText = `${message.title} - ${message.description}`;

            notify.querySelector('h1').innerText = message.title || "Уведомление";
            notify.querySelector('h2').innerText = message.description || "";

            header.style.backgroundColor = "rgba(0, 0, 0, 1)";

            sound.volume = 0.1;
            sound.currentTime = 0;
            sound.play().catch((error) => {
                console.error("Ошибка воспроизведения звука:", error);
            });

            notify.style.display = "flex";
            requestAnimationFrame(() => {
                notify.classList.add('visible');
                notify.classList.remove('hidden');
            });

            setTimeout(() => {
                this.hideNotification();
            }, 5000);
        },
        hideNotification() {
            const notify = document.getElementById('notify');
            notify.classList.add('hidden');
            notify.classList.remove('visible');
            setTimeout(() => {
                notify.style.display = "none";
                this.isNotificationActive = false;
                this.currentNotificationText = "";
                if (this.notificationQueue.length > 0) {
                    const nextNotification = this.notificationQueue.shift();
                    this.displayNotification(nextNotification);
                }
            }, 300);
        }
    }
});