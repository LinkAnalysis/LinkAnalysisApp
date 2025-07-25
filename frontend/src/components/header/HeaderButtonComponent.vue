<script setup>
import { ref, nextTick } from "vue"
import MenuItem from "./MenuItem.vue"

const props = defineProps({
  label: String,
  name: { type: String, default: "" },
  options: { type: Array, default: () => [] },
})

const emit = defineEmits(["click"])
const isOpen = ref(false)
const menuPosition = ref({ top: 0, left: 0 })

const buttonRef = ref(null)

const toogleMenu = async event => {
  if (props.options.length > 0) {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      await nextTick()
      const rect = buttonRef.value.getBoundingClientRect()
      menuPosition.value = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      }
    }
    event.stopPropagation()
  } else {
    emit("click")
  }
}
</script>

<template>
  <div class="dropdown-wrapper">
    <button ref="buttonRef" class="header-button" @click="toogleMenu">
      {{ label }}
    </button>

    <teleport to="body">
      <ul
        v-if="isOpen && options.length"
        class="dropdown menu-level"
        :style="{
          position: 'absolute',
          top: menuPosition.top + 'px',
          left: menuPosition.left + 'px',
        }"
      >
        <MenuItem
          v-for="(option, index) in options"
          :key="index"
          :option="option"
          @close-all="isOpen = false"
        />
      </ul>
    </teleport>
  </div>
</template>

<style scoped>
.header-button {
  font-size: 1.3rem;
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  border: 2px solid #000;
  border-radius: 7px;
  background-color: white;
  color: black;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    background-color 0.2s;
}

.header-button:hover {
  background-color: #cccccc;
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  list-style: none;
  padding: 0;
}

.menu-level {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
