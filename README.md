# @SpaceChart/Translate

@SpaceChart/Translate 是一个可配置的翻译插件，适用于任何环境，让开发者不再需要注重插件本身

## 翻译引擎

> 开发者可以通过`ITranslateEngine`翻译引擎接口自定义实现翻译逻辑，也可以使用内置的翻译引擎（Deeplx）

### 内置引擎

#### Deeplx

```js
const { DeeplxTranslateEngine, DeeplxLanguage } = require("@spacechart/translate");

const enine = new DeeplxTranslateEngine({
    host: "http://translate.xx.xx",
    src: DeeplxLanguage.ZH,
    target: DeeplxLanguage.EN,
    authorization: "xx.xx"
});

//发送请求
engine
    .translate({
        //....
    })
    .then((res) => {
        consoe.log("-----翻译结果", res);
    });
```

### 自定义引擎

```js
export class MyTranslateEngine implements ITranslateEngine {
    //单个翻译请求
    singleTranslate(options: TranslateConfigOption): Promise<TranslateResponseOption> {
        //....
    }

    //批量翻译请求
    branchTranslate(options: TranslateConfigOption[]): Promise<TranslateResponseOption[]> {
        //....
    }

    //单个或多个请求
    translate(
        options: TranslateConfigOption | TranslateConfigOption[]
    ): Promise<TranslateResponseOption> | Promise<TranslateResponseOption[]> {
        //....
    }
}

const enine = new MyTranslateEngine();

enine.translate({
    //...
});
```

### TranslateEngineInstance

> 除了使用对应的翻译引擎类外，插件还提供了`TranslateEngineInstance`类，它同样继承了`ITranslateEngine`接口，TranslateEngineInstance 通过多态的概念，让开发者可以随意的更换引擎，而不用更改已编写的代码（如下）

```js
const { DeeplxTranslateEngine, TranslateEngineInstance } = require("@spacechart/translate");

const enine = new TranslateEngineInstance(
    new DeeplxTranslateEngine({
        //..
    })
    //更换引擎，下面的translate无需更换
    // new MyTranslateEngine({
    //    //..
    // })
);

enine
    .translate({
        //....
    })
    .then((res) => {
        consoe.log("-----翻译结果", res);
    });
```

## 制作第一个 Translate 项目

### 1. 初始化项目

```shell
node init -y
```

### 2. 安装依赖

```shell
npm install @spacechart/translate
```

### 配置项目

```js
const {
    DeeplxTranslateEngine,
    DeeplxLanguage,
    TranslateEngineInstance
} = require("@spacechart/translate");

const engine = new TranslateEngineInstance(
    new DeeplxTranslateEngine({
        host: "http://translate.xx.xx",
        src: TranslationLanguage.ZH,
        target: TranslationLanguage.EN,
        authorization: "xx.xx"
    })
);

engine
    .translate({
        text: "你好世界"
    })
    .then((res) => {
        console.log("---翻译结果", res[0].data.data);
    });
```

## 关于

目前插件内置的引擎只有Deeplx，代码已开源，欢迎有想法的小伙伴们一起共建