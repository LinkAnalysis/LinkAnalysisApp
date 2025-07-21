import { computed } from "vue"

export function useGraphElements(graphRef) {
  const nodes = computed(() => {
    if (!graphRef.value) return []

    return graphRef.value.nodes().map(nodeId => {
      const attrs = graphRef.value.getNodeAttributes(nodeId)
      return {
        id: nodeId,
        label: attrs.label ?? "",
        ...attrs,
      }
    })
  })

  const edges = computed(() => {
    if (!graphRef.value) return []

    return graphRef.value.edges().map(edgeId => {
      const attrs = graphRef.value.getEdgeAttributes(edgeId)
      const source = graphRef.value.source(edgeId)
      const target = graphRef.value.target(edgeId)
      return {
        id: edgeId,
        source,
        target,
        label: attrs.label ?? "",
        ...attrs,
      }
    })
  })

  return { nodes, edges }
}
