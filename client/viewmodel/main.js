import { Blaze } from 'meteor/blaze';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { viewmodel } from 'meteor/manuel:viewmodel';

import profile from '../profile';
import collections from '../collections';

import './main.html';

ViewModel.mixin({
  timeLogger: {
    onRendered() {
      profile.logTime();
    }
  }
});

Template.viewModelRenderTableCell.viewmodel({
  registerClick() {
    console.log('Clicked!');
  }
});

Template.viewModelRecursiveContent.viewmodel({
  nextDepth() {
    return this.depth() - 1;
  }
});

Template.viewModelRecursiveFinal.viewmodel({
  registerClick() {
    console.log('Clicked!');
  }
});

Template.viewModelRecursive.viewmodel({
  mixin: 'timeLogger'
});

Template.viewModelOther.viewmodel({
  mixin: 'timeLogger'
});

Template.viewModelTable1.viewmodel({
  mixin: 'timeLogger',

  content() {
    return collections[0].find({}, {sort: {order: 1}});
  }
});

Template.viewModelTable2.viewmodel({
  mixin: 'timeLogger',

  content() {
    return collections[1].find({}, {sort: {order: 1}});
  }
});

Template.viewModelTable3.viewmodel({
  mixin: 'timeLogger',

  content() {
    return collections[2].find({}, {sort: {order: 1}});
  }
});

Template.viewModelMain.viewmodel({
  selectedOther() {
    return this.selection() === 'other';
  },
  selectedRecursive() {
    return this.selection() === 'recursive';
  },
  selectedTable1() {
    return this.selection() === 'table1';
  },
  selectedTable2() {
    return this.selection() === 'table2';
  },
  selectedTable3() {
    return this.selection() === 'table3';
  },
});

export default class {
  static getId() {
    return 'viewmodel';
  }

  static getName() {
    return 'ViewModel';
  }

  constructor(parent, before) {
    this.selection = new ReactiveVar(null);
    this.view = Blaze.renderWithData(Template.viewModelMain, () => {
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