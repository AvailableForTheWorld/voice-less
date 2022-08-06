<template>
  <div class="main-container">
    <div class="user-message" v-for="item in list">
      <el-avatar class="user-avatar" :size="50"></el-avatar>
      <el-card class="user-content" shadow="hover"> {{item.content}} </el-card>
      <div class="user-name">{{item.id}}</div>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import { defineProps,watch,toRefs,ref, watchEffect } from 'vue'
const props = defineProps(['list'])
// const {list}= toRefs(props)


// watch(
//   storage,
//   (new,old) => {
//     console.log("storage in main",new,old)
//   },
//   { deep: true }
// )


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
