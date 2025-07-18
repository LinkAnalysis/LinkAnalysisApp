<script setup>
import Graph from "graphology"
import Sigma from "sigma"
import VertexWindow from "./VertexWindow.vue"
import { useI18n } from "vue-i18n"

import { onBeforeUnmount, onMounted, ref } from "vue"
const props = defineProps({
  graph: Graph,
})

const clickedNodeData = ref(null)
const popupPosition = ref({ x: 0, y: 0 })
const clickedNodeId = ref(null)
const container = ref(null)
const { t } = useI18n()

let renderer = null
let draggedNode = null
let isDragging = false

const zoomIn = () => renderer?.getCamera().animatedZoom({ duration: 600 })
const zoomOut = () => renderer?.getCamera().animatedUnzoom({ duration: 600 })
const resetZoom = () => renderer?.getCamera().animatedReset({ duration: 600 })

onMounted(() => {
  renderer = new Sigma(props.graph, container.value, {
    minCameraRatio: 0.08,
    maxCameraRatio: 3,
    renderEdgeLabels: true,
    labelRenderedSizeThreshold: 6,
  })
  renderer.on("downNode", e => {
    isDragging = true
    draggedNode = e.node
    props.graph.setNodeAttribute(draggedNode, "highlighted", true)
    if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox())
  })
  renderer.on("moveBody", ({ event }) => {
    if (!isDragging || !draggedNode) return

    // Get new position of node
    const pos = renderer.viewportToGraph(event)

    props.graph.setNodeAttribute(draggedNode, "x", pos.x)
    props.graph.setNodeAttribute(draggedNode, "y", pos.y)

    // Prevent sigma to move camera:
    event.preventSigmaDefault()
    event.original.preventDefault()
    event.original.stopPropagation()
  })
  renderer.on("clickNode", ({ node }) => {
    selectNode(node)
  })

  // On mouse up, we reset the dragging mode
  const handleUp = () => {
    if (draggedNode && draggedNode !== clickedNodeId.value) {
      props.graph.removeNodeAttribute(draggedNode, "highlighted")
    }
    isDragging = false
    draggedNode = null
  }
  renderer.on("upNode", handleUp)
  renderer.on("upStage", handleUp)

  renderer.getCamera().on("updated", () => {
    updatePopupPosition()
  })
})

onBeforeUnmount(() => {
  if (renderer) renderer.kill()
})

function updatePopupPosition() {
  if (!clickedNodeId.value) return
  const attrs = props.graph.getNodeAttributes(clickedNodeId.value)
  const screenPos = renderer.graphToViewport({ x: attrs.x, y: attrs.y })
  popupPosition.value = { x: screenPos.x, y: screenPos.y }
}

function selectNode(nodeId) {
  if (clickedNodeId.value && clickedNodeId.value !== nodeId) {
    props.graph.removeNodeAttribute(clickedNodeId.value, "highlighted")
  }
  clickedNodeId.value = nodeId
  props.graph.setNodeAttribute(nodeId, "highlighted", true)

  const attrs = props.graph.getNodeAttributes(nodeId)
  clickedNodeData.value = {
    id: nodeId,
    Description: attrs.label,
    numOfNeighbors: props.graph.neighbors(nodeId).length,
  }
  updatePopupPosition()
}

function clearSelection() {
  if (clickedNodeId.value) {
    props.graph.removeNodeAttribute(clickedNodeId.value, "highlighted")
  }
  clickedNodeId.value = null
  clickedNodeData.value = null
}
</script>

<template>
  <div class="graph-wrapper">
    <div ref="container" class="sigma-container"></div>
    <div class="controls">
      <button @click="zoomIn">Zoom In</button>
      <button @click="zoomOut">Zoom Out</button>
      <button @click="resetZoom">Reset</button>
    </div>
    <VertexWindow
      v-if="clickedNodeData"
      :visible="true"
      :position="popupPosition"
      @close="clearSelection"
    >
      ID: {{ clickedNodeData.id }}<br />
      <span v-if="clickedNodeData.Description">
        {{ t("vertex_window.name") }}: {{ clickedNodeData.Description }}<br />
      </span>
      <span v-else>
        {{ t("vertex_window.name") }}: {{ t("vertex_window.no_description")
        }}<br />
      </span>
      {{ t("vertex_window.number_of_neighbors") }}:
      {{ clickedNodeData.numOfNeighbors }}<br />
    </VertexWindow>
  </div>
</template>

<style scoped>
.graph-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  position: relative;
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.5);
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.sigma-container {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  background: lightblue;
  border: 1px solid #000000;
}

.controls button {
  cursor: pointer;
  width: 100%;
}

.popup {
  position: absolute;
  background: white;
  border: 1px solid black;
  padding: 8px;
  z-index: 20;
  transform: translate(10px, -50%);
  pointer-events: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
