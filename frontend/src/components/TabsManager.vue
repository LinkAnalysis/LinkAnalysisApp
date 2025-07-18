<script setup>
import Graph from "graphology"
import { ref, onMounted, reactive } from "vue"

const tabs = ref([])

const selected_id = defineModel("selected_tab_id")
let next_id = 0
const edit_id = ref(null)
const edit_input = ref(null)

const emit = defineEmits(["new_tab", "tab_closed"])

const add_new_tab = () => {
  tabs.value.push({ title: `tab-${next_id}`, id: next_id })
  emit("new_tab", next_id)
  next_id++
}

const close_tab = id => {
  let index_to_remove = tabs.value.findIndex(el => el.id == id)
  let selected_index = tabs.value.findIndex(el => el.id == selected_id.value)
  tabs.value.splice(index_to_remove, 1)
  emit("tab_closed", id)
  let new_sid = selected_id.value
  if (selected_index >= index_to_remove) {
    new_sid = tabs.value[index_to_remove - 1]
  }

  if (tabs.value.length == 0) {
    add_new_tab()
    new_sid = tabs.value[0].id
  }
  selected_id.value = new_sid
  console.log("After close in component:", tabs.value)
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

defineExpose({
  add_new_tab: () => add_new_tab(),
})

onMounted(() => {
  if (tabs.value.length === 0) {
    add_new_tab()
    selected_id.value = 0
  }
})

const on_select = id => {
  selected_id.value = id
  console.log("SID", selected_id.value)
}
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
        @click="on_select(tab.id)"
        @dblclick="start_editing(tab.id)"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          border: '1px solid',
          borderColor: selected_id === tab.id ? '#3b82f6' : '#ccc',
          backgroundColor: selected_id === tab.id ? '#eff6ff' : '#fff',
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
      <button @click="add_new_tab">New Tab</button>
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
