import { defineStore } from "pinia"
import { computed, ref, watch } from "vue"

const getFileName = fullPath => {
  return fullPath ? fullPath.split(/[/\\]/).pop() : ""
}

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

  function removeTab(id) {
    const index = idToIndex(id)
    tabsData.value.splice(index, 1)
    graphs.value.splice(index, 1)
    nodeFiles.value.splice(index, 1)
    edgeFiles.value.splice(index, 1)
    layoutTypes.value.splice(index, 1)
    layoutParams.value.splice(index, 1)
  }

  function addTab(tabData) {
    console.log(tabData)

    graphs.value.push(ref(null))
    nodeFiles.value.push(ref(null))
    edgeFiles.value.push(ref(null))
    layoutTypes.value.push(ref(null))
    layoutParams.value.push(ref(null))

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

  const selectedNodeFile = computed({
    get() {
      if (nodeFiles.value.length > 0)
        return nodeFiles.value[selectedTabIndex.value].value ?? null
      return null
    },
    set(newVal) {
      if (nodeFiles.value.length > 0 && nodeFiles.value[selectedTabIndex.value])
        nodeFiles.value[selectedTabIndex.value].value = newVal
    },
  })

  const selectedEdgeFile = computed({
    get() {
      if (edgeFiles.value.length > 0)
        return edgeFiles.value[selectedTabIndex.value].value ?? null
      return null
    },
    set(newVal) {
      if (edgeFiles.value.length > 0 && edgeFiles.value[selectedTabIndex.value])
        edgeFiles.value[selectedTabIndex.value].value = newVal
    },
  })

  const selectedLayout = computed({
    get() {
      if (layoutTypes.value.length > 0)
        return layoutTypes.value[selectedTabIndex.value].value ?? null
      return null
    },
    set(newVal) {
      if (
        layoutTypes.value.length > 0 &&
        layoutTypes.value[selectedTabIndex.value]
      )
        layoutTypes.value[selectedTabIndex.value].value = newVal
    },
  })

  const selectedLayoutParams = computed({
    get() {
      if (layoutParams.value.length > 0)
        return layoutParams.value[selectedTabIndex.value].value ?? null
      return null
    },
    set(newVal) {
      if (
        layoutParams.value.length > 0 &&
        layoutParams.value[selectedTabIndex.value]
      )
        layoutParams.value[selectedTabIndex.value].value = newVal
    },
  })

  const getSelectedEdgeFileName = computed(() =>
    getFileName(selectedEdgeFile.value),
  )
  const getSelectedNodeFileName = computed(() =>
    getFileName(selectedNodeFile.value),
  )

  return {
    getSelectedEdgeFileName,
    getSelectedNodeFileName,
    selectedEdgeFile,
    selectedNodeFile,
    selectedLayout,
    selectedLayoutParams,
    selectedGraph,
    removeTab,
    addTab,
    resetSelectedTab,
    selectedTabId,
    tabsCount,
    tabsData,
  }
})
