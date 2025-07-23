<template>
  <div class="graph-controls">
    <button class="zoom-in" @click="$emit('zoomIn')" aria-label="Powiększ">
      +
    </button>
    <button class="zoom-out" @click="$emit('zoomOut')" aria-label="Pomniejsz">
      −
    </button>
    <button class="reset" @click="$emit('resetView')" aria-label="Resetuj">
      ⟳
    </button>
  </div>
</template>

<script setup>
defineEmits(["zoomIn", "zoomOut", "resetView"])
</script>
