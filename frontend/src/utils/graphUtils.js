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
}
