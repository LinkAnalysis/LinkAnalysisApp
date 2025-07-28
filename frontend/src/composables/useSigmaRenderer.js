import { ref, shallowRef, onMounted, onBeforeUnmount } from "vue"
import Sigma from "sigma"
import { applyStyleOptions } from "@/utils/graphUtils"
import { createNodeImageProgram } from "@sigma/node-image"
import { normalizeGraphCoordinates } from "./layouts"

export function useSigmaRenderer({ graph, optionsRef }) {
  const container = ref(null)
  const renderer = shallowRef(null)

  onMounted(() => {
    applyStyleOptions(graph, optionsRef.value)
    normalizeGraphCoordinates(graph)
    renderer.value = new Sigma(graph, container.value, {
      minCameraRatio: 0.08,
      maxCameraRatio: 50,
      renderEdgeLabels: optionsRef.value.renderEdgeLabels,
      enableEdgeEvents: true,
      labelRenderedSizeThreshold: optionsRef.value.renderNodeLabels ? 6 : 9999,
      defaultNodeType: "image",
      nodeProgramClasses: {
        image: createNodeImageProgram(),
      },

      nodeReducer: (node, data) => {
        if (data.highlighted) {
          return {
            ...data,
            color: optionsRef.value.selectedNodeColor,
            size: data.size * 1.5,
            zIndex: 10,
          }
        }
        return data
      },
      edgeReducer: (edge, data) => {
        const base = {
          ...data,
          forceLabel: true,
        }

        if (data.highlighted) {
          return {
            ...base,
            color: optionsRef.value.highlightedEdgeColor,
            size: (data.size || 1) * 2,
            labelSize: (data.labelSize || 12) + 4,
            zIndex: 5,
          }
        }

        return {
          ...base,
          color: optionsRef.value.edgeColor,
        }
      },

      defaultDrawNodeLabel: (ctx, d, s) => {
        if (!d.label) return
        ctx.font = `${s.labelSize}px ${s.labelFont}`
        ctx.textAlign = "center"
        ctx.fillStyle = s.labelColor === "node" ? d.color : s.labelColor
        ctx.fillText(d.label, d.x, d.y + d.size)
      },
      defaultDrawNodeHover: (ctx, d, s) => {
        if (!d.label) return

        ctx.save()
        const outline = d.size + 3
        ctx.beginPath()
        ctx.arc(d.x, d.y, outline, 0, Math.PI * 2, true)
        ctx.fillStyle = "#fff"
        ctx.fill()

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2, true)
        ctx.fillStyle = d.color || "#999"
        ctx.fill()

        const fontSize = s.labelSize || 12
        ctx.font = `${s.labelWeight || ""} ${fontSize}px ${s.labelFont || "Arial"}`

        const pad = 2
        const textW = ctx.measureText(d.label).width
        const boxW = textW + pad * 2 + 1
        const boxH = fontSize + pad * 2 + 1
        const boxX = d.x - boxW / 2
        const boxY = d.y + d.size

        ctx.fillStyle = "#fff"
        ctx.fillRect(boxX, boxY, boxW, boxH)

        ctx.fillStyle = "#000"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText(d.label, d.x, boxY + pad)

        ctx.restore()
      },
    })
    renderer.value.getContainer().style.background =
      optionsRef.value.backgroundColor
  })

  onBeforeUnmount(() => {
    renderer.value?.kill()
  })

  return { container, renderer }
}
