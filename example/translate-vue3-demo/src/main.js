import { createApp } from "vue";
import App from "./App.vue";

import { DeeplxTranslateEngine, TranslateVuePlugin } from "@spacechart/translate";

createApp(App)
    .use(TranslateVuePlugin, {
        engine: new DeeplxTranslateEngine({
            url: "/translate",
            authorization: "Bearer deeplx"
        }),
        el: "#app"
    })
    .mount("#app");
