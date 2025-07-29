<script setup>
import Graph from "graphology"
import VertexWindow from "./VertexWindow.vue"
import { useI18n } from "vue-i18n"
import { watch, toRefs, computed, ref } from "vue"
import { useSigmaRenderer } from "@/composables/useSigmaRenderer"
import { useGraphInteractions } from "@/composables/useGraphInteractions"
import { useGraphState } from "@/composables/useGraphState"
import { applyStyleOptions } from "@/utils/graphUtils"
import GraphControls from "./GraphControls.vue"
import { toBlob } from "@sigma/export-image"
import { SaveBytesToFile } from "../../../wailsjs/go/main/App"
import { importCsvToGraph, importGexfToGraph } from "@/composables/file_loader"
import ConfirmDialog from "@/components/ConfirmDialog.vue"

const props = defineProps({
  graph: Graph,
  options: { type: Object, default: () => ({}) },
})
const { t } = useI18n()
const { options } = toRefs(props)

const { container, renderer } = useSigmaRenderer({
  graph: props.graph,
  optionsRef: options,
})

const {
  clickedNodeData,
  popupNodePosition,
  popupEdgeData,
  popupEdgePosition,
  deleteSelection,
  selectedNodeIds,
  selectedEdgeIds,
} = useGraphInteractions({
  renderer,
  graph: props.graph,
  optionsRef: options,
})

const highlightedNode = computed(() => {
  if (!clickedNodeData.value) return null
  const attrs = props.graph.getNodeAttributes(clickedNodeData.value.id)
  return attrs.highlighted ? clickedNodeData.value : null
})

const highlightedEdge = computed(() => {
  if (!popupEdgeData.value) return null
  const attrs = props.graph.getEdgeAttributes(popupEdgeData.value.id)
  return attrs.highlighted ? popupEdgeData.value : null
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

const confirmDeleteModalOpen = ref(false)
const confirmDialogTitle = ref("")
const confirmMessage = ref("")

function openDeleteDialog() {
  const labels = [...props.graph?.nodes()]
    .filter(n => selectedNodeIds.has(n))
    .map(n => {
      const a = props.graph.getNodeAttributes(n)
      return a.label || n
    })

  confirmDialogTitle.value = t("editor.confirm_delete")
  confirmMessage.value = t("editor.confirm_delete_message")

  confirmDeleteModalOpen.value = true
}

function doDelete() {
  deleteSelection()
  confirmDeleteModalOpen.value = false
}

window.addEventListener("keydown", e => {
  if (
    (e.key === "Delete" || e.key === "Backspace") &&
    (selectedNodeIds.size || selectedEdgeIds.size)
  ) {
    const isInput =
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target?.isContentEditable
    if (!isInput) {
      e.preventDefault()
      openDeleteDialog()
    }
  }
})

function resetCamera() {
  const r = renderer.value
  if (!r) return
  r.setCustomBBox(null)
  r.resize(true)
  r.refresh()
  r.getCamera().animatedReset()
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
      @resetView="() => resetCamera()"
    />
    <VertexWindow
      v-if="highlightedNode"
      :visible="true"
      :position="popupNodePosition"
    >
      ID: {{ highlightedNode.id }}<br />
      <span v-if="highlightedNode.description">
        {{ t("vertex_window.name") }}: {{ highlightedNode.description }}<br />
      </span>
      <span v-else>
        {{ t("vertex_window.name") }}: {{ t("vertex_window.no_description")
        }}<br />
      </span>
      {{ t("vertex_window.number_of_neighbors") }}:
      {{ highlightedNode.numOfNeighbors }}<br />
    </VertexWindow>

    <VertexWindow
      v-if="highlightedEdge"
      :visible="true"
      :position="popupEdgePosition"
    >
      ID: {{ highlightedEdge.id }}<br />
      {{ t("vertex_window.name") }}: {{ highlightedEdge.description }} <br />
      {{ t("vertex_window.weight") }}: {{ highlightedEdge.weight }} <br />
    </VertexWindow>
    <ConfirmDialog
      :open="confirmDeleteModalOpen"
      :title="confirmDialogTitle"
      :message="confirmMessage"
      :confirm-label="t('editor.confirm')"
      :cancel-label="t('editor.cancel')"
      @confirm="doDelete"
      @cancel="
        () => {
          confirmDeleteModalOpen.value = false
        }
      "
    />
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
