import Vue from "vue";
import App from "./App.vue";
import translate from "@space-chart/translate";

Vue.config.productionTip = false;
Vue.use(translate.TransplateVuePlugin, {});

new Vue({
    render: (h) => h(App)
}).$mount("#app");
