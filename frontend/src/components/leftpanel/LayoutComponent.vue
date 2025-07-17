<template>
  <div class="layout-settings">
    <h2>Layout</h2>

    <select v-model="selectedLayout" class="dropdown">
      <option v-for="layout in layouts" :key="layout" :value="layout">
        {{ layout }}
      </option>
    </select>

    <table class="settings-table">
      <tbody>
        <tr v-for="(value, key) in currentParams" :key="key">
          <td>{{ formatLabel(key) }}</td>
          <td v-if="typeof value === 'boolean'">
            <input
              type="checkbox"
              v-model="layoutParams[selectedLayout][key]"
            />
          </td>
          <td v-else>
            <input
              type="number"
              v-model.number="layoutParams[selectedLayout][key]"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <button class="apply-button" @click="applySettings">Apply</button>
  </div>
</template>

<script>
export default {
  name: "LayoutSettings",
  data() {
    return {
      selectedLayout: "Force Atlas 2",
      layouts: ["Force Atlas 2", "Fruchterman-Reingold", "Yifan Hu"],
      layoutParams: {
        "Force Atlas 2": {
          iterations: 1000,
          gravity: 1.0,
          scalingRatio: 10,
          strongGravityMode: true,
        },
        "Fruchterman-Reingold": {
          area: 10000,
          gravity: 5,
          speed: 0.1,
        },
        "Yifan Hu": {
          optimalDistance: 30,
          relativeStrength: 0.2,
          stepRatio: 0.95,
        },
      },
    }
  },
  computed: {
    currentParams() {
      return this.layoutParams[this.selectedLayout]
    },
  },
  methods: {
    applySettings() {
      console.log("Applied layout config:", {
        layout: this.selectedLayout,
        parameters: this.currentParams,
      })
    },
    formatLabel(key) {
      // np. strongGravityMode → Strong Gravity Mode
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase())
    },
  },
}
</script>

<style scoped>
.layout-settings {
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

.dropdown {
  width: 100%;
  padding: 6px;
  font-size: 16px;
  margin-bottom: 16px;
  border: 2px solid black;
  border-radius: 8px;
}

.settings-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.settings-table td {
  padding: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

input[type="checkbox"] {
  width: 24px;
  height: 24px;
  accent-color: black;
}

input[type="number"] {
  width: 100%;
  font-size: 16px;
  padding: 4px;
}

.apply-button {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}
</style>
