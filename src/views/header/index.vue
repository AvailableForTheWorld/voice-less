<template>
  <div class="header-container">
     <el-row style="width: 100%">
        <el-col :span="16">
          <!-- search -->
          <MessageSearch :list="list"/>            
        </el-col>
        <el-col :span="8">
          <div class="select-wrapper" v-show="checkboxStore.isCheckboxShow">
            <div class="all-in" >
              <div class="checkbox">
                <input v-model="isAllChecked" type="checkbox" @change="changeAll" class="input-checkbox"/>
              </div>
              <label>全选</label>
            </div>
            <div class="cancel" @click="handelCheckboxCancel">
              <el-button type="danger" link>取消多选</el-button>
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

const {
  list
} = defineProps<{
  list: any[]
}>()
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
    text-align: left;
    margin-left: 20px;
    display: flex;
    align-items: center;
    .checkbox{
      text-align: center;
      .input-checkbox {
        cursor: pointer;
      }
    }
  }
  .cancel {
    cursor: pointer;
    margin-left: 20px;
  }
}

.select-wrapper {
  display: flex;
  align-items: center;
  color: #000;
  font-size: 12px;
  height: 32px;
}
</style>