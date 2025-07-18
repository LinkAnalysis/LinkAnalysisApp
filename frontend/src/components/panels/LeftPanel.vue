<script setup>
import { toRef } from "vue"
import EdgesNodesComponent from "./leftpanelcontent/EdgesNodesComponent.vue"
import LayoutComponent from "./leftpanelcontent/LayoutComponent.vue"
import VisualizationComponent from "./leftpanelcontent/VisualizationComponent.vue"
import Graph from "graphology"

import { useGraphElements } from "../../composables/useGraphElements"

const props = defineProps({
  graph: Graph,
})
const graphRef = toRef(props, "graph")

const { nodes, edges } = useGraphElements(graphRef)
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
