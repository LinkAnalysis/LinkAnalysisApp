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
  tabs.value.push({ title: `tab-${next_tab_id.value}`, id: next_tab_id.value })
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

  selected_tab_id.value = 0
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

// defineExpose({
//   add_new_tab: () => add_new_tab(),
// })

onMounted(() => {
  if (tabs.value.length == 0) {
    selected_tab_id.value = 0
    add_tab()
  }
})
</script>

<template>
  <div class="wrapper" style="padding: 1rem">
    <div
      class="tabs-container"
      style="display: flex; gap: 0.5rem; margin-bottom: 1rem"
    >
      <div
        v-for="tab in tabs"
        :key="tab.id"
        @click="select_tab(tab.id)"
        @dblclick="start_editing(tab.id)"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          border: '1px solid',
          borderColor: selected_tab_id == tab.id ? '#3b82f6' : '#ccc',
          backgroundColor: selected_tab_id == tab.id ? '#eff6ff' : '#fff',
          borderRadius: '0.25rem',
          cursor: 'pointer',
        }"
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
        <span v-else style="font-size: 0.875rem">{{ tab.title }}</span>
        <button
          @click.stop="close_tab(tab.id)"
          style="
            color: #dc2626;
            font-weight: bold;
            background: none;
            border: none;
            cursor: pointer;
          "
        >
          x
        </button>
      </div>
      <button @click="add_tab">New Tab</button>
    </div>
  </div>
</template>

<style scoped>
.tabs-container ul {
  list-style: none;
  display: flex;
  padding: 0;
  gap: 12px;
}

.tabs-container li.selected {
  background: #007bff;
  color: white;
}
</style>
