<script setup>
import Graph from "graphology"
import Sigma from "sigma"
import { onBeforeUnmount, onMounted, ref } from "vue"

const props = defineProps({
  graph: Graph,
})
const container = ref(null)
let renderer = null

onMounted(() => {
  renderer = new Sigma(props.graph, container.value)
})

onBeforeUnmount(() => {
  if (renderer) renderer.kill()
})
</script>

<template>
  <div ref="container" class="sigma-container"></div>
</template>

<style scoped>
.sigma-container {
  width: 500px;
  height: 500px;
  background: lightblue;
}
</style>
