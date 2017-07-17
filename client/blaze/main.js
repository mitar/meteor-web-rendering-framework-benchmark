import { Blaze } from 'meteor/blaze';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import profile from '../profile';
import collections from '../collections';

import './main.html';

for (let i = 0; i < 3; i++) {
  Template[`blazeTable${i + 1}`].onRendered(function () {
    profile.logTime();
  });
  
  Template[`blazeTable${i + 1}`].helpers({
    content() {
      return collections[i].find({}, {sort: {order: 1}});
    }
  });  
}

Template.blazeRenderTableCell.events({
  'click button'(event, template) {
    console.log('Clicked!');
  }
});

Template.blazeRecursiveContent.helpers({
  nextDepth() {
    return this.depth - 1;
  },
});

Template.blazeRecursiveFinal.events({
  'click button'(event, template) {
    console.log('Clicked!');
  }
});

Template.blazeRecursive.onRendered(function () {
  profile.logTime();
});

Template.blazeOther.onRendered(function () {
  profile.logTime();
});

Template.blazeMain.helpers({
  selectedOther() {
    return this.selection === 'other';
  },
  selectedRecursive() {
    return this.selection === 'recursive';
  },
  selectedTable1() {
    return this.selection === 'table1';
  },
  selectedTable2() {
    return this.selection === 'table2';
  },
  selectedTable3() {
    return this.selection === 'table3';
  },
});

export default class {
  static getId() {
    return 'blaze';
  }

  static getName() {
    return "Blaze";
  }

  constructor(parent, before) {
    this.selection = new ReactiveVar(null);
    this.view = Blaze.renderWithData(Template.blazeMain, () => {
      return {
        selection: this.selection.get()
      }
    }, parent, before);
  }

  render(selection) {
    this.selection.set(selection);
    Tracker.flush();
  }

  cleanup() {
    if (this.view) {
      Blaze.remove(this.view);
      this.view = null;
    }
  }
}