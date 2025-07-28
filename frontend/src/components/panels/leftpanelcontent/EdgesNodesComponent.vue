<script setup>
import { ref, computed, watch } from "vue"
import { useI18n } from "vue-i18n"
import { RecycleScroller } from "vue3-virtual-scroller"
import "vue3-virtual-scroller/dist/vue3-virtual-scroller.css"

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  edges: { type: Array, default: () => [] },
  currentTab: Number,
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
const fileInput = ref(null)
const uploadedFile = ref(null)
const previewUrl = ref(null)

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
  if (isNodeTab.value && item.image?.dataUrl) {
    previewUrl.value = item.image.dataUrl
    uploadedFile.value = null
  } else {
    previewUrl.value = null
    uploadedFile.value = null
  }
}

const saveEdit = () => {
  if (!editingItem.value) return
  if (isNodeTab.value) {
    editingItem.value.image = uploadedFile.value
      ? previewUrl.value
      : (editingItem.value.image ?? null)
  }
  emit(`edit-${tabPrefix.value}`, editingItem.value)
  editingItem.value = null
  uploadedFile.value = null
  previewUrl.value = null
}

const deleteEdit = () => {
  if (!editingItem.value) return
  emit(`delete-${tabPrefix.value}`, editingItem.value.id)
  editingItem.value = null
}

const cancelEdit = () => {
  editingItem.value = null
}

watch(
  () => props.currentTab,
  () => {
    editingItem.value = null
  },
)

function openDialog() {
  if (fileInput.value) fileInput.value.click()
}

async function handleFile(e) {
  const file = e.target.files[0]
  if (file && /image\/(png|jpeg)/.test(file.type)) {
    uploadedFile.value = file
    previewUrl.value = await new Promise(r => {
      const reader = new FileReader()
      reader.onload = () => r(reader.result)
      reader.readAsDataURL(file)
    })
  } else if (file) {
    alert("Wybierz plik PNG lub JPG")
    e.target.value = ""
  }
}

function resetFile() {
  uploadedFile.value = null
  previewUrl.value = null
  if (fileInput.value) fileInput.value.value = ""
  if (editingItem.value) editingItem.value.image = null
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
      <label v-if="activeTab === 'nodes'" class="tab-search">
        <input
          v-model="searchTerm"
          :placeholder="t('editor.placeholder_node')"
        />
      </label>
      <label v-else class="tab-search">
        <input
          v-model="searchTerm"
          :placeholder="t('editor.placeholder_edge')"
        />
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
          <div class="form-row" v-if="isNodeTab">
            <label>{{ t("editor.upload_file") }}:</label>
            <!-- ukryty input -->
            <input
              ref="fileInput"
              type="file"
              accept="image/png,image/jpeg"
              class="file-input-hidden"
              @change="handleFile"
            />

            <button type="button" class="file-btn" @click="openDialog">
              {{ t("editor.choose_file") }}
            </button>

            <button type="button" class="reset-btn" @click="resetFile">
              {{ t("editor.reset") }}
            </button>
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
  overflow: auto;
}

.list-wrapper {
  height: 235px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1 1 auto;
  min-height: 0;
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

.tab-buttons .tab-search {
  font: 600 18px/1 sans-serif;
  padding: 6px 16px;
  border: 2px solid #000;
  border-radius: 10px;
  background: #fff;
  cursor: text;
  display: flex;
  align-items: center;
}

.tab-buttons .tab-search input {
  all: unset;
  width: 100%;
  font: inherit;
  background: transparent;
  cursor: text;
}

.header-row,
.row {
  display: grid;
  grid-template-columns: 90px 1fr 60px auto;
  align-items: center;
  border-bottom: 1px solid #414141;
  font-size: 14px;
  height: 24px;
  box-sizing: border-box;
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
  padding-bottom: 1px;
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
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px;
  background: #fff;
  border-radius: 12px;
  font-family: "Segoe UI", sans-serif;
  overflow: auto;
}

.edit-form h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #000000;
  text-align: center;
  margin-bottom: 0px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.form-row label {
  width: 150px;
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

.file-input-hidden {
  display: none;
}

.file-btn,
.reset-btn {
  padding: 6px 12px;
  border: 2px solid #000;
  border-radius: 4px;
  background: #d0e3ff;
  font:
    600 12px/1 "Segoe UI",
    sans-serif;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 8px;
}

.file-btn:hover,
.reset-btn:hover {
  background: #a8caff;
}

.reset-btn {
  background: #e5e5e5;
}

.reset-btn:hover {
  background: #d4d4d4;
}
</style>
