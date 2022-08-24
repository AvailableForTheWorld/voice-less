<template>
  <div class="main-container">
    <div class="user-message" v-for="(item,index) in typeList" :key="item.date">
      <div class="checkbox-wrapper" v-show="checkboxStore.isCheckboxShow">
        <input type="checkbox" v-model="item.isChecked" @change="handleCheckBox(item,index)"/>
      </div>
      <el-avatar class="user-avatar" :size="40" :style="{backgroundColor:info[item.id]?.color,visibility:judgeAvatarDuplicated(item,index)?'visible':'hidden'}">{{item.id}}</el-avatar>
      <el-popover
        placement="top-start"
        :width="'auto'"
        trigger="hover"
        :hide-after="0"
      >
        <template #reference>
          <el-card class="user-content" shadow="hover"> <div class="text-content" v-html="item.content"></div> </el-card>
        </template>
        <div class="flex justify-space-between mb-0 flex-wrap gap-2">
        <el-button
          v-for="button in buttons"
          :key="button.text"
          :type="button.type"
          text
          @click="handleCardOptionsClick(button.text,index)"
        >{{ button.text }}
        </el-button>
      </div>
      </el-popover>
      
      <div class="show-time">{{getDate(item.date)}}</div>
    </div>

    <div class="caption-container">
      <div class="caption-header">
        <el-button text class="caption-btn" :disabled="!judgeRecordingPanelShow" @click="isHandleRecordingShow = false">隐藏</el-button>
        <div>字幕显示</div>
        <el-button text class="caption-btn" :disabled="judgeRecordingPanelShow" @click="isHandleRecordingShow = true">显示</el-button>
      </div>
      <ul  class="caption-content" v-if="judgeRecordingPanelShow">
        <li v-for="(item,index) in captionList">
          <div class="caption-date">{{getDate(item.date)}}</div>
          <div class="caption-words">
            {{item.content}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps,watch,toRefs,ref, watchEffect, onMounted, computed, defineEmits, onUpdated } from 'vue'
import bus from '../../utils/bus'
import { useCheckBox } from '../../stores/index';

const checkboxStore = useCheckBox();


const props = defineProps(['list','info','isRecordingPanelShow'])

const emit = defineEmits(['del-message','check-message'])

const buttons = [
  { type: 'danger', text: '删除' },
  { type: 'success', text: '多选' },
  { type: 'primary', text: '复制'},
] as const

const isChecked = ref(false)
const typeList = ref([])
const captionList = ref([])
const judgeAvatarDuplicated = (item,index) => {
  if(index && props.list[index-1]?.id == item.id){
    return false;
  }
  return true;
}

const isCardHover = ref(-1)

const handleCheckBox = (item,index) => {
  if(item.isChecked){
    checkboxStore.cntPlus();
  }else{
    checkboxStore.cntMinus();
  }
  emit('check-message',index)
}

const handleCardHover = (index)=> {
  isCardHover.value = index
}

const handleCardMouseLeave = () => {
  isCardHover.value = -1
}

const handleCardOptionsClick = (text,index) => {
  if(text === '删除'){
    emit('del-message',index);
  }
  else if(text === '多选'){
    checkboxStore.setCheckboxShow(true);
    window.context.dispatchMagixEvent('changeCheckboxShow',{isCheckboxShow:true})
  }
  else if(text === '复制'){
    let str = ''
    if(checkboxStore.isCheckboxShow){
      let arr = props.list.map((item)=>{
        if(item.isChecked){
          return item.content;
        }
        return null
      }).filter( item => item )
      str = arr.join('\n');
    }
    else {
      str += props.list[index].content;
    }
    navigator.clipboard.writeText(str)
  }
}

const scrollToEnd = ()=>{
  const dom = document.querySelector('.caption-content')
  setTimeout(()=>{
    dom?.scrollTo(0,dom.scrollHeight);
  },200)
  
}

