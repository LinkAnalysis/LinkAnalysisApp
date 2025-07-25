<template>
  <div class="panel-section">
    <h2>{{ t("overview.title") }}</h2>

    <div class="table-wrapper">
      <table>
        <tbody>
          <tr>
            <td>{{ t("overview.num_of_edges") }}</td>
            <td>
              {{ totalEdges }}
              ({{ visibleEdges }} / {{ hiddenEdges }})
            </td>
          </tr>

          <tr>
            <td>{{ t("overview.num_of_nodes") }}</td>
            <td>
              {{ totalNodes }}
              ({{ visibleNodes }} / {{ hiddenNodes }})
            </td>
          </tr>

          <tr>
            <td>{{ t("overview.graph") }}</td>
            <td>{{ t(`overview.graph_type.${graphType}`) }}</td>
          </tr>

          <tr>
            <td>{{ t("overview.edge_file") }}</td>
            <td>{{ edgeFileName || t("overview.no_file_selected") }}</td>
          </tr>

          <tr>
            <td>{{ t("overview.node_file") }}</td>
            <td>{{ nodeFileName || t("overview.no_file_selected") }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { useTabsStore } from "@/stores/tabsStore"

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  edges: { type: Array, default: () => [] },
})

const { t } = useI18n()
const graphType = "undirected"

const totalNodes = computed(() => props.nodes.length)
const hiddenNodes = computed(() => props.nodes.filter(n => n.hidden).length)
const visibleNodes = computed(() => totalNodes.value - hiddenNodes.value)

const totalEdges = computed(() => props.edges.length)
const hiddenEdges = computed(() => props.edges.filter(e => e.hidden).length)
const visibleEdges = computed(() => totalEdges.value - hiddenEdges.value)

const tabsStore = useTabsStore()
const { getSelectedNodeFileName, getSelectedEdgeFileName } =
  storeToRefs(tabsStore)

const nodeFileName = getSelectedNodeFileName
const edgeFileName = getSelectedEdgeFileName
</script>

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
  width: 100%;
  border-collapse: collapse;
}
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
h2 {
  margin: 0 0 8px;
  text-align: center;
}
</style>
