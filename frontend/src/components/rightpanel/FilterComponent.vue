<template>
  <div class="panel-section">
    <h2>Filters / Queries</h2>
    <button>Search by id</button>
    <button>Edge Weight</button>
    <button>Edge Type</button>
    <button>Degree Range</button>
    <button>Neighbors Network</button>
    <button>Group by</button>
    <button>LLM</button>
    <div class="search-area">
      <label>Search in:</label>
      <select>
        <option>Nodes</option>
      </select>
      <input placeholder="(e.g. 1234)" />
      <button>Search</button>
      <button>Reset</button>
    </div>
  </div>
</template>

<style scoped>
button {
  margin: 4px 0;
  width: 100%;
}

.search-area {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
