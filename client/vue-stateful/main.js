import Vue from 'vue';

export default class {
  static getId() {
    return 'stateful-vue';
  }

  static getName() {
    return "Stateful Vue";
  }

  constructor(parent, before) {
    // It can be any element, because it gets replaced by Vue.
    const el = document.createElement('div');
    parent.insertBefore(el, before);
    this.props = {
      selection: null
    };
    this.vm = new Vue({
      el,
      render: (createElement) => {
        return createElement(Vue.component('vue-main'), {props: this.props});
      }
    });
  }

  render(selection) {
    this.props.selection = selection;
    this.vm.$forceUpdate();
  }

  cleanup() {
    if (this.vm) {
      this.vm.$destroy();
      if (this.vm.$el) {
        this.vm.$el.remove();
      }
      this.vm = null;
    }
  }
}