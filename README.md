# @SpaceChart/Translate

@SpaceChart/Translate 是一个依靠 Deeplx 作为底层翻译服务的前端插件、插件支持浏览器、Node 引用

## 制作第一个 Translate 项目

### 1. 创建 node 项目

```shell
node init -y
```

### 2. 安装依赖

```shell
npm install @spacechart/translate
```

### 配置项目

```js
const { TranslateEngine,TranslationLanguage} = require("@spacechart/translate");

const engine = new TranslateEngine({
    host: "http://translate.xx.xx",
    src: TranslationLanguage.ZH,
    target: TranslationLanguage.EN,
    authorization: "xx.xx"
});

engine
    .translate({
        text: "你好世界"
    })
    .then((res) => {
        console.log("---翻译结果", res[0].data.data);
    });
```
