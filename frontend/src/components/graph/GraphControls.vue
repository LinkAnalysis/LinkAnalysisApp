<template>
  <div class="controls">
    <button class="zoom-in" @click="$emit('zoomIn')">
      {{ t("controls.zoomIn") }}
    </button>

    <button class="zoom-out" @click="$emit('zoomOut')">
      {{ t("controls.zoomOut") }}
    </button>

    <button class="reset" @click="$emit('resetView')">
      {{ t("controls.reset") }}
    </button>

    <button class="restore" @click="restoreHiddenNodes">
      {{ t("controls.restore") }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"

const props = defineProps({
  graph: Object,
})
defineEmits(["zoomIn", "zoomOut", "resetView"])

const { t } = useI18n()

function restoreHiddenNodes() {
  if (!props.graph) return

  props.graph.forEachNode(nodeId => {
    if (props.graph.hasNodeAttribute(nodeId, "hidden")) {
      props.graph.removeNodeAttribute(nodeId, "hidden")
      props.graph.setNodeAttribute(nodeId, "highlighted", false)
    }
  })

  props.graph.forEachEdge(edgeId => {
    if (props.graph.hasEdgeAttribute(edgeId, "hidden")) {
      props.graph.removeEdgeAttribute(edgeId, "hidden")
      props.graph.setEdgeAttribute(edgeId, "highlighted", false)
    }
  })
}
</script>

<style scoped>
.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.controls button {
  cursor: pointer;
  width: 100%;
}
</style>
