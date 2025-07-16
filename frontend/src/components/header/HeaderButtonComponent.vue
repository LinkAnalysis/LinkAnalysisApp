<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["click"])

const handleClick = () => {
  emit("click", props.name || props.label)
}
</script>

<template>
  <button class="header-button" @click="handleClick">
    {{ label }}
  </button>
</template>

<style scoped>
.header-button {
  font-size: 1.5rem;
  font-weight: 500;
  padding: 0.5rem 0.7rem;
  border: 3px solid #000;
  border-radius: 15px;
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
</style>
