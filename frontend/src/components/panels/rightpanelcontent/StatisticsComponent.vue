<template>
  <div class="panel-section">
    <h2>{{ t("statistics.title") }}</h2>
    <div v-for="s in statDefs" :key="s.key" class="stat-row">
      <span class="label">{{ t(`statistics.labels.${s.key}`) }}</span>
      <span class="value">
        {{ loading[s.key] ? "…" : (resultRefs[s.key]?.value ?? "—") }}
      </span>
      <button
        class="run-button"
        :disabled="loading[s.key]"
        @click="runStat(s.key)"
      >
        {{ t("statistics.run") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { reactive, toRef } from "vue"
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

const statLabels = [
  "avgPathLength",
  "clusteringCoefficient",
  "assortativityCoefficient",
  "connectedComponents",
  "pageRange",
]
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
