<template>
  <div class="main-container">
    <div class="user-message" v-for="(item,index) in list" >
      <div class="checkbox-wrapper" v-show="checkboxStore.isCheckboxShow">
        <input type="checkbox" v-model="item.isChecked" @change="handleCheckBox(item,index)"/>
      </div>
      <el-avatar class="user-avatar" :size="50" :style="{backgroundColor:info[item.id]?.color,visibility:judgeAvatarDuplicated(item,index)?'visible':'hidden'}">{{item.id}}</el-avatar>
      <el-popover
        placement="top-start"
        :width="'auto'"
        trigger="hover"
        :hide-after="0"
      >
        <template #reference>
          <el-card @mousemove="handleCardHover(index)" @mouseout="handleCardMouseLeave()" class="user-content" shadow="hover"> <div class="text-content" v-html="item.content"></div> </el-card>
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
      
      <div v-if="isCardHover===index" class="show-time">{{getDate(item.date)}}</div>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { defineProps,watch,toRefs,ref, watchEffect, onMounted, computed, defineEmits } from 'vue'
import bus from '../../utils/bus'
import { useCheckBox } from '../../stores/index';

const checkboxStore = useCheckBox();


const props = defineProps(['list','info'])

const emit = defineEmits(['del-message','check-message'])

const buttons = [
  { type: 'danger', text: '删除' },
  { type: 'success', text: '多选' },
  { type: 'primary', text: '复制'},
] as const

const isChecked = ref(false)
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

onMounted(()=>{
  const list = props.list
  let cnt = 0,sum=0;
  for(let item in list){
    ++sum;
    if(list[item].isChecked){
      ++cnt;
    }
  }
  checkboxStore.setSum(sum);
  checkboxStore.setCheckedCnt(cnt);
  window.context.addMagixEventListener('changeCheckboxShow',({payload})=>{
    checkboxStore.isCheckboxShow = payload.isCheckboxShow;
  })
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
    return `${month}月 ${day}日 ${hour}:${minute}:${second}`
  }
  else {
    return `${hour}:${minute}:${second}`
  }
}


</script>

<style lang="scss">
.main-container {
  padding: 50px 20px 30px;
  .user-message{
    position: relative;
    display: flex;
    align-items: center;
    margin: 20px 0;
    .checkbox-wrapper{
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
    .user-avatar {
      margin: 10px 20px 10px 0;
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
      margin-left: 15px;
      color: rgba(#000000,0.3);
    }
  }
  
}
</style>
