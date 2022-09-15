<template>
  <div class="main-container">
    <div class="user-message" v-for="(item,index) in typeList" :key="item.date">
      <div class="checkbox-wrapper" v-show="checkboxStore.isCheckboxShow">
        <input type="checkbox" v-model="item.isChecked" @change="handleCheckBox(item,index)" class="input-checkbox"/>
      </div>
      <el-avatar class="user-avatar" :size="40" :style="{backgroundColor:info[item.id]?.color,visibility:judgeAvatarDuplicated(item,index)?'visible':'hidden'}">{{item.id}}</el-avatar>
      <el-popover
        placement="top-start"
        :width="'auto'"
        trigger="hover"
        :hide-after="0"
      >
        <template #reference>
          <el-card class="user-content" shadow="hover"> <div class="text-content" v-html="item.content"></div> </el-card>
        </template>
        <div class="flex justify-space-between mb-0 flex-wrap gap-2">
        <el-button
          v-for="button in buttons"
          :key="button.text"
          :type="button.type"
          text
          @click="handleCardOptionsClick(button.text,index,item)"
        >{{ button.text }}
        </el-button>
      </div>
      </el-popover>
      
      <div class="show-time">{{getDate(item.date)}}</div>
    </div>

    <div class="caption-container">
      <div class="caption-header">
        <el-button text class="caption-btn" :disabled="!judgeRecordingPanelShow" @click="isHandleRecordingShow = false">隐藏</el-button>
        <div>字幕显示</div>
        <el-button text class="caption-btn" :disabled="judgeRecordingPanelShow" @click="isHandleRecordingShow = true">显示</el-button>
      </div>
      <ul  class="caption-content" v-if="judgeRecordingPanelShow">
        <li v-for="(item,index) in captionList" :key="item.date">
          <div class="caption-date">{{getDate(item.date)}}</div>
          <div class="caption-words">
            {{item.content}}
          </div>
        </li>
      </ul>
    </div>
    <div class="mavon-editor-wrapper" v-if="editorShow">
      <mavon-editor v-model="mavonEditorValue" :toolbars="mavontoolbars" @save="handleOutput">
      </mavon-editor>
    </div>
  </div>
</template>

<script lang="ts" setup>
import editor from 'mavon-editor';
import { defineProps,watch,toRefs,ref, watchEffect, onMounted, computed, defineEmits, onUpdated } from 'vue'
import { useCheckBox } from '../../stores/index';

const checkboxStore = useCheckBox();


const props = defineProps(['list','info','isRecordingPanelShow'])

const emit = defineEmits(['del-message','check-message'])

const buttons = [
  { type: 'danger', text: '删除' },
  { type: 'success', text: '多选' },
  { type: 'primary', text: '复制'},
] as const

const isChecked = ref(false)

// typeList是用来表示文本文字的list
const typeList = ref([])
// captionList是用来表示字幕文本的list
const captionList = ref([])
const judgeAvatarDuplicated = (item,index) => {
  if(index && typeList.value[index-1]?.id == item.id){
    return false;
  }
  return true;
}

const isCardHover = ref(-1)

// 点击checkbox触发事件（包括：选中，取消选中）
const handleCheckBox = (item,index) => {
  if(item.isChecked){
    checkboxStore.cntPlus();
  }else{
    checkboxStore.cntMinus();
  }
  emit('check-message',index)
}

// hover当前文字卡片的事件
const handleCardHover = (index)=> {
  isCardHover.value = index
}

const handleCardMouseLeave = () => {
  isCardHover.value = -1
}

// 文字卡片hover后tooltip弹出的处理方法
const handleCardOptionsClick = (text,index,item) => {
  if(text === '删除'){
    emit('del-message',item.idNum);
  }
  else if(text === '多选'){
    checkboxStore.setCheckboxShow(true);
    window.context.dispatchMagixEvent('changeCheckboxShow',{isCheckboxShow:true})
  }
  else if(text === '复制'){
    let str = ''
    if(checkboxStore.isCheckboxShow){
      let arr = typeList.value.map((item)=>{
        if(item.isChecked){
          return item.content;
        }
        return null
      }).filter( item => item )
      str = arr.join('\n');
    }
    else {
      str += typeList.value[index].content;
    }
    navigator.clipboard.writeText(str)
  }
}

// 滑动到最底端触发的函数
const scrollToEnd = ()=>{
  const dom = document.querySelector('.caption-content')
  setTimeout(()=>{
    dom?.scrollTo(0,dom.scrollHeight);
  },200)
  
}

// 手动触发显示隐藏变量
const isHandleRecordingShow = ref(false);

const judgeRecordingPanelShow = computed(()=>{
  if(isHandleRecordingShow.value){
    return true;
  }
  else if(props.isRecordingPanelShow){
    return true;
  }
  return false;
})

const mavonTypeValue = ref('')
const mavonRecordValue = ref('')
const mavonEditorValue = ref(mavonTypeValue.value+mavonRecordValue.value)
const mavonEditorHead = `
# 会议主题：
`

const mavontoolbars = {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    superscript: true, // 上角标
    subscript: true, // 下角标
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: false, // 图片链接
    code: true, // code
    table: true, // 表格
    fullscreen: true, // 全屏编辑
    readmodel: true, // 沉浸式阅读
    htmlcode: true, // 展示html源码
    help: true, // 帮助
    /* 1.3.5 */
    undo: true, // 上一步
    redo: true, // 下一步
    trash: true, // 清空
    save: true, // 保存（触发events中的save事件）
    /* 1.4.2 */
    navigation: true, // 导航目录
    /* 2.1.8 */
    alignleft: false, // 左对齐
    aligncenter: false, // 居中
    alignright: false, // 右对齐
    /* 2.2.1 */
    subfield: true, // 单双栏模式
    preview: true, // 预览
}

