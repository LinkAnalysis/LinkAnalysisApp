<script lang="js" setup>
import { ref, provide, watch } from "vue"
import HeaderComponent from "./components/header/HeaderComponent.vue"
import GraphView from "./components/GraphView.vue"
import Graph from "graphology"
import { load_graph } from "./graph_constructor/file_loader"

const currentLang = ref("en")

const graph = ref(null)

//graph.value.addNode('n1', { label: 'Node 1', x: 0, y: 0, size: 10, color: '#FF5733' })
//graph.value.addNode('n2', { label: 'Node 2', x: 3, y: 1, size: 10, color: '#33C1FF' })
//graph.value.addEdge('n1', 'n2')

load_graph("/random_node.csv", "/random_edge.csv").then(g => {
  graph.value = g
})

provide("currentLang", currentLang)
</script>

<template>
  <v-app>
    <HeaderComponent />
    <v-main class="main-area">
      <v-container fluid class="layout-grid">
        <div class="left-panel">
          <LeftPanel />
        </div>
        <div class="center-panel">
          <MainContent :currentSection="currentSection" />

          <GraphView v-if="graph" :graph="graph" />
        </div>
        <div class="right-panel">
          <RightPanel />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  height: calc(100vh - 64px);
  padding: 0;
  gap: 0;
}

.left-panel {
  background-color: #fdfdfd;
  border-right: 2px solid #ccc;
  height: 100%;
}

.center-panel {
  background-color: #fff;
  border-left: 2px solid #ccc;
  border-right: 2px solid #ccc;
  height: 100%;
}

.right-panel {
  background-color: #fdfdfd;
  border-left: 2px solid #ccc;
  height: 100%;
}
</style>
