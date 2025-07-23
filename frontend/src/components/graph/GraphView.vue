<script setup>
import Graph from "graphology"
import VertexWindow from "./VertexWindow.vue"
import { useI18n } from "vue-i18n"
import { watch, toRefs } from "vue"

import { useSigmaRenderer } from "@/composables/useSigmaRenderer"
import { useGraphInteractions } from "@/composables/useGraphInteractions"
import { useGraphState } from "@/composables/useGraphState"
import { normalizeGraphCoordinates } from "@/composables/layouts"
import { applyStyleOptions } from "@/utils/graphUtils"
import GraphControls from "./GraphControls.vue"

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

const { clickedNodeData, popupPosition, selectedNodeIds } =
  useGraphInteractions({
    renderer,
    graph: props.graph,
    optionsRef: options,
  })

const zoomIn = () => renderer.value?.getCamera().animatedZoom({ duration: 600 })
const zoomOut = () =>
  renderer.value?.getCamera().animatedUnzoom({ duration: 600 })

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
  <div class="graph-wrapper">
    <div ref="container" class="sigma-container" />

    <GraphControls
      @zoomIn="zoomIn"
      @zoomOut="zoomOut"
      @resetView="() => resetCamera(true)"
    />

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

.sigma-container {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  background: lightblue;
  border: 1px solid #000;
}
</style>
