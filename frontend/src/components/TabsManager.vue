<script setup>
import Graph from "graphology"
import { ref, onMounted, computed, watch } from "vue"
import { LogPrint } from "../../wailsjs/runtime/runtime"

const next_tab_id = ref(0)
const selected_tab_id = ref(0)
const tabs = ref([])
const edit_id = ref(null)
const edit_input = ref(null)

const props = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])

const graphs = ref([])
const graph = computed({
  get() {
    if (graphs.value.length > 0)
      return graphs.value[selected_tab_id.value].value ?? null
    return null
  },

  set(val) {
    if (graphs.value.length > 0 && graphs.value[selected_tab_id.value])
      graphs.value[selected_tab_id.value].value = val
  },
})

let updating = false
watch(
  () => props.modelValue,
  val => {
    updating = true
    graph.value = val
    updating = false
  },
)

watch(graph, val => {
  if (updating) return
  emit("update:modelValue", val)
})

const select_tab = id => {
  selected_tab_id.value = id
}

const add_tab = () => {
  tabs.value.push({ title: `Tab ${next_tab_id.value}`, id: next_tab_id.value })
  graphs.value.push(ref(null))
  next_tab_id.value++
}

const close_tab = id => {
  let index_to_remove = tabs.value.findIndex(el => el.id == id)
  let selected_index = tabs.value.findIndex(
    el => el.id == selected_tab_id.value,
  )
  if (selected_index == index_to_remove) {
    graph.value = null
  }
  tabs.value.splice(index_to_remove, 1)

  if (tabs.value.length == 0) {
    add_new_tab()
  }

  selected_tab_id.value = tabs.value[0].id
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
  if (tabs.value.length == 0) {
    selected_tab_id.value = 0
    add_tab()
  }
})
</script>

<template>
  <div class="wrapper">
    <div class="tabs-container">
      <div
        :class="`tab ${selected_tab_id == tab.id ? 'selected' : ''}`"
        v-for="tab in tabs"
        :key="tab.id"
        @click="select_tab(tab.id)"
        @dblclick="start_editing(tab.id)"
      >
        <input
          v-if="edit_id == tab.id"
          v-model="tab.title"
          ref="edit_input"
          @blur="stop_editing"
          @keyup.enter="stop_editing"
          style="
            font-size: 0.875rem;
            padding: 0.25rem;
            border: 1px solid #ccc;
            border-radius: 0.25rem;
          "
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
}

.tabs-container {
  display: flex;
  gap: 0;
  margin-bottom: 1rem;
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
