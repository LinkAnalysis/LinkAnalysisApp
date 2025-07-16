<template>
  <v-app-bar class="header-bar" flat elevation="0" app>
    <div class="header-content">
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
  </v-app-bar>
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
  background-color: white;
  border-bottom: 2px solid #ccc;
  padding: 0 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.branding {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 40px;
}

.app-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.button-box {
  display: flex;
  gap: 1rem;
}
</style>
