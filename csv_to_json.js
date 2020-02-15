const fs = require('fs')
const parse = require('csv-parse')
const transform = require('stream-transform')

const graph = [];
const filename = process.argv[2];

// Produces an adjacency list based graph with direct java object relations.
async function parseGraph(filename) {
  let next_node_id = 1;  // Useful for a simple identifier.
  const ticket_node_map = {};

  const addNode = (n, raw_var_node) => {
    let node = ticket_node_map[n.ticket];
    if (node !== undefined) {
    } else {
      const new_node = {
        node_id: `n${next_node_id++}`,
        name: n['qualified_name'],
        path: n['location']['path'],
        in_edges: [],
        out_edges: [],
        raw_node: n,
        var_nodes: {}
      };
      node =  ticket_node_map[n.ticket] = new_node;
    }

    node.var_nodes[raw_var_node.ticket] = raw_var_node;
    return node;
  }

  const addEdge = (record, cb) => {
    const receiver_container = JSON.parse(record['receiver_container']);
    const remote_container = JSON.parse(record['remote_container']);
    const mojom_type = JSON.parse(record['mojom_type']);
    const remote = JSON.parse(record['remote']);
    const receiver = JSON.parse(record['receiver']);

    const source_node = addNode(remote_container, remote);
    const target_node = addNode(receiver_container, receiver);
    source_node.out_edges.push({
      target: target_node,
      mojom_type: mojom_type['qualified_name'],
      raw_mojom_type: mojom_type
    });
    target_node.in_edges.push({
      source: source_node,
      mojom_type: mojom_type['qualified_name'],
      raw_mojom_type: mojom_type
    });

    cb();
  };

  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filename);
    stream.on('error', (err) => reject(err));
    stream.on('end', () => {
      resolve(Object.values(ticket_node_map));
    });

    const parser = parse({columns: true});
    stream.pipe(parser).pipe(transform(addEdge));
  });
}

// Stuff in a function just so I can use await.
async function main() {
  if (!filename) {
    console.log(`Usage: node ${process.argv[0]} ${process.argv[1]} <in.csv>`);
    return 1;
  }

  const graph = await parseGraph(process.argv[2]);

  const getCategory = (path) => {
    if (path.includes('/browser/')) {
      return 1;
    } else if (path.includes('/renderer/')) {
      return 2;
    } else if (path.includes('/services/network/')) {
      return 3;
    }

    return 0;
  };

  // Example.
  // "src/chrome/browser/signin/chrome_signin_proxying_url_loader_factory.cc"
  const d3_graph = {nodes:[], edges:[]};
  graph.forEach((node) => {
    d3_graph.nodes.push({
      id: node.node_id,
      name: node.name,
      path: node.path,
      category: getCategory(node.path),
      component: node.path.split('/').splice(1,2).join('/'),
    });

    node.out_edges.forEach(e => {
      d3_graph.edges.push({
        source: node.node_id,
        target: e.target.node_id,
        label: e.mojom_type,
      });
    });
  });

  console.log(JSON.stringify(d3_graph, null, 2));
}

main();
