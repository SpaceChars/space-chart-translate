import Vue from "vue";
import App from "./App.vue";
import { TranslateVuePlugin } from "@spacechart/translate";

Vue.config.productionTip = false;
Vue.use(TranslateVuePlugin, {
    host: "http://translate.cxjfun.top"
});

new Vue({
    render: (h) => h(App)
}).$mount("#app");
