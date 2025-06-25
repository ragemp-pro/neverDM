var deathScreen = new Vue({
    el: '#deathScreen',
    data: {
      isSuicide: false,
      killerInfo: '',
      deathMessage: '',
      deathImage: './img/death.svg',
      leftTime: 20,
      rightTime: 10,
      leftEnabled: false,
      rightEnabled: false,
      leftInterval: null,
      rightInterval: null
    },
    methods: {
      setDeathMessage(isSuicide, killerInfo = '') {
        this.isSuicide = isSuicide;
        this.killerInfo = killerInfo;
  
        if (isSuicide) {
          this.deathImage = './img/suicide.svg';
          this.deathMessage = 'Вы совершили самоубийство';
        } else {
          this.deathImage = './img/death.svg';
          this.deathMessage = `Вас убил ${killerInfo}`;
        }
  
        this.startTimers(); 
      },
      spawn(place) {
        mp.trigger('spawnPlayer', place);
      },
      startTimers() {
        this.leftTime = 20;
        this.rightTime = 10;
        this.leftEnabled = false;
        this.rightEnabled = false;
  
        if (this.leftInterval) clearInterval(this.leftInterval);
        if (this.rightInterval) clearInterval(this.rightInterval);
  
        this.leftInterval = setInterval(() => {
          if (this.leftTime > 0) {
            this.leftTime--;
          } else {
            clearInterval(this.leftInterval);
            this.leftEnabled = true;
          }
        }, 1000);
  
        this.rightInterval = setInterval(() => {
          if (this.rightTime > 0) {
            this.rightTime--;
          } else {
            clearInterval(this.rightInterval);
            this.rightEnabled = true;
          }
        }, 1000);
      }
    }
  });
  