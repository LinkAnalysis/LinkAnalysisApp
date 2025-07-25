export function withCtrl(e) {
  const ev = e?.original ?? e
  return !!(ev.ctrlKey || ev.metaKey)
}
