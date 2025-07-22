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
    focusedNodeId: null,
    focusedEdgeSource: null,
    focusedEdgeTarget: null,
    searchingEditNode: null,
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
    focusNode(id) {
      this.focusedNodeId = id
    },
    focusEdgeEndpoints(source, target) {
      this.focusedEdgeSource = source
      this.focusedEdgeTarget = target
    },
    searchEditNode(nodeLabel) {
      this.searchingEditNode = nodeLabel
    },
  },
})
