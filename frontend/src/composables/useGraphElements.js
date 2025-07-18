import { computed } from "vue"

export function useGraphElements(graphRef) {
  const nodes = computed(() => (graphRef.value ? graphRef.value.nodes() : []))

  const edges = computed(() => (graphRef.value ? graphRef.value.edges() : []))

  return { nodes, edges }
}
