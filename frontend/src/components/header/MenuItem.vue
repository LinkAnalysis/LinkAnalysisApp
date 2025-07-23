<script setup>
import { ref } from "vue"

const props = defineProps({
  option: Object,
})

const emit = defineEmits(["close-all"])
const showSubmenu = ref(false)

const handleClick = () => {
  if (!props.option.children || props.option.children.length === 0) {
    props.option.onClick?.()
    emit("close-all")
  }
}
</script>

<template>
  <li
    class="dropdown-item"
    @mouseenter="showSubmenu = true"
    @mouseleave="showSubmenu = false"
    @click.stop="handleClick"
  >
    <div class="item-content">
      <img v-if="option.icon" :src="option.icon" class="flag-icon" />

      <span class="label">{{ option.label }}</span>

      <span v-if="option.active" class="checkmark">✔️</span>

      <span v-if="option.children" class="arrow">▶</span>
    </div>

    <ul v-if="option.children && showSubmenu" class="submenu menu-level">
      <MenuItem
        v-for="(child, index) in option.children"
        :key="index"
        :option="child"
        @close-all="emit('close-all')"
      />
    </ul>
  </li>
</template>

<style scoped>
.dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  background-color: white;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.submenu {
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: 4px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  list-style: none;
  padding: 0;
}

.arrow {
  font-size: 0.7em;
  margin-left: 0.5rem;
}

.item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
}

.flag-icon {
  width: 20px;
  height: 14px;
  object-fit: cover;
  border-radius: 2px;
}

.label {
  flex-grow: 1;
  text-align: left;
}

.checkmark {
  margin-left: auto;
  color: green;
  font-size: 1rem;
}

.arrow {
  margin-left: 0.25rem;
  font-size: 0.8rem;
}
</style>
