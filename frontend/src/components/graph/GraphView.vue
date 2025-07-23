<script setup>
import Graph from "graphology"
import Sigma from "sigma"
import VertexWindow from "./VertexWindow.vue"
import { useI18n } from "vue-i18n"
import { useFileStore } from "../../stores/fileStore"
import { useTabsStore } from "../../stores/tabsStore"
import { onBeforeUnmount, onMounted, ref, watch, toRefs } from "vue"
import { storeToRefs } from "pinia"
import { normalizeGraphCoordinates } from "../../composables/layouts"
import GraphControls from "./GraphControls.vue"

const props = defineProps({
  graph: Graph,
  changed: Number,
  options: { type: Object, default: () => ({}) },
})

const tabsStore = useTabsStore()
const { selectedGraphChangedMarker } = storeToRefs(tabsStore)

const clickedNodeData = ref(null)
const popupPosition = ref({ x: 0, y: 0 })
const clickedNodeId = ref(null)
const container = ref(null)
const { options } = toRefs(props)
const { t } = useI18n()

let renderer = null

watch(selectedGraphChangedMarker, _ => {
  resetCamera()
})

let draggedNode = null
let isDragging = false

const zoomIn = () => renderer?.getCamera().animatedZoom({ duration: 600 })
const zoomOut = () => renderer?.getCamera().animatedUnzoom({ duration: 600 })
const resetCamera = (resetZoom = false) => {
  if (renderer != null) {
    renderer.refresh()
    normalizeGraphCoordinates(props.graph)
    renderer.setCustomBBox({ x: [0, 1], y: [0, 1] })
    if (resetZoom) renderer.getCamera().animatedReset()
    else renderer.getCamera().animate({ x: 0.5, y: 0.5 })
  }
}

const fileStore = useFileStore()
const searchHighlighted = ref([])
const edgesNodesHighlighted = ref([])
watch(
  () => fileStore.focusedNodeId,
  query => {
    searchHighlighted.value.forEach(id =>
      props.graph.removeNodeAttribute(id, "highlighted"),
    )
    renderer.refresh()
    searchHighlighted.value = []
    if (!query || !renderer) {
      fileStore.focusNode(null)
      return
    }

    let ids = []
    if (props.graph.hasNode(query)) {
      ids = [query]
    } else {
      ids = findNodesByLabelPrefix(query)
    }

    if (!ids.length) {
      fileStore.focusNode(null)
      return
    }

    ids.forEach(id => props.graph.setNodeAttribute(id, "highlighted", true))
    searchHighlighted.value = ids
    renderer.refresh()
    let sx = 0,
      sy = 0
    ids.forEach(id => {
      const target = renderer.getNodeDisplayData(id)
      sx += target.x
      sy += target.y
    })
    const cx = sx / ids.length
    const cy = sy / ids.length

    const cam = renderer.getCamera()
    const ratio = cam.getState().ratio

    cam.animate({ x: cx, y: cy, ratio }, { duration: 600 })
  },
)

watch(
  () => [fileStore.focusedEdgeSource, fileStore.focusedEdgeTarget],
  ([source, target]) => {
    edgesNodesHighlighted.value.forEach(id =>
      props.graph.removeNodeAttribute(id, "highlighted"),
    )
    edgesNodesHighlighted.value = []
    renderer?.refresh()
    if (!source || !target || !renderer || !props.graph) return

    const edgeKey = props.graph.edge(source, target)
    if (!edgeKey) return
    edgesNodesHighlighted.value = [source, target]
    renderer.refresh()

    const node1 = renderer.getNodeDisplayData(source)
    const node2 = renderer.getNodeDisplayData(target)
    props.graph.setNodeAttribute(target, "highlighted", true)
    props.graph.setNodeAttribute(source, "highlighted", true)
    const x = (node1.x + node2.x) / 2
    const y = (node1.y + node2.y) / 2

    renderer
      .getCamera()
      .animate({ x, y }, { duration: 600, easing: "quadraticInOut" })
  },
)

