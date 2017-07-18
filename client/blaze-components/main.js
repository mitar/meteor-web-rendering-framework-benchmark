import { Blaze } from 'meteor/blaze';
import { BlazeComponent } from 'meteor/peerlibrary:blaze-components';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import profile from '../profile';
import collections from '../collections';

import './main.html';

class Other extends BlazeComponent {
  onRendered() {
    profile.logTime();
  }
}

Other.register('BlazeComponents.Other');

class RenderTable extends BlazeComponent {
  constructor(content) {
    super();
    this.content = content;
  }
}

RenderTable.register('BlazeComponents.RenderTable');

class RenderTableRow extends BlazeComponent {
}

RenderTableRow.register('BlazeComponents.RenderTableRow');

class RenderTableCell extends BlazeComponent {
  clicked(event) {
    console.log('Clicked!');
  }
}

RenderTableCell.register('BlazeComponents.RenderTableCell');

class Recursive extends BlazeComponent {
  onRendered() {
    profile.logTime();
  }
}

Recursive.register('BlazeComponents.Recursive');

class RecursiveContent extends BlazeComponent {
  constructor(kwargs) {
    super();
    this.depth = kwargs.hash.depth;
  }

  nextDepth() {
    return this.depth - 1;
  }
}

RecursiveContent.register('BlazeComponents.RecursiveContent');

class RecursiveFinal extends BlazeComponent {
  clicked(event) {
    console.log('Clicked!');
  }
}

RecursiveFinal.register('BlazeComponents.RecursiveFinal');

class Table1 extends BlazeComponent {
  onRendered() {
    profile.logTime();
  }

  content() {
    return collections[0].find({}, {sort: {order: 1}});
  }
}

Table1.register('BlazeComponents.Table1');

class Table2 extends BlazeComponent {
  onRendered() {
    profile.logTime();
  }

  content() {
    return collections[1].find({}, {sort: {order: 1}});
  }
}

Table2.register('BlazeComponents.Table2');

class Table3 extends BlazeComponent {
  onRendered() {
    profile.logTime();
  }

  content() {
    return collections[2].find({}, {sort: {order: 1}});
  }
}

Table3.register('BlazeComponents.Table3');

class Main extends BlazeComponent {
  selectedOther() {
    return this.data('selection') === 'other';
  }

  selectedRecursive() {
    return this.data('selection') === 'recursive';
  }

  selectedTable1() {
    return this.data('selection') === 'table1';
  }

  selectedTable2() {
    return this.data('selection') === 'table2';
  }

  selectedTable3() {
    return this.data('selection') === 'table3';
  }
}

Main.register('BlazeComponents.Main');

export default class {
  static getId() {
    return 'blaze-components';
  }

  static getName() {
    return "Blaze Components";
  }

  constructor(parent, before) {
    this.selection = new ReactiveVar(null);
    this.view = Blaze.renderWithData(Main.renderComponent(), () => {
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