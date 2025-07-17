<template>
  <div class="panel-section">
    <h2>Statistics</h2>
    <div v-for="label in statLabels" :key="label" class="stat-row">
      <span class="label">{{ label }}</span>
      <button class="run-button">Run</button>
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
.panel-section {
  border: 2px solid black;
  padding: 16px 24px;
  width: 300px;
  font-family: sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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
