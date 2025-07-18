<script setup>
import Graph from "graphology"
import Sigma from "sigma"

import { onBeforeUnmount, onMounted, ref, watch } from "vue"

const props = defineProps({
  graph: Graph,
})

const container = ref(null)
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

  // On mouse up, we reset the dragging mode
  const handleUp = () => {
    if (draggedNode) {
      props.graph.removeNodeAttribute(draggedNode, "highlighted")
    }
    isDragging = false
    draggedNode = null
  }
  renderer.on("upNode", handleUp)
  renderer.on("upStage", handleUp)
})

onBeforeUnmount(() => {
  if (renderer) renderer.kill()
})
</script>

<template>
  <div class="graph-wrapper">
    <div ref="container" class="sigma-container"></div>
    <div class="controls">
      <button @click="zoomIn">Zoom In</button>
      <button @click="zoomOut">Zoom Out</button>
      <button @click="resetZoom">Reset</button>
    </div>
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
</style>
