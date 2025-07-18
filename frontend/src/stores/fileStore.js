import { defineStore } from "pinia"

const getFileName = fullPath => {
  return fullPath ? fullPath.split(/[/\\]/).pop() : ""
}

export const useFileStore = defineStore("files", {
  state: () => ({
    nodePath: null,
    edgePath: null,
  }),

  getters: {
    nodeFileName: state => getFileName(state.nodePath),
    edgeFileName: state => getFileName(state.edgePath),
  },

  actions: {
    setNodeFile(path) {
      this.nodePath = path
    },
    setEdgeFile(path) {
      this.edgePath = path
    },
  },
})
