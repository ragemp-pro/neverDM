var ban = new Vue({
    el: '#ban',
    data: {
      user: {
        username: 'DamnitOG',
        staticId: '313473',
        moderator: 'Killua',
        banStart: '25.04.2023 14:22:19',
        banEnd: '09.09.2050 14:22:19',
        reason: 'Слив склада Vagos by Leef'
      }
    },
    methods: {
      updateBlockMessage(username, staticId, moderator, banStart, banEnd, reason) {
        this.user.username = username;
        this.user.staticId = staticId;
        this.user.moderator = moderator;
        this.user.banStart = banStart;
        this.user.banEnd = banEnd;
        this.user.reason = reason;
      }
    }
  });
  