<template>
  <div v-if="selectedLayout && selectedLayoutParams" class="layout-settings">
    <h2>{{ t("layout.title") }}</h2>
    <select v-model="selectedLayout" class="dropdown">
      <option v-for="l in layoutsNames" :key="l.key" :value="l.key">
        {{ l.label }}
      </option>
    </select>

    <div>
      <table v-if="hasParams" class="settings-table">
        <tbody>
          <template v-for="(value, key) in currentParams">
            <template v-if="typeof value === 'object'" v-for="(v, k) in value">
              <tr>
                <td>{{ formatLabel(k) }}</td>
                <td v-if="typeof v === 'boolean'">
                  <input
                    type="checkbox"
                    v-model="selectedLayoutParams[key][k]"
                  />
                </td>
                <td v-else="typeof v === 'number'">
                  <input type="number" v-model="selectedLayoutParams[key][k]" />
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td>{{ formatLabel(key) }}</td>
                <td v-if="typeof value === 'boolean'">
                  <input type="checkbox" v-model="selectedLayoutParams[key]" />
                </td>
                <td v-else>
                  <input
                    type="number"
                    v-model.number="selectedLayoutParams[key]"
                  />
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
      <button v-if="hasParams" class="reset-button" @click="resetSettings">
        {{ t("layout.reset") }}
      </button>
      <button class="apply-button" @click="applySettings">
        {{ t("layout.apply") }}
      </button>
      <button v-if="canSimulate" @click="createSimulation" class="reset-button">
        Create simulation
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTabsStore } from "@/stores/tabsStore"
import { layouts as layoutsMap } from "@/composables/layouts"
import { storeToRefs } from "pinia"
import { computed, watch } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const tabsStore = useTabsStore()
const { selectedLayout, selectedLayoutParams, selectedTabId } =
  storeToRefs(tabsStore)

const layoutsNames = computed(() =>
  Object.keys(layoutsMap).map(k => ({
    key: k,
    label: t(`layout.layouts.${k}`),
  })),
)
const defaultLayoutParams = Object.keys(layoutsMap).reduce(
  (acc, k) => ({ ...acc, [k]: { ...layoutsMap[k].defaultParams } }),
  {},
)

const currentParams = computed(() => selectedLayoutParams.value)
const hasParams = computed(
  () => (Object.keys(selectedLayoutParams.value).length ?? 0) > 0,
)
const canSimulate = computed(() =>
  Object.keys(layoutsMap[selectedLayout.value]).includes("simulate"),
)

watch(
  [selectedLayout, selectedTabId],
  ([newLayout, newTabId], [oldLayout, oldTabId]) => {
    if (oldTabId != newTabId) {
      return
    }
    selectedLayoutParams.value = JSON.parse(
      JSON.stringify(defaultLayoutParams[newLayout]),
    )
  },
)

// when tab is changed, initialize its layout and layout params to defaults
watch(
  selectedTabId,
  newVal => {
    if (newVal != null) {
      if (!selectedLayout.value) {
        selectedLayout.value = layoutsNames.value[0]?.key
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

const emit = defineEmits(["applyLayout", "createSimulationWorker"])

const applySettings = () => {
  emit("applyLayout")
}

const createSimulation = () => {
  emit("createSimulationWorker")
}

const resetSettings = () => {
  selectedLayoutParams.value = JSON.parse(
    JSON.stringify(defaultLayoutParams[selectedLayout.value]),
  ) //{ ...defaultLayoutParams[selectedLayout.value] }
}

const formatLabel = key => {
  const translation = t(`layout.params.${key}`)
  return translation !== `layout.params.${key}`
    ? translation
    : key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())
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
