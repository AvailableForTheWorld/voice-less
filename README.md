## 项目简介

[本项目](https://github.com/AvailableForTheWorld/voice-less)为伴有实时字幕到聊天工具，是会议中进行头脑风暴的便携辅助的记录工具。

## 快速开始

1.  在 .env 文件里配置白板房间 UUID 和 Token

2.  本录音转文字是调用的讯飞ASR，将api-id以及api-key配置到.env文件中

3.  执行 `npm install` 安装依赖

4.  执行 `npm start` 运行项目

## 功能介绍

1. 实时语音转字幕

   > 可点击输入框录音按钮开启字幕功能，识别结果会展示到应用界面<字幕>窗口中。
   
   ![实时语音转文字](https://user-images.githubusercontent.com/49779788/186431652-bdbc975e-5433-4a7d-8624-7ba59e3900db.gif)

   
2. 实时文本通信

  > 多人白板互动时，可通过应用进行消息通信，支持文本形式的消息发送。除文本通信外，还支持文本消息的删除、导出操作（可一键导出当前应用中的消息记录）。

<img width="1239" alt="image" src="https://user-images.githubusercontent.com/49779788/186429676-d3282432-e115-4dab-b229-6036cc667eaa.png">

<img width="881" alt="image" src="https://user-images.githubusercontent.com/49779788/186431755-288ef483-55fd-4c59-a18b-8ace29ee4c94.png">

3. 消息交互

  > 可以对发送的文本消息进行多选、删除、复制操作，多选模式下可以进行全选和反选、多选删除以及多选复制操作，点击取消多选即可返回普通模式。
  
 <img width="1055" alt="image" src="https://user-images.githubusercontent.com/49779788/186456078-e4f379b5-e3b3-4174-b0f6-73f4d07e4165.png">

<img width="1049" alt="image" src="https://user-images.githubusercontent.com/49779788/186456202-a4b5945e-f85b-421a-8e8c-38399841587b.png">

4. 消息输出

  > 点击右下角导出按钮即可生成所有消息按照时间排序的txt文档

<img width="1501" alt="image" src="https://user-images.githubusercontent.com/49779788/186458181-6abc6c9b-9041-4046-8913-5ef0c0236601.png">



## 功能点说明

  - [x] 发送消息
  - [x] 语音转字幕
  - [x] 多选消息
  - [x] 删除消息
  - [x] 复制消息
  - [x] 多用户头像
  - [x] 消息时间显示
  - [x] 导出消息
  
## 技术栈
1. vue3
2. sass
3. pinia
4. element-plus

