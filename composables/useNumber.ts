export const useNumber = (x: number): string => {
  if (x < 1e3) {
    return x.toLocaleString()
  } else if (x < 1e6) {
    let n = (x / 1e3).toFixed(1)
    if (n.endsWith(".0") || n.length >= 5) n = n.slice(0, n.length - 2)
    return `${n}k`
  } else if (x < 1e9) {
    let n = (x / 1e6).toFixed(1)
    if (n.endsWith(".0") || n.length >= 5) n = n.slice(0, n.length - 2)
    return `${n}M`
  } else if (x < 1e12) {
    let n = (x / 1e9).toFixed(1)
    if (n.endsWith(".0") || n.length >= 5) n = n.slice(0, n.length - 2)
    return `${n}B`
  }
  return x.toPrecision(2)
}