watch(
  options,
  (newO, oldO) => {
    if (!renderer) return
    if (newO.backgroundColor !== oldO?.backgroundColor) {
      renderer.getContainer().style.background = newO.backgroundColor
    }
    if (newO.nodeColor && newO.nodeColor !== oldO?.nodeColor) {
      updateNodeColors(newO)
    }
    if (newO.edgeColor && newO.edgeColor !== oldO?.edgeColor) {
      updateEdgeColors(newO)
    }
    if (newO.nodeSize && newO.nodeSize !== oldO?.nodeSize) {
      updateNodeSizes(newO.nodeSize)
    }
    if (newO.renderEdgeLabels !== oldO?.renderEdgeLabels) {
      renderer.setSetting("renderEdgeLabels", newO.renderEdgeLabels)
    }
    if (
      newO.edgeSize !== oldO?.edgeSize ||
      newO.useEdgeWeights !== oldO?.useEdgeWeights
    ) {
      updateEdgeSizes(newO)
    }
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  renderer = new Sigma(props.graph, container.value, {
    minCameraRatio: 0.08,
    maxCameraRatio: 20,
    renderEdgeLabels: options.value.renderEdgeLabels,
    labelRenderedSizeThreshold: options.value.renderNodeLabels ? 6 : 9999,

    nodeReducer: (node, data) => {
      if (data.highlighted) {
        return {
          ...data,
          color: options.value.selectedNodeColor,
          size: data.size * 1.5,
          zIndex: 10,
        }
      }
      return data
    },
    edgeReducer: (edge, data) => {
      return {
        ...data,
        color: data.highlighted ? "#ff9900" : options.value.edgeColor,
      }
    },
    defaultDrawNodeLabel: (ctx, d, s) => {
      if (!d.label) return
      ctx.font = `${s.labelSize}px ${s.labelFont}`
      ctx.textAlign = "center"
      ctx.fillStyle = s.labelColor === "node" ? d.color : s.labelColor
      ctx.fillText(d.label, d.x, d.y + d.size)
    },
    defaultDrawNodeHover: (ctx, d, s) => {
      if (!d.label) return

      ctx.save()

      const outlineSize = d.size + 3
      ctx.beginPath()
      ctx.arc(d.x, d.y, outlineSize, 0, Math.PI * 2, true)
      ctx.fillStyle = "#fff"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2, true)
      ctx.fillStyle = d.color || "#999"
      ctx.fill()

      const fontSize = s.labelSize || 12
      ctx.font = `${s.labelWeight || ""} ${fontSize}px ${s.labelFont || "Arial"}`

      const padding = 2
      const margin = 0
      const textW = ctx.measureText(d.label).width
      const boxW = textW + padding * 2 + 1
      const boxH = fontSize + padding * 2 + 1

      const boxX = d.x - boxW / 2
      const boxY = d.y + d.size + margin

      ctx.fillStyle = "#fff"
      ctx.fillRect(boxX, boxY, boxW, boxH)

      ctx.lineWidth = 1

      ctx.fillStyle = "#000"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(d.label, d.x, boxY + padding)

      ctx.restore()
    },
  })
  renderer.getContainer().style.background = options.value.backgroundColor
  updateNodeColors(options.value)
  updateEdgeColors(options.value)
  renderer.setCustomBBox(renderer.getBBox())

  renderer.on("downNode", e => {
    if (options.value.allowDragging) {
      isDragging = true
      draggedNode = e.node
      props.graph.setNodeAttribute(draggedNode, "highlighted", true)
    }
  })
  renderer.on("moveBody", ({ event }) => {
    if (!isDragging || !draggedNode) return
    const pos = renderer.viewportToGraph(event)

    props.graph.setNodeAttribute(draggedNode, "x", pos.x)
    props.graph.setNodeAttribute(draggedNode, "y", pos.y)

    event.preventSigmaDefault()
    event.original.preventDefault()
    event.original.stopPropagation()
  })
  renderer.on("clickNode", ({ node }) => {
    selectNode(node)
  })

  const handleUp = () => {
    if (draggedNode && draggedNode !== clickedNodeId.value) {
      props.graph.removeNodeAttribute(draggedNode, "highlighted")
    }
    //forceLayout.stop()
    isDragging = false
    draggedNode = null
  }
  renderer.on("upNode", handleUp)
  renderer.on("upStage", handleUp)

  renderer.getCamera().on("updated", () => {
    updatePopupPosition()
  })
})

