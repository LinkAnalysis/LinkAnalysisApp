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
      <template v-if="selectedFilter === 'degreeRange'">
        <div class="search-row">
          <label>{{ t("filters.degreeRange.minDegree") }}:</label>
          <input type="number" v-model.number="minDegree" min="0" />
        </div>
        <div class="search-row">
          <label>{{ t("filters.degreeRange.maxDegree") }}:</label>
          <input type="number" v-model.number="maxDegree" :min="minDegree" />
        </div>
        <div class="search-row">
          <button class="search-button" @click="applyDegreeFilter">
            {{ t("filters.degreeRange.apply") }}
          </button>
          <button class="reset-button" @click="resetDegreeFilter">
            {{ t("filters.degreeRange.reset") }}
          </button>
        </div>
      </template>

      <template v-else-if="selectedFilter === 'searchByName'">
        <div class="search-row">
          <label>{{ t("filters.search.label") }}:</label>
          <select v-model="searchIn">
            <option value="Nodes">{{ t("filters.search.nodes") }}</option>
            <option value="Edges">{{ t("filters.search.edges") }}</option>
          </select>
        </div>
        <div class="search-row">
          <label>
            <input
              v-model="searchTerm"
              :placeholder="
                t(
                  searchIn === 'Nodes'
                    ? 'filters.search.placeholderNode'
                    : 'filters.search.placeholderEdge',
                )
              "
            />
          </label>
          <button class="search-button" @click="performSearch">
            {{ t("filters.search.search") }}
          </button>
          <button class="reset-button" @click="resetSearch">
            {{ t("filters.search.reset") }}
          </button>
        </div>
      </template>

      <template v-else-if="selectedFilter === 'edgeWeight'">
        <div class="search-row">
          <label>{{ t("filters.edgeWeight.minWeight") }}:</label>
          <input type="number" v-model.number="minWeight" />
        </div>
        <div class="search-row">
          <label>{{ t("filters.edgeWeight.maxWeight") }}:</label>
          <input type="number" v-model.number="maxWeight" :min="minWeight" />
        </div>
        <div class="search-row">
          <button class="search-button" @click="applyEdgeWeightFilter">
            {{ t("filters.edgeWeight.apply") }}
          </button>
          <button class="reset-button" @click="resetEdgeWeightFilter">
            {{ t("filters.edgeWeight.reset") }}
          </button>
        </div>
      </template>

      <template v-else>
        <div class="search-row">
          <span>
            {{ t("filters.search.comingSoon") }}:
            {{ t(`filters.buttons.${selectedFilter}`) }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed, ref } from "vue"
import { useTabsStore } from "@/stores/tabsStore"
import { useFileStore } from "@/stores/fileStore"
import { useI18n } from "vue-i18n"

const props = defineProps({ graph: Object })

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

const minDegree = ref(0)
const maxDegree = ref(10)

const minWeight = ref(0)
const maxWeight = ref(100)

const filters = [
  { key: "searchByName" },
  { key: "edgeWeight" },
  // { key: "edgeType" },
  { key: "degreeRange" },
  // { key: "neighborsNetwork" },
  // { key: "groupBy" },
  // { key: "llm" },
]

function applyDegreeFilter() {
  console.log("graph type: ", props.graph.type)
  if (!props.graph) return

  props.graph.forEachNode((node, attributes) => {
    const degree = props.graph.degree(node)
    const hidden = degree < minDegree.value || degree > maxDegree.value

    props.graph.setNodeAttribute(node, "hidden", hidden)

    if (hidden && attributes.highlighted) {
      props.graph.setNodeAttribute(node, "highlighted", false)
    }
    if (hidden) {
      props.graph.forEachOutEdge(node, (edge, edgeAttrs) => {
        if (edgeAttrs.highlighted) {
          props.graph.setEdgeAttribute(edge, "highlighted", false)
        }
      })
    }
  })

  fileStore.refreshGraph()
}

function resetDegreeFilter() {
  if (!props.graph) return

  props.graph.forEachNode(node => {
    props.graph.setNodeAttribute(node, "hidden", false)
  })

  minDegree.value = 0
  maxDegree.value = 10
}

function applyEdgeWeightFilter() {
  if (!props.graph) return

  props.graph.forEachEdge((edge, attributes, source, target) => {
    const weight = attributes.weight || 0
    const hidden = weight < minWeight.value || weight > maxWeight.value

    props.graph.setEdgeAttribute(edge, "hidden", hidden)

    if (hidden && attributes.highlighted) {
      props.graph.setEdgeAttribute(edge, "highlighted", false)
      props.graph.setNodeAttribute(source, "highlighted", false)
      props.graph.setNodeAttribute(target, "highlighted", false)
    }
  })

  fileStore.refreshGraph()
}

function resetEdgeWeightFilter() {
  if (!props.graph) return

  props.graph.forEachEdge(edge => {
    props.graph.setEdgeAttribute(edge, "hidden", false)
  })

  minWeight.value = 0
  maxWeight.value = 100

  fileStore.refreshGraph()
}

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
