import Papa from "papaparse"
import Graph from "graphology"
//import fs from "fs"
import circular from "graphology-layout/circular"
import { ReadTextFile } from "../../wailsjs/go/main/App"
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

// constructs the graphology Graph from the node and edge files
export async function load_graph(node_file, edge_file) {
  const graph = new Graph()

  const csv_e = await ReadTextFile(edge_file)
  const edges = await parseCSV(csv_e)

  if (node_file) {
    const csv_n = await ReadTextFile(node_file)
    const nodes = await parseCSV(csv_n)
    nodes.forEach(line => {
      const id = line.id
      const description = line.Description
      graph.addNode(id, { label: description, size: 20 })
    })
  } else {
    const added = new Set()
    edges.forEach(line => {
      const first_vertex = line.x
      const second_vertex = line.y
      if (!added.has(first_vertex)) {
        graph.addNode(first_vertex, { size: 20 })
        added.add(first_vertex)
      }
      if (!added.has(second_vertex)) {
        graph.addNode(second_vertex, { size: 20 })
        added.add(second_vertex)
      }
    })
  }

  edges.forEach(line => {
    const w = parseInt(line.edgeWeight)
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
