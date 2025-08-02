<template>
  <div class="panel-section">
    <h2>{{ t("statistics.title") }}</h2>
    <div v-for="s in statDefs" :key="s.key" class="stat-row">
      <span class="label">{{ t(`statistics.labels.${s.key}`) }}</span>
      <span class="value">
        {{ loading[s.key] ? "…" : (resultRefs[s.key]?.value ?? "—") }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { reactive, toRef, onMounted, watch, onBeforeUnmount } from "vue"
import { useGraphStatistics } from "@/composables/useGraphStatistics"
import { storeToRefs } from "pinia"
import { useTabsStore } from "@/stores/tabsStore"
const props = defineProps({ graph: Object })

const tabsStore = useTabsStore()
const {
  averageDegree,
  avgWeightedDegree,
  networkDiameter,
  networkDensity,
  simpleSize,
} = storeToRefs(tabsStore)
const stats = useGraphStatistics(toRef(props, "graph"))

const { t } = useI18n()

const statDefs = [
  { key: "averageDegree", fn: stats.getAverageDegree },
  { key: "avgWeightedDegree", fn: stats.getAverageWeightedDegree },
  { key: "networkDiameter", fn: stats.getNetworkDiameter },
  { key: "networkDensity", fn: stats.getGraphDensity },
  { key: "simpleSize", fn: stats.getSimpleSize },
]
const resultRefs = {
  averageDegree,
  avgWeightedDegree,
  networkDiameter,
  networkDensity,
  simpleSize,
}

const loading = reactive({})

function runAllStats() {
  for (const def of statDefs) {
    runStat(def.key)
  }
}

async function runStat(key) {
  const def = statDefs.find(d => d.key === key)
  const targetRef = resultRefs[key]
  if (!def || !targetRef) return

  loading[key] = true
  try {
    const value = await def.fn()
    targetRef.value = value
  } finally {
    loading[key] = false
  }
}

function attachGraphListeners(graph) {
  if (!graph?.on) return
  graph.on("nodeAdded", runAllStats)
  graph.on("nodeDropped", runAllStats)
  graph.on("edgeAdded", runAllStats)
  graph.on("edgeDropped", runAllStats)
}

function detachGraphListeners(graph) {
  if (!graph?.off) return
  graph.off("nodeAdded", runAllStats)
  graph.off("nodeDropped", runAllStats)
  graph.off("edgeAdded", runAllStats)
  graph.off("edgeDropped", runAllStats)
}

onMounted(() => {
  if (!props.graph) return
  runAllStats()
  attachGraphListeners(props.graph)
})

onBeforeUnmount(() => {
  detachGraphListeners(props.graph)
})
watch(
  () => props.graph,
  (newGraph, oldGraph) => {
    detachGraphListeners(oldGraph)
    attachGraphListeners(newGraph)
    runAllStats()
  },
)
</script>

<style scoped>
.panel-section {
  border: 2px solid black;
  padding: 8px;
  width: 100%;
  font-family: sans-serif;
}

h2 {
  margin-top: 0;
  text-align: center;
  margin-bottom: 8px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.label {
  font-size: 16px;
}

.run-button {
  padding: 4px 12px;
  font-size: 16px;
  border: 2px solid black;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>
