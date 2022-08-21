<template>
  <div class="header-container" v-show="checkboxStore.isCheckboxShow">
    <div class="all-in" >
      <div class="checkbox">
        <input v-model="isAllChecked" type="checkbox" @change="changeAll" />
      </div>
      <label>全选</label>
    </div>
    <div class="cancel" @click="handelCheckboxCancel">
      <span>取消多选</span>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { ref, defineEmits, onMounted } from 'vue'
import { useCheckBox } from '../../stores/index';
const checkboxStore = useCheckBox();
const isAllChecked = ref(false)

checkboxStore.$subscribe((mutation,state)=>{
  if(state.sum === state.checkedCnt && state.sum !== 0){
    isAllChecked.value = true;
  }
  else {
    isAllChecked.value = false;
  }
  window.context.dispatchMagixEvent('changeSumChecked',{checked: isAllChecked.value})
})

const emit = defineEmits(['changeAllChecked'])

const changeAll = () => {
  emit('changeAllChecked',isAllChecked.value);
  checkboxStore.setFullChecked(isAllChecked.value)
  
}
const handelCheckboxCancel = ()=>{
  checkboxStore.setCheckboxShow(false)
  window.context.dispatchMagixEvent('changeCheckboxShow',{isCheckboxShow:false})
}

onMounted(()=>{
    window.context.addMagixEventListener('changeSumChecked',({payload})=>{
    isAllChecked.value = payload.checked;
  })
})

</script>

<style lang="scss">
.header-container{
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  .cancel {
    margin-right: 20px;
  }
}
</style>