var carsShop = new Vue({
    el: '#carsShop',
    data: {
      cars: [
        { name: "Pagadi Phuayra", price: 8000000, category: "Гиперкар", model: "phuayra" },
        { name: "Furia", price: 800000, category: "Спорткар", model: "furia" },
        { name: "Tezeract", price: 1000000, category: "Спорткар", model: "tezeract" },
        { name: "Entity", price: 1000000, category: "Спорткар", model: "entity3" },
        { name: "Yamaga p1m", price: 15000000, category: "Мотоцикл", model: "r1m" },
        { name: "Doe Matizz", price: 100000, category: "Легковое авто", model: "matiz" },
        { name: "Koegigsegg Gegera", price: 9000000, category: "Гиперкар", model: "gemera" },
        { name: "Buddati Dido", price: 6500000, category: "Спортивная машина", model: "2019divo" },
        { name: "Porge Sryder", price: 6000000, category: "Спортивная машина", model: "918spyder" },
      ],
      selectedCar: null,
      showBuyBlock: false,
    },
    computed: {
      sortedCars() {
        return this.cars.slice().sort((a, b) => a.price - b.price);
      }
    },
    methods: {
      formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' $';
      },
      selectCar(car) {
        this.selectedCar = car;
        this.showBuyBlock = false;
        void this.$nextTick(() => {
          this.showBuyBlock = true;
        });
        mp.trigger('previewCar', car.model);
      },
      buyCar() {
        if (this.selectedCar) {
          mp.trigger('buyCar', this.selectedCar.model, this.selectedCar.price, this.selectedCar.name);
        }
      },
      closeBrowser() {
        mp.trigger('closeCarBrowser');
      },
      handleKeyDown(event) {
        if (event.key === 'Escape' || event.key === 'Backspace') {
          this.closeBrowser();
        }
      }
    },
    mounted() {
      document.addEventListener('keydown', this.handleKeyDown);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  });
  