import Papa from "papaparse"
import Graph from "graphology"
import circular from "graphology-layout/circular"
import { ReadTextFile, ReadTextFileAntiMoney } from "../../wailsjs/go/main/App"
import { layouts } from "./layouts"
import { useTabsStore } from "../stores/tabsStore"
import { storeToRefs } from "pinia"
import { parse } from "graphology-gexf"

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

export function parseAntiMoneyLaunderingCSV(filename) {
  return new Promise((resolve, reject) => {
    Papa.parse(filename, {
      header: true,
      delimiter: ",",
      skipEmptyLines: true,
      worker: true,
      complete: results => {
        const transformed = results.data.map(row => ({
          x: `${row["From Bank"]}-${row["Account"]}`,
          y: `${row["To Bank"]}-${row["Account_1"]}`,
          Timestamp: row["Timestamp"],
          fromBank: row["From Bank"],
          fromAccount: row["Account"],
          toBank: row["To Bank"],
          toAccount: row["Account_1"],
          AmountReceived: row["Amount Received"],
          ReceivingCurrency: row["Receiving Currency"],
          AmountPaid: row["Amount Paid"],
          PaymentCurrency: row["Payment Currency"],
          PaymentFormat: row["Payment Format"],
        }))
        resolve(transformed)
      },
      error: error => reject(error),
    })
  })
}

// constructs the graphology Graph from the node and edge files
export async function load_graph(node_file, edge_file, graphMode) {
  let graph = new Graph({ multi: true })
  if (graphMode === "normal") {
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
  } else if (graphMode === "antiMoneyLaundering") {
    const { selectedNumberOfRows } = storeToRefs(useTabsStore())
    const edges = await parseAntiMoneyLaunderingCSV(
      await ReadTextFileAntiMoney(edge_file, selectedNumberOfRows.value),
    )

    const added = new Set()
    edges.forEach(({ x, y, fromBank, fromAccount, toBank, toAccount }) => {
      if (!added.has(x)) {
        graph.addNode(x, {
          label: `Bank: ${fromBank} Account: ${fromAccount}`,
          size: 20,
          x: 0,
          y: 0,
        })
        added.add(x)
      }
      if (!added.has(y)) {
        graph.addNode(y, {
          label: `Bank: ${toBank} Account: ${toAccount}`,
          size: 20,
          x: 0,
          y: 0,
        })
        added.add(y)
      }
    })

    let maxWeight = 0
    let minWeight = Infinity
    edges.forEach(({ AmountPaid }) => {
      const w = parseInt(AmountPaid)
      if (w > maxWeight) maxWeight = w
      if (w < minWeight) minWeight = w
    })

    edges.forEach(({ x, y, AmountPaid, PaymentCurrency, Timestamp }) => {
      const w = parseInt(AmountPaid)
      const normalized = 1 + (9 * (w - minWeight)) / (maxWeight - minWeight)
      graph.addEdge(x, y, {
        label: Timestamp + ": " + AmountPaid + " " + PaymentCurrency,
        weight: normalized,
        size: normalized,
        color: "#000000",
      })
    })
  } else if (graphMode === "gexf") {
    const gexfContent = await ReadTextFile(edge_file)
    graph = parse(Graph, gexfContent)
    graph.forEachNode((node, attrs) => {
      if (typeof attrs.x === "number" && typeof attrs.y === "number") {
        graph.setNodeAttribute(node, "x", attrs.x / 1000)
        graph.setNodeAttribute(node, "y", attrs.y / 1000)
      }
    })
  }
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
