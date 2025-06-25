var chooseCharacters = new Vue({
    el: '#chooseCharacters',
    data: {
      characters: [],
      selectedCharacterId: null,
      login: '',
      socialClub: '',
      DP: 0
    },
/*     mounted() {
      this.loadCharacters([
        { id: 1, name: 'Kai', surname: 'Angel' },
        { id: 2, name: 'Lana', surname: 'Del Rey' },
        { id: 3, name: 'Lana', surname: 'Del Rey' },
      ]);
    }, */
    methods: {
      loadCharacters(chars) {
        this.characters = chars;
      },
      selectCharacter(id) {
        this.selectedCharacterId = id;
      },
      start() {
        if (this.selectedCharacterId) {
          mp.trigger('selectCharacter', this.selectedCharacterId);
        }
      },
      createCharacter() {
        mp.trigger('create-character');
      }
    }
  });
  