var dialog = new Vue({
    el: '#dialog',
    data: {
      dialogData: {
        name: '',
        text: '',
        button1: '',
        button2: ''
      },
      trigger1: () => {},
      trigger2: () => {}
    },
    methods: {
      updateDialog({ name, dialog, button1, button2, trigger1, trigger2 }) {
        this.dialogData.name = name;
        this.dialogData.text = dialog;
        this.dialogData.button1 = button1;
        this.dialogData.button2 = button2;
        this.trigger1 = trigger1;
        this.trigger2 = trigger2;
      }
    }
  });
  