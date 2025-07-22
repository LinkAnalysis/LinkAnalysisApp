<template>
  <div v-if="selectedLayout && selectedLayoutParams" class="layout-settings">
    <h2>Layout</h2>
    <select v-model="selectedLayout" class="dropdown">
      <option v-for="l in layoutsNames" :key="l.key" :value="l.key">
        {{ l.label }}
      </option>
    </select>

    <div>
      <table v-if="hasParams" class="settings-table">
        <tbody>
          <tr v-for="(value, key) in currentParams" :key="key">
            <td>{{ formatLabel(key) }}</td>
            <td v-if="typeof value === 'boolean'">
              <input type="checkbox" v-model="selectedLayoutParams[key]" />
            </td>
            <td v-else>
              <input type="number" v-model.number="selectedLayoutParams[key]" />
            </td>
          </tr>
        </tbody>
      </table>
      <button class="apply-button" @click="applySettings">Apply</button>
      <button v-if="hasParams" class="reset-button" @click="resetSettings">
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTabsStore } from "@/stores/tabsStore"
import { layouts as layoutsMap } from "@/composables/layouts"
import { storeToRefs } from "pinia"
import { computed, onMounted, ref, watch } from "vue"
import { LogPrint } from "../../../../wailsjs/runtime/runtime"

const tabsStore = useTabsStore()
const { selectedLayout, selectedLayoutParams, selectedTabId } =
  storeToRefs(tabsStore)

const layoutsNames = Object.keys(layoutsMap).map(k => ({ key: k, label: k }))
const defaultLayoutParams = Object.keys(layoutsMap).reduce(
  (acc, k) => ({ ...acc, [k]: { ...layoutsMap[k].defaultParams } }),
  {},
)

const currentParams = computed(() => selectedLayoutParams.value)
const hasParams = computed(
  () => (Object.keys(selectedLayoutParams.value).length ?? 0) > 0,
)

watch(
  [selectedLayout, selectedTabId],
  ([newLayout, newTabId], [oldLayout, oldTabId]) => {
    if (oldTabId != newTabId) {
      return
    }
    selectedLayoutParams.value = { ...defaultLayoutParams[newLayout] }
  },
)

// when tab is changed, initialize its layout and layout params to defaults
watch(
  selectedTabId,
  newVal => {
    if (newVal != null) {
      if (!selectedLayout.value) {
        selectedLayout.value = layoutsNames[0].key
      }
      if (!selectedLayoutParams.value) {
        selectedLayoutParams.value = {
          ...defaultLayoutParams[selectedLayout.value],
        }
      }
    }
  },
  { immediate: true },
)

const emit = defineEmits(["applyLayout"])

const applySettings = () => {
  emit("applyLayout")
}

const resetSettings = () => {
  selectedLayoutParams.value = { ...defaultLayoutParams[selectedLayout.value] }
}

const formatLabel = key => {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())
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

.apply-button,
.reset-button {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 2px solid black;
  margin-bottom: 2px;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}
</style>
