<template>
  <div class="footer-container">
    <div>
      <el-input class="input-container" v-model="input" placeholder="Please input" type="textarea" rows="1" />
      <div class=""  @click="handleRecordStart">
        <el-icon class="recording">
          <img src="../../assets/icons/recording.svg" />
        </el-icon>
      </div>
      <div  @click="handleRecordEnd">
        222
      </div>
      <el-button type="primary" @click="handleInputClick">发送</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits,getCurrentInstance } from 'vue'
import { iatrtcrecord } from '@/utils/index.js'

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

const emitMessage = (data) => {
  emit('push-message', {
    content: data,
    id: window.context.getRoom().observerId,
    date: new Date().getTime(),
  })
}
window.emitMessage = emitMessage;

const handleRecordStart = () => {
  iatrtcrecord.start()
}

const handleRecordEnd = ()=> {
  iatrtcrecord.stop()
}

</script>

<style lang="scss">
.footer-container {
  position: fixed;
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