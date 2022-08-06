<template>
  <div class="footer-container">
    <div>
        <el-input class="input-container" v-model="input" placeholder="Please input" type="textarea" rows="1" />
        <el-button type="primary" >录音</el-button>
        <el-button type="primary" @click="handleInputClick">发送</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref,defineEmits } from 'vue'
const input = ref('')
const emit = defineEmits(['push-message'])

const handleInputClick = () => {
  emit('push-message',{
    content: input.value,
    id: window.context.getRoom().observerId,
  })
  input.value = ''
}


</script>

<style lang="scss">
.footer-container{
  position: fixed;
  bottom: 0;
  width: 100%;
  div{
    display: flex;

    .input-container{
      display: inline;

    }
  }
}
</style>