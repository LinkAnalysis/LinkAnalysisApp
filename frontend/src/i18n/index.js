import { createI18n } from "vue-i18n"
import messages from "./translations"

export const i18n = createI18n({
  legacy: false,
  locale: "pl",
  fallbackLocale: "pl",
  messages,
})
