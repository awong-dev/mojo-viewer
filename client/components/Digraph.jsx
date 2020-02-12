import React from 'react'
import * as d3 from 'd3'

const viewboxWidth = 2048;
const viewboxHeight = 1024;

class Digraph extends React.Component {
  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
    this.updateGraph = this.updateGraph.bind(this);
  }

  updateGraph() {
    const graphRoot = d3.select(this.graphRef.current);
    const testGraph = {
      nodes: [
        {id:"a"},
        {id:"b"},
        {id:"c"},
        {id:"d"}
      ],
      links: [
        {source:"a", target: "b"},
        {source:"a", target: "c"},
        {source:"b", target: "c"}
      ]
    };
    const graphData = this.props.graphData;

    // Generate the base elements in the svg for links and nodes.
    const link = graphRoot.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graphData.links)
      .enter().append("line")
      .attr("stroke-width", d => 5 );

    const node = graphRoot.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graphData.nodes)
      .enter().append("g");

    // Draw the circles around the nodes.
    const circles = node.append("circle")
        .attr("r", 5)
        .call(d3.drag()
        .on("start", d => {
          if (!d3.event.active)
            this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", d => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on("end", d => {
          if (!d3.event.active)
            this.simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Put labels on the node too, slightly offset.
    const labels = node.append("text")
        .text(d => d.name)
        .attr('x', 6)
        .attr('y', 3);

    node.append("title")
      .text(d=> d.name);

    const ticked = () => {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node
        .attr("transform", d => {
          return "translate(" + d.x + "," + d.y + ")";
        });
    };

    this.simulation
        .nodes(graphData.nodes)
        .on("tick", ticked);

    this.simulation.force("link")
        .links(graphData.links);
  }

  componentDidMount() {
    this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.id))
      .force("collide", d3.forceCollide(40))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(viewboxWidth / 2, viewboxHeight / 2));
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  render() {
    return (
      <svg preserveAspectRatio="xMinYMin meet" viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`} className="main-graph" ref={this.graphRef} />
    );
  }
}

export default Digraph;
