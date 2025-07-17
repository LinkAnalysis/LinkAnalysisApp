<script lang="js" setup>
import { ref, provide } from "vue"
import HeaderComponent from "./components/header/HeaderComponent.vue"
import GraphView from "./components/GraphView.vue"
import {
  parseCSV,
  update_graph_edges,
  update_graph_nodes,
} from "./graph_constructor/file_loader"
import RightPanelComponent from "./components/rightpanel/RightPanelComponent.vue"
import Graph from "graphology"

const currentLang = ref("en")

const graph = ref(new Graph())

const get_edges_data = () => {
  fetch("/random_edge.csv")
    .then(resp => resp.text())
    .then(csv_r => parseCSV(csv_r))
    .then(csv => update_graph_edges(graph.value, csv))
}

const get_nodes_data = () => {
  fetch("/random_node.csv")
    .then(resp => resp.text())
    .then(csv_r => parseCSV(csv_r))
    .then(csv => update_graph_nodes(graph.value, csv))
}

const clear_graph = () => {
  graph.value.clear()
}

provide("currentLang", currentLang)
</script>

<template>
  <div class="app-shell">
    <v-app>
      <HeaderComponent />
      <v-main class="main-area">
        <v-container fluid class="layout-grid">
          <div class="left-panel">
            <button @click="get_nodes_data">Nodes</button>
            <button @click="get_edges_data">Edges</button>
            <button @click="clear_graph">Clear</button>
            <LeftPanelComponent :graph="graph" />
          </div>
          <div class="center-panel">
            <MainContent :currentSection="currentSection" />
            <GraphView v-if="graph" :graph="graph" />
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
