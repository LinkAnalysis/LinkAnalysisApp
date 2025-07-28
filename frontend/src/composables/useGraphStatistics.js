import { unref, toRaw } from "vue"
import weightedSize from "graphology-metrics/graph/weighted-size"
import diameter from "graphology-metrics/graph/diameter"
import { density } from "graphology-metrics/graph/density"
import simpleSize from "graphology-metrics/graph/simple-size"

export function useGraphStatistics(graphRef) {
  const getAverageDegree = () => {
    const g = toRaw(unref(graphRef))
    const nodes = g.nodes()
    if (!nodes.length) return 0
    let sum = 0
    for (const n of nodes) sum += g.degree(n)
    return sum / nodes.length
  }

  const getAverageWeightedDegree = () => {
    const g = toRaw(unref(graphRef))
    const nodes = g.nodes()
    const result = weightedSize(g, "weight")
    return result / nodes.length
  }

  const getNetworkDiameter = () => {
    const g = toRaw(unref(graphRef))
    const d = diameter(g)
    return d
  }

  const getGraphDensity = () => {
    const g = toRaw(unref(graphRef))
    const d = density(g)
    return d
  }

  const getSimpleSize = () => {
    const g = toRaw(unref(graphRef))
    const ss = simpleSize(g)
    return ss
  }

  return {
    getAverageDegree,
    getAverageWeightedDegree,
    getNetworkDiameter,
    getGraphDensity,
    getSimpleSize,
  }
}
