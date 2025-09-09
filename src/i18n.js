import { createI18n } from 'vue-i18n'
import ar from './ar.json'
import en from './en.json'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'ar',
  fallbackLocale: 'en',
  messages: {
    ar,
    en
  }
})

export default i18n
