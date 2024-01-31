
// This module is intended to unwrap Axios default export as named.

import Translate from './lib/core/translate'

const { DeeplxTranslateEngine,DeeplxLanguage, TranslateVuePlugin } = Translate

export {
  Translate as default,
  DeeplxTranslateEngine,
  DeeplxLanguage,
  TranslateVuePlugin
}