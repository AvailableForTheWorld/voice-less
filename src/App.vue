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
import { computed, inject, onMounted, onUpdated, reactive, ref, watchEffect,getCurrentInstance } from "vue";
import MainContainer from '@/views/main/index.vue'
import FooterContainer from '@/views/footer/index.vue'
import HeaderContainer from '@/views/header/index.vue'


const vm = getCurrentInstance();
window.vm = vm;
const context = window.context;
if (!context) throw new Error("must call provide('context') before mount App");


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
  const storeArr = {...storage.state.arr};
  storage.setState({arr:storeArr})
}

const handleChangeAllChecked = (val) => {
  const storeArr = {...storage.state.arr};
  Object.keys(storeArr).forEach((key)=>{
    storeArr[key].isChecked = val;
  })
  storage.setState({arr:storeArr});
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



</script>
<style lang="scss">
</style>