<script setup>
import { ref } from "vue"

const props = defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
  edges: {
    type: Array,
    default: () => [],
  },
})

const activeTab = ref("nodes")

const editNode = node => {
  console.log("Edit node:", node)
}
const editEdge = edge => {
  console.log("Edit edge:", edge)
}
</script>

<template>
  <div class="panel-section">
    <div class="tab-buttons">
      <button
        :class="{ active: activeTab === 'nodes' }"
        @click="activeTab = 'nodes'"
      >
        Nodes
      </button>
      <button
        :class="{ active: activeTab === 'edges' }"
        @click="activeTab = 'edges'"
      >
        Edges
      </button>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Label</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="activeTab === 'nodes'">
            <tr v-for="node in nodes" :key="'node-' + node">
              <td>{{ node }}</td>
              <td></td>
              <td>
                <button class="edit-button" @click="editNode(node)">
                  Edit
                </button>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="edge in edges" :key="'edge-' + edge">
              <td>{{ edge }}</td>
              <td></td>
              <td>
                <button class="edit-button" @click="editEdge(edge)">
                  Edit
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.panel-section {
  border: 2px solid black;
  padding: 8px;
  width: 100%;
  font-family: sans-serif;
}

.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  justify-content: flex-start;
}

.tab-buttons button {
  font-size: 18px;
  padding: 6px 16px;
  border: 2px solid black;
  border-radius: 12px;
  background-color: white;
  cursor: pointer;
}

.tab-buttons button.active {
  background-color: lightgray;
  font-weight: bold;
}

.table-wrapper {
  border: 2px solid black;
  max-height: 300px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #999;
  text-align: center;
  padding: 10px;
  font-size: 16px;
}

thead th {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.edit-button {
  padding: 2px 3px;
  font-size: 16px;
  border: 2px solid black;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>
