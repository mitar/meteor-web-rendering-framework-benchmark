import { createContainer } from 'meteor/react-meteor-data';

import React from 'react';
import ReactDOM from 'react-dom';

import profile from '../profile';
import collections from '../collections';
import text from '../text';

class RenderTableCell extends React.Component {
  onClick(event) {
    console.log('Clicked!');
  }

  render() {
    return (
      <td><button onClick={this.onClick}>{this.props.cell.value}</button></td>
    );
  }
}

class RenderTableRow extends React.Component {
  render() {
    const cells = [];
    this.props.row.forEach((doc, i) => {
      cells.push(
        <RenderTableCell cell={doc.cell} key={doc._id} />
      );
    });
    return (
      <tr>
        {cells}
      </tr>
    );
  }
}

class RenderTable extends React.Component {
  render() {
    const rows = [];
    this.props.content.forEach((doc, i) => {
      rows.push(
        <RenderTableRow row={doc.row} key={doc._id} />
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

const RenderTableContainer = createContainer(({collectionId}) => {
  return {
    content: collections[collectionId].find({}, {sort: {order: 1}}).fetch()
  }
}, RenderTable);

class Table1 extends React.Component {
  componentDidMount() {
    profile.logTime();
  }

  componentDidUpdate() {
    profile.logTime();
  }

  render() {
    return (
      <RenderTableContainer collectionId={0} />
    );
  }
}

class Table2 extends React.Component {
  componentDidMount() {
    profile.logTime();
  }

  componentDidUpdate() {
    profile.logTime();
  }

  render() {
    return (
      <RenderTableContainer collectionId={1} />
    );
  }
}

class Table3 extends React.Component {
  componentDidMount() {
    profile.logTime();
  }

  componentDidUpdate() {
    profile.logTime();
  }

  render() {
    return (
      <RenderTableContainer collectionId={2} />
    );
  }
}

class Other extends React.Component {
  componentDidMount() {
    profile.logTime();
  }

  componentDidUpdate() {
    profile.logTime();
  }

  render() {
    return (
      <p>{text}</p>
    );
  }
}

class RecursiveFinal extends React.Component {
  onClick(event) {
    console.log('Clicked!');
  }

  render() {
    return (
      <button onClick={this.onClick}>Bottom!</button>
    )
  }
}

class RecursiveContent extends React.Component {
  render() {
    let content;
    if (this.props.depth) {
      content = [
        <RecursiveContent depth={this.props.depth - 1} key="1" />
      ,
        <RecursiveContent depth={this.props.depth - 1} key="2" />
      ,
        <RecursiveContent depth={this.props.depth - 1} key="3" />
      ,
        <RecursiveContent depth={this.props.depth - 1} key="4" />
      ,
        <RecursiveContent depth={this.props.depth - 1} key="5" />
      ];
    }
    else {
      content = (
        <RecursiveFinal />
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

class Recursive extends React.Component {
  componentDidMount() {
    profile.logTime();
  }

  componentDidUpdate() {
    profile.logTime();
  }

  render() {
    return (
      <RecursiveContent depth="6" />
    )
  }
}

class Main extends React.Component {
  render() {
    if (this.props.selection === 'other') {
      return (
        <Other />
      )
    }
    else if (this.props.selection === 'recursive') {
      return (
        <Recursive />
      )
    }
    else if (this.props.selection === 'table1') {
      return (
        <Table1 />
      )
    }
    else if (this.props.selection === 'table2') {
      return (
        <Table2 />
      )
    }
    else if (this.props.selection === 'table3') {
      return (
        <Table3 />
      )
    }
    else {
      return (null);
    }
  }
}

export default class {
  static getId() {
    return 'stateful-react';
  }

  static getName() {
    return "Stateful React";
  }

  constructor(parent, before) {
    // We place React inside this element.
    this.container = document.createElement('div');
    parent.insertBefore(this.container, before);
    ReactDOM.render(React.createElement(Main, {}), this.container);
  }

  render(selection) {
    ReactDOM.render(React.createElement(Main, {selection: selection}), this.container);
  }

  cleanup() {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container);
      this.container.remove();
      this.container = null;
    }
  }
}