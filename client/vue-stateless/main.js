import Vue from 'vue';

import profile from '../profile';
import collections from '../collections';
import text from '../text';

const VueOther = {
  name: 'other',

  render(h) {
    return h('p', text);
  },

  mounted() {
    profile.logTime();
  },

  updated() {
    profile.logTime();
  },
};

const VueTableCell = {
  name: 'table-cell',

  props: ['cell'],

  functional: true,

  render(h, { props }) {
    return h('td', [
      h('button', {
        on: {
          click(event) {
            console.log('Clicked!');
          },
        },
      }, props.cell.value),
    ]);
  },
};

const VueTableRow = {
  name: 'table-row',

  props: ['row'],

  functional: true,

  render(h, { props }) {
    return h('tr',
      props.row.map(doc => h(VueTableCell, {
        props: {
          cell: doc.cell,
        },
        key: doc._id,
      }))
    );
  },
};

const VueTable = {
  name: 'table',

  props: ['content'],

  functional: true,

  render(h, {props}) {
    return h('table', [
      h('tbody',
        props.content.map(doc => h(VueTableRow, {
          props: {
            row: doc.row,
          },
          key: doc._id,
        }))
      ),
    ])
  },
};

const VueTable1 = {
  name: 'table1',

  meteor: {
    content() {
      return Object.freeze(collections[0].find({}, {sort: {order: 1}}).fetch());
    },
  },

  render(h) {
    return h(VueTable, {
      props: {
        content: this.content,
      }
    });
  },

  mounted() {
    profile.logTime();
  },

  updated() {
    profile.logTime();
  },
};

const VueTable2 = {
  name: 'table2',

  meteor: {
    content() {
      return Object.freeze(collections[1].find({}, {sort: {order: 1}}).fetch());
    },
  },

  render(h) {
    return h(VueTable, {
      props: {
        content: this.content,
      }
    });
  },

  mounted() {
    profile.logTime();
  },

  updated() {
    profile.logTime();
  },
};

const VueTable3 = {
  name: 'table3',

  meteor: {
    content() {
      return Object.freeze(collections[2].find({}, {sort: {order: 1}}).fetch());
    },
  },

  render(h) {
    return h(VueTable, {
      props: {
        content: this.content,
      }
    });
  },

  mounted() {
    profile.logTime();
  },

  updated() {
    profile.logTime();
  },
};

const VueRecursiveFinal = {
  name: 'recursive-final',

  functional: true,

  render(h) {
    return h('button', {
      on: {
        click(event) {
          console.log('Clicked!');
        },
      },
    }, 'Bottom!');
  },
};

const VueRecursiveContent = {
  name: 'recursive-content',

  functional: true,

  props: ['depth'],

  render(h, { props }) {
    let content;
    if (props.depth) {
      content = [
        h(VueRecursiveContent, {
          props: {
            depth: props.depth - 1,
          },
          key: 1,
        }),
        h(VueRecursiveContent, {
          props: {
            depth: props.depth - 1,
          },
          key: 2,
        }),
        h(VueRecursiveContent, {
          props: {
            depth: props.depth - 1,
          },
          key: 3,
        }),
        h(VueRecursiveContent, {
          props: {
            depth: props.depth - 1,
          },
          key: 4,
        }),
        h(VueRecursiveContent, {
          props: {
            depth: props.depth - 1,
          },
          key: 5,
        }),
      ];
    } else {
      content = h(VueRecursiveFinal);
    }

    return h('ul', [
      h('li', [
        h('p', `Depth ${props.depth}`),
        content,
      ])
    ])
  },
};

const VueRecursive = {
  name: 'recursive',

  render(h) {
    return h(VueRecursiveContent, {
      props: {
        depth: 6,
      },
    });
  },

  mounted() {
    profile.logTime();
  },

  updated() {
    profile.logTime();
  },
};

const VueMain = {
  name: 'vue-main',

  props: ['selection'],

  render(h) {
    if (this.selection === 'other') {
      return h(VueOther);
    }
    else if (this.selection === 'recursive') {
      return h(VueRecursive);
    }
    else if (this.selection === 'table1') {
      return h(VueTable1);
    }
    else if (this.selection === 'table2') {
      return h(VueTable2);
    }
    else if (this.selection === 'table3') {
      return h(VueTable3);
    }
  },
};

export default class {
  static getId() {
    return 'stateless-vue';
  }

  static getName() {
    return "Stateless Vue";
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
        return createElement(VueMain, {props: this.props});
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