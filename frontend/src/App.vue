<script setup lang="js">
import { ref, watch } from "vue"

import HeaderComponent from "@/components/header/HeaderComponent.vue"
import GraphView from "@/components/graph/GraphView.vue"
import Panel from "@/components/panels/Panel.vue"

import { storeToRefs } from "pinia"
import TabsManager from "./components/TabsManager.vue"
import { load_graph, apply_layout } from "@/composables/file_loader"
import { useTabsStore } from "./stores/tabsStore"
import { LogPrint } from "../wailsjs/runtime/runtime"

const tabs = useTabsStore()
const {
  selectedGraph,
  selectedNodeFile,
  selectedEdgeFile,
  selectedTabId,
  selectedLayout,
  selectedLayoutParams,
  tabsData,
  selectedVisualizationOptions,
} = storeToRefs(tabs)

const graph = selectedGraph

const isLoading = ref(false)
const graphKey = ref(0)

//const { nodePath, edgePath, layoutType, layoutParams } = storeToRefs(fileStore)

watch(
  [selectedNodeFile, selectedEdgeFile, selectedTabId],
  async (
    [newNodeFile, newEdgeFile, newTabId],
    [oldNodeFile, oldEdgeFile, oldTabId],
  ) => {
    if (oldTabId != newTabId) {
      return
    }

    if (!newEdgeFile) {
      graph.value = null
      return
    }

    isLoading.value = true
    graph.value = await load_graph(newNodeFile ?? null, newEdgeFile)
    apply_layout(graph.value)
    isLoading.value = false
  },
  { immediate: true },
)

watch(graph, () => {
  graphKey.value++
})
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
            <MainContent :current-section="currentSection" />
            <TabsManager />
            <GraphView
              v-if="graph"
              :key="graphKey"
              :graph="graph"
              :changed="gC"
              :options="selectedVisualizationOptions"
            />
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
