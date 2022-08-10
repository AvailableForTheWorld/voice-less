<template>
  <div class="header-container">
    <div class="all-in">
      <div class="checkbox">
        <input type="checkbox" @change="changeAll" />
      </div>
      <label>全选</label>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref, defineEmits } from 'vue'
const isAllChecked = ref(false)

const emit = defineEmits(['changeAllChecked'])

const changeAll = () => {
  isAllChecked.value = ! isAllChecked.value;
  emit('changeAllChecked',isAllChecked);
}

</script>

<style lang="scss">
.header-container{
  width: 100%;
  position: fixed;
  top: 20px;
  z-index: 10;
  background-color: white;
  .all-in{
    height: 50px;
    text-align: left;
    line-height: 50px;
    margin-left: 20px;
    display: flex;
    .checkbox{
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
  }
}
</style>