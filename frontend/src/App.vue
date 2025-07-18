<script setup lang="js">
import { ref, watch } from "vue"

import HeaderComponent from "@/components/header/HeaderComponent.vue"
import GraphView from "@/components/graph/GraphView.vue"
import Panel from "@/components/panels/Panel.vue"

import Graph from "graphology"
import { useFileStore } from "@/stores/fileStore"
import { storeToRefs } from "pinia"
import { load_graph } from "@/composables/file_loader"

const graph = ref(new Graph())
const isLoading = ref(false)
const graphKey = ref(0)

const fileStore = useFileStore()
const { nodePath, edgePath, layoutType, layoutParams } = storeToRefs(fileStore)

watch(
  () => [nodePath.value, edgePath.value, layoutType.value, layoutParams.value],
  async ([nodeFile, edgeFile, layoutType, layoutParams]) => {
    if (nodeFile && edgeFile) {
      isLoading.value = true
      graph.value = await load_graph(
        nodeFile,
        edgeFile,
        layoutType,
        layoutParams,
      )
      isLoading.value = false
    } else if (edgeFile) {
      isLoading.value = true
      graph.value = await load_graph(null, edgeFile, layoutType, layoutParams)
      isLoading.value = false
    } else {
      graph.value = null
    }
  },
  { immediate: true },
)

watch(graph, () => {
  graphKey.value++
})

// const get_edges_data = () => {
//   fetch("/random_edge.csv")
//     .then(resp => resp.text())
//     .then(csv_r => parseCSV(csv_r))
//     .then(csv => update_graph_edges(graph.value, csv))
// }

// const get_nodes_data = () => {
//   fetch("/random_node.csv")
//     .then(resp => resp.text())
//     .then(csv_r => parseCSV(csv_r))
//     .then(csv => update_graph_nodes(graph.value, csv))
// }

// const clear_graph = () => {
//   graph.value.clear()
// }
</script>

<template>
  <div class="app-shell">
    <v-app>
      <HeaderComponent />
      <v-main class="main-area">
        <v-container fluid class="layout-grid">
          <div class="left-panel">
            <Panel :graph="graph" position="left" />
          </div>
          <div class="center-panel">
            <GraphView v-if="graph" :key="graphKey" :graph="graph" />
          </div>
          <div class="right-panel">
            <Panel :graph="graph" position="right" />
          </div>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<style scoped>
.app-shell::before,
.app-shell::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
  pointer-events: none;
  z-index: 10;
}

.app-shell::before {
  left: 16%;
  border-left: 2px solid #000000;
}

.app-shell::after {
  left: 80%;
  top: 48px;
  border-left: 2px solid #000000;
}

.layout-grid {
  display: grid;
  grid-template-columns: 16% 64% 20%;
  height: calc(100vh - 48px);
  padding: 0;
  gap: 0;
}

.left-panel,
.center-panel,
.right-panel {
  background-color: #fdfdfd;
  height: 100%;
}

.left-panel,
.right-panel {
  overflow-y: auto;
}

.center-panel {
  background-color: #fff;
}
</style>
