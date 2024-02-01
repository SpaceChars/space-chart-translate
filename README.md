# @SpaceChart/Translate

## 关于

> `@SpaceChart/Translate` 是一个可配置的翻译插件，适用于任何环境，让开发者不再需要注重插件本身\
> \
> 内置引擎： Deeplx（`DeeplxTranslateEngine`）\
> 内置翻译插件：HTML（`TranslateHTMLPlugin`）、VUE（`TranslateVuePlugin`）\
> \
> 代码已开源（[GitHub](https://github.com/SpaceChars/space-chart-translate)）,欢迎有想法的小伙伴们一起共建

## 翻译引擎

> 开发者可以通过`ITranslateEngine`翻译引擎接口自定义实现翻译逻辑，也可以使用内置的翻译引擎（Deeplx）

### 内置引擎

#### Deeplx

```js
const { DeeplxTranslateEngine, DeeplxLanguage } = require("@spacechart/translate");

const enine = new DeeplxTranslateEngine({
    //....
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

### `TranslateEngineInstance`

> 除了使用对应的翻译引擎类外，插件还提供了`TranslateEngineInstance`类，它同样继承了`ITranslateEngine`接口，`TranslateEngineInstance` 通过多态的概念，让开发者可以随意的更换引擎，而不用更改已编写的代码（如下）

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

## 扩展插件

### Vue 扩展插件

> Vue 插件通过`TranslateVuePlugin`类创建使用，支持`v-not-translate`指令排除需要翻译的文本（如下）

#### Options

> `VuePluginDefaultConfigOption`

| 字段     | 是否必填 | 类型               | 描述                                       |
| -------- | -------- | ------------------ | ------------------------------------------ |
| `engine` | 是       | `ITranslateEngine` | 翻译引擎                                   |
| `el`     | 否       | `string`           | 需要翻译的顶级节点                         |
| `global` | 否       | `boolean`          | 是否全局注入`$t`全局插件变量 ，默认`false` |

#### Methods

| 方法名                                                     | 描述                          |
| ---------------------------------------------------------- | ----------------------------- |
| `install(app: any, options: VuePluginDefaultConfigOption)` | `Vue.directive`注册指令时使用 |
| `create(options: VuePluginDefaultConfigOption) `           | 创建 `VuePlugin` 插件使用     |

#### 案例

##### 1. main.js

```js
import Vue from "vue";
import App from "./App.vue";

import { DeeplxTranslateEngine, TranslateVuePlugin } from "@spacechart/translate";

Vue.config.productionTip = false;
Vue.use(TranslateVuePlugin, {
    //翻译引擎
    engine: new DeeplxTranslateEngine({
        url: "/translate",
        authorization: "xx xx"
    }),
    //需要翻译的节点
    el: "#app"
});

new Vue({
    render: (h) => h(App)
}).$mount("#app");
```

##### 2. App.vue

```html
<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" />

        <HelloWorld msg="Welcome to Your Vue.js App" />
        <div class="div">
            你好 yes
            <div class="div" v-not-translate>How are you?</div>
        </div>
    </div>
</template>

<script>
    import HelloWorld from "./components/HelloWorld.vue";

    export default {
        name: "App",
        components: {
            HelloWorld
        },
        data() {
            return {};
        },
        mounted() {
            setTimeout(() => {
                this.$t.translate({
                    src: "EN",
                    target: "ZH",
                    languageMap: [
                        {
                            src: "EN",
                            target: "ZH",
                            srcText: "你好",
                            targetText: "Hello"
                        }
                    ]
                });
            });
        }
    };
</script>
```

### `HTML` 扩展插件

> `HTML` 插件通过`TranslateHTMLPlugin`类创建使用，支持`not-translate`属性排除需要翻译的文本（如下）

#### Options

> `HtmlPluginDefaultConfigOption`

| 字段     | 是否必填 | 描述               |
| -------- | -------- | ------------------ | ------------------------------------------ |
| 字段     | 是否必填 | 类型               | 描述                                       |
| ------   | -------- | ----------------   | ------------------------------------------ |
| `engine` | 是       | `ITranslateEngine` | 翻译引擎                                   |
| `el`     | 否       | `string`           | 需要翻译的顶级节点                         |

#### Methods

| 方法名                                           | 描述                       |
| ------------------------------------------------ | -------------------------- |
| `create(options: HtmlPluginDefaultConfigOption)` | 创建 `HtmlPlugin` 插件使用 |

#### 案例

##### index.html

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script src="../../dist//translate.js"></script>
    </head>
    <body>
        <div id="app">你好</div>
        <script>
            const { TranslateHTMLPlugin, DeeplxTranslateEngine } = translate;
            const plugin = TranslateHTMLPlugin.create({
                engine: new DeeplxTranslateEngine({
                    url: "/translate",
                    authorization: "xx xx"
                }),
                el: "#app"
            });

            plugin.translate({
                src: "ZH",
                target: "EN"
            });
        </script>
    </body>
</html>
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
const { DeeplxTranslateEngine, TranslateEngineInstance } = require("@spacechart/translate");

const engine = new TranslateEngineInstance(
    new DeeplxTranslateEngine({
        //...
    })
);

engine
    .translate({
        text: "你好世界"
    })
    .then((res) => {
        console.log("---翻译结果", res.data);
    });
```
