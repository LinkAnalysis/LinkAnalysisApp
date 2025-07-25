<template>
  <div class="panel-section">
    <h2>{{ t("visualization.title") }}</h2>

    <div class="table-wrapper">
      <table class="settings-table">
        <tbody>
          <tr class="section-header">
            <td colspan="2">
              <strong>{{ t("visualization.sections.nodes") }}</strong>
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.nodeColor") }}</td>
            <td>
              <input type="color" v-model="settings.nodeColor" />
              <span>{{ settings.nodeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.selectedNodeColor") }}</td>
            <td>
              <input type="color" v-model="settings.selectedNodeColor" />
              <span>{{ settings.selectedNodeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.nodeSize") }}</td>
            <td>
              <input
                type="range"
                v-model.number="settings.nodeSize"
                min="5"
                max="50"
                step="1"
              />
              <span>{{ settings.nodeSize }}</span>
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.allowDragging") }}</td>
            <td>
              <input type="checkbox" v-model="settings.allowDragging" />
            </td>
          </tr>
          <tr class="section-header">
            <td colspan="2">
              <strong>{{ t("visualization.sections.edges") }}</strong>
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.edgeColor") }}</td>
            <td>
              <input type="color" v-model="settings.edgeColor" />
              <span>{{ settings.edgeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.highlightedEdgeColor") }}</td>
            <td>
              <input type="color" v-model="settings.highlightedEdgeColor" />
              <span>{{ settings.highlightedEdgeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.edgeSize") }}</td>
            <td>
              <input
                type="range"
                v-model.number="settings.edgeSize"
                min="1"
                max="30"
                step="1"
              />
              <span>{{ settings.edgeSize }}</span>
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.useEdgeWeights") }}</td>
            <td>
              <input type="checkbox" v-model="settings.useEdgeWeights" />
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.renderEdgeLabels") }}</td>
            <td>
              <input type="checkbox" v-model="settings.renderEdgeLabels" />
            </td>
          </tr>
          <tr class="section-header">
            <td colspan="2">
              <strong>{{ t("visualization.sections.background") }}</strong>
            </td>
          </tr>
          <tr>
            <td>{{ t("visualization.settings.backgroundColor") }}</td>
            <td>
              <input type="color" v-model="settings.backgroundColor" />
              <span>{{ settings.backgroundColor }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue"
import { useTabsStore } from "@/stores/tabsStore"
import { storeToRefs } from "pinia"
import { useI18n } from "vue-i18n"
const { t } = useI18n()

const tabsStore = useTabsStore()
const { selectedVisualizationOptions } = storeToRefs(tabsStore)

const settings = reactive({
  nodeColor: "#3498db",
  selectedNodeColor: "#ff3333",
  nodeSize: 10,
  allowDragging: true,
  edgeColor: "#000000",
  highlightedEdgeColor: "#ff9900",
  edgeSize: 1.5,
  useEdgeWeights: false,
  renderEdgeLabels: true,
  backgroundColor: "#ffffff",
})

watch(
  selectedVisualizationOptions,
  val => {
    if (val) Object.assign(settings, val)
  },
  { immediate: true },
)

watch(
  settings,
  val => {
    selectedVisualizationOptions.value = { ...val }
  },
  { deep: true },
)
</script>

<style scoped>
.panel-section {
  border: 2px solid black;
  padding: 8px;
  width: 100%;
  font-family: sans-serif;
}

.section-header {
  background-color: #f0f0f0;
  text-align: center;
  font-weight: bold;
}

h2 {
  margin-top: 0;
  text-align: center;
  margin-bottom: 8px;
}

.table-wrapper {
  border: 2px solid black;
  max-height: 400px;
  overflow-y: auto;
}
.table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.settings-table {
  width: 100%;
  border-collapse: collapse;
}

.settings-table td {
  padding: 8px;
  border: 1px solid #999;
  font-size: 16px;
}

input[type="color"] {
  margin-right: 8px;
  width: 32px;
  height: 32px;
  border: 1px solid #333;
  padding: 0;
}

input[type="number"] {
  width: 80px;
  padding: 4px;
}

select {
  font-size: 16px;
  padding: 4px;
  border-radius: 6px;
  border: 2px solid black;
}
</style>
