<template>
  <div class="panel-section">
    <h2>Filters / Queries</h2>

    <button
      v-for="filter in filters"
      :key="filter"
      :class="{ active: selectedFilter === filter }"
      @click="selectedFilter = filter"
    >
      {{ filter }}
    </button>

    <div class="search-area">
      <div class="search-row">
        <!-- Dynamiczna zawartość -->
        <template v-if="selectedFilter === 'Search by id'">
          <label>Search in:</label>
          <select v-model="searchIn">
            <option>Nodes</option>
            <option>Edges</option>
          </select>
        </template>

        <template v-else>
          <span>Coming soon: {{ selectedFilter }}</span>
        </template>
      </div>

      <div class="search-row" v-if="selectedFilter === 'Search by id'">
        <input v-model="searchTerm" placeholder="(e.g. 1234)" />
        <button class="search-button" @click="performSearch">🔍</button>
        <button class="reset-button" @click="resetSearch">🔄️</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FiltersQueries",
  data() {
    return {
      filters: [
        "Search by id",
        "Edge Weight",
        "Edge Type",
        "Degree Range",
        "Neighbors Network",
        "Group by",
        "LLM",
      ],
      selectedFilter: "Search by id",
      searchTerm: "",
      searchIn: "Nodes",
    }
  },
  methods: {
    performSearch() {
      console.log(`Searching ${this.searchIn} for "${this.searchTerm}"`)
    },
    resetSearch() {
      this.searchTerm = ""
    },
  },
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

button {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}
button.active {
  background-color: lightgray;
  font-weight: bold;
}

.search-area {
  margin-top: 8px;
  padding: 12px;
  border: 2px solid black;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

select {
  padding: 4px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 6px;
}

input {
  flex: 1;
  padding: 6px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
}

.search-button,
.reset-button {
  margin: auto;
  padding: 6px 6px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}
</style>
