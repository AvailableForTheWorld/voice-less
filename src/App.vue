<template>
  <div>
    <header-container @changeAllChecked="handleChangeAllChecked"></header-container>
    <main-container :list="messList" :info="infoList" :isRecordingPanelShow="isRecordingPanelShow" @delMessage="delMessage" @checkMessage="checkMessage"></main-container>
    <footer-container @pushMessage="pushMessage" @output="handleOutput" @toggleRecordingPanel="handleRecordingPanel"></footer-container>
  </div>
</template>

<script lang="ts" setup>
import type { AppContext } from "@netless/window-manager";
import type { FastboardApp } from "@netless/fastboard-core";
import { computed, inject, onMounted, onUpdated, reactive, ref, watchEffect,getCurrentInstance } from "vue";
import MainContainer from '@/views/main/index.vue'
import FooterContainer from '@/views/footer/index.vue'
import HeaderContainer from '@/views/header/index.vue'
import { useCheckBox } from './stores/index';
const checkboxStore = useCheckBox();

const vm = getCurrentInstance();
window.vm = vm;
const context = window.context;
if (!context) throw new Error("must call provide('context') before mount App");


// 头像颜色选择
const color = ['#a8d8ea','#aa96da','#fcbad3','#ffffd2','#ffc7c7','#ffe2e2','#f6f6f6','#8785a2']
const storage = context.createStorage("mess-list", { arr: [],info:{} });
const pushMessage = (item) => {
  checkboxStore.setSum(checkboxStore.Sum + 1)
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
  const arr = arr1.length?[...arr1,item1]:[item1];
  storage.setState({arr})
  scrollToEnd();
}

const delMessage = (pos) => {
  let arr ;
  if(checkboxStore.isCheckboxShow){
    let cnt = 0;
    arr = storage.state.arr.filter((item)=>{
      if(!item.isChecked){
        ++cnt;
        return true;
      }
      return false;
    })
    checkboxStore.setFullChecked(false);
    checkboxStore.setSum(cnt);
    checkboxStore.setCheckedCnt(0);
    if(cnt===0){
      checkboxStore.setCheckboxShow(false)
      window.context.dispatchMagixEvent('changeCheckboxShow',{isCheckboxShow:false})
    }
  }
  else {
    arr = storage.state.arr.filter((item,index)=>{
      return index !== pos
    });
  }
  storage.setState({arr})
}

const checkMessage = (val) => {
  const storeArr = [...storage.state.arr];
  storage.setState({arr:storeArr})
}

const handleChangeAllChecked = (val) => {
  const storeArr = [...storage.state.arr];
  storeArr.forEach((item)=>{
    item.isChecked = val;
  })
  storage.setState({arr:storeArr});
}

const messList = ref(storage.state.arr);
const infoList = ref(storage.state.info);

const container = ref(null);

const scrollToEnd = ()=>{
  const dom = document.querySelector('.telebox-content')
  setTimeout(()=>{
    dom?.scrollTo(0,dom.scrollHeight);
  },200)
  
}

const handleOutput = () => {
  const target = storage.state.arr.map((item)=>{
    return 'id '+ item.id + ' : ' + item.content;
  }).join('\n');
  let filename="聊天内容";
  //文件内容
  let text=target;
  let pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);
  if (document.createEvent) {
      let event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
  } else {
      pom.click();
  }
}

const isRecordingPanelShow = ref(false)
const handleRecordingPanel = (val) => {
  isRecordingPanelShow.value = val;
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