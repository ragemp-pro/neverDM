var helicoptersShop = new Vue({
    el: '#helicoptersShop',
    data: {
      helicopters: [
        { name: "Maverick", price: 10000000, model: "maverick" },
        { name: "Frogger", price: 8000000, model: "frogger" },
        { name: "Supervolito", price: 15000000, model: "supervolito" },
        { name: "Volatus", price: 20000000, model: "volatus" },
        { name: "Havok", price: 5000000, model: "havok" },
      ],
      selected: null,
      showBuyBlock: false,
    },
    computed: {
      sortedHelicopters() {
        return this.helicopters.slice().sort((a, b) => a.price - b.price);
      }
    },
    methods: {
      formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' $';
      },
      selectHelicopter(helicopter) {
        this.selected = helicopter;
        this.showBuyBlock = false;
        void this.$nextTick(() => {
          this.showBuyBlock = true;
        });
        mp.trigger('previewhelicopter', helicopter.model);
      },
      buyHelicopter() {
        if (this.selected) {
          mp.trigger('buyCar', this.selected.model, this.selected.price, this.selected.name);
        }
      },
      closeBrowser() {
        mp.trigger('closeHelicopterBrowser');
      },
      handleKey(event) {
        if (event.key === 'Escape' || event.key === 'Backspace') {
          this.closeBrowser();
        }
      }
    },
    mounted() {
      document.addEventListener('keydown', this.handleKey);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.handleKey);
    }
  });
  