const getList = (newVal)=>{
  mavonTypeValue.value=""
  mavonRecordValue.value=""
  typeList.value = newVal.filter((item)=>{
    if(item.type == 1){
      mavonTypeValue.value+=item.content+'\n'
    }
    return item.type == 1;
  })
  captionList.value = newVal.filter((item)=>{
    if(item.type == 0){
      mavonRecordValue.value+=item.content+'\n'
    }
    return item.type == 0;
  })
  mavonEditorValue.value = mavonEditorHead +`## 文本信息：\n` + mavonTypeValue.value + '\n\n' + `## 字幕信息：\n` + mavonRecordValue.value;
}

const handleOutput = () => {
  const target = mavonEditorValue.value;
  let filename="会议内容.md";
  //文件内容
  let text=target;
  let pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);
  if (document.createEvent) {
      let event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
  } else {
      pom.click();
  }
}

const editorShow = ref(false)
const changeEditorShow = ()=>{
  editorShow.value = !editorShow.value;
  window.context.dispatchMagixEvent('changeMavonEditorShow',{show:editorShow.value});
}
defineExpose({
  changeEditorShow,
})

watch(()=>props.list,(newVal)=>{
  getList(newVal);
  scrollToEnd();
},{deep:true})

watch(mavonEditorValue,(val)=>{
  if(val){
    window.context.dispatchMagixEvent('changeMavonEditorValue',{data:mavonEditorValue.value})
  }
})

onMounted(()=>{
  getList(props.list)
  let cnt = 0,sum=0;
  for(let item in typeList.value){
    ++sum;
    if(typeList.value[item].isChecked){
      ++cnt;
    }
  }
  // 这里需要修改pinia状态中选中框的个数，在每次加载页面后需要计算checkbox的总数以及选中了的数量
  checkboxStore.setSum(sum);
  checkboxStore.setCheckedCnt(cnt);
  window.context.addMagixEventListener('changeCheckboxShow',({payload})=>{
    checkboxStore.isCheckboxShow = payload.isCheckboxShow;
  })
  window.context.addMagixEventListener('changeMavonEditorValue',({payload})=>{
    mavonEditorValue.value = payload.data
  })
  window.context.addMagixEventListener('changeMavonEditorShow',({payload})=>{
    editorShow.value = payload.show
  })
  scrollToEnd();
})

// 每次hover文字卡片以及字幕上方的日期处理函数
const getDate = (date)=>{
  const oldVal = new Date(date), newVal = new Date();
  const year = oldVal.getFullYear().toString().padStart(4, "0");
  const month = (oldVal.getMonth() + 1).toString().padStart(2, "0");
  const day = oldVal.getDate().toString().padStart(2, "0");

  const hour = oldVal.getHours().toString().padStart(2, "0");
  const minute = oldVal.getMinutes().toString().padStart(2, "0");
  const second = oldVal.getSeconds().toString().padStart(2, "0");
  if((newVal-oldVal)/(1000*3600*24*365)>1){
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  else if((newVal-oldVal)/(1000*3600*24)>1){
    return `${month} 月 ${day} 日 ${hour}:${minute}:${second}`
  }
  else {
    return `${hour}:${minute}:${second}`
  }
}


</script>

<style lang="scss">
.main-container {
  position: relative;
  padding: 0.25rem 0.75rem;
  flex: 1;
  overflow-y: auto;
  .user-message{
    position: relative;
    display: flex;
    align-items: center;
    margin: 0;
    .checkbox-wrapper{
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      .input-checkbox {
        cursor: pointer;
      }
    }
    .user-avatar {
      margin: 4px 20px 4px 0;
      flex-shrink: 0;
      background-color: skyblue;
    }
    .user-content {
      max-width: calc(100% - 110px);
      .text-content{
        white-space: pre-line;
        flex-wrap: wrap;
      }
    }
    .show-time {
      display: none;
      margin-left: 15px;
      color: rgba(#000000,0.3);
    }
    &:hover {
      .show-time {
        display: block;
      }
    }
  }
  
  .fold {
    height: 10px;
    background-color: #aaaaaa;
  }
  .caption-container {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    width: 200px;
    height: fit-content;
    
    color: #fff;
    border-radius: 4px;
    overflow: hidden;
    .caption-header {
      display: flex;
      font-size: 14px;
      height: 32px;
      border-radius: 4px;
      justify-content: space-between;
      align-items: center;
      background-color: #121217;
      padding: 0 10px;
      .caption-btn {
        height: 20px;
        font-size: 12px;
        padding: 0 4px;
      }
    }
    .caption-content {
      font-size: 12px;
      overflow-y: scroll;
      height: calc(100% - 32px);
      margin: 0;
      background-color: rgba($color: #000000, $alpha: 0.8);
      padding: 0 ;
      li {
        list-style: none;
      }
      .caption-date {
        text-align: left;
        margin-left: -12px;
        transform: scale(0.8);
      }
      .caption-words {
        margin-left: 20px;
      }
      &::-webkit-scrollbar {
        display: block;
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #888888;
        border-radius: 4px;
      }
      &::-webkit-scrollbar-track-piece {
        background-color: transparent;
      }
    }
  }
}
</style>
<style lang="scss">
.user-content {
  .el-card__body {
    padding: 6px 10px;
    font-size: 14px;
  }
}
.mavon-editor-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  transform: translateX(100%);
  .shadow {
    max-height: 400px;
    .v-note-panel {
      .v-note-edit{
        border-bottom-left-radius: 0 !important;
      }
    }
  }
}
</style>