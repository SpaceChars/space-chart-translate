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

        <div v-translate="{ global: true,src:'EN',target:'ZH'}">
            11
            <HelloWorld msg="Welcome to Your Vue.js App" />
            <div v-translate>{{ total }}</div>
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
        value() {
            // document.querySelector('.hello').innerText='22222'
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
        // setInterval(() => {
        //     this.total += 1;
        // }, 2000);
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
