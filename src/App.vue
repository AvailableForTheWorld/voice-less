<template>
  <div>
    <header-container></header-container>
    <main-container :list="messList"></main-container>
    <footer-container @pushMessage="pushMessage"></footer-container>
  </div>
</template>

<script lang="ts" setup>
import type { AppContext } from "@netless/window-manager";
import type { FastboardApp } from "@netless/fastboard-core";
import { computed, inject, onMounted, onUpdated, reactive, ref, watchEffect } from "vue";
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


const storage = context.createStorage("mess-list", { arr: [] });

const pushMessage = (item) => {
  const arr1 = storage.state.arr;
  storage.setState({arr:[...arr1,item]})
  console.log("storage.state.arr",storage.state.arr)
}

const messList = ref(storage.state.arr);

const container = ref(null)
// const list1 = computed<string>({
//   get: () => mess_list.value,
//   set: (arr) => storage.setState({ arr }),
// });

const scrollToEnd = ()=>{
  const dom = document.querySelector('.telebox-content')
  dom?.scrollTo(0,dom.scrollHeight);
}

onMounted(() =>{
    storage.addStateChangedListener(() => {
      messList.value = storage.state.arr;
    })
    scrollToEnd();
  }
);

onUpdated(()=>{
  scrollToEnd();
})

watchEffect(() => {
  if(messList.value){
    console.log('messlist',messList.value)
  }
});
</script>
<style lang="scss">
</style>