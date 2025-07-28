<template>
  <teleport to="body">
    <div v-if="open" class="aml-overlay">
      <div class="aml-modal">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <div class="aml-actions">
          <button class="aml-btn aml-btn--secondary" @click="onCancel">
            {{ cancelLabel }}
          </button>
          <button class="aml-btn" @click="onConfirm">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
defineProps({
  open: Boolean,
  title: String,
  message: String,
  confirmLabel: { type: String, default: "Confirm" },
  cancelLabel: { type: String, default: "Cancel" },
})

const emit = defineEmits(["confirm", "cancel"])

const onConfirm = () => emit("confirm")
const onCancel = () => emit("cancel")
</script>

<style scoped>
.aml-overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.aml-modal {
  background: #fff;
  padding: 32px 40px;
  border-radius: 12px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
}

.aml-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.aml-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #1976d2;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}

.aml-btn--secondary {
  background: #e0e0e0;
  color: #333;
}
</style>
