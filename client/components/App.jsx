import React from 'react'

import Control from './Control'
import Digraph from './Digraph'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: {nodes:[], links:[]},
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(theEvent) {
  }

  componentDidMount() {
    fetch("data/graph.json")
    .then(response => response.json())
    .then(data => {
      this.setState({graph: data});
    });
  }

  render() {
    return (
      <main className="app-main">
        <header className="mdc-toolbar top-bar">
          <div className="title-box">
            <h4 className="title">Mojo Visualizer</h4>
            <Control data={this.state.graph} />
          </div>
        </header>
        <div>
          <section className="title-details">
          Shows mojo connections. Nodes are classes. Edges are mojom interfaces.
          </section>
          <Digraph graphData={this.state.graph} />
        </div>
      </main>
    );
  }
}

export default App;