onBeforeUnmount(() => {
  if (renderer) renderer.kill()
  //forceLayout.kill()
})

function updateEdgeSizes(o) {
  if (!props.graph) return

  const base = o.edgeSize

  props.graph.forEachEdge(edge => {
    const attrs = props.graph.getEdgeAttributes(edge)
    const factor = o.useEdgeWeights && attrs.weight ? attrs.weight : 1
    props.graph.setEdgeAttribute(edge, "size", base * factor)
  })

  renderer?.refresh()
}

function updateNodeSizes(size) {
  if (!props.graph) return

  props.graph.forEachNode(id => {
    props.graph.setNodeAttribute(id, "size", size)
  })

  renderer?.refresh()
}

function updateNodeColors(o) {
  if (!props.graph) return

  props.graph.forEachNode(id => {
    const attrs = props.graph.getNodeAttributes(id)
    if (attrs.highlighted) return

    props.graph.setNodeAttribute(id, "color", o.nodeColor)
  })

  renderer?.refresh()
}

function updateEdgeColors(o) {
  if (!props.graph) return

  props.graph.forEachEdge(edge => {
    const attrs = props.graph.getEdgeAttributes(edge)
    if (attrs.highlighted) return
    props.graph.setEdgeAttribute(edge, "color", o.edgeColor)
  })

  renderer?.refresh()
}

function updatePopupPosition() {
  if (!clickedNodeId.value) return
  const attrs = props.graph.getNodeAttributes(clickedNodeId.value)
  const screenPos = renderer.graphToViewport({ x: attrs.x, y: attrs.y })
  popupPosition.value = { x: screenPos.x, y: screenPos.y }
}

function selectNode(nodeId) {
  if (clickedNodeId.value && clickedNodeId.value !== nodeId) {
    props.graph.removeNodeAttribute(clickedNodeId.value, "highlighted")
  }
  clickedNodeId.value = nodeId
  props.graph.setNodeAttribute(nodeId, "highlighted", true)

  const attrs = props.graph.getNodeAttributes(nodeId)
  clickedNodeData.value = {
    id: nodeId,
    Description: attrs.label,
    numOfNeighbors: props.graph.neighbors(nodeId).length,
  }
  updatePopupPosition()
}

function clearSelection() {
  if (clickedNodeId.value) {
    props.graph.removeNodeAttribute(clickedNodeId.value, "highlighted")
  }
  clickedNodeId.value = null
  clickedNodeData.value = null
}

function findNodesByLabelPrefix(query) {
  if (!query) return []
  const q = query.toLowerCase()
  const matches = []

  props.graph.forEachNode((id, attrs) => {
    const label = (attrs.label || "").toString().toLowerCase()
    if (label.startsWith(q)) matches.push(id)
  })

  return matches
}
</script>

<template>
  <div class="graph-wrapper">
    <div ref="container" class="sigma-container"></div>
    <div class="controls">
      <GraphControls
        @zoomIn="zoomIn"
        @zoomOut="zoomOut"
        @resetView="() => resetCamera(true)"
      />
    </div>
    <VertexWindow
      v-if="clickedNodeData"
      :visible="true"
      :position="popupPosition"
      @close="clearSelection"
    >
      ID: {{ clickedNodeData.id }}<br />
      <span v-if="clickedNodeData.Description">
        {{ t("vertex_window.name") }}: {{ clickedNodeData.Description }}<br />
      </span>
      <span v-else>
        {{ t("vertex_window.name") }}: {{ t("vertex_window.no_description")
        }}<br />
      </span>
      {{ t("vertex_window.number_of_neighbors") }}:
      {{ clickedNodeData.numOfNeighbors }}<br />
    </VertexWindow>
  </div>
</template>

<style scoped>
.graph-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  position: relative;
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.5);
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.sigma-container {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  background: lightblue;
  border: 1px solid #000000;
}

.controls button {
  cursor: pointer;
  width: 100%;
}

.popup {
  position: absolute;
  background: white;
  border: 1px solid black;
  padding: 8px;
  z-index: 20;
  transform: translate(10px, -50%);
  pointer-events: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
