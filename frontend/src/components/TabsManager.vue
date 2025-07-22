<script setup>
import { ref, onMounted } from "vue"
import { useTabsStore } from "@/stores/tabsStore"
import { storeToRefs } from "pinia"

const tabs = useTabsStore()
const { selectedTabId, tabsCount, tabsData } = storeToRefs(tabs)
const { removeTab, addTab, resetSelectedTab } = tabs

const next_tab_id = ref(0)
const edit_id = ref(null)
const edit_input = ref(null)

const select_tab = id => {
  selectedTabId.value = id
}

const add_tab = () => {
  addTab({ title: `Tab ${next_tab_id.value}`, id: next_tab_id.value })
  next_tab_id.value++
  console.log(tabsData.value)
}

const close_tab = id => {
  removeTab(id)
  if (tabsCount.value == 0) {
    add_tab()
  }
  resetSelectedTab()
}

const start_editing = id => {
  edit_id.value = id
  nextTick(() => {
    edit_input.value?.focus()
  })
}

const stop_editing = () => {
  edit_id.value = null
}

onMounted(() => {
  if (tabsCount.value == 0) {
    add_tab()
    resetSelectedTab()
  }
})
</script>

<template>
  <div class="wrapper">
    <div class="tabs-container">
      <div
        v-for="tab in tabsData"
        :class="`tab ${selectedTabId == tab.id ? 'selected' : ''}`"
        :key="tab.id"
        @click="select_tab(tab.id)"
        @dblclick="start_editing(tab.id)"
      >
        <input
          v-if="edit_id == tab.id"
          v-model="tab.title"
          ref="edit_input"
          @blur="stop_editing"
          style="
            font-size: 0.875rem;
            padding: 0.25rem;
            border: 1px solid #ccc;
            border-radius: 0.25rem;
          "
          @keyup.enter="stop_editing"
        />
        <span class="tab-cnt" v-else style="font-size: 0.875rem">{{
          tab.title
        }}</span>
        <div class="close-tab-btn" @click.stop="close_tab(tab.id)" />
      </div>
      <button @click="add_tab">+</button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 0;
  margin: 0;
}

.tabs-container {
  display: flex;
  gap: 0;
  margin-bottom: 0;
  background-color: aquamarine;
}

.tab {
  display: inline-flex;
  align-items: center;
  text-align: center;
  border: 1px solid #aaa;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  margin: 0;
  color: #333;
  user-select: none;
  cursor: default;
  position: relative;
  background-color: rgb(167, 167, 184);
  padding-left: 1%;
}

.tab.selected {
  background-color: rgb(105, 105, 113);
}

.tab:hover {
  color: #0bbfcb;
  background-color: aquamarine;
}

.tab-cnt {
  flex-grow: 1;
  padding-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-tab-btn {
  position: relative;
  width: 16px;
  height: 16px;
  cursor: pointer;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.2s ease;
}

.close-tab-btn:hover {
  background-color: #e74c3c;
}

.close-tab-btn::before,
.close-tab-btn::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 2px;
  background-color: #555;
  border-radius: 1px;
  transform-origin: center;
  transition: background-color 0.2s ease;
}

.close-tab-btn:hover::before,
.close-tab-btn:hover::after {
  background-color: white;
}

.close-tab-btn::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-tab-btn::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
