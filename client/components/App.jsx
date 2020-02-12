import React from 'react'

import Control from './Control'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: {},
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
          </div>
          <Control data={this.state.graph} />
        </header>
        <div>
          <section className="title-details">
          Shows mojo connections. Nodes are classes. Edges are mojom interfaces.
          </section>
          <div className="main-graph">
          </div>
        </div>
      </main>
    );
  }
}

export default App;
