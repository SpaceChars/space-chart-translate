<template>
    <div id="app">
        <el-select v-model="value">
            <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item, index) in language"
                :key="index"
            />
        </el-select>
        <img alt="Vue logo" src="./assets/logo.png" />

        <div class="div">
            你好yes
            <div class="div">2222</div>
        </div>

        <div>
            11
            <HelloWorld msg="Welcome to Your Vue.js App" />
            <div>{{ total }}</div>
            11
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
    watch: {
        value(target, src) {
            this.$t.translate({
                src: src || "EN",
                target,
                languageMap: [
                    {
                        src: "EN",
                        target: "ZH",
                        srcText: "你好",
                        targetText: "Hello"
                    }
                ]
            });
        }
    },
    data() {
        return {
            value: "EN",
            language: [
                {
                    label: "中文",
                    value: "ZH"
                },
                {
                    label: "英文",
                    value: "EN"
                }
            ],
            total: 0
        };
    },
    mounted() {
        setInterval(() => {
            this.total += 1;
        }, 1000);
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;

    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
