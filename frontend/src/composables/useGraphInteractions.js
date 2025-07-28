import { ref, reactive, watch, onScopeDispose } from "vue"
import { withCtrl } from "@/utils/keys"

export function useGraphInteractions({ renderer, graph, optionsRef }) {
  const selectedNodeIds = reactive(new Set())
  const selectedEdgeIds = reactive(new Set())
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
      if (!selectedEdgeIds.has(e)) graph.removeEdgeAttribute(e, "highlighted")
    })
    highlightedEdges.clear()

    selectedNodeIds.forEach(nId => {
      graph.outEdges(nId).forEach(e => {
        graph.setEdgeAttribute(e, "highlighted", true)
        highlightedEdges.add(e)
      })
    })
  }

  function toggleNode(nodeId) {
    let added = false
    if (selectedNodeIds.has(nodeId)) {
      selectedNodeIds.delete(nodeId)
      if (!graph.hasNodeAttribute(nodeId, "edgeHighlighted"))
        graph.removeNodeAttribute(nodeId, "highlighted")
      if (popupNodeId.value === nodeId) {
        popupNodeId.value = null
        clickedNodeData.value = null
      }
    } else {
      added = true
      selectedNodeIds.add(nodeId)
      graph.setNodeAttribute(nodeId, "highlighted", true)
      popupNodeId.value = nodeId
      const a = graph.getNodeAttributes(nodeId)
      clickedNodeData.value = {
        id: nodeId,
        description: a.label,
        numOfNeighbors: graph.neighbors(nodeId).length,
      }
      updatePopupNodePosition()
    }
    recomputeHighlightedEdges()
    return added
  }

  function toggleEdge(edgeId) {
    if (selectedEdgeIds.has(edgeId)) {
      selectedEdgeIds.delete(edgeId)
      if (!highlightedEdges.has(edgeId))
        graph.removeEdgeAttribute(edgeId, "highlighted")
      const s = graph.source(edgeId)
      const t = graph.target(edgeId)
      ;[s, t].forEach(n => {
        graph.removeNodeAttribute(n, "edgeHighlighted")
        if (!selectedNodeIds.has(n)) graph.removeNodeAttribute(n, "highlighted")
      })
      if (popupEdgeId.value === edgeId) {
        popupEdgeId.value = null
        popupEdgeData.value = null
      }
      return false
    } else {
      selectedEdgeIds.add(edgeId)
      graph.setEdgeAttribute(edgeId, "highlighted", true)
      const s = graph.source(edgeId)
      const t = graph.target(edgeId)
      ;[s, t].forEach(n => {
        graph.setNodeAttribute(n, "highlighted", true)
        graph.setNodeAttribute(n, "edgeHighlighted", true)
      })
      popupEdgeId.value = edgeId
      const attrs = graph.getEdgeAttributes(edgeId)
      popupEdgeData.value = {
        id: edgeId,
        description: attrs.label,
        weight: attrs.weight,
      }
      updatePopupEdgePosition()
      return true
    }
  }

  function hideNode(nodeId, hide = true) {
    graph.setNodeAttribute(nodeId, "hidden", hide)

    graph.forEachEdge(nodeId, edgeId =>
      graph.setEdgeAttribute(edgeId, "hidden", hide),
    )

    selectedNodeIds.delete(nodeId)
    highlightedEdges.forEach(e => {
      if (graph.source(e) === nodeId || graph.target(e) === nodeId)
        highlightedEdges.delete(e)
    })
    popupNodeId.value = null
    clickedNodeData.value = null
  }

  function attachListeners(r) {
    if (!r) return

    r.on("rightClickNode", ({ node, event }) => {
      event.preventSigmaDefault()
      event.original.preventDefault()

      hideNode(node)
    })

    r.on("downNode", ({ node, event }) => {
      if (withCtrl(event)) {
        toggleNode(node)
      }
      if (
        event.original.button === 0 &&
        optionsRef.value.allowDragging !== false
      ) {
        isDragging = true
        draggedNode = node
        graph.setNodeAttribute(draggedNode, "fixed", true)
        if (!r.getCustomBBox()) r.setCustomBBox(r.getBBox())
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
      graph.removeNodeAttribute(draggedNode, "fixed")
      draggedNode = null
    }
    r.on("upNode", stopDrag)
    r.on("upStage", stopDrag)

    r.on("clickEdge", ({ edge, event }) => {
      if (!withCtrl(event)) return
      toggleEdge(edge)
    })

    r.getMouseCaptor().on("clickStage", ({ event }) => {
      if (!withCtrl(event)) return
      selectedNodeIds.forEach(n => graph.removeNodeAttribute(n, "highlighted"))
      selectedEdgeIds.forEach(e => graph.removeEdgeAttribute(e, "highlighted"))
      selectedNodeIds.clear()
      selectedEdgeIds.clear()
      highlightedEdges.clear()
      popupNodeId.value = null
      popupEdgeId.value = null
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
    popupNodePosition,
    clickedNodeData,
    popupEdgeData,
    popupEdgePosition,
  }
}
