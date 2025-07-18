import { defineStore } from "pinia"

const getFileName = fullPath => {
  return fullPath ? fullPath.split(/[/\\]/).pop() : ""
}

export const useFileStore = defineStore("files", {
  state: () => ({
    nodePath: null,
    edgePath: null,
    layoutType: "circular",
    layoutParams: {},
  }),

  getters: {
    nodeFileName: state => getFileName(state.nodePath),
    edgeFileName: state => getFileName(state.edgePath),
    layoutName: state => state.layoutName,
  },

  actions: {
    setNodeFile(path) {
      this.nodePath = path
    },
    setEdgeFile(path) {
      this.edgePath = path
    },
    setLayout(type, params = {}) {
      this.layoutType = type
      this.layoutParams = params
    },
  },
})
