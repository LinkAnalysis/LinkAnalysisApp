<script setup>
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { RecycleScroller } from "vue3-virtual-scroller"
import "vue3-virtual-scroller/dist/vue3-virtual-scroller.css"

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  edges: { type: Array, default: () => [] },
})

const { t } = useI18n()

const emit = defineEmits([
  "edit-node",
  "edit-edge",
  "delete-node",
  "delete-edge",
])

const activeTab = ref("nodes")
const editingItem = ref(null)

const searchTerm = ref("")

const items = computed(() => {
  const src = activeTab.value === "nodes" ? props.nodes : props.edges
  return src.map((it, idx) => ({
    ...(typeof it === "object" && it !== null ? it : { value: it }),
    __key: it.id ?? it.key ?? idx,
  }))
})

const filteredItems = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return items.value
  return items.value.filter(it =>
    (it.label ?? String(it.value ?? "")).toLowerCase().startsWith(term),
  )
})

const isNodeTab = computed(() => activeTab.value === "nodes")
const tabPrefix = computed(() => (isNodeTab.value ? "node" : "edge"))
const editItem = item => {
  editingItem.value = { ...item }
}

const saveEdit = () => {
  if (!editingItem.value) return
  emit(`edit-${tabPrefix.value}`, editingItem.value)
  editingItem.value = null
}

const deleteEdit = () => {
  if (!editingItem.value) return
  emit(`delete-${tabPrefix.value}`, editingItem.value.id)
  editingItem.value = null
}

const cancelEdit = () => {
  editingItem.value = null
}
</script>

<template>
  <div class="panel-section">
    <div class="tab-buttons" v-if="!editingItem">
      <button
        :class="{ active: activeTab === 'nodes' }"
        @click="activeTab = 'nodes'"
      >
        {{ t("editor.nodes") }}
      </button>
      <button
        :class="{ active: activeTab === 'edges' }"
        @click="activeTab = 'edges'"
      >
        {{ t("editor.edges") }}
      </button>
      <label v-if="activeTab === 'nodes'">
        <input v-model="searchTerm" placeholder="e.g. Node 1" />
      </label>
      <label v-else>
        <input v-model="searchTerm" placeholder="e.g. Edge 1,2" />
      </label>
    </div>

    <div class="list-wrapper">
      <template v-if="!editingItem">
        <div class="header-row">
          <span>{{ t("editor.id") }}</span>
          <span>{{ t("editor.label") }}</span>
          <span>{{ t("editor.edit") }}</span>
        </div>

        <RecycleScroller
          class="virtual-list"
          :items="filteredItems"
          :item-size="24"
          key-field="__key"
          :min-item-size="24"
        >
          <template #default="{ item }">
            <div :key="item.__key" class="row">
              <span class="id-cell">{{ item.id ?? item.value }}</span>
              <span>{{ item.label ?? "" }}</span>
              <span>
                <button class="edit-button" @click="editItem(item)">
                  {{ t("editor.edit") }}
                </button>
              </span>
            </div>
          </template>
        </RecycleScroller>
      </template>

      <template v-else>
        <div class="edit-form">
          <h3>
            {{
              activeTab === "nodes"
                ? t("editor.edit_node")
                : t("editor.edit_edge")
            }}
          </h3>

          <div class="form-row">
            <label>{{ t("editor.id") }}:</label>
            <input v-model="editingItem.id" disabled />
          </div>

          <div class="form-row">
            <label>{{ t("editor.label") }}:</label>
            <input v-model="editingItem.label" />
          </div>

          <div class="form-buttons">
            <button @click="saveEdit">{{ t("editor.save") }}</button>
            <button class="delete-button" @click="deleteEdit">
              {{ t("editor.delete") }}
            </button>
            <button @click="cancelEdit">{{ t("editor.cancel") }}</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.panel-section,
.list-wrapper {
  border: 2px solid #000;
  box-sizing: border-box;
}

.panel-section {
  padding: 8px;
  width: 100%;
  font-family: sans-serif;
}

.list-wrapper {
  height: 220px;
  display: flex;
  flex-direction: column;
}

.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.tab-buttons button {
  font: 600 18px/1 sans-serif;
  padding: 6px 16px;
  border: 2px solid #000;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}

.tab-buttons button.active {
  background: #dcdcdc;
}

.header-row,
.row {
  display: grid;
  grid-template-columns: 90px 1fr 60px auto;
  align-items: center;
  border-bottom: 1px solid #414141;
  font-size: 14px;
  height: 24px;
}

.header-row {
  font-size: 16px;
  border-color: #000;
  margin-right: 8px;
}

.virtual-list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.header-row span,
.row span {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-right: 1px solid #414141;
}

.id-cell {
  overflow-x: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}

.id-cell::-webkit-scrollbar {
  height: 4px;
}

.id-cell::-webkit-scrollbar-thumb {
  background: #888;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  background: #fff;
  border-radius: 12px;
  font-family: "Segoe UI", sans-serif;
  height: 100%;
  overflow: hidden;
}

.edit-form h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #000000;
  text-align: center;
  margin-bottom: 12px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.form-row label {
  width: 60px;
  font-weight: 700;
  font-size: 16px;
  color: #000;
}

.form-row input {
  flex: 1;
  padding: 4px 8px;
  font-size: 14px;
  border: 2px solid #000;
  border-radius: 4px;
  background: #fdfdfd;
  color: #000;
}

.form-row input:disabled {
  background: #e5e5e5;
  color: #777;
  border-color: #999;
  cursor: not-allowed;
}

.form-row input:not(:disabled):hover {
  background: #eef6ff;
  transition: background-color 0.2s;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.form-buttons button {
  font-size: 14px;
  padding: 6px 16px;
  border: 2px solid #000;
  background: #f5f5f5;
  color: #000;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.form-buttons button:first-child {
  background: #d0e3ff;
  border-color: #2563eb;
}

.form-buttons button:first-child:hover {
  background: #a8caff;
}

.form-buttons .delete-button {
  background: #ffd5d5;
  border-color: #dc2626;
}

.form-buttons .delete-button:hover {
  background: #fca5a5;
}

.form-buttons button:last-child {
  background: #e5e5e5;
  border-color: #999;
}

.form-buttons button:last-child:hover {
  background: #d4d4d4;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