const isHandleRecordingShow = ref(false);

const judgeRecordingPanelShow = computed(()=>{
  if(isHandleRecordingShow.value){
    return true;
  }
  else if(props.isRecordingPanelShow){
    return true;
  }
  return false;
})

onUpdated(()=>{
  typeList.value = props.list.filter((item)=>{
    return item.type == 1;
  })
  captionList.value = props.list.filter((item)=>{
    return item.type == 0;
  })
  scrollToEnd();
})

onMounted(()=>{
  typeList.value = props.list.filter((item)=>{
    return item.type == 1;
  })
  
  captionList.value = props.list.filter((item)=>{
    return item.type == 0;
  })
  let cnt = 0,sum=0;
  for(let item in typeList.value){
    ++sum;
    if(typeList.value[item].isChecked){
      ++cnt;
    }
  }
  checkboxStore.setSum(sum);
  checkboxStore.setCheckedCnt(cnt);
  window.context.addMagixEventListener('changeCheckboxShow',({payload})=>{
    checkboxStore.isCheckboxShow = payload.isCheckboxShow;
  })
  scrollToEnd();
})


const getDate = (date)=>{
  const oldVal = new Date(date), newVal = new Date();
  const year = oldVal.getFullYear().toString().padStart(4, "0");
  const month = (oldVal.getMonth() + 1).toString().padStart(2, "0");
  const day = oldVal.getDate().toString().padStart(2, "0");

  const hour = oldVal.getHours().toString().padStart(2, "0");
  const minute = oldVal.getMinutes().toString().padStart(2, "0");
  const second = oldVal.getSeconds().toString().padStart(2, "0");
  if((newVal-oldVal)/(1000*3600*24*365)>1){
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  else if((newVal-oldVal)/(1000*3600*24)>1){
    return `${month} 月 ${day} 日 ${hour}:${minute}:${second}`
  }
  else {
    return `${hour}:${minute}:${second}`
  }
}


</script>

<style lang="scss">
.main-container {
  position: relative;
  padding: 50px 20px 30px;
  .user-message{
    position: relative;
    display: flex;
    align-items: center;
    margin: 0;
    .checkbox-wrapper{
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
    .user-avatar {
      margin: 4px 20px 4px 0;
      flex-shrink: 0;
      background-color: skyblue;
    }
    .user-content {
      .text-content{
        white-space: pre-line;
        flex-wrap: wrap;
      }
    }
    .show-time {
      display: none;
      margin-left: 15px;
      color: rgba(#000000,0.3);
    }
    &:hover {
      .show-time {
        display: block;
      }
    }
  }
  
  .fold {
    height: 10px;
    background-color: #aaaaaa;
  }
  .caption-container {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    width: 200px;
    height: 300px;
    
    color: #fff;
    border-radius: 4px;
    overflow: hidden;
    .caption-header {
      display: flex;
      font-size: 14px;
      height: 32px;
      border-radius: 4px;
      justify-content: space-between;
      align-items: center;
      background-color: #121217;
      padding: 0 10px;
      .caption-btn {
        height: 20px;
        font-size: 12px;
        padding: 0 4px;
      }
    }
    .caption-content {
      font-size: 12px;
      overflow-y: scroll;
      height: calc(100% - 32px);
      margin: 0;
      background-color: rgba($color: #000000, $alpha: 0.8);
      padding: 0 ;
      li {
        list-style: none;
      }
      .caption-date {
        text-align: left;
        margin-left: -12px;
        transform: scale(0.8);
      }
      .caption-words {
        margin-left: 20px;
      }
      &::-webkit-scrollbar {
        display: block;
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #888888;
        border-radius: 4px;
      }
      &::-webkit-scrollbar-track-piece {
        background-color: transparent;
      }
    }
  }
}
</style>
<style lang="scss">
.user-content {
  .el-card__body {
    padding: 6px 10px;
    font-size: 14px;
  }
}
</style>