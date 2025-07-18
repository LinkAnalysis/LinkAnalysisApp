<template>
  <div class="layout-settings">
    <h2>Layout</h2>
    <select v-model="selectedLayout" class="dropdown">
      <option v-for="l in layouts" :key="l.key" :value="l.key">
        {{ l.label }}
      </option>
    </select>

    <div>
      <table v-if="hasParams" class="settings-table">
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
  </div>
</template>

<script>
import { useFileStore } from "@/stores/fileStore"
import { layouts as layoutsMap } from "@/composables/layouts"

export default {
  name: "LayoutSettings",
  data() {
    return {
      fileStore: useFileStore(),
      selectedLayout: "circular",
      layouts: [
        { key: "circular", label: "Circular" },
        { key: "forceAtlas2", label: "Force Atlas 2" },
      ],
      layoutParams: {
        circular: { ...layoutsMap.circular.defaultParams },
        forceAtlas2: { ...layoutsMap.forceAtlas2.defaultParams },
      },
    }
  },
  computed: {
    currentParams() {
      return this.layoutParams[this.selectedLayout]
    },
    hasParams() {
      return Object.keys(this.currentParams).length > 0
    },
  },
  methods: {
    applySettings() {
      this.fileStore.setLayout(this.selectedLayout, this.currentParams)
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
