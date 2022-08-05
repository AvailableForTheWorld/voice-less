<template>
  <div class="main-container">
    <div class="user-message" v-for="item in props.list">
      <el-avatar class="user-avatar" :size="50"></el-avatar>
      <el-card class="user-content" shadow="hover"> {{item.content}} </el-card>
      <div class="user-name">{{item.id}}</div>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps({
  list:Object
})
</script>

<style lang="scss">
.main-container {
  padding: 20px;
  .user-message{
    position: relative;
    display: flex;
    .user-avatar {
      margin: 10px 20px 10px 0;
    }
    .user-content {
      flex: 1;
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
