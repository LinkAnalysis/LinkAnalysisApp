import { ref, watch, onScopeDispose } from "vue"

export function useGraphInteractions({ renderer, graph, optionsRef }) {
  const selectedNodeIds = ref(new Set())
  const popupNodeId = ref(null)
  const clickedNodeData = ref(null)
  const popupPosition = ref({ x: 0, y: 0 })

  const highlightedEdges = new Set()
  function updatePopupPosition() {
    if (!renderer.value || !popupNodeId.value) return
    const a = graph.getNodeAttributes(popupNodeId.value)
    const p = renderer.value.graphToViewport({ x: a.x, y: a.y })
    popupPosition.value = { x: p.x, y: p.y }
  }

  function recomputeHighlightedEdges() {
    highlightedEdges.forEach(e => graph.removeEdgeAttribute(e, "highlighted"))
    highlightedEdges.clear()

    selectedNodeIds.value.forEach(nodeId => {
      graph.outEdges(nodeId).forEach(e => {
        graph.setEdgeAttribute(e, "highlighted", true)
        highlightedEdges.add(e)
      })
    })
  }

  function toggleNodeSelection(nodeId) {
    const sel = selectedNodeIds.value

    if (sel.has(nodeId)) {
      sel.delete(nodeId)
      graph.removeNodeAttribute(nodeId, "highlighted")

      if (popupNodeId.value === nodeId) {
        popupNodeId.value = null
        clickedNodeData.value = null
      }
    } else {
      sel.add(nodeId)
      graph.setNodeAttribute(nodeId, "highlighted", true)

      popupNodeId.value = nodeId
      const a = graph.getNodeAttributes(nodeId)
      clickedNodeData.value = {
        id: nodeId,
        description: a.label,
        numOfNeighbors: graph.neighbors(nodeId).length,
      }
      updatePopupPosition()
    }

    recomputeHighlightedEdges()

    if (sel.size === 0) {
      popupNodeId.value = null
      clickedNodeData.value = null
    }
  }

  function clearSelection() {
    selectedNodeIds.value.forEach(id => {
      graph.removeNodeAttribute(id, "highlighted")
    })
    selectedNodeIds.value.clear()

    highlightedEdges.forEach(e => {
      graph.removeEdgeAttribute(e, "highlighted")
    })
    highlightedEdges.clear()

    popupNodeId.value = null
    clickedNodeData.value = null
  }

  function attachListeners(r) {
    if (!r) return

    r.on("clickNode", ({ node, event }) => {
      toggleNodeSelection(node)
    })

    r.getMouseCaptor().on("clickStage", e => {
      if (!e.original.shiftKey && !e.original.ctrlKey) clearSelection()
    })

    r.getCamera().on("updated", updatePopupPosition)
  }

  watch(renderer, r => attachListeners(r), { immediate: true })

  onScopeDispose(() => {
    const r = renderer.value
    if (!r) return
    r.removeAllListeners()
    r.getCamera().removeAllListeners()
  })

  return {
    selectedNodeIds,
    clickedNodeData,
    popupPosition,
    clearSelection,
  }
}
