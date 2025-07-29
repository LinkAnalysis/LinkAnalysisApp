export function applyStyleOptions(graph, opts) {
  graph.forEachNode((id, a) => {
    if (!a.highlighted) {
      graph.setNodeAttribute(id, "color", opts.nodeColor)
    }
    graph.setNodeAttribute(id, "size", opts.nodeSize)
  })
  graph.forEachEdge((e, a) => {
    if (!a.highlighted) {
      graph.setEdgeAttribute(e, "color", opts.edgeColor)
    }
    const w = opts.useEdgeWeights && a.weight ? a.weight : 1
    graph.setEdgeAttribute(e, "size", opts.edgeSize * w)
  })
  if (opts.nodeResize) {
    let minNumOfNeighbors = Infinity
    let maxNumOfNeighbors = 0
    graph.forEachNode(id => {
      const d = graph.degree(id)
      if (d > maxNumOfNeighbors) {
        maxNumOfNeighbors = d
      } else if (d < minNumOfNeighbors) {
        minNumOfNeighbors = d
      }
    })
    const span = maxNumOfNeighbors - minNumOfNeighbors || 1
    graph.forEachNode((id, a) => {
      const d = graph.degree(id)
      const newSize =
        opts.minNodeSize +
        ((d - minNumOfNeighbors) / span) * (opts.maxNodeSize - opts.minNodeSize)
      graph.setNodeAttribute(id, "size", newSize)
    })
  }
}
