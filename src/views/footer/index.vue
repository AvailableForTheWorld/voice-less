<template>
  <div class="footer-container">
    <div>
      <el-input class="input-container" v-model="input" placeholder="Please input" type="textarea" rows="1" @focus="resizeElInput" @blur="restoreElInput"/>
      <div v-if="!isRecording" class="cursor"  @click="handleRecordStart">
        <el-icon class="recording">
          <img src="../../assets/icons/recording.svg" />
        </el-icon>
      </div>
      <div v-else class="cursor" @click="handleRecordEnd">
        <el-icon class="recording">
          <img src="../../assets/icons/cancel-recording.svg" />
        </el-icon>
      </div>
      <el-button type="primary" @click="handleInputClick">发送</el-button>
      <el-button type="warning" @click="handleOutPut">导出</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits,getCurrentInstance, onMounted } from 'vue'
import { iatrtcrecord } from '@/utils/index.js'

const input = ref('')
const emit = defineEmits(['push-message','output'])
const isRecording = ref(false);

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
  isRecording.value = true;
  window.context.dispatchMagixEvent('changeRecordingShow',{isRecording:true})
}

const handleRecordEnd = ()=> {
  iatrtcrecord.stop()
  isRecording.value = false;
  window.context.dispatchMagixEvent('changeRecordingShow',{isRecording:false})
}

const handleOutPut = () => {
  emit('output')
}

const resizeElInput = (e) => {
  e.preventDefault();
  e.target.rows = 10;
}
const restoreElInput = (e) => {
  e.preventDefault();
  e.target.rows = 1;
}

onMounted(()=>{
   window.context.addMagixEventListener('changeRecordingShow',({payload})=>{
    isRecording.value = payload.isRecording;
  })
})

</script>

<style lang="scss">
.cursor {
  cursor: pointer;
}
.footer-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  .input-container {
    .el-textarea__inner {
      resize: none;
    }
  }
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