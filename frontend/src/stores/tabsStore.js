import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useTabsStore = defineStore("tabs", () => {
  const graphs = ref([])
  const nodeFiles = ref([])
  const edgeFiles = ref([])
  const layoutTypes = ref([])
  const layoutParams = ref([])

  const tabsData = ref([])

  const idToIndex = id => tabsData.value.findIndex(o => o.id == id)
  const tabsCount = computed(() => tabsData.value.length)

  const selectedTabId = ref(null)
  const selectedTabIndex = computed(() => idToIndex(selectedTabId.value))

  const selectedGraph = computed({
    get() {
      if (graphs.value.length > 0)
        return graphs.value[selectedTabIndex.value].value ?? null
      return null
    },
    set(newVal) {
      if (graphs.value.length > 0 && graphs.value[selectedTabIndex.value])
        graphs.value[selectedTabIndex.value].value = newVal
    },
  })

  function getSelectedGraph() {
    return graphs.value[selectedTabIndex.value]
  }

  function removeTab(id) {
    const index = idToIndex(id)
    tabsData.value.splice(index, 1)
    graphs.value.splice(index, 1)
  }

  function addTab(tabData) {
    console.log(tabData)
    graphs.value.push(ref(null))
    tabsData.value.push(tabData)
  }

  function resetSelectedTab() {
    if (tabsData.value.length == 0) {
      selectedTabId.value = null
    } else {
      console.log(tabsData.value)
      selectedTabId.value = tabsData.value[0].id
    }
  }

  return {
    selectedGraph,
    removeTab,
    addTab,
    resetSelectedTab,
    selectedTabId,
    tabsCount,
    tabsData,
  }
})
