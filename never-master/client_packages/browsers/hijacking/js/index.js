var hijacking = new Vue({
    el: '#hijacking',
    data: {
      locks: [],
      totalLocks: 3
    },
    created() {
      for (let i = 0; i < this.totalLocks; i++) {
        this.locks.push({
          keyPosition: 0,
          isUnlocked: false,
          maxHeight: 100  
        });
      }
    },
    mounted() {
      this.$nextTick(() => {
        const lockElements = document.querySelectorAll('.lock');
        lockElements.forEach((el, index) => {
          this.$set(this.locks[index], 'maxHeight', el.offsetHeight);
          this.startLowering(index);
        });
      });
    },
    methods: {
      raiseKey(index) {
        const lock = this.locks[index];
        if (lock.isUnlocked) return;
  
        const moveAmount = Math.floor(Math.random() * (20 - 5 + 1)) + 10;
        lock.keyPosition += moveAmount;
  
        const limit = lock.maxHeight - 35;
        if (lock.keyPosition >= limit) {
          lock.keyPosition = limit;
          lock.isUnlocked = true;
          this.checkAllUnlocked();
        }
      },
      startLowering(index) {
        setInterval(() => {
          const lock = this.locks[index];
          if (!lock.isUnlocked && lock.keyPosition > 0) {
            lock.keyPosition -= 1;
          }
        }, 100);
      },
      checkAllUnlocked() {
        if (this.locks.every(lock => lock.isUnlocked)) {
          if (typeof mp !== 'undefined' && typeof mp.trigger === 'function') {
            mp.trigger('HijackingSuccess');
          } else {
            console.log('Все замки взломаны!');
          }
        }
      }
    }
  });
  