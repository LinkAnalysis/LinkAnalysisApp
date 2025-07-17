<script setup>
import Graph from "graphology"
import { ref, onMounted, reactive } from "vue"

const tabs = ref([])
const selected_index = defineModel("selected_tab_index")

const tab_added = defineEmits(["new_tab"])

const add_new_tab = () => {
  tabs.value.push({ title: `tab-${tabs.value.length + 1}` })

  tab_added("new_tab")
}

defineExpose({
  add_new_tab: () => add_new_tab(),
})

onMounted(() => {
  if (tabs.value.length === 0) {
    add_new_tab()
    selected_index.value = 0
  }
})

const on_select = index => {
  selected_index.value = index
}
</script>

<template>
  <div class="tabs-container">
    <ul>
      <li
        v-for="(tab, index) in tabs"
        :key="index"
        @click="on_select(index)"
        :class="{ selected: index === selected_index }"
      >
        {{ tab.title }}
      </li>
      <button @click="add_new_tab">New Tab</button>
    </ul>
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
