import { watch } from "vue"
import { useFileStore } from "@/stores/fileStore"
import { useTabsStore } from "@/stores/tabsStore"
import { storeToRefs } from "pinia"

export function useGraphState({ renderer, graph, resetCamera }) {
  const fileStore = useFileStore()
  const tabsStore = useTabsStore()
  const { selectedGraphChangedMarker } = storeToRefs(tabsStore)

  const searchHighlighted = new Set()

  watch(
    () => fileStore.focusedNodeId,
    query => {
      searchHighlighted.forEach(id =>
        graph.removeNodeAttribute(id, "highlighted"),
      )
      searchHighlighted.clear()
      renderer.value?.refresh()

      if (!query) return

      const ids = graph.hasNode(query)
        ? [query]
        : findNodesByPrefix(graph, query)

      if (!ids.length) return

      ids.forEach(id => {
        graph.setNodeAttribute(id, "highlighted", true)
        searchHighlighted.add(id)
      })
      renderer.value?.refresh()

      const { x, y } = averageCoords(renderer.value, ids)
      const cam = renderer.value.getCamera()
      cam.animate({ x, y, ratio: cam.getState().ratio }, { duration: 600 })
    },
  )

  const edgeNodesHighlighted = new Set()
  let focusedEdgeId = null

  watch(
    () => [fileStore.focusedEdgeSource, fileStore.focusedEdgeTarget],
    ([source, target]) => {
      edgeNodesHighlighted.forEach(id =>
        graph.removeNodeAttribute(id, "highlighted"),
      )
      edgeNodesHighlighted.clear()
      if (focusedEdgeId && graph.hasEdge(focusedEdgeId))
        graph.removeEdgeAttribute(focusedEdgeId, "highlighted")
      focusedEdgeId = null
      renderer.value?.refresh()

      if (!source || !target) return
      const edgeIds = graph.edges(source, target)
      if (!edgeIds.length) return
      if (!graph.hasEdge(source, target)) return
      ;[source, target].forEach(id => {
        graph.setNodeAttribute(id, "highlighted", true)
        edgeNodesHighlighted.add(id)
      })

      edgeIds.forEach(eId => {
        graph.setEdgeAttribute(eId, "highlighted", true)
      })
      focusedEdgeId = edgeIds[0]
      renderer.value?.refresh()

      const { x, y } = midpoint(renderer.value, source, target)
      renderer.value
        .getCamera()
        .animate({ x, y }, { duration: 600, easing: "quadraticInOut" })
    },
  )

  watch(selectedGraphChangedMarker, () => resetCamera())
}

function findNodesByPrefix(graph, q) {
  const query = q.toLowerCase()
  const res = []
  graph.forEachNode((id, a) => {
    if ((a.label || "").toLowerCase().startsWith(query)) res.push(id)
  })
  return res
}

function averageCoords(r, ids) {
  let sx = 0,
    sy = 0
  ids.forEach(id => {
    const { x, y } = r.getNodeDisplayData(id)
    sx += x
    sy += y
  })
  return { x: sx / ids.length, y: sy / ids.length }
}

function midpoint(r, n1, n2) {
  const a = r.getNodeDisplayData(n1)
  const b = r.getNodeDisplayData(n2)
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}
