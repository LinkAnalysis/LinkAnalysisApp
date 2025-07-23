<template>
  <div class="controls">
    <button class="zoom-in" @click="$emit('zoomIn')">Zoom in</button>
    <button class="zoom-out" @click="$emit('zoomOut')">Zoom out</button>
    <button class="reset" @click="$emit('resetView')">Reset</button>
  </div>
</template>

<script setup>
defineEmits(["zoomIn", "zoomOut", "resetView"])
</script>

<style scoped>
.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.5);
  padding: 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
}
.controls button {
  cursor: pointer;
  width: 100%;
}
</style>
