<template>
  <div class="footer-container">
    <div>
      <el-input class="input-container" v-model="input" placeholder="Please input" type="textarea" rows="1" @focus="resizeElInput" @blur="handleInputBlur" ref="textArea"/>
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
import { ElMessage } from 'element-plus'

const input = ref('')
const emit = defineEmits(['push-message','output','toggle-recording-panel'])
const isRecording = ref(false);

const handleInputClick = () => {
  const inputArea = document.querySelector('.input-container')?.children[0];
  inputArea.rows = 1;
  emit('push-message', {
    content: input.value,
    id: window.context.getRoom().observerId,
    date: new Date().getTime(),
    type: 1
  })
  input.value = ''
}

const emitMessage = (data) => {
  const reg = /[.,?。，？]/ 
  if(data.length===1 && reg.test(data) ){
    return;
  }
  emit('push-message', {
    content: data,
    id: window.context.getRoom().observerId,
    date: new Date().getTime(),
    type: 0
  })
}
window.emitMessage = emitMessage;

const handleRecordStart = () => {
  iatrtcrecord.start()
  isRecording.value = true;
  window.context.dispatchMagixEvent('changeRecordingShow',{isRecording:true})
  emit('toggle-recording-panel',true);
  ElMessage({
    message: '正在录音，点击底部红色按钮取消录音',
    type: 'success',
  })
}

const handleRecordEnd = ()=> {
  iatrtcrecord.stop()
  isRecording.value = false;
  emit('toggle-recording-panel',false);
  window.context.dispatchMagixEvent('changeRecordingShow',{isRecording:false})
  ElMessage({
    message: '已结束录音',
  })
}

const handleOutPut = () => {
  emit('output')
}

const resizeElInput = (e) => {
  e.preventDefault();
  e.target.rows = 10;
}

const handleInputBlur = (e) => {
  setTimeout(()=>{
    e.target.rows = 1;
  },100)
}

onMounted(()=>{
   window.context.addMagixEventListener('changeRecordingShow',({payload})=>{
    isRecording.value = payload.isRecording;
    if(isRecording.value){
      emit('toggle-recording-panel',true);
    }
    else {
      emit('toggle-recording-panel',false);
    }
  })
})

</script>

<style lang="scss">
.cursor {
  cursor: pointer;
}
.footer-container {
  /* position: fixed; */
  /* bottom: 0; */
  // TODO: 输入框修正
  width: 100%;
  height: 32px;
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