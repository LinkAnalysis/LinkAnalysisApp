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
    <div v-if="tabsStore.simulationExists()" class="sim-settings">
      <button class="sim-toggle" @click="onToggleSimulation">
        {{ tabsStore.simulationRunning() ? "⏸️" : "▶️" }}
      </button>
      <button class="sim-kill" @click="onKillSimulation">❌</button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { useTabsStore } from "../../stores/tabsStore"
import ForceSupervisor from "graphology-layout-force/worker"
import { storeToRefs } from "pinia"
import { LogPrint } from "../../../wailsjs/runtime/runtime"
defineEmits(["zoomIn", "zoomOut", "resetView"])
const tabsStore = useTabsStore()
const { selectedGraph } = storeToRefs(tabsStore)
let worker = null
const onToggleSimulation = () => {
  //LogPrint("HEEWASJFKJ")
  //worker = new ForceSupervisor(selectedGraph.value, {})
  //LogPrint(`${JSON.stringify(worker, null, 2)}`)
  //worker.start()
  tabsStore.toggleSimulation()
}
const onKillSimulation = () => tabsStore.killSimulation()
const { t } = useI18n()
</script>

<style scoped>
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
.controls button {
  cursor: pointer;
  width: 100%;
}
.sim-settings {
  display: flex;
}
</style>
