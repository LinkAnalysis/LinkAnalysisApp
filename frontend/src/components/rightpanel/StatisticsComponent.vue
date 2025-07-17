<template>
  <div class="panel-section">
    <h2>Statistics</h2>
    <div v-for="label in statLabels" :key="label" class="stat-row">
      <span>{{ label }}</span>
      <button>Run</button>
    </div>
  </div>
</template>

<script setup>
const statLabels = [
  "Avarage Degree",
  "Avg. Weighted Degree",
  "Network Diameter",
  "Graph Density",
  "Avg. Path Length",
  "Clustering Coefficient",
  "Assortativity Coefficient",
  "Connected Components",
  "PageRange",
]
</script>

<style scoped>
.stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

button {
  margin-left: 8px;
}
</style>
