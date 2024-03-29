
// This module is intended to unwrap translate default export as named.

import Translate from './lib/core/translate'

const { DeeplxTranslateEngine, DeeplxLanguage, TranslateVuePlugin, TranslateEngineInstance, TranslateHTMLPlugin } = Translate

export {
  Translate as default,
  DeeplxTranslateEngine,
  DeeplxLanguage,
  TranslateVuePlugin,
  TranslateEngineInstance,
  TranslateHTMLPlugin
}