<template>
  <div class="panel-section">
    <h2>{{ t("filters.title") }}</h2>

    <button
      v-for="filter in filters"
      :key="filter.key"
      :class="{ active: selectedFilter === filter.key }"
      @click="selectedFilter = filter.key"
    >
      {{ t(`filters.buttons.${filter.key}`) }}
    </button>

    <div class="search-area">
      <div class="search-row">
        <template v-if="selectedFilter === 'searchByName'">
          <label>{{ t("filters.search.label") }}:</label>
          <select v-model="searchIn">
            <option value="Nodes">{{ t("filters.search.nodes") }}</option>
            <option value="Edges">{{ t("filters.search.edges") }}</option>
          </select>
        </template>
        <template v-else>
          <span>
            {{ t("filters.search.comingSoon") }}:
            {{ t(`filters.buttons.${selectedFilter}`) }}
          </span>
        </template>
      </div>

      <div class="search-row" v-if="selectedFilter === 'searchByName'">
        <label v-if="searchIn === 'Nodes'">
          <input
            v-model="searchTerm"
            :placeholder="t('filters.search.placeholderNode')"
          />
        </label>
        <label v-else>
          <input
            v-model="searchTerm"
            :placeholder="t('filters.search.placeholderEdge')"
          />
        </label>

        <button class="search-button" @click="performSearch">
          {{ t("filters.search.search") }}
        </button>
        <button class="reset-button" @click="resetSearch">
          {{ t("filters.search.reset") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed } from "vue"
import { useTabsStore } from "@/stores/tabsStore"
import { useFileStore } from "@/stores/fileStore"
import { useI18n } from "vue-i18n"
const props = defineProps({
  graph: Object,
})

const { t } = useI18n()

const tabsStore = useTabsStore()
const fileStore = useFileStore()

const selectedFilter = computed({
  get: () => tabsStore.selectedFilter,
  set: v => (tabsStore.selectedFilter = v),
})
const searchTerm = computed({
  get: () => tabsStore.selectedSearchTerm,
  set: v => (tabsStore.selectedSearchTerm = v),
})
const searchIn = computed({
  get: () => tabsStore.selectedSearchIn,
  set: v => (tabsStore.selectedSearchIn = v),
})

const filters = [
  { key: "searchByName" },
  { key: "edgeWeight" },
  { key: "edgeType" },
  { key: "degreeRange" },
  { key: "neighborsNetwork" },
  { key: "groupBy" },
  { key: "llm" },
]

function performSearch() {
  if (selectedFilter.value !== "searchByName" || !searchTerm.value.trim())
    return

  const term = searchTerm.value.trim()

  try {
    if (searchIn.value === "Nodes") {
      fileStore.focusNode(term)
    } else {
      const [src, tgt] = term.split(",").map(s => s.trim())
      fileStore.focusEdgeEndpoints(src, tgt)
    }
  } catch (err) {
    console.log("focusNode/Edge threw!", err)
  }
}

function resetSearch() {
  const term = searchTerm.value.trim()

  if (term && props.graph) {
    if (searchIn.value === "Nodes") {
      if (props.graph.hasNode(term))
        props.graph.setNodeAttribute(term, "highlighted", false)
    } else {
      const [src, tgt] = term.split(",").map(s => s.trim())
      const eid = props.graph.edges(src, tgt)[0]
      if (eid) {
        props.graph.setEdgeAttribute(eid, "highlighted", false)
        props.graph.setNodeAttribute(src, "highlighted", false)
        props.graph.setNodeAttribute(tgt, "highlighted", false)
      }
    }
  }

  searchTerm.value = ""
  fileStore.focusNode(null)
  fileStore.focusEdgeEndpoints(null, null)
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
  margin: 0 0 8px;
  text-align: center;
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
.search-area::-webkit-scrollbar {
  height: 8px;
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
  padding: 6px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}
</style>
