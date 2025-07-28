<script setup>
import { toRef } from "vue"
import EdgesNodesComponent from "./leftpanelcontent/EdgesNodesComponent.vue"
import LayoutComponent from "./leftpanelcontent/LayoutComponent.vue"
import VisualizationComponent from "./leftpanelcontent/VisualizationComponent.vue"
import Graph from "graphology"
import { useGraphElements } from "../../composables/useGraphElements"
import { useTabsStore } from "../../stores/tabsStore"
import { apply_layout } from "../../composables/file_loader"
import { storeToRefs } from "pinia"
import { layouts } from "../../composables/layouts"

const props = defineProps({
  graph: Graph,
})
const graphRef = toRef(props, "graph")

const { nodes, edges } = useGraphElements(graphRef)

const tabsStore = useTabsStore()
const { markSelectedGraphChange } = tabsStore
const { selectedGraph, selectedLayout, selectedLayoutParams, selectedTabId } =
  storeToRefs(tabsStore)

const onApplyLayout = () => {
  if (selectedGraph.value) {
    apply_layout(
      selectedGraph.value,
      selectedLayout.value,
      selectedLayoutParams.value,
    )
    markSelectedGraphChange()
  }
}

const onCreateSimulationWorker = () => {
  if (selectedGraph.value) {
    const g = selectedGraph.value
    const l = selectedLayout.value
    const p = selectedLayoutParams.value
    tabsStore.createSimulation(layouts[l].simulate(g, p))
  }
}

function handleEditNode(updated) {
  graphRef.value.updateNodeAttributes(updated.id, old => ({
    ...old,
    label: updated.label,
    image: updated.image ?? null,
  }))
}

function handleEditEdge(updated) {
  graphRef.value.updateEdgeAttributes(updated.id, old => ({
    ...old,
    label: updated.label,
  }))
}

function handleDeleteItem(type, id) {
  if (type === "node") {
    graphRef.value.dropNode(id)
  } else if (type === "edge") {
    graphRef.value.dropEdge(id)
  }
}
</script>

<template>
  <div class="panel-content">
    <div class="panel-wrapper">
      <EdgesNodesComponent
        class="panel-section"
        :nodes="nodes"
        :edges="edges"
        :current-tab="selectedTabId"
        @edit-node="handleEditNode"
        @edit-edge="handleEditEdge"
        @delete-node="id => handleDeleteItem('node', id)"
        @delete-edge="id => handleDeleteItem('edge', id)"
      />
    </div>
    <div class="panel-wrapper">
      <LayoutComponent
        class="panel-section"
        @apply-layout="onApplyLayout"
        @createSimulationWorker="onCreateSimulationWorker"
      />
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
