import Papa from "papaparse"
import Graph from "graphology"
//import fs from "fs"
import circular from "graphology-layout/circular"

export function parseCSV(filename) {
  return new Promise((resolve, reject) => {
    //const file = fs.readFileSync(filename, "utf8")
    Papa.parse(filename, {
      header: true,
      delimiter: ",",
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error: error => reject(error),
    })
  })
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
