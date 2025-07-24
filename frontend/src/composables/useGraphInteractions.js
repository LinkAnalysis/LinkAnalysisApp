import { ref, watch, onScopeDispose } from "vue"
import { LogPrint } from "../../wailsjs/runtime/runtime"

export function useGraphInteractions({ renderer, graph, optionsRef }) {
  const selectedNodeId = ref(null)
  const popupNodeId = ref(null)
  const clickedNodeData = ref(null)
  const popupNodePosition = ref({ x: 0, y: 0 })

  const popupEdgeId = ref(null)
  const popupEdgeData = ref(null)
  const popupEdgePosition = ref({ x: 0, y: 0 })

  let draggedNode = null
  let isDragging = false

  function updatePopupNodePosition() {
    if (!renderer.value || !popupNodeId.value) return
    const a = graph.getNodeAttributes(popupNodeId.value)
    const p = renderer.value.graphToViewport({ x: a.x, y: a.y })
    popupNodePosition.value = { x: p.x, y: p.y }
  }

  function updatePopupEdgePosition() {
    if (!renderer.value || !popupEdgeId.value) return
    const e = popupEdgeId.value
    const s_attrs = graph.getNodeAttributes(graph.source(e))
    const t_attrs = graph.getNodeAttributes(graph.target(e))
    const midPoint = {
      x: (s_attrs.x + t_attrs.x) / 2,
      y: (s_attrs.y + t_attrs.y) / 2,
    }
    const p = renderer.value.graphToViewport(midPoint)
    popupEdgePosition.value = { x: p.x, y: p.y }
  }

  const highlightedEdges = new Set()
  function recomputeHighlightedEdges() {
    highlightedEdges.forEach(e => {
      if (e != popupEdgeId.value) graph.removeEdgeAttribute(e, "highlighted")
    })
    highlightedEdges.clear()

    if (selectedNodeId.value) {
      graph.outEdges(selectedNodeId.value).forEach(e => {
        graph.setEdgeAttribute(e, "highlighted", true)
        highlightedEdges.add(e)
      })
    }
  }

  function selectSingleNode(nodeId) {
    if (selectedNodeId.value === nodeId) {
      if (!graph.hasNodeAttribute(nodeId, "edgeHighlighted"))
        graph.removeNodeAttribute(nodeId, "highlighted")
      selectedNodeId.value = null
      popupNodeId.value = null
      clickedNodeData.value = null
      recomputeHighlightedEdges()
      return
    }

    if (selectedNodeId.value) {
      graph.removeNodeAttribute(selectedNodeId.value, "highlighted")
    }

    selectedNodeId.value = nodeId
    graph.setNodeAttribute(nodeId, "highlighted", true)

    popupNodeId.value = nodeId
    const a = graph.getNodeAttributes(nodeId)
    clickedNodeData.value = {
      id: nodeId,
      description: a.label,
      numOfNeighbors: graph.neighbors(nodeId).length,
    }
    updatePopupNodePosition()

    recomputeHighlightedEdges()
  }

  function clearPopupEdgeSelection() {
    popupEdgeData.value = null

    if (!popupEdgeId.value) return

    const edgeId = popupEdgeId.value
    if (!highlightedEdges.has(edgeId))
      graph.removeEdgeAttribute(edgeId, "highlighted")

    const sourceId = graph.source(popupEdgeId.value)
    const targetId = graph.target(popupEdgeId.value)

    graph.removeNodeAttribute(sourceId, "edgeHighlighted")
    if (selectedNodeId.value != sourceId)
      graph.removeNodeAttribute(sourceId, "highlighted")

    graph.removeNodeAttribute(targetId, "edgeHighlighted")
    if (selectedNodeId.value != targetId)
      graph.removeNodeAttribute(targetId, "highlighted")

    popupEdgeId.value = null
  }

  function selectPopupEdge(edgeId) {
    if (popupEdgeId.value === edgeId) {
      clearPopupEdgeSelection()
      return
    }

    popupEdgeId.value = edgeId
    graph.setEdgeAttribute(edgeId, "highlighted", true)
    graph.setNodeAttribute(graph.source(edgeId), "highlighted", true)
    graph.setNodeAttribute(graph.source(edgeId), "edgeHighlighted", true)

    graph.setNodeAttribute(graph.target(edgeId), "highlighted", true)
    graph.setNodeAttribute(graph.target(edgeId), "edgeHighlighted", true)

    const attrs = graph.getEdgeAttributes(edgeId)
    popupEdgeData.value = {
      id: edgeId,
      description: attrs.label,
      weight: attrs.weight,
    }
    updatePopupEdgePosition()
  }

  function clearSelection() {
    if (selectedNodeId.value) {
      graph.removeNodeAttribute(selectedNodeId.value, "highlighted")
    }
    selectedNodeId.value = null

    highlightedEdges.forEach(e => {
      if (e != popupEdgeId.value) graph.removeEdgeAttribute(e, "highlighted")
    })
    highlightedEdges.clear()

    popupNodeId.value = null
    clickedNodeData.value = null
  }

  function attachListeners(r) {
    if (!r) return

    r.on("downNode", ({ node }) => {
      selectSingleNode(node)
      if (optionsRef.value.allowDragging !== false) {
        isDragging = true
        draggedNode = node
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
      updatePopupNodePosition()
      updatePopupEdgePosition()
    })

    const stopDrag = () => {
      isDragging = false
      draggedNode = null
    }
    r.on("upNode", stopDrag)
    r.on("upStage", stopDrag)

    r.on("clickEdge", ({ edge }) => {
      selectPopupEdge(edge)
    })

    r.getMouseCaptor().on("clickStage", () => {
      clearSelection()
      clearPopupEdgeSelection()
    })

    r.getCamera().on("updated", () => {
      updatePopupNodePosition()
      updatePopupEdgePosition()
    })
  }

  watch(renderer, r => attachListeners(r), { immediate: true })

  onScopeDispose(() => {
    const r = renderer.value
    if (!r) return
    r.removeAllListeners()
    r.getCamera().removeAllListeners()
  })

  return {
    selectedNodeId,
    clickedNodeData,
    popupNodePosition,
    popupEdgeId,
    popupEdgeData,
    popupEdgePosition,
    clearSelection,
    clearPopupEdgeSelection,
  }
}
