<template>
  <div>
    <header-container></header-container>
    <main-container :list="list"></main-container>
    <footer-container @pushMessage="pushMessage"></footer-container>
  </div>
</template>

<script lang="ts" setup>
import type { AppContext } from "@netless/window-manager";
import type { FastboardApp } from "@netless/fastboard-core";
import { computed, inject, onMounted, reactive, ref, watchEffect } from "vue";
import MainContainer from './views/main/index.vue'
import FooterContainer from './views/footer/index.vue'
import HeaderContainer from './views/header/index.vue'

// console.log("fasterboard",window.fastboard);

const context = window.context;
if (!context) throw new Error("must call provide('context') before mount App");

// const insertMedia : () => void = async () => {
//   const fastborad:FastboardApp = window.fastboard;
//   const mid = await fastboard.insertMedia('测试','https://lanhu-cdn.oss-cn-shenzhen.aliyuncs.com/video/ts.mp4');
//   console.log("mid: ",mid)
// }

const list = reactive([])

const pushMessage = (item) => {
  list.push(item)
  
}

const storage = context.createStorage("Group", { arr: [] });
const mess_list = ref(storage.state.arr);


const list1 = computed<string>({
  get: () => mess_list.value,
  set: (arr) => storage.setState({ arr }),
});

// onMounted(() =>
//   storage.addStateChangedListener(() => {
//     mess_list.value = storage.state.groupName;
//   })
// );

watchEffect(() => {
  
});
</script>
<style lang="scss">
</style>