var clothesShop = new Vue({
    el: '#clothesShop',
    data() {
      return {
        activeCategory: 'outerwear',
        boughtClothes: [],
        clothes: {
          outerwear: [],
          bottoms: [],
          footwear: []
        },
        componentRanges: {
          11: { name: "Верх", min: 0, max: 392 },
          4: { name: "Низ", min: 0, max: 143 },
          6: { name: "Обувь", min: 0, max: 101 }
        },
        exclusions: {
          11: [2, 4, 5, 8, 11, 15, 17, 21, 25, 42, 43, 45, 48, 54, 55, 56, 57, 58, 62, 63, 64, 71, 79, 85, 90, 91, 96, 103, 104, 105, 106, 109, 110, 112, 115, 125, 129, 130, 131, 132, 133, 157, 158, 159, 160, 162, 163, 170, 173, 175, 176, 177, 179, 180, 186, 185, 201, 202, 206, 207, 212, 213, 226, 231, 223, 239, 237, 240, 247, 289, 291, 286, 287, 246, 272, 274, 277, 278, 283, 284, 285, 290, 252, 320, 321, 322, 326, 328, 329, 330, 331, 356, 359, 360, 361, 362, 372, 327, 333, 340, 346, 357, 365, 366, 367, 390, 387, 314, 315],
          4: [2, 8, 11, 30, 33, 34, 35, 36, 37, 41, 51, 53, 57, 59, 63, 87, 93, 111, 112, 120, 121, 122, 123, 84, 85, 95, 126, 130, 131, 133, 44, 40, 74, 72, 97, 107, 110, 109, 113, 115, 108, 127, 12],
          6: [0, 2, 13, 33, 34, 10, 11, 17, 19, 24, 25, 27, 29, 39, 41, 47, 58, 68, 67, 83, 87, 88, 89, 90, 91, 95, 96, 97, 98, 100]
        }
      };
    },
    methods: {
      formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' $';
      },
      generateClothesData(component, min, max, exclusions) {
        const items = [];
        for (let drawable = min; drawable <= max; drawable++) {
          if (exclusions.includes(drawable)) continue;
          items.push({
            name: `${this.componentRanges[component].name} ${drawable}`,
            component,
            drawable,
            texture: 1,
            price: 2000
          });
        }
        return items;
      },
      setCategory(category) {
        this.activeCategory = category;
      },
      buy(item) {
        mp.trigger('buyOnClothes', item.name, item.component, item.drawable, item.texture, item.price);
      },
      tryOn(item) {
        mp.trigger('tryOnClothes', item.component, item.drawable, item.texture);
      },
      putOn(item) {
        mp.trigger('putOnClothes', item.name, item.component, item.drawable, item.texture);
      },
      requestBoughtClothes() {
        mp.trigger('requestBoughtClothes');
        this.setCategory('boughtClothes');
      },
      closeShop() {
        mp.trigger('close-clothes');
      },
      handleKey(event) {
        if (event.key === 'Escape' || event.key === 'Backspace') {
          this.closeShop();
        }
      },
      initClothesData() {
        this.clothes.outerwear = this.generateClothesData(11, this.componentRanges[11].min, this.componentRanges[11].max, this.exclusions[11]);
        this.clothes.bottoms = this.generateClothesData(4, this.componentRanges[4].min, this.componentRanges[4].max, this.exclusions[4]);
        this.clothes.footwear = this.generateClothesData(6, this.componentRanges[6].min, this.componentRanges[6].max, this.exclusions[6]);
      },
      displayBoughtClothes(clothesArray) {
        this.boughtClothes = clothesArray;
        this.setCategory('boughtClothes');
      }
      
    },
    mounted() {
      this.initClothesData();
      document.addEventListener('keydown', this.handleKey);
      this.setCategory('outerwear');
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.handleKey);
    }
  });
  