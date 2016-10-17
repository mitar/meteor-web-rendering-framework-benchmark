import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Vue from 'vue';
import async from 'async';

import './main.html';

const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const contentSelector = new ReactiveVar('otherblaze');
const status = new ReactiveVar(null);

const collection1 = new Mongo.Collection(null);
const collection2 = new Mongo.Collection(null);
const collection3 = new Mongo.Collection(null);

for (let i = 0; i < 1000; i++) {
  const row1 = [];
  const row2 = [];
  const row3 = [];
  for (let j = 0; j < 10; j++) {
    let doc1 = {
      _id: Random.id(),
      cell: {
        value: Random.id()
      }
    };
    let doc2 = {
      _id: Random.id(),
      cell: {
        value: Random.id()
      }
    };
    row1.push(doc1);
    row2.push(doc2);
    if (j % 2 === 0) {
      row3.push(doc1);
    }
    else {
      row3.push(doc2);
    }
  }
  collection1.insert({row: row1, order: i});
  collection2.insert({row: row2, order: i});
  collection3.insert({row: row3, order: i});
}

class TableCell extends React.Component {
  onClick(event) {
    console.log('Clicked!');
  }

  render() {
    return (
      <td><button onClick={this.onClick}>{this.props.cell.value}</button></td>
    );
  }
}

class TableRow extends React.Component {
  render() {
    const cells = [];
    this.props.row.forEach((doc, i) => {
      cells.push(
        <TableCell cell={doc.cell} key={doc._id} />
      );
    });
    return (
      <tr>
        {cells}
      </tr>
    );
  }
}

class Table extends React.Component {
  componentDidMount() {
    logTime();
  }

  componentDidUpdate() {
    logTime();
  }

