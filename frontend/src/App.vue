<script lang="js" setup>
import { ref, provide, watch } from "vue"
import HeaderComponent from "./components/header/HeaderComponent.vue"
import GraphView from "./components/GraphView.vue"
import Graph from "graphology"
import { load_graph } from "./graph_constructor/file_loader"

const currentLang = ref("en")

const graph = ref(null)

load_graph("/random_node.csv", "/random_edge.csv").then(g => {
  graph.value = g
})

provide("currentLang", currentLang)
</script>

<template>
  <div class="app-shell">
    <v-app>
      <HeaderComponent />
      <v-main class="main-area">
        <v-container fluid class="layout-grid">
          <div class="left-panel">
            <LeftPanel />
          </div>
          <div class="center-panel">
            <MainContent :currentSection="currentSection" />
          </div>
          <div class="right-panel">
            <RightPanel />
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
  flex: 1 1 auto;
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
