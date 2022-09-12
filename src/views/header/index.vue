<template>
  <div class="header-container" v-show="checkboxStore.isCheckboxShow">
    <div class="all-in">
      <div class="checkbox">
        <input v-model="isAllChecked" type="checkbox" @change="SwitchCheckStatus" class="input-checkbox" />
      </div>
      <div>
        <button class="checkall" @click="SwitchCheckStatus"><span v-show={isShowSwitchOff}>{{CheckSwitchOff}}</span>全选</button>
      </div>
      <div @click="handelCheckboxCopy">
        <button class="copy">复制</button>
      </div>

      <div @click="handelCheckboxdelete">
        <button class="delete">删除</button>
      </div>
      <!-- <div @click="handelCheckboxCancel">
        <button class="cancel">取消多选</button>
      </div> -->
    </div>
  </div>  
</template>

<script lang="ts" setup>

import { ref, defineEmits, onMounted } from 'vue'
import { useCheckBox } from '../../stores/index';
const checkboxStore = useCheckBox();
const isAllChecked = ref(false);


let CheckSwitchOff = ref<string>('取消');
let isShowSwitchOff = ref(false);

checkboxStore.$subscribe((mutation, state) => {
  if (state.sum === state.checkedCnt && state.sum !== 0) {
    isAllChecked.value = true;
  }
  else {
    isAllChecked.value = false;
  }
  window.context.dispatchMagixEvent('changeSumChecked', { checked: isAllChecked.value })
})

const emit = defineEmits(['changeAllChecked', 'copyAllChecked', 'checkAllChecked', 'deleteAllChecked'])

const SwitchCheckStatus = () => {
  isShowSwitchOff.value = isAllChecked.value;

  console.log(isShowSwitchOff);
  
  emit('changeAllChecked', isAllChecked.value);
  checkboxStore.setFullChecked(isAllChecked.value)
}

const handelCheckboxAll = () => {
  isShowSwitchOff.value = isAllChecked.value;
  console.log('---1');

  console.log(isShowSwitchOff);

  emit('checkAllChecked', isAllChecked.value);
  checkboxStore.setFullChecked(isAllChecked.value)
}

const handelCheckboxCancel = () => {
  checkboxStore.setCheckboxShow(false)
  window.context.dispatchMagixEvent('changeCheckboxShow', { isCheckboxShow: false })
}

const handelCheckboxCopy = () => {
  emit('copyAllChecked', isAllChecked.value);
}

const handelCheckboxdelete = () => {
  emit('deleteAllChecked', isAllChecked.value);
}

onMounted(() => {
  window.context.addMagixEventListener('changeSumChecked', ({ payload }) => {
    isAllChecked.value = payload.checked;
  })
})

</script>

<style lang="scss">
.header-container {
  // width: 100%;
  position: fixed;
  display: flex;
  padding: 0px 15px;
  justify-content: space-between;
  align-items: center;
  top: 20px;
  z-index: 10;
  background-color: white;
  border-radius: 0px 0px 10px 0px;
  box-shadow: rgb(0 0 0 / 25%) 0px 1px 1px, rgb(0 0 0 / 12%) 0px 0px 3000px, rgb(0 0 0 / 12%) 0px 0px 0px, rgb(0 0 0 / 17%) 0px 12px 13px, rgb(0 0 0 / 9%) 0px -0px 0px;

  .all-in {
    // display: flexbox;

    button {
      width: 100%;
      appearance: none;
      background-color: #2ea44f;
      border: 1px solid rgba(27, 31, 35, .15);
      border-radius: 6px;
      box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
      box-sizing: border-box;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      // padding: 6px 10px;
      position: relative;
      text-align: center;
      text-decoration: none;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      vertical-align: middle;
      white-space: nowrap;
    }

    button.copy {
      background-color: #FFF;
      color: #2ea44f;
    }

    button.copy:focus:not(:focus-visible):not(.focus-visible) {
      box-shadow: none;
      outline: none;
    }

    button.copy:hover {
      color: #FFF;
      background-color: #2ea44f;
    }

    button.copy:focus {
      box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
      outline: none;
    }

    button.copy:disabled {
      background-color: #94d3a2;
      border-color: rgba(27, 31, 35, .1);
      color: rgba(255, 255, 255, .8);
      cursor: default;
    }

    button.copy:active {
      background-color: #298e46;
      box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
    }

    button.delete {
      background-color: #FFF;
      color: #d32d0f;
    }

    button.delete:focus:not(:focus-visible):not(.focus-visible) {
      box-shadow: none;
      outline: none;
    }

    button.delete:hover {
      color: #FFF;
      background-color: #d32d0f;
    }

    button.delete:focus {
      box-shadow: #d32c0f4a 0 0 0 3px;
      outline: none;
    }
    
    button.delete:disabled {
      background-color: #94d3a2;
      border-color: rgba(27, 31, 35, .1);
      color: rgba(255, 255, 255, .8);
      cursor: default;
    }

    button.delete:active {
      background-color: #d32d0f;
      box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
    }

    .checkall:focus:not(:focus-visible):not(.focus-visible) {
      box-shadow: none;
      outline: none;
    }

    .checkall:hover {
      background-color: #2bb652;
    }

    .checkall:focus {
      box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
      outline: none;
    }

    .checkall:disabled {
      background-color: #94d3a2;
      border-color: rgba(27, 31, 35, .1);
      color: rgba(255, 255, 255, .8);
      cursor: default;
    }

    height: 50px;
    text-align: left;
    line-height: 50px;
    margin-left: 20px;
    display: flex;

  }

  .cancel {
    cursor: pointer;
    margin-right: 20px;
  }
}
</style>