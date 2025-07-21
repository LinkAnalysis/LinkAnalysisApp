import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useTabsStore = defineStore("tabs", () => {
  const graphs = ref([])
  const tabsData = ref([])
  const idToIndex = id => tabsData.value.findIndex(o => o.id == id)
  const tabsCount = computed(() => tabsData.value.length)

  const selectedTabId = ref(null)
  const selectedTabIndex = computed(() => idToIndex(selectedTabId.value))

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
    getSelectedGraph,
    removeTab,
    addTab,
    resetSelectedTab,
    selectedTabId,
    tabsCount,
    tabsData,
  }
})
