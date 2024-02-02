<template>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
</template>

<script setup>
import { onMounted, getCurrentInstance } from "vue";
import HelloWorld from "./components/HelloWorld.vue";

onMounted(() => {
      getCurrentInstance().proxy.$t.translate({
        src: "EN",
        target: "ZH"
    });
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
