import { ref, watch, onScopeDispose } from "vue"

export function useGraphInteractions({ renderer, graph, optionsRef }) {
  const selectedNodeIds = ref(new Set())
  const popupNodeId = ref(null)
  const clickedNodeData = ref(null)
  const popupPosition = ref({ x: 0, y: 0 })

  let draggedNode = null
  let isDragging = false

  function updatePopupPosition() {
    if (!renderer.value || !popupNodeId.value) return
    const a = graph.getNodeAttributes(popupNodeId.value)
    const p = renderer.value.graphToViewport({ x: a.x, y: a.y })
    popupPosition.value = { x: p.x, y: p.y }
  }

  const highlightedEdges = new Set()
  function recomputeHighlightedEdges() {
    highlightedEdges.forEach(e => graph.removeEdgeAttribute(e, "highlighted"))
    highlightedEdges.clear()

    selectedNodeIds.value.forEach(id => {
      graph.outEdges(id).forEach(e => {
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
    selectedNodeIds.value.forEach(id =>
      graph.removeNodeAttribute(id, "highlighted"),
    )
    selectedNodeIds.value.clear()

    highlightedEdges.forEach(e => graph.removeEdgeAttribute(e, "highlighted"))
    highlightedEdges.clear()

    popupNodeId.value = null
    clickedNodeData.value = null
  }

  function attachListeners(r) {
    if (!r) return

    r.on("downNode", ({ node }) => {
      if (optionsRef.value.allowDragging !== false) {
        isDragging = true
        draggedNode = node
        if (!selectedNodeIds.value.has(node)) toggleNodeSelection(node)
      }
    })

    r.on("moveBody", ({ event }) => {
      if (!isDragging || !draggedNode) return
      const pos = renderer.value.viewportToGraph(event)
      graph.setNodeAttribute(draggedNode, "x", pos.x)
      graph.setNodeAttribute(draggedNode, "y", pos.y)

      event.preventSigmaDefault()
      event.original.preventDefault()
      event.original.stopPropagation()
      updatePopupPosition()
    })

    const stopDrag = () => {
      isDragging = false
      draggedNode = null
    }
    r.on("upNode", stopDrag)
    r.on("upStage", stopDrag)

    r.on("clickNode", ({ node }) => {
      if (!isDragging) toggleNodeSelection(node)
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
