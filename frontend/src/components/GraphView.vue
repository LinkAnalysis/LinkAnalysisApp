<script setup>
import Graph from "graphology"
import Sigma from "sigma"
import { onBeforeUnmount, onMounted, ref, watch } from "vue"

const props = defineProps({
  graph: Graph,
})
const container = ref(null)
let renderer = null

const zoomIn = () => renderer?.getCamera().animatedZoom({ duration: 600 })
const zoomOut = () => renderer?.getCamera().animatedUnzoom({ duration: 600 })
const resetZoom = () => renderer?.getCamera().animatedReset({ duration: 600 })

onMounted(() => {
  renderer = new Sigma(props.graph, container.value, {
    minCameraRatio: 0.08,
    maxCameraRatio: 3,
  })
})

onBeforeUnmount(() => {
  if (renderer) renderer.kill()
})
</script>

<template>
  <div class="graph-wrapper">
    <div class="control">
      <button @click="zoomIn">Zoom In</button>
      <button @click="zoomOut">Zoom Out</button>
      <button @click="resetZoom">Reset Zoom</button>
    </div>
    <div ref="container" class="sigma-container"></div>
  </div>
</template>

<style scoped>
.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.graph-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sigma-container {
  width: 500px;
  height: 500px;
  background: lightblue;
  border: 1px solid #000000;
}
</style>
