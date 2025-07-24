import { createI18n } from "vue-i18n"
import messages from "./translations"

function detectLocale() {
  const candidates = navigator.languages ?? [navigator.language]
  for (const tag of candidates) {
    const short = tag.toLowerCase().split("-")[0]
    if (short in messages) return short
  }
  return "en"
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: "en",
  messages,
})
