var checkCheat = new Vue({
    el: '#checkCheat',
    data: {
      discordTag: 'ounezz'
    },
    methods: {
      copyDiscord() {
        const tempInput = document.createElement('input');
        tempInput.value = this.discordTag;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
  
        console.log(`Скопировано: ${this.discordTag}`);
      }
    }
  });
  