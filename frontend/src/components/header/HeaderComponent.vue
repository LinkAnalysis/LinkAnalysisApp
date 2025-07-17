<template>
  <v-app-bar class="header-bar" flat elevation="0" app>
    <div class="branding">
      <img src="@/assets/images/logo.svg" alt="Logo" class="logo" />
      <span class="app-name">LinkAnalysis</span>
    </div>
    <div class="button-box">
      <div class="file-button-box">
        <HeaderButtonComponent
          :label="labels.file"
          name="file"
          :options="[
            {
              label: 'Upload Graph',
              onClick: () => console.log('Upload Graph'),
              children: [
                {
                  label: 'Upload nodes configuration',
                  onClick: () => console.log('Upload Graph nodes'),
                },
                {
                  label: 'Upload edges configuration',
                  onClick: () => console.log('Upload Graph edges'),
                },
              ],
            },
          ]"
        />
      </div>
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
  </v-app-bar>
</template>

<script setup>
import HeaderButtonComponent from "./HeaderButtonComponent.vue"
import { useTranslations } from "@/i18n/useTranslations"

const emit = defineEmits(["change-section"])

const { currentLang, labels } = useTranslations()

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
  line-height: 1.3;
  color: #000;
}

.button-box {
  padding-left: 1rem;
  margin-right: auto;
  display: flex;
  gap: 1rem;
}

.file-box-popup {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-button-box {
  position: relative;
  display: inline-block;
}

.custom-file-name {
  margin-left: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}

.hidden-input {
  display: none;
}

.file-input-label {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.custom-file-name {
  font-style: italic;
  font-size: 0.9rem;
  color: #555;
}

.file-select-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-trigger {
  padding: 0.25rem 0.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-style: italic;
  min-width: 160px;
}

.hidden-input {
  display: none;
}
</style>
