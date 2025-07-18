<script setup>
import OverviewComponent from "./rightpanelcontent/OverviewComponent.vue"
import FilterComponent from "./rightpanelcontent/FilterComponent.vue"
import StatisticsComponent from "./rightpanelcontent/StatisticsComponent.vue"
import { useGraphStats } from "@/composables/useGraphStats"
import Graph from "graphology"
import { toRef } from "vue"
const props = defineProps({
  graph: Graph,
})

const graphRef = toRef(props, "graph")

const { nodeCount, edgeCount } = useGraphStats(graphRef)
</script>

<template>
  <div class="panel-content">
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
