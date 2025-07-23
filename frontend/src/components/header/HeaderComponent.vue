<script setup>
import HeaderButtonComponent from "./HeaderButtonComponent.vue"
import {
  OpenFileExplorer,
  SaveFileExplorer,
  SaveStringToFile,
} from "../../../wailsjs/go/main/App"
import { useI18n } from "vue-i18n"
import { useTabsStore } from "../../stores/tabsStore.js"
import { storeToRefs } from "pinia"
import { LogPrint } from "../../../wailsjs/runtime/runtime.js"
import svg from "graphology-svg"
import * as gexf from "graphology-gexf"
import * as graphml from "graphology-graphml"

const { t } = useI18n()

const tabsStore = useTabsStore()
const { selectedNodeFile, selectedEdgeFile, selectedGraph, graphViewRef } =
  storeToRefs(tabsStore)

const uploadNodesConfiguration = async () => {
  const filePath = await OpenFileExplorer()
  if (filePath) {
    selectedNodeFile.value = filePath
  }
}

const uploadEdgesConfiguration = async () => {
  const filePath = await OpenFileExplorer()
  if (filePath) {
    selectedEdgeFile.value = filePath
  }
}

const exportToPNG = async () => {
  LogPrint("Exporting to PNG")
  if (!graphViewRef.value) {
    LogPrint("grapView container was null")
    return
  }
  const filePath = await SaveFileExplorer("graph", "png")
  await graphViewRef.value.saveImage(filePath, "png")
  LogPrint("Done!")
}

const exportToJPG = async () => {
  LogPrint("Exporting to JPG")
  if (!graphViewRef.value) {
    LogPrint("grapView container was null")
    return
  }
  const filePath = await SaveFileExplorer("graph", "jpg")
  await graphViewRef.value.saveImage(filePath, "jpg")
  LogPrint("Done!")
}

const exportToGEXF = async () => {
  LogPrint("Exporting to GEXF")
  const gexfString = gexf.write(selectedGraph.value)
  const filePath = await SaveFileExplorer("graph", "gexf")
  await SaveStringToFile(filePath, gexfString)
  LogPrint("Done!")
}
</script>

<template>
  <v-app-bar class="header-bar" flat elevation="0" app>
    <div class="branding">
      <img src="@/assets/images/logo.svg" alt="Logo" class="logo" />
      <span class="app-name">LinkAnalysis</span>
    </div>
    <div class="button-box">
      <div class="file-button-box">
        <HeaderButtonComponent
          :label="t('header.file')"
          name="file"
          :options="[
            {
              label: 'Upload Graph',
              onClick: () => console.log('Upload Graph'),
              children: [
                {
                  label: 'Upload edges configuration',
                  onClick: () => uploadEdgesConfiguration(),
                },
                {
                  label: 'Upload nodes configuration',
                  onClick: () => uploadNodesConfiguration(),
                },
              ],
            },
            {
              label: 'Export Graph',
              children: [
                {
                  label: 'JPG',
                  onClick: () => exportToJPG(),
                },
                {
                  label: 'PNG',
                  onClick: exportToPNG,
                },
                {
                  label: 'GEXF',
                  onClick: exportToGEXF,
                },
              ],
            },
          ]"
        />
      </div>
      <HeaderButtonComponent
        :label="t('header.workspace')"
        name="workspace"
        @click="emitChange"
      />
      <HeaderButtonComponent
        :label="t('header.view')"
        name="view"
        @click="emitChange"
      />
      <HeaderButtonComponent
        :label="t('header.settings')"
        name="settings"
        @click="emitChange"
      />
    </div>
  </v-app-bar>
</template>

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
