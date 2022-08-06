<template>
  <div class="main-container">
    <div class="user-message" v-for="item in list" >
      <el-avatar class="user-avatar" :size="50"></el-avatar>
      <el-card class="user-content" shadow="hover"> <div class="text-content" v-html="item.content"></div> </el-card>
      <div class="user-name">{{item.id}}</div>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { defineProps,watch,toRefs,ref, watchEffect } from 'vue'
const props = defineProps(['list'])

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
    }
    .user-content {
      
      .text-content{
        white-space: pre-line;
      }
    }
    .user-name {
      position: absolute;
      top: 50%;
      margin-left: 5px;
      transform: translateY(-50%);
    }
  }
  
}
</style>
