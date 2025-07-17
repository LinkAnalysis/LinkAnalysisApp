<script setup>
import { ref, watch } from "vue"
import OverviewComponent from "./OverviewComponent.vue"
import FilterComponent from "./FilterComponent.vue"
import StatisticsComponent from "./StatisticsComponent.vue"
import Graph from "graphology"
const props = defineProps({
  graph: Graph,
})
const nodeCount = ref(0)
const edgeCount = ref(0)

watch(
  () => props.graph,
  newGraph => {
    if (newGraph) {
      nodeCount.value = newGraph.order
      edgeCount.value = newGraph.size
    } else {
      nodeCount.value = 0
      edgeCount.value = 0
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="panel-content">
    <div class="panel-wrapper">
      <OverviewComponent
        class="panel-section"
        :node-count="nodeCount"
        :edges-count="edgeCount"
      />
    </div>
    <div class="panel-wrapper">
      <FilterComponent class="panel-section" />
    </div>
    <div class="panel-wrapper">
      <StatisticsComponent class="panel-section" />
    </div>
  </div>
</template>

<style scoped>
.panel-content {
  max-height: 92vh;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.panel-wrapper {
  flex: 1;
  margin: 8px 0;
  padding: 0 8px;
}

.panel-section {
  border: 2px solid black;
  width: 100%;
  box-sizing: border-box;
}
</style>
