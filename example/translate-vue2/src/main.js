import Vue from "vue";
import App from "./App.vue";
import {TransplateVuePlugin} from "@space-chart/translate";

Vue.config.productionTip = false;
Vue.use(TransplateVuePlugin, {});

new Vue({
    render: (h) => h(App)
}).$mount("#app");
