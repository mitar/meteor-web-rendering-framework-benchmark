import profile from '../profile';
import collections from '../collections';
import text from '../text';

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

function renderRecursive() {
  return renderRecursiveContent(6);
}

function renderTable(collection) {
  const table = document.createElement('table');
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
    table.appendChild(row);
  });
  return table;
}

export default class {
  static getId() {
    return 'manual';
  }

  static getName() {
    return "Manual DOM";
  }

  constructor(parent, before) {
    this.parent = parent;
    this.before = before;
    this.currentDomElement = null;
  }

  _insertElement(element) {
    this.cleanup();
    this.parent.insertBefore(element, this.before);
    this.currentDomElement = element;
  }

  render(selection) {
    if (selection === 'other') {
      const p = document.createElement('p');
      p.textContent = text;
      this._insertElement(p);
      profile.logTime();
    }
    else if (selection === 'recursive') {
      const ul = renderRecursive();
      this._insertElement(ul);
      profile.logTime();
    }
    else if (selection === 'table1') {
      const table = renderTable(collections[0]);
      this._insertElement(table);
      profile.logTime();
    }
    else if (selection === 'table2') {
      const table = renderTable(collections[1]);
      this._insertElement(table);
      profile.logTime();
    }
    else if (selection === 'table3') {
      const table = renderTable(collections[2]);
      this._insertElement(table);
      profile.logTime();
    }
    else {
      this.cleanup();
    }
  }

  cleanup() {
    if (this.currentDomElement) {
      this.currentDomElement.remove();
      this.currentDomElement = null;
    }
  }
}