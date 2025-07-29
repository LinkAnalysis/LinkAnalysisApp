<script setup lang="js">
import Graph from "graphology"
import { computed } from "vue"
import LeftPanel from "./LeftPanel.vue"
import RightPanel from "./RightPanel.vue"

const props = defineProps({
  graph: Graph,
  position: "left" | "right",
})

const activePanel = computed(() =>
  props.position === "left" ? LeftPanel : RightPanel,
)
</script>

<template>
  <component :is="activePanel" :graph="props.graph" />
</template>
