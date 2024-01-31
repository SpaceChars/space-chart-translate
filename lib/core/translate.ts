// this module should only have a default export
import { DeeplxTranslateEngine, DeeplxLanguage } from '../engines/index'
import {TranslateEngineInstance} from './engine'

import TranslateVuePlugin from '../../plugins/vue/index'

export default {
  DeeplxTranslateEngine,
  DeeplxLanguage,
  TranslateVuePlugin,
  TranslateEngineInstance
}