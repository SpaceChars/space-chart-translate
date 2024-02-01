const {
    DeeplxTranslateEngine,
    DeeplxLanguage,
    TranslateEngineInstance
} = require("@spacechart/translate");

const engine = new TranslateEngineInstance(
    new DeeplxTranslateEngine({
        url: "http://translate.cxjfun.top/translate",
        src: DeeplxLanguage.ZH,
        target: DeeplxLanguage.EN,
        authorization: "Bearer deeplx"
    })
);

engine
    .translate({
        text: "你好世界"
    })
    .then((res) => {
        console.log("---翻译结果", res);
    });
