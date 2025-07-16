<script setup>
import { ref, watch } from "vue"
import OverviewComponent from "./OverviewComponent.vue"
import FilterComponent from "./FilterComponent.vue"
import StatisticsComponent from "./StatisticsComponent.vue"
const props = defineProps({
  graph: Object,
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
  <div class="right-panel-content">
    <div class="panel-wrapper">
      <OverviewComponent
        class="panel-section"
        :nodeCount="nodeCount"
        :edgesCount="edgeCount"
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
.right-panel-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
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
