<script lang="js" setup>
import { ref, provide } from "vue"
import HeaderComponent from "./components/header/HeaderComponent.vue"

const currentLang = ref("en")

provide("currentLang", currentLang)
</script>

<template>
  <v-app>
    <HeaderComponent />
    <v-main class="main-area">
      <v-container fluid class="layout-grid">
        <div class="left-panel">
          <LeftPanel />
        </div>
        <div class="center-panel">
          <MainContent :currentSection="currentSection" />
        </div>
        <div class="right-panel">
          <RightPanel />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  height: calc(100vh - 64px);
  padding: 0;
  gap: 0;
}

.left-panel {
  background-color: #fdfdfd;
  border-right: 2px solid #ccc;
  height: 100%;
}

.center-panel {
  background-color: #fff;
  border-left: 2px solid #ccc;
  border-right: 2px solid #ccc;
  height: 100%;
}

.right-panel {
  background-color: #fdfdfd;
  border-left: 2px solid #ccc;
  height: 100%;
}
</style>
