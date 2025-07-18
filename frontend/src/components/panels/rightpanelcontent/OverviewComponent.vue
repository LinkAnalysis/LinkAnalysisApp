<script setup>
import { useI18n } from "vue-i18n"
import fileStore from "../../../stores/fileStore.js"

const props = defineProps({
  nodeCount: Number,
  edgesCount: Number,
})

const { t } = useI18n()
const graphType = "Undirected"

const getFileName = fullPath => {
  return fullPath ? fullPath.split(/[/\\]/).pop() : ""
}
console.log("overview.title →", t("overview.title"))
</script>

<template>
  <div class="panel-section">
    <h2>{{ t("overview.title") }}</h2>
    <div class="table-wrapper">
      <table>
        <tbody>
          <tr>
            <td>{{ t("overview.num_of_edges") }}</td>
            <td>{{ edgesCount }}</td>
          </tr>
          <tr>
            <td>{{ t("overview.num_of_nodes") }}</td>
            <td>{{ nodeCount }}</td>
          </tr>
          <tr>
            <td>{{ t("overview.graph_type") }}</td>
            <td>{{ graphType }}</td>
          </tr>
          <tr>
            <td>{{ t("overview.edge_file") }}</td>
            <td>{{ getFileName(selectedEdgeFilePath) }}</td>
          </tr>
          <tr>
            <td>{{ t("overview.node_file") }}</td>
            <td>{{ getFileName(selectedNodeFilePath) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.panel-section {
  border: 2px solid black;
  padding: 8px;
  width: 100%;
  font-family: sans-serif;
}
.table-wrapper {
  border: 2px solid black;
  max-height: 300px;
  overflow-y: auto;
}
.table-wrapper::-webkit-scrollbar {
  height: 8px;
}
table {
  border-collapse: collapse;
  margin: 0 auto;
  width: 100%;
}

td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
h2 {
  margin-top: 0;
  text-align: center;
  margin-bottom: 8px;
}
</style>