  render() {
    const rows = [];
    this.props.content.forEach((doc, i) => {
      rows.push(
        <TableRow row={doc.row} key={doc._id} />
      );
    });
    return (
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

class Other extends React.Component {
  componentDidMount() {
    logTime();
  }

  componentDidUpdate() {
    logTime();
  }

  render() {
    return (
      <p>{TEXT}</p>
    );
  }
}

class Recursive extends React.Component {
  onClick(event) {
    console.log('Clicked!');
  }

  render() {
    let content;
    if (this.props.depth) {
      content = [
        <Recursive depth={this.props.depth - 1} key="1" />
      ,
        <Recursive depth={this.props.depth - 1} key="2" />
      ,
        <Recursive depth={this.props.depth - 1} key="3" />
      ,
        <Recursive depth={this.props.depth - 1} key="4" />
      ,
        <Recursive depth={this.props.depth - 1} key="5" />
      ];
    }
    else {
      content = (
        <button onClick={this.onClick}>Bottom!</button>
      );
    }

    return (
      <ul>
        <li>
          <p>Depth {this.props.depth}</p>
          {content}
        </li>
      </ul>
    )
  }
}

class RecursiveBase extends React.Component {
  componentDidMount() {
    logTime();
  }

  componentDidUpdate() {
    logTime();
  }

  render() {
    return (
      <Recursive depth="6" />
    )
  }
}

class ReactBase extends React.Component {
  render() {
    if (this.props.other) {
      return (
        <Other />
      )
    }
    else if (this.props.recursive) {
      return (
        <RecursiveBase />
      )
    }
    else {
      return (
        <Table content={this.props.content} />
      )
    }
  }
}

const ReactContainer = createContainer(() => {
  if (contentSelector.get() === 'otherreact') {
    return {
      other: true
    }
  }

  if (contentSelector.get() === 'recursivereact') {
    return {
      recursive: true
    }
  }

  let collection;
  if (contentSelector.get() === 'table1react') {
    collection = collection1;
  }
  else if (contentSelector.get() === 'table2react') {
    collection = collection2;
  }
  else if (contentSelector.get() === 'table3react') {
    collection = collection3;
  }
  return {
    content: collection.find({}, {sort: {order: 1}}).fetch()
  }
}, ReactBase);

const VueOther = {
  name: 'other',
  render(h) {
    return h('p', TEXT);
  },
  mounted() {
    logTime();
  },
  updated() {
    logTime();
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
          click() {
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
  render(h) {
    return h('table', [
      h('tbody',
        this.content.map(doc => h(VueTableRow, {
          props: {
            row: doc.row,
          },
          key: doc._id,
        }))
      ),
    ])
  },
  mounted() {
    logTime();
  },
  updated() {
    logTime();
  },
};

const VueRecursive = {
  name: 'recursive',
  functional: true,
  props: ['depth'],
  render(h, { props }) {
    let content;
    if(props.depth) {
      content = [
        h(VueRecursive, {
          props: {
            depth: props.depth - 1,
          },
          key: 1,
        }),
        h(VueRecursive, {
          props: {
            depth: props.depth - 1,
          },
          key: 2,
        }),
        h(VueRecursive, {
          props: {
            depth: props.depth - 1,
          },
          key: 3,
        }),
        h(VueRecursive, {
          props: {
            depth: props.depth - 1,
          },
          key: 4,
        }),
        h(VueRecursive, {
          props: {
            depth: props.depth - 1,
          },
          key: 5,
        }),
      ];
    } else {
      content = h('button', {
        on: {
          click() {
            console.log('Clicked!');
          },
        },
      }, 'Bottom!');
    }
    return h('ul', [
      h('li', [
        h('p', `Depth ${props.depth}`),
        content,
      ])
    ])
  },
};

const VueRecursiveBase = {
  name: 'recursive-base',
  render(h) {
    return h(VueRecursive, {
      props: {
        depth: 6,
      },
    });
  },
  mounted() {
    logTime();
  },
  updated() {
    logTime();
  },
};



let vue;

Template.vueContent.onRendered(function() {
  vue = new Vue({
    name: 'vue-base',
    el: '#vue',
    render(h) {
      if(this.type === 'other') {
        return h(VueOther);
      } else if(this.type === 'recursive') {
        return h(VueRecursiveBase);
      } else if(this.type === 'table') {
        return h(VueTable, {
          props: {
            content: this.content,
          },
        });
      } else {
        return h('p', 'Wrong type');
      }
    },
    meteor: {
      type() {
        const selector = contentSelector.get();
        if(selector === 'othervue') {
          return 'other';
        } else if(selector === 'recursivevue') {
          return 'recursive';
        } else {
          return 'table';
        }
      },
      content() {
        const selector = contentSelector.get();
        let collection;
        if (selector === 'table1vue') {
          collection = collection1;
        } else if (selector === 'table2vue') {
          collection = collection2;
        } else if (selector === 'table3vue') {
          collection = collection3;
        } else {
          return null;
        }
        // Optimization of the Meteor data with Object.freeze
        // because we know it's the source of truth
        // and we don't need vue to setup reactivity on every
        // nested object, Tracker will take care of the reactivity
        // This increase speed ~2 times
        return Object.freeze(collection.find({}, {sort: {order: 1}}).fetch());
      },
    },
  })
});

Template.vueContent.onDestroyed(function() {
  vue.$destroy();
});

let clickTime = new Date().valueOf();
let previous = null;
let timingFunction = null;

function logTime() {
  const difference = new Date().valueOf() - clickTime;
  console.log(`Time ${previous} -> ${contentSelector.get()}: ${difference}`);
  if (timingFunction) timingFunction(difference);
}

Template.sidebar.events({
  'click button': function (event, template) {
    if (event.currentTarget.className === 'benchmark-all') {
      doBenchmark(['blaze', 'manual', 'react', 'vue']);
    }
    if (event.currentTarget.className === 'benchmark-blaze') {
      doBenchmark(['blaze']);
    }
    if (event.currentTarget.className === 'benchmark-manual') {
      doBenchmark(['manual']);
    }
    if (event.currentTarget.className === 'benchmark-react') {
      doBenchmark(['react']);
    }
    if (event.currentTarget.className === 'benchmark-vue') {
      doBenchmark(['vue']);
    }
    else {
      clickTime = new Date().valueOf();
      previous = contentSelector.get();
      contentSelector.set(event.currentTarget.className);
    }
  }
});

Template.sidebar.helpers({
  status() {
    return status.get();
  }
});

Template.content.helpers({
  selected(name) {
    return contentSelector.get() === name;
  },

  selectedReact() {
    return ['table1react', 'table2react', 'table3react', 'otherreact', 'recursivereact'].indexOf(contentSelector.get()) !== -1;
  },

  selectedVue() {
    return ['table1vue', 'table2vue', 'table3vue', 'othervue', 'recursivevue'].indexOf(contentSelector.get()) !== -1;
  },
});

Template.table1blaze.onRendered(function () {
  logTime();
});

Template.table2blaze.onRendered(function () {
  logTime();
});

Template.table3blaze.onRendered(function () {
  logTime();
});

Template.otherblaze.onRendered(function () {
  logTime();
});

Template.table1blaze.helpers({
  content() {
    return collection1.find({}, {sort: {order: 1}});
  }
});

Template.table2blaze.helpers({
  content() {
    return collection2.find({}, {sort: {order: 1}});
  }
});

Template.table3blaze.helpers({
  content() {
    return collection3.find({}, {sort: {order: 1}});
  }
});

Template.renderTableCell.events({
  'click button'(event, template) {
    console.log('Clicked!');
  }
});

function renderTable(template, collection) {
  template.table = document.createElement('table');
  collection.find({}, {sort: {order: 1}}).forEach(function (doc, i, cursor) {
    const row = document.createElement('tr');
    doc.row.forEach(function (column, j) {
      const cell = document.createElement('td');
      const button = document.createElement('button');
      button.textContent = column.cell.value;
      button.addEventListener('click', function (event) {
        console.log('Clicked!');
      });
      cell.appendChild(button);
      row.appendChild(cell);
    });
    template.table.appendChild(row);
  });
  template.firstNode.parentNode.insertBefore(template.table, null);
}

Template.table1manual.onRendered(function () {
  renderTable(this, collection1);
  logTime();
});

Template.table1manual.onDestroyed(function () {
  this.table.remove();
});

Template.table2manual.onRendered(function () {
  renderTable(this, collection2);
  logTime();
});

Template.table2manual.onDestroyed(function () {
  this.table.remove();
});

Template.table3manual.onRendered(function () {
  renderTable(this, collection3);
  logTime();
});

Template.table3manual.onDestroyed(function () {
  this.table.remove();
});

Template.othermanual.onRendered(function () {
  this.p = document.createElement('p');
  this.p.textContent = TEXT;
  this.firstNode.parentNode.insertBefore(this.p, null);
  logTime();
});

Template.othermanual.onDestroyed(function () {
  this.p.remove();
});

Template.reactContent.helpers({
  component() {
    return ReactContainer;
  }
});

Template.recursiveContent.helpers({
  nextDepth() {
    return this.depth - 1;
  },
});

Template.recursiveFinal.events({
  'click button'(event, template) {
    console.log('Clicked!');
  }
});

Template.recursiveblaze.onRendered(function () {
  logTime();
});

function renderRecursiveContent(depth) {
  const ul = document.createElement('ul');
  const li = document.createElement('li');
  const p = document.createElement('p');
  p.textContent = `Depth ${depth}`;
  li.appendChild(p);
  if (depth) {
    li.appendChild(renderRecursiveContent(depth - 1));
    li.appendChild(renderRecursiveContent(depth - 1));
    li.appendChild(renderRecursiveContent(depth - 1));
    li.appendChild(renderRecursiveContent(depth - 1));
    li.appendChild(renderRecursiveContent(depth - 1));
  }
  else {
    const button = document.createElement('button');
    button.textContent = 'Bottom!';
    button.addEventListener('click', function (event) {
      console.log('Clicked!');
    });
    li.appendChild(button);
  }
  ul.appendChild(li);
  return ul;
}

function renderRecursive(template) {
  template.ul = renderRecursiveContent(6);
  template.firstNode.parentNode.insertBefore(template.ul, null);
}

Template.recursivemanual.onRendered(function () {
  renderRecursive(this);
  logTime();
});

Template.recursivemanual.onDestroyed(function () {
  this.ul.remove();
});

const BENCHMARK_LOOPS = 15;

function doBenchmark(types) {
  console.log("Benchmark started.");
  status.set("Benchmark started.");

  // So that the message above is displayed first.
  Tracker.flush();

  const results = new Map();

  const queue = async.queue(function(task, callback) {
    const to = `${task.to}${task.type}`;

    // Initialize.
    if (!task.from) {
      // If we are already initialized.
      if (contentSelector.get() === to) {
        callback();
        return;
      }

      // Otherwise we go to the initial state.
      timingFunction = function (difference) {
        // Delay between tasks.
        Meteor.setTimeout(callback, 3000);
      };
      clickTime = new Date().valueOf();
      previous = contentSelector.get();
      contentSelector.set(to);
      return;
    }

    const from = `${task.from}${task.type}`;
    const measurement = `${task.from}-${task.to}`;

    if (contentSelector.get() !== from) {
      callback(new Error(`Invalid state. We should be in '${from}', but we are in '${contentSelector.get()}'.`));
      return;
    }

    timingFunction = function (difference) {
      if (contentSelector.get() !== to) {
        callback(new Error(`Invalid state. We should be in '${to}', but we are in '${contentSelector.get()}'.`));
        return;
      }
      if (previous !== from) {
        callback(new Error(`Invalid previous state. It should be '${from}', but it is '${previous}'.`));
        return;
      }

      if (!results.has(task.type)) results.set(task.type, new Map());
      if (!results.get(task.type).has(measurement)) results.get(task.type).set(measurement, []);
      results.get(task.type).get(measurement).push(difference);

      // Delay between tasks.
      Meteor.setTimeout(callback, 3000);
    };

    clickTime = new Date().valueOf();
    previous = contentSelector.get();
    contentSelector.set(to);
  });

  queue.drain = function drain(error) {
    console.log("Benchmark ended.");
    status.set("Benchmark ended. Check results in the console.");

    const baseline = new Map();

    if (results.has('manual')) {
      for (let [measurement, differences] of results.get('manual')) {
        const sum = differences.reduce((a, b) => a + b, 0);
        const average = sum / differences.length;
        baseline.set(measurement, average);
      }
    }

    for (let [type, measurements] of results) {
      for (let [measurement, differences] of measurements) {
        const sum = differences.reduce((a, b) => a + b, 0);
        const average = sum / differences.length;
        console.log("Result", type, measurement, average, average / baseline.get(measurement));
      }
    }
  };

  queue.error = function error(error, task) {
    console.error(error, task);
  };

  let type;
  while (type = types.shift()) {
    queue.push({type: type, to: 'other'});

    for (let i = 0; i < BENCHMARK_LOOPS; i++) {
      queue.push({type: type, from: 'other', to: 'table1'});
      queue.push({type: type, to: 'other', from: 'table1'});
    }
    for (let i = 0; i < BENCHMARK_LOOPS; i++) {
      queue.push({type: type, from: 'other', to: 'recursive'});
      queue.push({type: type, to: 'other', from: 'recursive'});
    }
  }
}
