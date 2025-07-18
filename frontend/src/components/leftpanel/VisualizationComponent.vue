<template>
  <div class="panel-section">
    <h2>Visualization settings</h2>
    <div class="table-wrapper">
      <table class="settings-table">
        <tbody>
          <tr>
            <td>Node Color</td>
            <td>
              <input type="color" v-model="settings.nodeColor" />
              <span>{{ settings.nodeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>Node Size</td>
            <td>
              <input type="number" v-model.number="settings.nodeSize" min="1" />
            </td>
          </tr>
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
          <tr>
            <td>Render Node Labels</td>
            <td>
              <input type="checkbox" v-model="settings.renderNodeLabels" />
            </td>
          </tr>
          <tr>
            <td>Edge Color</td>
            <td>
              <input type="color" v-model="settings.edgeColor" />
              <span>{{ settings.edgeColor }}</span>
            </td>
          </tr>
          <tr>
            <td>Edge Size</td>
            <td>
              <input
                type="number"
                v-model.number="settings.edgeSize"
                min="0.1"
                step="0.1"
              />
            </td>
          </tr>
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
          <tr>
            <td>Render Edge Labels</td>
            <td>
              <input type="checkbox" v-model="settings.renderEdgeLabels" />
            </td>
          </tr>
          <tr>
            <td>Highlight Neighbors</td>
            <td>
              <input type="checkbox" v-model="settings.highlightNeighbors" />
            </td>
          </tr>
          <tr>
            <td>Hover Effect</td>
            <td>
              <input type="checkbox" v-model="settings.hoverEffect" />
            </td>
          </tr>
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
import { reactive } from "vue"

const settings = reactive({
  nodeColor: "#3498db",
  nodeSize: 10,
  nodeShape: "Circle",
  renderNodeLabels: true,
  edgeColor: "#cccccc",
  edgeSize: 1.5,
  edgeType: "Line",
  renderEdgeLabels: true,
  highlightNeighbors: true,
  hoverEffect: true,
  nodeSizeByDegree: true,
  nodeDragging: true,
  backgroundColor: "#ffffff",
})
</script>

<style scoped>
.panel-section {
  border: 2px solid black;
  padding: 8px;
  width: 100%;
  font-family: sans-serif;
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
