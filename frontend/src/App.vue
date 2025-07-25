<script setup lang="js">
import { ref, watch } from "vue"

import HeaderComponent from "@/components/header/HeaderComponent.vue"
import GraphView from "@/components/graph/GraphView.vue"
import Panel from "@/components/panels/Panel.vue"

import { storeToRefs } from "pinia"
import TabsManager from "./components/TabsManager.vue"
import { load_graph, apply_layout } from "@/composables/file_loader"
import { useTabsStore } from "./stores/tabsStore"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
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
  graphViewRef,
  selectedGraphMode,
} = storeToRefs(tabs)

const graph = selectedGraph

const isLoading = ref(false)
const graphKey = ref(0)

watch(
  [selectedNodeFile, selectedEdgeFile, selectedTabId, selectedGraphMode],
  async (
    [newNodeFile, newEdgeFile, newTabId, newGraphMode],
    [oldNodeFile, oldEdgeFile, oldTabId, oldGraphMode],
  ) => {
    if (oldTabId != newTabId) {
      return
    }

    if (!newEdgeFile) {
      graph.value = null
      return
    }

    isLoading.value = true
    try {
      graph.value = await load_graph(
        newNodeFile ?? null,
        newEdgeFile,
        newGraphMode,
      )
      if (selectedGraphMode.value != "gexf") {
        apply_layout(graph.value)
      }
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true },
)

watch(graph, () => {
  graphKey.value++
})
</script>

<template>
  <div class="app-shell">
    <HeaderComponent />
    <div class="main-area">
      <div class="layout-grid">
        <div class="left-panel">
          <Panel :graph="graph" position="left" />
        </div>

        <div class="center-panel">
          <TabsManager />
          <transition name="fade">
            <div
              v-if="isLoading"
              class="loading-overlay"
              role="status"
              aria-live="polite"
            >
              <div class="spinner" />
              <span class="loading-text">{{ t("app.loading") }}</span>
            </div>
          </transition>
          <GraphView
            v-if="graph"
            :key="graphKey"
            :graph="graph"
            :options="selectedVisualizationOptions"
            ref="graphViewRef"
          />
        </div>

        <div class="right-panel">
          <Panel :graph="graph" position="right" />
        </div>
      </div>
    </div>
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

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
  background: rgba(255, 255, 255, 0.7);
  z-index: 20;
  gap: 12px;
  font-size: 14px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ddd;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.center-panel {
  position: relative;
}
</style>
