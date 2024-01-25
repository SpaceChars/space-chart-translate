const { TranslateEngine } = require("@spacechart/translate");
const { TranslateLang } = require("@spacechart/translate/lib/core/engine");

const engine = new TranslateEngine({
    host: "http://translate.cxjfun.top",
    src: TranslateLang.ZH
});

engine
    .translate({
        text: "你好世界"
    })
    .then((res) => {
        console.log("---翻译结果", res[0].data.data);
    });
