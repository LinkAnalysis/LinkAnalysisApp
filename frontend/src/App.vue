<script lang="js" setup>
import { ref, provide, watch } from "vue"
import HeaderComponent from "./components/header/HeaderComponent.vue"
import GraphView from "./components/GraphView.vue"
import { load_graph } from "./graph_constructor/file_loader"
import RightPanelComponent from "./components/rightpanel/RightPanelComponent.vue"
import fileStore from "./stores/fileStore"
const currentLang = ref("en")

const graph = ref(null)
const isLoading = ref(false)
// load_graph("/random_node.csv", "/random_edge.csv").then(g => {
//   graph.value = g
// })
const currentSection = ref("overview")
const statusMessage = ref("No graph loaded. Please upload node and edge files.")
watch(
  () => [
    fileStore.selectedNodeFilePath.value,
    fileStore.selectedEdgeFilePath.value,
  ],
  async ([nodeFile, edgeFile]) => {
    if (nodeFile && edgeFile) {
      isLoading.value = true
      graph.value = await load_graph(nodeFile, edgeFile)
      isLoading.value = false
      statusMessage.value = ""
      return
    } else {
      graph.value = null
      if (nodeFile && !edgeFile) {
        statusMessage.value = "Node file loaded. Please upload edge file."
      } else if (!nodeFile && edgeFile) {
        statusMessage.value = "Edge file loaded. Please upload node file."
      } else {
        statusMessage.value =
          "No graph loaded. Please upload node and edge files."
      }
    }
  },
  { immediate: true },
)

provide("currentLang", currentLang)
</script>

<template>
  <div class="app-shell">
    <v-app>
      <HeaderComponent />
      <v-main class="main-area">
        <v-container fluid class="layout-grid">
          <div class="left-panel">
            <LeftPanelComponent :graph="graph" />
          </div>
          <div class="center-panel">
            <MainContent :current-section="currentSection" />
            <GraphView v-if="graph" :graph="graph" />
            <div v-else class="graph-status-message">
              <p>{{ statusMessage }}</p>
            </div>
          </div>
          <div class="right-panel">
            <RightPanelComponent :graph="graph" />
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

.center-panel {
  background-color: #fff;
}
</style>
