<template>
  <div class="footer-container">
    <div>
      <el-input class="input-container" v-model="input" placeholder="请输入" type="textarea" rows="1" @focus="resizeElInput" @blur="handleInputBlur" ref="textArea" />
      <div v-if="!isRecording" class="cursor"  @click="handleRecordStart">
        <el-icon class="recording">
          <img src="../../assets/icons/recording.svg" alt="" />
        </el-icon>
      </div>
      <div v-else class="cursor" @click="handleRecordEnd">
        <el-icon class="recording">
          <img src="../../assets/icons/cancel-recording.svg" alt="" />
        </el-icon>
      </div>
      <el-button type="primary" @click="handleInputClick">发送</el-button>
      <el-button type="warning" @click="handlePreview">预览</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits,getCurrentInstance, onMounted } from 'vue'
import { iatrtcrecord } from '@/utils/index.js'
import { ElMessage } from 'element-plus'

const input = ref('')
const emit = defineEmits(['push-message','preview','toggle-recording-panel'])
const isRecording = ref(false);

// 处理发送消息方法
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

// 从讯飞接口获取数据后触发更新字幕看板
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

// 全局挂载的一个方法，用在讯飞的调用脚本中使用
window.emitMessage = emitMessage;

// 点击开始录音按钮
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

// 点击结束录音按钮
const handleRecordEnd = ()=> {
  iatrtcrecord.stop()
  isRecording.value = false;
  emit('toggle-recording-panel',false);
  window.context.dispatchMagixEvent('changeRecordingShow',{isRecording:false})
  ElMessage({
    message: '已结束录音',
  })
}

// 将聊天内容以及字幕文本输出为文档
const handlePreview = () => {
  emit('preview')
}

// 输入框focus后让它高度增加为10行
const resizeElInput = (e) => {
  e.preventDefault();
  const footEle = document.querySelector<HTMLDivElement>('.footer-container');
  if (footEle && footEle !== null) footEle.style.height = '200px';
  e.target.rows = 9;
}

// 输入框blur后恢复行数为1行显示
const handleInputBlur = (e) => {
  e.preventDefault();
  // footer-panel 元素 
  const footEle = document.querySelector<HTMLDivElement>('.footer-container');
  if (footEle && footEle !== null) footEle.style.height = '32px';
  e.target.rows = 1;
  // setTimeout(()=>{
  // },100)
}

onMounted(()=>{
    // 当发起人修改本地字幕看板的显隐后，其他人监听字幕看板的显示隐藏触发本地看板显隐事件
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