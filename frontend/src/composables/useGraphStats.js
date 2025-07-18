import { computed } from "vue"

export function useGraphStats(graphRef) {
  const nodeCount = computed(() => (graphRef.value ? graphRef.value.order : 0))

  const edgeCount = computed(() => (graphRef.value ? graphRef.value.size : 0))

  return { nodeCount, edgeCount }
}
