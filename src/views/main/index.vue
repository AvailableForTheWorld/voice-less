<template>
  <div class="main-container">
    <div class="user-message" v-for="(item,index) in list" >
      <el-avatar class="user-avatar" :size="50" :style="{backgroundColor:info[item.id].color,visibility:judgeAvatarDuplicated(item,index)?'visible':'hidden'}">{{item.id}}</el-avatar>
      <el-card @mousemove="handleCardHover(index)" @mouseout="handleCardMouseLeave()" class="user-content" shadow="hover"> <div class="text-content" v-html="item.content"></div> </el-card>
      <div v-if="isCardHover===index" class="show-time">{{getDate(item.date)}}</div>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { defineProps,watch,toRefs,ref, watchEffect, onUpdated, computed } from 'vue'
const props = defineProps(['list','info'])

const judgeAvatarDuplicated = (item,index) => {
  if(index && props.list[index-1].id == item.id){
    return false;
  }
  return true;
}

const isCardHover = ref(-1)

const handleCardHover = (index)=> {
  isCardHover.value = index
}

const handleCardMouseLeave = () => {
  isCardHover.value = -1
}

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
  padding: 40px 20px;
  .user-message{
    position: relative;
    display: flex;
    align-items: center;
    margin: 20px 0;
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
