<template>
  <div class="panel-section">
    <h2>{{ t("statistics.title") }}</h2>
    <div v-for="label in statLabels" :key="label" class="stat-row">
      <span class="label">{{ t(`statistics.labels.${label}`) }}</span>
      <button class="run-button">{{ t("statistics.run") }}</button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"
const { t } = useI18n()

const statLabels = [
  "averageDegree",
  "avgWeightedDegree",
  "networkDiameter",
  "graphDensity",
  "avgPathLength",
  "clusteringCoefficient",
  "assortativityCoefficient",
  "connectedComponents",
  "pageRange",
]
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
