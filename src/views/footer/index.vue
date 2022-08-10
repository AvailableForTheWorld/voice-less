<template>
  <div class="footer-container">
    <div>
      <el-input
        class="input-container"
        v-model="input"
        placeholder="Please input"
        type="textarea"
        rows="1"
      />
      <el-icon class="recording">
        <img src="../../assets/icons/recording.svg" />
      </el-icon>
      <el-button type="primary" @click="handleInputClick">发送</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue'
const input = ref('')
const emit = defineEmits(['push-message'])

const handleInputClick = () => {
  emit('push-message', {
    content: input.value,
    id: window.context.getRoom().observerId,
    date: new Date().getTime(),
  })
  input.value = ''
}
</script>

<style lang="scss">
.footer-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  div {
    display: flex;
    .recording {
      display: block;
      width: fit-content;
      img {
        width: 32px;
      }
    }
    .input-container {
      display: inline;
    }
  }
}
</style>
