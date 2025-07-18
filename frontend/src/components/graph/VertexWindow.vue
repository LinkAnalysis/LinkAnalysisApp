<template>
  <div
    v-if="visible"
    ref="popupRef"
    class="popup"
    :style="{
      left: position.x + offsetX + 'px',
      top: position.y + offsetY + 'px',
    }"
  >
    <slot />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue"

defineProps({
  position: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  offsetX: {
    type: Number,
    default: 10,
  },
  offsetY: {
    type: Number,
    default: -20,
  },
})
const popupRef = ref(null)

function handleClickOutside(event) {
  if (popupRef.value && !popupRef.value.contains(event.target)) {
    emit("close")
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside)
})

const emit = defineEmits(["close"])
</script>

<style scoped>
.popup {
  position: absolute;
  background: white;
  border: 1px solid black;
  padding: 8px;
  z-index: 20;
  transform: translate(0, 0);
  pointer-events: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
