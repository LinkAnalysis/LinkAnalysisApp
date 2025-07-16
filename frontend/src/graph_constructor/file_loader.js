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

// constructs the graphology Graph from the node and edge files
export async function load_graph(node_file, edge_file) {
  const graph = new Graph()

  const resp_n = await fetch(node_file)
  const csv_n = await resp_n.text()

  const resp_e = await fetch(edge_file)
  const csv_e = await resp_e.text()

  const nodes = await parseCSV(csv_n)
  const edges = await parseCSV(csv_e)
  console.log(nodes)
  console.log(edges)

  nodes.forEach(line => {
    const id = line.id
    const description = line.Description
    graph.addNode(id, { label: description, size: 20 })
  })

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
