import React from 'react'
import Card from './Card'
import * as d3 from 'd3'

const VIEWBOX_WIDTH = 4096;
const VIEWBOX_HEIGHT = 2048;
const MIN_NODE_RADIUS = 15;
const NODE_RADIUS_SCALE = 1.5;

function calcRadius(n) {
  return Math.sqrt(n.in_degree) * NODE_RADIUS_SCALE + MIN_NODE_RADIUS;
}

const TEST_GRAPH = {
  nodes: [
    {id:"a", name: "a", in_degree: 29, category: 1},
    {id:"b", name: "b", in_degree: 3, category: 2},
    {id:"c", name: "c", in_degree: 5, category: 0},
    {id:"d", name: "d", in_degree: 150, category: 1}
  ],
  edges: [
    {source:"a", target: "b", label: "n"},
    {source:"a", target: "c", label: "m"},
    {source:"b", target: "c", label: "o"}
  ]
};

class Digraph extends React.Component {
  constructor(props) {
    super(props);
    this.graphRef = React.createRef();
    this.updateGraph = this.updateGraph.bind(this);
  }

  updateGraph() {
    const graphRoot = d3.select(this.graphRef.current);
    //const graphData = TEST_GRAPH;
    const graphData = this.props.graphData;

    // Generate the base elements in the svg for edges and nodes.
    const edge = graphRoot.select(".edges").selectAll("line")
      .data(graphData.edges).enter()
      .append("line")
      .attr("stroke-width", d => 10 );

    edge.exit().remove();

    const node = graphRoot.select(".nodes").selectAll("g")
      .data(graphData.nodes)
      .enter().append("g");
    node.exit().remove();

    // Draw the circles representing the nodes. They are also the drag
    // locations.
    const categories = [...new Set(graphData.nodes.map(n => n.category))];
    const in_degrees = graphData.nodes.map(n => n.in_degree).sort();
    const category_color = d3.scaleOrdinal().domain(categories).range(d3.schemeCategory10);
    const circles = node.append("circle")
        .attr("r", n => calcRadius(n))
        .attr("fill", n => category_color(n.category))
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
        .attr('x', n => calcRadius(n) + 6)
        .attr('y', n => calcRadius(n) + 3);

    node.append("title")
      .text(d=> d.name);

    const ticked = () => {
      edge
        .attr("x1", e => e.source.x)
        .attr("y1", e => e.source.y)
        .attr("x2", e => e.target.x)
        .attr("y2", e => e.target.y);

      node
        .attr("transform", n => {
          const radius = calcRadius(n);
          const new_x = Math.max(MIN_NODE_RADIUS, Math.min(n.x, VIEWBOX_WIDTH - radius));
          const new_y = Math.max(MIN_NODE_RADIUS, Math.min(n.y, VIEWBOX_HEIGHT - radius));
          return "translate(" + new_x + "," + new_y + ")";
        });
    };

    const bandScale = d3.scaleBand()
      .domain(categories)
      .range([0, VIEWBOX_WIDTH])
      .paddingOuter(.2);
    this.simulation = d3.forceSimulation()
      .force("x", d3.forceX().x(n => bandScale(n.category)).strength(1))
      .force("charge", d3.forceManyBody().strength(n => -(calcRadius(n) * 2)))
      .force("link", d3.forceLink().id(n => n.id).strength(l => 0.2 / (l.source.in_degree + l.target.in_degree)))
      ;

    this.simulation
        .nodes(graphData.nodes)
        .on("tick", ticked);

    this.simulation.force("link")
        .links(graphData.edges);
  }

  componentDidMount() {
    // Create the initial 2 SVG groups for edges and nodes.
    const graphRoot = d3.select(this.graphRef.current);
    const view = graphRoot.append("g");
    view.append("g").attr("class", "edges");
    view.append("g").attr("class", "nodes");

    const zoomed = () => {
      graphRoot.select('.view').attr("transform", d3.event.transform);
    };

    const zoom = d3.zoom()
      .scaleExtent([1, 40])
      .translateExtent([[-100, -100], [VIEWBOX_WIDTH + 90, VIEWBOX_HEIGHT + 100]])
      .on("zoom", zoomed);
    graphRoot.call(zoom);
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  render() {
    return (
      <Card title="Shows mojo connections. Nodes are classes. Edges are mojom interfaces.">
        <svg preserveAspectRatio="xMinYMin meet" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} className="main-graph" ref={this.graphRef} />
      </Card>
    );
  }
}

export default Digraph;
