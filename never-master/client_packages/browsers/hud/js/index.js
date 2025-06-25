var hud = new Vue({
  el: '#hud',
  data: {
    showGreenZone: false,
    showMic: false,
    showAdm: false,
    initialized: true 
  },
  methods: {
    setGreenZone(state) {
      this.showGreenZone = state;
    },
    setMic(state) {
      this.showMic = state;
    },
    setAdm(state) {
      this.showAdm = state;
    },
    setInitialized(state) {
      this.initialized = state;
    }
  }
});
