import Vue from "vue";
import App from "./App.vue";

import { DeeplxTranslateEngine, TranslateVuePlugin,DeeplxLanguage} from "@spacechart/translate";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.use(TranslateVuePlugin, {
    engine: new DeeplxTranslateEngine({
        url: "/translate",
        src: DeeplxLanguage.ZH,
        target: DeeplxLanguage.EN,
        authorization: "Bearer deeplx"
    })
});

new Vue({
    render: (h) => h(App)
}).$mount("#app");
