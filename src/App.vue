<template>
  <div>
    <header-container @changeAllChecked="handleChangeAllChecked"></header-container>
    <main-container :list="messList" :info="infoList" @delMessage="delMessage" @checkMessage="checkMessage"></main-container>
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

// 头像颜色选择
const color = ['#a8d8ea','#aa96da','#fcbad3','#ffffd2','#ffc7c7','#ffe2e2','#f6f6f6','#8785a2']
const storage = context.createStorage("mess-list", { arr: [],info:{} });

const pushMessage = (item) => {
  const arr1 = storage.state.arr;
  const info = storage.state.info;
  let cnt = storage.state.info.cnt;
  if(!cnt){
    cnt = 0;
  }
  if(!info[item.id]){
    storage.setState({info:{...info,[item.id]:{color:color[cnt]},cnt:(cnt+1)%(color.length),}})
  }
  const item1 = { ...item, isChecked:false }
  storage.setState({arr:[...arr1,item1]})
  scrollToEnd();
}

const delMessage = (pos) => {
  const arr = storage.state.arr.filter((item,index)=> {
    return pos !== index;
  })
  storage.setState({arr})
}

const checkMessage = (val) => {
  debugger;
  const arr = storage.state.arr.map((item,index)=>{
    if(index===val.index){
      const changeItem = val;
      changeItem.isChecked = !changeItem.isChecked;
      return changeItem;
    }
    return item;
  })
  storage.setState({arr})
}

const handleChangeAllChecked = (val) => {
  const arr = storage.state.arr.map((item)=>{
    const changeItem = item;
    changeItem.isChecked = val;
    return changeItem;
  })
  storage.setState({arr});
}

const messList = ref(storage.state.arr);
const infoList = ref(storage.state.info);

const container = ref(null);
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
      infoList.value = storage.state.info;
    })
    scrollToEnd();
  }
);


watchEffect(() => {
  if(messList.value){
    console.log('messlist',messList.value)
  }
});
</script>
<style lang="scss">
</style>