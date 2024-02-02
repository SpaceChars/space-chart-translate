const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        proxy: {
            "/translate": {
                target: "http://translate.cxjfun.top",
                ws: true,
                changeOrigin: true
            }
        }
    }
});
