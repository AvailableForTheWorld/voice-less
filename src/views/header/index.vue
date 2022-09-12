<template>
  <div class="header-container">
     <el-row style="width: 100%">
        <el-col :span="12">
          <!-- search -->
          <MessageSearch />            
        </el-col>
        <el-col :span="12">
          <div class="select-wrapper" v-show="checkboxStore.isCheckboxShow">
            <div class="all-in" >
              <div class="checkbox">
                <input v-model="isAllChecked" type="checkbox" @change="changeAll" class="input-checkbox"/>
              </div>
              <label>全选</label>
            </div>
            <div class="cancel" @click="handelCheckboxCancel">
              <span>取消多选</span>
            </div>
          </div>
        </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>

import { ref, defineEmits, onMounted } from 'vue'
import { useCheckBox } from '../../stores/index';
import MessageSearch from '../../component/MessageSearch.vue';
const checkboxStore = useCheckBox();
const isAllChecked = ref(false)

// 这里监听pinia中的选中框的状态变化来使除了本人以外的其他人能看到修改状态
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

// 全选所有文本信息
const changeAll = () => {
  emit('changeAllChecked',isAllChecked.value);
  checkboxStore.setFullChecked(isAllChecked.value)
  
}

// 取消选择所有文本信息
const handelCheckboxCancel = ()=>{
  checkboxStore.setCheckboxShow(false)
  window.context.dispatchMagixEvent('changeCheckboxShow',{isCheckboxShow:false})
}

onMounted(()=>{
    // 每次加载页面时监听是否有全部选择状态
    window.context.addMagixEventListener('changeSumChecked',({payload})=>{
    isAllChecked.value = payload.checked;
  })
})

</script>

<style lang="scss">
.header-container{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  background-color: white;
  height: 32px;
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
      .input-checkbox {
        cursor: pointer;
      }
    }
  }
  .cancel {
    cursor: pointer;
    margin-right: 20px;
  }
}
</style>