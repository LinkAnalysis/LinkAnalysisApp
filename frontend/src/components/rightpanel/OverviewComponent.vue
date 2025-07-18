<script setup>
import { useTranslations } from "@/i18n/useTranslations"
import fileStore from "../../stores/fileStore"

const props = defineProps({
  nodeCount: Number,
  edgesCount: Number,
})

const { labels } = useTranslations()
const graphType = "Undirected"

const getFileName = fullPath => {
  return fullPath ? fullPath.split(/[/\\]/).pop() : ""
}
</script>

<template>
  <div class="panel-section">
    <h2>{{ labels.overview }}</h2>
    <table>
      <tr>
        <td>{{ labels.num_of_edges }}</td>
        <td>{{ edgesCount }}</td>
      </tr>
      <tr>
        <td>{{ labels.num_of_nodes }}</td>
        <td>{{ nodeCount }}</td>
      </tr>
      <tr>
        <td>{{ labels.graph_type }}</td>
        <td>{{ graphType }}</td>
      </tr>
      <tr>
        <td>{{ labels.edge_file }}</td>
        <td v-if="fileStore.selectedEdgeFilePath.value">
          {{ getFileName(fileStore.selectedEdgeFilePath.value) }}
        </td>
        <td v-else>
          {{ labels.no_file_selected }}
        </td>
      </tr>
      <tr>
        <td>{{ labels.node_file }}</td>
        <td v-if="fileStore.selectedNodeFilePath.value">
          {{ getFileName(fileStore.selectedNodeFilePath.value) }}
        </td>
        <td v-else>
          {{ labels.no_file_selected }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  margin: 0 auto;
  margin-top: 8px;
  width: 100%;
}

td {
  border: 1px solid black;
  padding: 8px 12px;
  text-align: left;
}
</style>
