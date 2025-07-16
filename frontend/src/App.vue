<script setup>
import Graph from "graphology"
import GraphView from "./components/GraphView.vue"
import { ref } from "vue"

const graph = ref(new Graph())

graph.value.addNode("n1", {
  label: "Node 1",
  x: 0,
  y: 0,
  size: 10,
  color: "#FF5733",
})
graph.value.addNode("n2", {
  label: "Node 2",
  x: 3,
  y: 1,
  size: 10,
  color: "#33C1FF",
})
graph.value.addEdge("n1", "n2")
</script>

<template>
  <GraphView :graph="graph" />
</template>
