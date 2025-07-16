<template>
  <div class="header-bar">
    <div class="branding">
      <img src="@/assets/images/logo.svg" alt="Logo" class="logo" />
      <span class="app-name">LinkAnalysis</span>
    </div>

    <div class="button-box">
      <HeaderButtonComponent
        :label="labels.file"
        name="file"
        @click="emitChange"
      />
      <HeaderButtonComponent
        :label="labels.workspace"
        name="workspace"
        @click="emitChange"
      />
      <HeaderButtonComponent
        :label="labels.view"
        name="view"
        @click="emitChange"
      />
      <HeaderButtonComponent
        :label="labels.settings"
        name="settings"
        @click="emitChange"
      />
    </div>
  </div>
</template>

<script setup>
import { inject, computed, toValue } from "vue"
import HeaderButtonComponent from "./HeaderButtonComponent.vue"
import { translations } from "@/i18n/translations.js"

const currentLang = inject("currentLang", "en")
const emit = defineEmits(["change-section"])

const labels = computed(() => {
  const lang = toValue(currentLang)
  return translations[lang] || translations.en
})

const emitChange = section => {
  emit("change-section", section)
}
</script>

<style scoped>
.header-bar {
  min-height: 48px;
  background-color: white;
  border-bottom: 2px solid #000000;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.branding {
  width: 16%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  overflow: hidden;
  box-sizing: border-box;
}

.logo {
  height: 30px;
  display: block;
  flex-shrink: 0;
}

.app-name {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  color: #000;
}

.button-box {
  padding-left: 1rem;
  margin-right: auto;
  display: flex;
  gap: 1rem;
}
</style>
