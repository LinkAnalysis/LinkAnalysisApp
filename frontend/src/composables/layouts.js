import circular from "graphology-layout/circular"
import forceAtlas2 from "graphology-layout-forceatlas2"

export const layouts = {
  circular: {
    apply: (graph, params = {}) => circular.assign(graph),
    defaultParams: {},
  },
  forceAtlas2: {
    apply: (graph, params = {}) => {
      circular.assign(graph)
      forceAtlas2.assign(graph, params)
    },
    defaultParams: {
      iterations: 1000,
      gravity: 1,
      scalingRatio: 1,
      strongGravityMode: false,
    },
  },
}
