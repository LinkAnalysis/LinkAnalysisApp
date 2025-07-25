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
import * as gexf from "graphology-gexf"
import { computed } from "vue"
import plFlag from "@/assets/images/pl.png"
import enFlag from "@/assets/images/gb.png"

const { t, locale } = useI18n()
import { ref } from "vue"

const tabsStore = useTabsStore()
const {
  selectedNodeFile,
  selectedEdgeFile,
  selectedGraph,
  graphViewRef,
  selectedGraphMode,
  selectedNumberOfRows,
} = storeToRefs(tabsStore)

const amlModalOpen = ref(false)
const amlTempRows = ref(100)
let amlResolve = null
const amlError = ref("")

const confirmAml = () => {
  const value = amlTempRows.value
  if (!Number.isInteger(value) || value < 1 || value > 20000) {
    amlError.value = t("rowsWindow.wrong_range_message")
    return
  }
  amlError.value = ""
  amlResolve?.(value)
}

const uploadAntiMoneyLaunderingGraph = async () => {
  let filePath = null

  try {
    filePath = await OpenFileExplorer()
    if (!filePath) return

    amlTempRows.value = selectedNumberOfRows.value ?? 100
    amlModalOpen.value = true

    const rows = await new Promise((resolve, reject) => {
      amlResolve = resolve
    })

    selectedNumberOfRows.value = rows
  } catch (e) {
    console.error("[openAmlModal] aborted/error:", e)
  } finally {
    amlModalOpen.value = false
    amlResolve = null

    if (filePath) {
      selectedEdgeFile.value = filePath
      selectedGraphMode.value = "antiMoneyLaundering"
    }
  }
}

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
    selectedGraphMode.value = "normal"
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

const availableLanguages = [
  {
    code: "pl",
    label: () => t("header.languages.pl"),
    icon: plFlag,
  },
  {
    code: "en",
    label: () => t("header.languages.en"),
    icon: enFlag,
  },
]

const languageOptions = computed(() =>
  availableLanguages.map(lang => ({
    label: lang.label(),
    icon: lang.icon,
    onClick: () => setLanguage(lang.code),
    active: locale.value === lang.code,
  })),
)

function setLanguage(lang) {
  locale.value = lang
}
</script>

<template>
  <v-app-bar>
    <header class="header-bar">
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
                label: t('header.file_menu.upload_graph'),
                children: [
                  {
                    label: t('header.file_menu.upload_edges'),
                    onClick: () => uploadEdgesConfiguration(),
                  },
                  {
                    label: t('header.file_menu.upload_nodes'),
                    onClick: () => uploadNodesConfiguration(),
                  },
                ],
              },
              {
                label: t('header.file_menu.upload_anti_money_graph'),
                onClick: () => uploadAntiMoneyLaunderingGraph(),
              },
              {
                label: 'Export Graph',
                children: [
                  {
                    label: t('header.file_menu.export_jpg'),
                    onClick: () => exportToJPG(),
                  },
                  {
                    label: t('header.file_menu.export_png'),
                    onClick: exportToPNG,
                  },
                  {
                    label: t('header.file_menu.export_gexf'),
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
        />
        <HeaderButtonComponent :label="t('header.view')" name="view" />
        <HeaderButtonComponent
          :label="t('header.settings')"
          name="settings"
          :options="languageOptions"
        />
      </div>
    </header>
  </v-app-bar>
  <teleport to="body">
    <div v-if="amlModalOpen" class="aml-overlay">
      <div class="aml-modal">
        <h2>{{ t("rowsWindow.window_message") }}</h2>
        <h2>{{ t("rowsWindow.available_range") }}</h2>
        <input
          type="number"
          min="1"
          v-model.number="amlTempRows"
          class="aml-input"
          @keyup.enter="confirmAml"
        />
        <p v-if="amlError" style="color: red; margin-top: 8px">
          {{ amlError }}
        </p>
        <div class="aml-actions">
          <button class="aml-btn" @click="confirmAml">OK</button>
        </div>
      </div>
    </div>
  </teleport>
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

<style>
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

.aml-input {
  width: 100%;
  margin-top: 16px;
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
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
