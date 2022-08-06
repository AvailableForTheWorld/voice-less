<template>
  <div class="main-container">
    <div class="user-message" v-for="(item,index) in list" >
      <el-avatar class="user-avatar" :size="50" :style="{backgroundColor:info[item.id].color,visibility:judgeAvatarDuplicated(item,index)?'visible':'hidden'}">{{item.id}}</el-avatar>
      <el-card class="user-content" shadow="hover"> <div class="text-content" v-html="item.content"></div> </el-card>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { defineProps,watch,toRefs,ref, watchEffect, onUpdated } from 'vue'
const props = defineProps(['list','info'])

const judgeAvatarDuplicated = (item,index)=>{
  if(index && props.list[index-1].id == item.id){
    return false;
  }
  return true;
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
      }
    }
  }
  
}
</style>
