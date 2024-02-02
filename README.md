<h2 align="center">
    <br/>
    <b>@SpaceChart/Translate</b>
    <br/>
</h2>

<br/>

<p align="center">
@SpaceChart/Translate 是一个可配置的翻译插件，适用于任何环境，让开发者不再需要注重插件本身
</p>

<br/>

<p align="center">
Engines： Deeplx（DeeplxTranslateEngine）
</p>
<p align="center">
Plugins：HTML（TranslateHTMLPlugin）、VUE（TranslateVuePlugin）
</p>

<br/>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@spacechart/translate.svg?style=flat-square)](https://www.npmjs.org/package/@spacechart/translate)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=@spacechart/translate&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=@spacechart/translate)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@spacechart/translate?style=flat-square)](https://bundlephobia.com/package/@spacechart/translate@latest)
[![npm downloads](https://img.shields.io/npm/dm/@spacechart/translate.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@spacechart/translate)
[![Known Vulnerabilities](https://snyk.io/test/npm/@spacechart/translate/badge.svg)](https://snyk.io/test/npm/@spacechart/translate)

</div>

<br/>

## Table of Contents

- [Browser Support](#browser-support)
- [Installing](#installing)
    - [Package manager](#package-manager)
    - [CDN](#cdn)
- [Create Your first translate project](#create-your-first-translate-project)
    - [Initialize Node.js project](#initialize-nodejs-project)
    - [Install dependencies](#install-dependencies)
    - [Introducing dependencies](#introducing-dependencies)
- [Translate engines](#translate-engines)
    - [Deeplx](#deeplx)
    - [Custom Engine](#custom-engine)
    - [TranslateEngineInstance Class](#translateengineinstance-class)
- [Extention Plugins](#extention-plugins)
    - [Vue Plugin](#vue-plugin)
    - [HTML Plugin](#html-plugin)
- [Future](#future)

## Browser Support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/main/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/main/src/firefox/firefox_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/main/src/safari/safari_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/main/src/opera/opera_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/main/src/edge/edge_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 × |

## Installing

### Package manager

Using npm:

```bash
$ npm install @spacechart/translate
```

Using bower:

```bash
$ bower install @spacechart/translate
```

Using yarn:

```bash
$ yarn add @spacechart/translate
```

Using pnpm:

```bash
$ pnpm add @spacechart/translate
```

### CDN

Using jsDelivr CDN (ES5 UMD browser module):

```html
<script src="https://cdn.jsdelivr.net/npm/@spacechart/translate@1.0.1/dist/translate.min.js"></script>
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/@spacechart/translate@1.0.1/dist/translate.min.js"></script>
```

## Create Your first translate project

### Initialize Node.js project

```shell
node init -y
```

### Install dependencies

```shell
npm install @spacechart/translate
```

### Introducing dependencies

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


## Translate engines

开发者可以通过实现 `ITranslateEngine` 接口创建[自定义翻译引擎](#custom-engine)，也可以使用内置的翻译引擎，比如Deeplx（`DeeplxTranslateEngine`）


### Deeplx

实现类：DeeplxTranslateEngine

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

### Custom Engine

接口类：ITranslateEngine

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

### TranslateEngineInstance Class

除了使用对应的翻译引擎类外，插件还提供了`TranslateEngineInstance`类，它同样继承了`ITranslateEngine`接口，`TranslateEngineInstance` 通过多态的特点，让开发者可以随意的更换引擎，而不用更改已编写的代码（如下）

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

## Extention Plugins

### Vue Plugin

Vue 插件通过`TranslateVuePlugin`类创建使用，支持`v-not-translate`指令排除需要翻译的文本（如下）

#### Options

属性类 `VuePluginDefaultConfigOption`

| 字段| 是否必填 | 类型| 描述|
| ---- | ---- | ---- | ---- |
| `engine` | 是 | `ITranslateEngine` | 翻译引擎 |
| `el`     | 否 | `string`           | 需要翻译的顶级节点|
| `global` | 否 | `boolean`          | 是否全局注入`$t`全局插件变量 ，默认`false` |

#### Methods

| 方法名 | 描述 
| ---- | ---- |
| `install(app: any, options: VuePluginDefaultConfigOption)` | `Vue.directive`注册指令时使用 |
| `create(options: VuePluginDefaultConfigOption) `           | 创建 `VuePlugin` 插件使用     |

#### Example

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

### HTML Plugin

`HTML` 插件通过`TranslateHTMLPlugin`类创建使用，支持`not-translate`属性排除需要翻译的文本（如下）

#### Options

属性类：`HtmlPluginDefaultConfigOption`

| 字段| 是否必填 | 类型| 描述|
| ---- | ---- | ---- | ---- |
| `engine` | 是| `ITranslateEngine` | 翻译引擎|
| `el`     | 否 | `string`           | 需要翻译的顶级节点 |

#### Methods

| 方法名 | 描述 |
| ---- | ---- |
| `create(options: HtmlPluginDefaultConfigOption)` | 创建 `HtmlPlugin` 插件使用 |

#### Example

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

## Future

欢迎有共建想法的小伙伴加入到开源生态中