<script setup>
import { ref, watch } from "vue"
import EdgesNodesComponent from "./EdgesNodesComponent.vue"
import LayoutComponent from "./LayoutComponent.vue"
import VisualizationComponent from "./VisualizationComponent.vue"
import Graph from "graphology"

const props = defineProps({
  graph: Graph,
})

const nodes = ref([])
const edges = ref([])

watch(
  () => props.graph,
  newGraph => {
    if (newGraph) {
      nodes.value = newGraph.nodes()
      edges.value = newGraph.edges()
    } else {
      nodes.value = []
      edges.value = []
    }
  },
  { immediate: true },
)
console.log("Nodes:", nodes)
console.log("Edges:", edges)
</script>

<template>
  <div class="panel-content">
    <div class="panel-wrapper">
      <EdgesNodesComponent
        class="panel-section"
        :nodes="nodes"
        :edges="edges"
      />
    </div>
    <div class="panel-wrapper">
      <LayoutComponent class="panel-section" />
    </div>
    <div class="panel-wrapper">
      <VisualizationComponent class="panel-section" />
    </div>
  </div>
</template>

<style scoped>
.panel-content {
  padding: 4px;
  display: flex;
  flex-direction: column;
}

.panel-wrapper {
  flex: 1;
  margin: 4px 0;
  padding: 0 4px;
}

.panel-section {
  border: 2px solid black;
  width: 100%;
  box-sizing: border-box;
}
</style>
