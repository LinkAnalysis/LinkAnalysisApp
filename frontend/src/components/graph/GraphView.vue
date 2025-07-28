<script setup>
import Graph from "graphology"
import VertexWindow from "./VertexWindow.vue"
import { useI18n } from "vue-i18n"
import { watch, toRefs, computed } from "vue"
import { useSigmaRenderer } from "@/composables/useSigmaRenderer"
import { useGraphInteractions } from "@/composables/useGraphInteractions"
import { useGraphState } from "@/composables/useGraphState"
import { normalizeGraphCoordinates } from "@/composables/layouts"
import { applyStyleOptions } from "@/utils/graphUtils"
import GraphControls from "./GraphControls.vue"
import { toBlob } from "@sigma/export-image"
import { SaveBytesToFile } from "../../../wailsjs/go/main/App"
import { importCsvToGraph, importGexfToGraph } from "@/composables/file_loader"

const props = defineProps({
  graph: Graph,
  changed: Number,
  options: { type: Object, default: () => ({}) },
})
const { t } = useI18n()
const { options } = toRefs(props)

const { container, renderer } = useSigmaRenderer({
  graph: props.graph,
  optionsRef: options,
})

const { clickedNodeData, popupNodePosition, popupEdgeData, popupEdgePosition } =
  useGraphInteractions({
    renderer,
    graph: props.graph,
    optionsRef: options,
  })

const zoomIn = () => renderer.value?.getCamera().animatedZoom({ duration: 600 })
const zoomOut = () =>
  renderer.value?.getCamera().animatedUnzoom({ duration: 600 })

const dragEnabled = computed(() => !!props.graph)

const handleDrop = event => {
  if (!dragEnabled.value) return

  const files = event.dataTransfer.files
  if (files.length === 0) return

  const file = files[0]
  const isCsv = file.name.endsWith(".csv")

  const reader = new FileReader()
  reader.onload = async () => {
    const text = reader.result

    try {
      if (file.name.endsWith(".csv")) {
        await importCsvToGraph(props.graph, text)
      } else if (file.name.endsWith(".gexf")) {
        await importGexfToGraph(props.graph, text, true)
      } else {
        console.warn("Obsługiwane są tylko pliki .csv oraz .gexf")
        return
      }

      applyStyleOptions(props.graph, options.value)
      renderer.value?.refresh()
      resetCamera()
    } catch (err) {
      console.error("Błąd importu:", err)
    }
  }

  reader.readAsText(file)
}

function resetCamera(full = false) {
  const r = renderer.value
  if (!r) return
  r.refresh()
  normalizeGraphCoordinates(props.graph)
  r.setCustomBBox({ x: [0, 1], y: [0, 1] })
  full
    ? r.getCamera().animatedReset()
    : r.getCamera().animate({ x: 0.5, y: 0.5 })
}

const saveImage = async (filePath, ext) => {
  if (!renderer.value) return
  const blob = await toBlob(renderer.value, { format: ext })
  const arrayBuffer = await blob.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  await SaveBytesToFile(filePath, Array.from(uint8Array))
}

defineExpose({
  saveImage,
})

useGraphState({ renderer, graph: props.graph, resetCamera })

watch(
  options,
  (n, o) => {
    const r = renderer.value
    if (!r) return

    if (n.backgroundColor !== o?.backgroundColor)
      r.getContainer().style.background = n.backgroundColor
    if (n.renderEdgeLabels !== o?.renderEdgeLabels)
      r.setSetting("renderEdgeLabels", n.renderEdgeLabels)

    applyStyleOptions(props.graph, n)
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div
    class="graph-wrapper"
    :class="{ 'drag-active': dragEnabled }"
    @dragover.prevent="dragEnabled && $event.preventDefault()"
    @drop.prevent="dragEnabled && handleDrop($event)"
  >
    <div ref="container" class="sigma-container" />

    <GraphControls
      :graph="props.graph"
      @zoomIn="zoomIn"
      @zoomOut="zoomOut"
      @resetView="() => resetCamera(true)"
    />

    <VertexWindow
      v-if="clickedNodeData"
      :visible="true"
      :position="popupNodePosition"
    >
      ID: {{ clickedNodeData.id }}<br />
      <span v-if="clickedNodeData.description">
        {{ t("vertex_window.name") }}: {{ clickedNodeData.description }}<br />
      </span>
      <span v-else>
        {{ t("vertex_window.name") }}: {{ t("vertex_window.no_description")
        }}<br />
      </span>
      {{ t("vertex_window.number_of_neighbors") }}:
      {{ clickedNodeData.numOfNeighbors }}<br />
    </VertexWindow>

    <VertexWindow
      v-if="popupEdgeData"
      :visible="true"
      :position="popupEdgePosition"
    >
      ID: {{ popupEdgeData.id }}<br />
      {{ t("vertex_window.name") }}: {{ popupEdgeData.description }} <br />
      {{ t("vertex_window.weight") }}: {{ popupEdgeData.weight }} <br />
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

.sigma-container {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  background: lightblue;
  border: 1px solid #000;
}
</style>
