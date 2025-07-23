<template>
  <div class="panel-section">
    <h2>Visualization settings</h2>

    <div class="table-wrapper">
      <table class="settings-table">
        <tbody>
          <!-- === NODES === -->
          <tr class="section-header">
            <td colspan="2"><strong>Nodes</strong></td>
          </tr>
          <tr>
            <td>Node Color</td>
            <td>
              <input type="color" v-model="settings.nodeColor" />
              <span>{{ settings.nodeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>Selected Node Color</td>
            <td>
              <input type="color" v-model="settings.selectedNodeColor" />
              <span>{{ settings.selectedNodeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>Node Size</td>
            <td>
              <input
                type="range"
                v-model.number="settings.nodeSize"
                min="5"
                max="50"
                step="1"
              />
              <span>{{ settings.nodeSize }}</span>
            </td>
          </tr>
          <tr>
            <td>Dragging</td>
            <td>
              <input type="checkbox" v-model="settings.allowDragging" />
            </td>
          </tr>
          <!--
            <tr>
            <td>Node Shape</td>
            <td>
              <select v-model="settings.nodeShape">
              <option>Circle</option>
              <option>Square</option>
              <option>Triangle</option>
              </select>
            </td>
            </tr>
            -->
          <!--
            <tr>
            <td>Render Node Labels</td>
            <td>
              <input type="checkbox" v-model="settings.renderNodeLabels" />
            </td>
            </tr>
            -->
          <!--
            <tr>
            <td>Node size by degree</td>
            <td>
              <input type="checkbox" v-model="settings.nodeSizeByDegree" />
            </td>
            </tr>
            <tr>
            <td>Node Dragging</td>
            <td>
              <input type="checkbox" v-model="settings.nodeDragging" />
            </td>
            </tr>
            -->

          <!-- === EDGES === -->
          <tr class="section-header">
            <td colspan="2"><strong>Edges</strong></td>
          </tr>
          <tr>
            <td>Edge Color</td>
            <td>
              <input type="color" v-model="settings.edgeColor" />
              <span>{{ settings.edgeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>Highlighted Edge Color</td>
            <td>
              <input type="color" v-model="settings.highlightedEdgeColor" />
              <span>{{ settings.highlightedEdgeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>Edge Size</td>
            <td>
              <input
                type="range"
                v-model.number="settings.edgeSize"
                min="1"
                max="30"
                step="1"
              />
              <span>{{ settings.edgeSize }}</span>
            </td>
          </tr>
          <tr>
            <td>Use edge weights</td>
            <td>
              <input type="checkbox" v-model="settings.useEdgeWeights" />
            </td>
          </tr>
          <!--
            <tr>
            <td>Edge Type</td>
            <td>
              <select v-model="settings.edgeType">
              <option>Line</option>
              <option>Dashed</option>
              <option>Arrow</option>
              </select>
            </td>
            </tr>
            -->
          <tr>
            <td>Render Edge Labels</td>
            <td>
              <input type="checkbox" v-model="settings.renderEdgeLabels" />
            </td>
          </tr>

          <!-- === INTERACTION === -->
          <tr class="section-header">
            <td colspan="2"><strong>Interaction</strong></td>
          </tr>
          <!--
            <tr>
            <td>Highlight Neighbors</td>
            <td>
              <input type="checkbox" v-model="settings.highlightNeighbors" />
            </td>
            </tr>
            -->
          <tr>
            <td>Hover Effect</td>
            <td>
              <input type="checkbox" v-model="settings.hoverEffect" />
            </td>
          </tr>

          <!-- === BACKGROUND === -->
          <tr class="section-header">
            <td colspan="2"><strong>Background</strong></td>
          </tr>
          <tr>
            <td>Background color</td>
            <td>
              <input type="color" v-model="settings.backgroundColor" />
              <span>{{ settings.backgroundColor }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
/**
 * 1. Importujemy Pinia‑store i wyciągamy selectedVisualizationOptions jako ref.
 * 2. Tworzymy lokalny obiekt settings – łatwiejszy do użycia z v‑model.
 * 3. Synchronizujemy:
 *    - store ➜ settings przy przełączaniu zakładki,
 *    - settings ➜ store gdy użytkownik coś zmieni.
 */

import { reactive, watch } from "vue"
import { useTabsStore } from "@/stores/tabsStore"
import { storeToRefs } from "pinia"

/* --- Store -------------------------------------------------------------- */
const tabsStore = useTabsStore()
const { selectedVisualizationOptions } = storeToRefs(tabsStore)

/* --- Lokalny stan dla v‑model ------------------------------------------ */
const settings = reactive({
  nodeColor: "#3498db",
  selectedNodeColor: "#ff3333",
  nodeSize: 10,
  allowDragging: true,
  edgeColor: "#000000",
  highlightedEdgeColor: "#ff9900",
  edgeSize: 1.5,
  useEdgeWeights: false,
  renderEdgeLabels: true,
  hoverEffect: true,
  backgroundColor: "#ffffff",
})

/* --- store ➜ ui przy zmianie zakładki ---------------------------------- */
watch(
  selectedVisualizationOptions,
  val => {
    if (val) Object.assign(settings, val)
  },
  { immediate: true },
)

/* --- ui ➜ store gdy coś zmienimy --------------------------------------- */
watch(
  settings,
  val => {
    // nadpisujemy obiekt w store, żeby wymusić re‑render grafu
    selectedVisualizationOptions.value = { ...val }
  },
  { deep: true },
)
</script>

<style scoped>
/* oryginalne style – bez zmian */
.panel-section {
  border: 2px solid black;
  padding: 8px;
  width: 100%;
  font-family: sans-serif;
}

.section-header {
  background-color: #f0f0f0;
  text-align: center;
  font-weight: bold;
}

h2 {
  margin-top: 0;
  text-align: center;
  margin-bottom: 8px;
}

.table-wrapper {
  border: 2px solid black;
  max-height: 400px;
  overflow-y: auto;
}
.table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.settings-table {
  width: 100%;
  border-collapse: collapse;
}

.settings-table td {
  padding: 8px;
  border: 1px solid #999;
  font-size: 16px;
}

input[type="color"] {
  margin-right: 8px;
  width: 32px;
  height: 32px;
  border: 1px solid #333;
  padding: 0;
}

input[type="number"] {
  width: 80px;
  padding: 4px;
}

select {
  font-size: 16px;
  padding: 4px;
  border-radius: 6px;
  border: 2px solid black;
}
</style>
