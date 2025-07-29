<script setup>
import { toRef, computed } from "vue"
import OverviewComponent from "./rightpanelcontent/OverviewComponent.vue"
import FilterComponent from "./rightpanelcontent/FilterComponent.vue"
import StatisticsComponent from "./rightpanelcontent/StatisticsComponent.vue"
import Graph from "graphology"
import { graph } from "graphology-metrics"

const props = defineProps({
  graph: Graph,
})

const graphRef = toRef(props, "graph")

const nodes = computed(() =>
  graphRef.value
    ? graphRef.value.nodes().map(id => graphRef.value.getNodeAttributes(id))
    : [],
)

const edges = computed(() =>
  graphRef.value
    ? graphRef.value.edges().map(id => graphRef.value.getEdgeAttributes(id))
    : [],
)
</script>

<template>
  <div class="panel-content">
    <div class="panel-wrapper">
      <OverviewComponent
        class="panel-section"
        :nodes="nodes"
        :edges="edges"
        :graph="graphRef"
      />
    </div>
    <div class="panel-wrapper">
      <FilterComponent class="panel-section" :graph="graphRef" />
    </div>
    <div class="panel-wrapper">
      <StatisticsComponent class="panel-section" :graph="graph" />
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
