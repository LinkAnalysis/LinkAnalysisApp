import circular from "graphology-layout/circular"
import random from "graphology-layout/random"
import circlepack from "graphology-layout/circlepack"
import forceAtlas2 from "graphology-layout-forceatlas2"
import * as d3 from "d3-hierarchy"
import * as d3f from "d3-force-3d"
import { LogPrint } from "../../wailsjs/runtime/runtime"

export const layouts = {
  random: {
    apply: (graph, params = {}) => {
      random.assign(graph)
    },
    defaultParams: {},
  },
  circular: {
    apply: (graph, params = {}) => circular.assign(graph),
    defaultParams: {},
  },
  forceAtlas2: {
    apply: (graph, params = {}) => {
      circular.assign(graph)
      forceAtlas2.assign(graph, params)
    },
    defaultParams: {
      iterations: 1000,
      gravity: 1,
      scalingRatio: 1,
      strongGravityMode: false,
    },
  },
  circlepack: {
    apply: (graph, params = {}) => {
      circlepack.assign(graph)
    },
    defaultParams: {},
  },
  d3tree: {
    apply: (graph, params = {}) => {
      const rootId = params.rootId
      //const rootId = graph.nodes()[Math.floor(Math.random() * graph.nodes().length)];
      LogPrint(rootId)
      const d3root = buildD3Hierarchy(graph, rootId)
      const treeLayout = d3.tree().nodeSize([50, 50])
      const tree = treeLayout(d3root)
      tree.descendants().forEach(d => {
        graph.mergeNodeAttributes(d.data.id, { x: d.x, y: d.y })
      })
    },
    defaultParams: { rootId: 0 },
  },
  radial: {
    apply: (graph, params = {}) => {
      //const rootId = graph.nodes()[Math.floor(Math.random() * graph.nodes().length)];
      const rootId = params.rootId
      const d3root = buildD3Hierarchy(graph, rootId)
      const d3cluster = d3.cluster().size([2 * Math.PI, 100])
      const d3layout = d3cluster(d3root)
      d3layout.descendants().forEach(d => {
        const radius = d.y
        const angle = d.x
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        graph.mergeNodeAttributes(d.data.id, { x, y })
      })
    },
    defaultParams: { rootId: 0 },
  },
  force: {
    apply: (graph, params = {}) => {
      const nodes = []
      const links = []

      graph.forEachNode((key, attrs) => {
        nodes.push({ id: key })
      })
      graph.forEachEdge((key, source, target) => {
        links.push({ source, target })
      })

      const width = 1000
      const height = 1000
      const depth = 600

      const simulation = d3f
        .forceSimulation(nodes)
        .force("charge", d3f.forceManyBody().strength(-10))
        .force(
          "link",
          d3f
            .forceLink(links)
            .id(d => d.id)
            .distance(1000),
        )
        .force("center", d3f.forceCenter(0, 0, 0))
        .stop()

      const ticks = 600
      for (let i = 0; i < ticks; i++) {
        simulation.tick()
      }
      nodes.forEach(({ id, x, y, z }) => {
        graph.mergeNodeAttributes(id, { x, y, z, size: 5 })
      })
    },
    defaultParams: {},
  },
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
