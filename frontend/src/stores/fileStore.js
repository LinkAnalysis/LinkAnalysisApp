import { ref } from "vue"

const selectedNodeFilePath = ref(null)
const selectedEdgeFilePath = ref(null)

export default {
  selectedNodeFilePath,
  setNodeFilePath(path) {
    selectedNodeFilePath.value = path
  },
  selectedEdgeFilePath,
  setEdgeFilePath(path) {
    selectedEdgeFilePath.value = path
  },
}
