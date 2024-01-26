const { TranslateEngine, TranslationLanguage } = require("@spacechart/translate");

const engine = new TranslateEngine({
    host: "http://translate.cxjfun.top",
    src: TranslationLanguage.ZH,
    target: TranslationLanguage.EN,
    authorization: "Bearer deeplx"
});

engine
    .translate({
        text: "你好世界"
    })
    .then((res) => {
        console.log("---翻译结果", res);
    });
