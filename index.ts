
// This module is intended to unwrap Axios default export as named.

import Translate from './lib/core/translate'

const { DeeplxTranslateEngine, DeeplxLanguage, TranslateEngineInstance } = Translate

export {
  Translate as default,
  DeeplxTranslateEngine,
  DeeplxLanguage,
  TranslateEngineInstance
}