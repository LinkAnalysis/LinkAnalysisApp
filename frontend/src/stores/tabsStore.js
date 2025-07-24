import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { visualizationDefaultOptions } from "../config/visualizationDefaults"

const getFileName = fullPath => {
  return fullPath ? fullPath.split(/[/\\]/).pop() : ""
}

export const useTabsStore = defineStore("tabs", () => {
  const graphs = ref([])
  const nodeFiles = ref([])
  const edgeFiles = ref([])
  const layoutTypes = ref([])
  const layoutParams = ref([])
  const visualizationOptions = ref([])

  const tabsData = ref([])

  const idToIndex = id => tabsData.value.findIndex(o => o.id == id)
  const tabsCount = computed(() => tabsData.value.length)

  const graphViewRef = ref(null)

  const selectedTabId = ref(null)
  const selectedTabIndex = computed(() => idToIndex(selectedTabId.value))
  const graphMode = ref([])
  const numberOfRows = ref([])

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

  const selectedGraphChangedMarker = ref(false)
  function markSelectedGraphChange() {
    selectedGraphChangedMarker.value = !selectedGraphChangedMarker.value
  }

  function removeTab(id) {
    const index = idToIndex(id)
    tabsData.value.splice(index, 1)
    graphs.value.splice(index, 1)
    nodeFiles.value.splice(index, 1)
    edgeFiles.value.splice(index, 1)
    layoutTypes.value.splice(index, 1)
    layoutParams.value.splice(index, 1)
    visualizationOptions.value.splice(index, 1)
  }

  function addTab(tabData) {
    graphs.value.push(ref(null))
    nodeFiles.value.push(ref(null))
    edgeFiles.value.push(ref(null))
    layoutTypes.value.push(ref(null))
    layoutParams.value.push(ref(null))
    graphMode.value.push(ref(null))
    numberOfRows.value.push(ref(null))
    visualizationOptions.value.push(
      ref(structuredClone(visualizationDefaultOptions)),
    )

    tabsData.value.push(tabData)
  }

  function resetSelectedTab() {
    if (tabsData.value.length == 0) {
      selectedTabId.value = null
    } else {
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

  const selectedGraphMode = computed({
    get() {
      if (graphMode.value.length > 0)
        return graphMode.value[selectedTabIndex.value].value ?? null
      return null
    },
    set(newVal) {
      if (graphMode.value.length > 0 && graphMode.value[selectedTabIndex.value])
        graphMode.value[selectedTabIndex.value].value = newVal
    },
  })

  const selectedNumberOfRows = computed({
    get() {
      if (numberOfRows.value.length > 0)
        return numberOfRows.value[selectedTabIndex.value].value ?? null
      return null
    },
    set(newVal) {
      if (
        numberOfRows.value.length > 0 &&
        numberOfRows.value[selectedTabIndex.value]
      )
        numberOfRows.value[selectedTabIndex.value].value = newVal
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

  const selectedVisualizationOptions = computed({
    get() {
      if (visualizationOptions.value.length > 0)
        return visualizationOptions.value[selectedTabIndex.value].value ?? null
      return null
    },
    set(newVal) {
      if (
        visualizationOptions.value.length > 0 &&
        visualizationOptions.value[selectedTabIndex.value]
      )
        visualizationOptions.value[selectedTabIndex.value].value = newVal
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
    selectedGraphChangedMarker,
    markSelectedGraphChange,
    selectedVisualizationOptions,
    graphViewRef,
    selectedGraphMode,
    selectedNumberOfRows,
  }
})
