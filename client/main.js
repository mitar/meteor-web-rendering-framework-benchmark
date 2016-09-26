import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

const contentSelector = new ReactiveVar('other');

const collection1 = new Mongo.Collection(null);
const collection2 = new Mongo.Collection(null);

for (let i = 0; i < 1000; i++) {
  let row1 = [];
  let row2 = [];
  for (let j = 0; j < 10; j++) {
    row1.push({
      _id: Random.id(),
      cell: {
        value: Random.id()
      }
    });
    row2.push({
      _id: Random.id(),
      cell: {
        value: Random.id()
      }
    });
  }
  collection1.insert({row: row1, order: i});
  collection2.insert({row: row2, order: i});
}

let clickTime = new Date().valueOf();
let previous = null;

Template.sidebar.events({
  'click button': function (event, template) {
    clickTime = new Date().valueOf();
    previous = contentSelector.get();
    contentSelector.set(event.currentTarget.className);
  }
});

Template.content.helpers({
  selected(name) {
    return contentSelector.get() === name;
  }
});

Template.table1.onRendered(function () {
  const difference = new Date().valueOf() - clickTime;
  console.log(`Time ${previous} -> table1: ${difference}`);
});

Template.table2.onRendered(function () {
  const difference = new Date().valueOf() - clickTime;
  console.log(`Time ${previous} -> table2: ${difference}`);
});

Template.other.onRendered(function () {
  const difference = new Date().valueOf() - clickTime;
  console.log(`Time ${previous} -> other: ${difference}`);
});

Template.table1.helpers({
  content() {
    return collection1.find({}, {sort: {order: 1}});
  }
});

Template.table2.helpers({
  content() {
    return collection2.find({}, {sort: {order: 1}});
  }
});

function renderTable(template, collection) {
  template.table = document.createElement('table');
  collection.find({}, {sort: {order: 1}}).forEach(function (doc, i, cursor) {
    const row = document.createElement('tr');
    doc.row.forEach(function (column, j) {
      const cell = document.createElement('td');
      cell.textContent = column.cell.value;
      row.appendChild(cell);
    });
    template.table.appendChild(row);
  });
  template.firstNode.parentNode.insertBefore(template.table, null);
}

Template.table1manual.onRendered(function () {
  renderTable(this, collection1);
  const difference = new Date().valueOf() - clickTime;
  console.log(`Time ${previous} -> table1manual: ${difference}`);
});

Template.table1manual.onDestroyed(function () {
  this.table.remove();
});

Template.table2manual.onRendered(function () {
  renderTable(this, collection2);
  const difference = new Date().valueOf() - clickTime;
  console.log(`Time ${previous} -> table2manual: ${difference}`);
});

Template.table2manual.onDestroyed(function () {
  this.table.remove();
});
