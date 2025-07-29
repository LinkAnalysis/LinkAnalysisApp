import circular from "graphology-layout/circular"
import random from "graphology-layout/random"
import circlepack from "graphology-layout/circlepack"
import forceAtlas2 from "graphology-layout-forceatlas2"
import FA2Layout from "graphology-layout-forceatlas2/worker"
import ForceSupervisor from "graphology-layout-force/worker"
import forceLayout from "graphology-layout-force"
import noverlap from "graphology-layout-noverlap"
import NoverlapLayout from "graphology-layout-noverlap/worker"
import * as d3 from "d3-hierarchy"
import * as d3f from "d3-force-3d"

export function normalizeGraphCoordinates(graph) {
  let xMin = Infinity,
    xMax = -Infinity
  let yMin = Infinity,
    yMax = -Infinity

  graph.forEachNode((_, attrs) => {
    const x = attrs.x
    const y = attrs.y

    if (x < xMin) xMin = x
    if (x > xMax) xMax = x
    if (y < yMin) yMin = y
    if (y > yMax) yMax = y
  })

  graph.forEachNode(n => {
    const attrs = graph.getNodeAttributes(n)
    const newX = (attrs.x - xMin) / (xMax - xMin)
    const newY = (attrs.y - yMin) / (yMax - yMin)
    graph.mergeNodeAttributes(n, { x: newX, y: newY })
  })
}

export const layouts = {
  random: {
    apply: (graph, params = {}) => {
      random.assign(graph)
    },
    defaultParams: {},
  },
  circular: {
    apply: (graph, params = {}) => {
      circular.assign(graph)
    },
    defaultParams: {},
  },
  circlepack: {
    apply: (graph, params = {}) => {
      circlepack.assign(graph)
    },
    defaultParams: {},
  },
  noverlap: {
    apply: (graph, params) => {
      noverlap.assign(graph, params)
    },
    simulate: (graph, params = {}) => {
      const worker = new NoverlapLayout(graph, {
        isNodeFixed: (_, attr) => attr.fixed,
        ...params,
      })
      worker.stop()
      return worker
    },
    defaultParams: {
      maxIterations: 50,
      settings: {
        gridSize: 20,
        margin: 5,
        expansion: 1.1,
        ratio: 1.0,
        speed: 3,
      },
    },
  },
  forceAtlas2: {
    apply: (graph, params = {}) => {
      forceAtlas2.assign(graph, params)
    },
    simulate: (graph, params = {}) => {
      const worker = new FA2Layout(graph, {
        isNodeFixed: (_, attr) => attr.fixed,
        ...params,
      })
      worker.start()
      return worker
    },
    defaultParams: {
      iterations: 1000,
      settings: {
        gravity: 1,
        scalingRatio: 100,
        strongGravityMode: false,
        adjustSizes: true,
      },
    },
  },
  forceLayout: {
    apply: (graph, params = {}) => {
      forceLayout.assign(graph, params)
    },
    simulate: (graph, params = {}) => {
      const worker = new ForceSupervisor(graph, {
        isNodeFixed: (_, attr) => attr.fixed,
        ...params,
      })
      worker.stop()
      return worker
    },
    defaultParams: {
      maxIterations: 100,
      settings: {
        attraction: 0.0005,
        repulsion: 0.1,
        gravity: 0.0001,
        inertia: 0.6,
      },
    },
  },

  d3force: {
    apply: (graph, params) => {
      const nodes = []
      const links = []
      normalizeGraphCoordinates(graph)

      graph.forEachNode((key, attrs) => {
        nodes.push({ id: key, x: attrs.x, y: attrs.y, vx: 0, vy: 0 })
      })

      graph.forEachEdge((key, source, target) => {
        links.push({ source, target })
      })

      const sim = d3f
        .forceSimulation(nodes)
        .force(
          "link",
          d3f
            .forceLink(links)
            .id(d => d.id)
            .distance(params.nodesDistance),
        )
        .force("charge", d3f.forceManyBody().strength(params.chargeForce))
        .force("center", d3f.forceCenter(0.5, 0.5).strength(params.centerForce))
        .force("collide", d3f.forceCollide(params.collideForce))
        .stop()

      for (let i = 0; i < params.iterations; i++) {
        sim.tick()
      }

      nodes.forEach(({ id, x, y }) => {
        graph.mergeNodeAttributes(id, { x, y })
      })
      normalizeGraphCoordinates(graph)
    },
    defaultParams: {
      iterations: 100,
      nodesDistance: 0.1,
      chargeForce: -0.1,
      centerForce: -0.1,
      collideForce: -0.1,
    },
  },
  tree: {
    apply: (graph, params) => {
      const rootId = selectRootFromParams(graph, params)
      if (!rootId) {
        return
      }
      const d3root = buildD3Hierarchy(graph, rootId)
      const treeLayout = d3.tree().nodeSize([0.8, 0.8])
      const tree = treeLayout(d3root)
      tree.descendants().forEach(d => {
        graph.mergeNodeAttributes(d.data.id, { x: -d.x, y: -d.y })
      })
    },
    defaultParams: {
      rootSelectOptions: {
        optionsList: [
          { name: "rootId", type: "text", value: null },
          { name: "maxDegree", value: null },
          { name: "minDegree", value: null },
          { name: "random", value: null },
        ],
        selected: { name: "random", value: null },
      },
    },
  },
  radial: {
    apply: (graph, params) => {
      const rootId = selectRootFromParams(graph, params)
      if (!rootId) {
        return
      }

      const d3root = buildD3Hierarchy(graph, rootId)
      const d3cluster = d3.cluster().size([2 * Math.PI, 0.8])
      const d3layout = d3cluster(d3root)
      d3layout.descendants().forEach(d => {
        const radius = d.y
        const angle = d.x
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        graph.mergeNodeAttributes(d.data.id, { x, y })
      })
    },
    defaultParams: {
      rootSelectOptions: {
        optionsList: [
          { name: "rootId", type: "text", value: null },
          { name: "maxDegree", value: null },
          { name: "minDegree", value: null },
          { name: "random", value: null },
        ],
        selected: { name: "random", value: null },
      },
    },
  },
}

