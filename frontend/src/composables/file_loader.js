import Papa from "papaparse"
import Graph from "graphology"
import circular from "graphology-layout/circular"
import { ReadTextFile } from "../../wailsjs/go/main/App"
import { layouts } from "./layouts"

export function parseCSV(filename) {
  return new Promise((resolve, reject) => {
    Papa.parse(filename, {
      header: true,
      delimiter: ",",
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error: error => reject(error),
    })
  })
}

// constructs the graphology Graph from the node and edge files
export async function load_graph(node_file, edge_file) {
  const graph = new Graph()

  const edges = await parseCSV(await ReadTextFile(edge_file))

  if (node_file) {
    const nodes = await parseCSV(await ReadTextFile(node_file))
    nodes.forEach(({ id, Description }) =>
      graph.addNode(id, { label: Description, size: 20, x: 0, y: 0 }),
    )
  } else {
    const added = new Set()
    edges.forEach(({ x, y }) => {
      if (!added.has(x)) {
        graph.addNode(x, { size: 20, x: 0, y: 0 })
        added.add(x)
      }
      if (!added.has(y)) {
        graph.addNode(y, { size: 20, x: 0, y: 0 })
        added.add(y)
      }
    })
  }

  edges.forEach(({ x, y, edgeWeight, edgeLabel }) => {
    const w = parseInt(edgeWeight)
    graph.addEdge(x, y, {
      label: edgeLabel,
      weight: w,
      size: w,
      color: "#000000",
    })
  })
  
  return graph
}

export function apply_layout(graph, layout = "circular", layoutParams = {}) {
  let entry = layouts[layout] ?? layouts.circular
  const params = { ...entry.defaultParams, ...layoutParams }
  entry.apply(graph, params)
}

export function update_graph_nodes(graph, nodes_csv) {
  nodes_csv.forEach(line => {
    graph.mergeNode(line.id, { label: line.Description, size: 15, x: 0, y: 0 })
  })

  circular.assign(graph)

  return graph
}

export function update_graph_edges(graph, edges_csv) {
  graph.clearEdges()
  edges_csv.forEach(line => {
    const w = parseInt(line.edgeWeight)
    graph.mergeNode(line.x, { size: 15, x: 0, y: 0 })
    graph.mergeNode(line.y, { size: 15, x: 0, y: 0 })
    graph.addEdge(line.x, line.y, {
      label: line.edgeLabel,
      weight: w,
      size: w,
      color: "#000000",
    })
  })
  circular.assign(graph)

  return graph
}
