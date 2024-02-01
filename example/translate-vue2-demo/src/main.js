import Vue from "vue";
import App from "./App.vue";

import { DeeplxTranslateEngine, TranslateVuePlugin } from "@spacechart/translate";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.use(TranslateVuePlugin, {
    engine: new DeeplxTranslateEngine({
        url: "/translate",
        authorization: "Bearer deeplx"
    }),
    el: "#app"
});

new Vue({
    render: (h) => h(App)
}).$mount("#app");