function selectRootFromParams(graph, params) {
  const rootSelectionName = params?.rootSelectOptions?.selected?.name
  if (!rootSelectionName) return null
  const rootSelectionValue = params?.rootSelectOptions?.selected?.value
  let rootId = null
  if (rootSelectionName === "rootId" && graph.hasNode(rootSelectionValue)) {
    rootId = rootSelectionValue
  }
  if (rootSelectionName === "random") {
    rootId = graph.nodes()[Math.floor(Math.random() * graph.nodes().length)]
  }
  if (rootSelectionName == "maxDegree") {
    let maxDegree = -1
    let maxNode = null
    graph.forEachNode(node => {
      const degree = graph.degree(node)
      if (degree > maxDegree) {
        maxDegree = degree
        maxNode = node
      }
    })
    rootId = maxNode
  }
  if (rootSelectionName == "minDegree") {
    let minDegree = graph.order + 1
    let minNode = null
    graph.forEachNode(node => {
      const degree = graph.degree(node)
      if (degree < minDegree) {
        minDegree = degree
        minNode = node
      }
    })
    rootId = minNode
  }
  return rootId
}

function buildD3Hierarchy(graph, rootId) {
  const visited = new Set()
  const buildNode = id => {
    visited.add(id)
    const children = []
    graph.forEachOutboundNeighbor(id, neighbor => {
      if (!visited.has(neighbor)) children.push(buildNode(neighbor))
    })
    return { id, children }
  }
  const hierarchyData = buildNode(rootId)
  return d3.hierarchy(hierarchyData, d => d.children)
}
