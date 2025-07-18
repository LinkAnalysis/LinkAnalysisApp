<script setup>
import { ref, computed } from "vue"
import { RecycleScroller } from "vue3-virtual-scroller"
import "vue3-virtual-scroller/dist/vue3-virtual-scroller.css"

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  edges: { type: Array, default: () => [] },
})

const activeTab = ref("nodes")
const isNodeTab = computed(() => activeTab.value === "nodes")

const rawItems = computed(() => (isNodeTab.value ? props.nodes : props.edges))
const items = computed(() =>
  rawItems.value.map((it, idx) =>
    typeof it === "object" && it !== null
      ? { ...it, __key: it.id ?? it.key ?? idx }
      : { value: it, __key: it },
  ),
)

const editingItem = ref(null)
const editItem = item => {
  editingItem.value = { ...item }
}

const emit = defineEmits([
  "edit-node",
  "edit-edge",
  "delete-node",
  "delete-edge",
])

const saveEdit = () => {
  if (isNodeTab.value) {
    emit("edit-node", editingItem.value)
  } else {
    emit("edit-edge", editingItem.value)
  }
  editingItem.value = null
}

const deleteEdit = () => {
  if (isNodeTab.value) {
    emit("delete-node", editingItem.value.id)
  } else {
    emit("delete-edge", editingItem.value.id)
  }
  editingItem.value = null
}

const cancelEdit = () => {
  editingItem.value = null
}
</script>

<template>
  <div class="panel-section">
    <div class="tab-buttons" v-if="!editingItem">
      <button :class="{ active: isNodeTab }" @click="activeTab = 'nodes'">
        Nodes
      </button>
      <button :class="{ active: !isNodeTab }" @click="activeTab = 'edges'">
        Edges
      </button>
    </div>

    <div class="list-wrapper">
      <template v-if="!editingItem">
        <div class="header-row" v-once>
          <span>Id</span>
          <span>Label</span>
          <span>Edit</span>
        </div>

        <RecycleScroller
          class="virtual-list"
          :items="items"
          :item-size="24"
          key-field="__key"
          :min-item-size="24"
          style="height: 100%"
        >
          <template #default="{ item }">
            <div class="row" :key="item.__key">
              <span class="id-cell">{{ item.id ?? item.value }}</span>
              <span>{{ item.label ?? "" }}</span>
              <span>
                <button class="edit-button" @click="editItem(item)">
                  Edit
                </button>
              </span>
            </div>
          </template>
        </RecycleScroller>
      </template>

      <div v-else class="edit-form">
        <h3>Edit {{ isNodeTab ? "Node" : "Edge" }}</h3>
        <label>
          ID:
          <input v-model="editingItem.id" disabled />
        </label>
        <label>
          Label:
          <input v-model="editingItem.label" />
        </label>
        <div class="form-buttons">
          <button @click="saveEdit">Save</button>
          <button @click="deleteEdit" class="delete-button">Delete</button>
          <button @click="cancelEdit">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-section {
  border: 2px solid black;
  padding: 8px;
  width: 100%;
  font-family: sans-serif;
  box-sizing: border-box;
}

.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.tab-buttons button {
  font-size: 18px;
  padding: 6px 16px;
  border: 2px solid black;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}
.tab-buttons button.active {
  background: #dcdcdc;
  font-weight: 600;
}

.list-wrapper {
  border: 2px solid black;
  height: 220px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.header-row {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 90px 1fr 60px auto;
  align-items: center;
  border-bottom: 1px solid #000000;
  font-size: 16px;
  line-height: 24px;
  margin-right: 8px;
}
.virtual-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
}
.row {
  display: grid;
  grid-template-columns: 90px 1fr 60px auto;
  align-items: center;
  border-bottom: 1px solid #414141;
  font-size: 14px;
  height: 24px;
  box-sizing: border-box;
}

.header-row span,
.row span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-right: 1px solid #414141;
}

.scrollbar-spacer {
  width: 8px;
  height: 100%;
  pointer-events: none;
  background: transparent;
}

.id-cell {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}
.id-cell::-webkit-scrollbar {
  height: 4px;
}
.id-cell::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 2px;
}
.id-cell::-webkit-scrollbar-track {
  background: transparent;
}

.edit-button {
  padding: 0 4px;
  font-size: 11px;
  border: 1px solid #000;
  background: #fff;
  border-radius: 3px;
  cursor: pointer;
}

.edit-form {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 8px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: #ffffff;
  border-radius: 12px;
  font-family: "Segoe UI", sans-serif;

  overflow: hidden;
}
.edit-form h3 {
  margin-top: 0;
  /* margin-bottom: 20px; */
  font-size: 1.4rem;
  color: #333;
  text-align: center;
}

.edit-form label {
  display: block;
  /* margin-bottom: 15px; */
  font-weight: 500;
  color: #444;
}

.edit-form input {
  display: block;
  width: 100%;
  /* padding: 8px 10px; */
  /* margin-top: 5px; */
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.edit-form input:focus {
  border-color: #3b82f6;
  outline: none;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  /* gap: 10px; */
  /* margin-top: 20px; */
}

.form-buttons button {
  flex: 1;
  padding: 10px 0;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form-buttons button:nth-child(1) {
  background-color: #3b82f6;
  color: white;
}

.form-buttons button:nth-child(1):hover {
  background-color: #2563eb;
}

.form-buttons button:nth-child(3) {
  background-color: #f3f4f6;
  color: #333;
}

.form-buttons button:nth-child(3):hover {
  background-color: #e5e7eb;
}

.form-buttons .delete-button {
  background-color: #ef4444;
  color: white;
}

.form-buttons .delete-button:hover {
  background-color: #dc2626;
}
</style>
