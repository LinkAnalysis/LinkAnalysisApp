import { inject, computed, ref, toValue } from "vue"
import { translations } from "./translations"

export function useTranslations() {
  const currentLang = inject("currentLang", ref("en"))

  const labels = computed(() => {
    const lang = toValue(currentLang)
    return translations[lang] || translations.en
  })

  return { currentLang, labels }
}
