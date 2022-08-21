
// 音频转码worker
let recorderWorker = new Worker('./src/utils/transformpcm.worker.js')

// 记录处理的缓存音频
let buffer = []
let AudioContext = window.AudioContext || window.webkitAudioContext
let notSupportTip = '请试用chrome浏览器且域名为localhost或127.0.0.1测试'
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

recorderWorker.onmessage = function (e) {
  buffer.push(...e.data.buffer)
}

class IatRecorder {
  constructor(config) {
    this.config = config
    this.state = 'ing'

    //以下信息在控制台-我的应用-实时语音转写 页面获取
    this.appId = import.meta.env.VITE_ASR_API_ID
    this.apiKey = import.meta.env.VITE_ASR_API_KEY
  }

  start() {
    this.stop()
    if (navigator.getUserMedia && AudioContext) {
      this.state = 'ing'
      if (!this.recorder) {
        var context = new AudioContext()
        this.context = context
        this.recorder = context.createScriptProcessor(0, 1, 1)

        var getMediaSuccess = (stream) => {
          var mediaStream = this.context.createMediaStreamSource(stream)
          this.mediaStream = mediaStream
          this.recorder.onaudioprocess = (e) => {
            this.sendData(e.inputBuffer.getChannelData(0))
          }
          this.connectWebsocket()
        }
        var getMediaFail = (e) => {
          this.recorder = null
          this.mediaStream = null
          this.context = null
          console.log('请求麦克风失败')
        }
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
          }).then((stream) => {
            getMediaSuccess(stream)
          }).catch((e) => {
            getMediaFail(e)
          })
        } else {
          navigator.getUserMedia({
            audio: true,
            video: false
          }, (stream) => {
            getMediaSuccess(stream)
          }, function (e) {
            getMediaFail(e)
          })
        }
      } else {
        this.connectWebsocket()
      }
    } else {
      var isChrome = navigator.userAgent.toLowerCase().match(/chrome/)
      alert(notSupportTip)
    }
  }

  stop() {
    this.state = 'end'
    try {
      this.mediaStream.disconnect(this.recorder)
      this.recorder.disconnect()
    } catch (e) { }
  }

  sendData(buffer) {
    recorderWorker.postMessage({
      command: 'transform',
      buffer: buffer
    })
  }
  // 生成握手参数
  getHandShakeParams() {
    var appId = this.appId
    var secretKey = this.apiKey
    var ts = Math.floor(new Date().getTime() / 1000);//new Date().getTime()/1000+'';
    var signa = hex_md5(appId + ts)//hex_md5(encodeURIComponent(appId + ts));//EncryptUtil.HmacSHA1Encrypt(EncryptUtil.MD5(appId + ts), secretKey);
    var signatureSha = CryptoJSNew.HmacSHA1(signa, secretKey)
    var signature = CryptoJS.enc.Base64.stringify(signatureSha)
    signature = encodeURIComponent(signature)
    return "?appid=" + appId + "&ts=" + ts + "&signa=" + signature;
  }
  connectWebsocket() {
    var url = 'wss://rtasr.xfyun.cn/v1/ws'
    var urlParam = this.getHandShakeParams()

    url = `${url}${urlParam}`
    if ('WebSocket' in window) {
      this.ws = new WebSocket(url)
    } else if ('MozWebSocket' in window) {
      this.ws = new MozWebSocket(url)
    } else {
      alert(notSupportTip)
      return null
    }
    this.ws.onopen = (e) => {
      this.mediaStream.connect(this.recorder)
      this.recorder.connect(this.context.destination)
      setTimeout(() => {
        this.wsOpened(e)
      }, 500)
      this.config.onStart && this.config.onStart(e)
    }
    this.ws.onmessage = (e) => {
      // this.config.onMessage && this.config.onMessage(e)
      this.wsOnMessage(e)
    }
    this.ws.onerror = (e) => {
      this.stop()
      console.log("关闭连接ws.onerror");
      this.config.onError && this.config.onError(e)
    }
    this.ws.onclose = (e) => {
      this.stop()
      console.log("关闭连接ws.onclose");
      this.config.onClose && this.config.onClose(e)
    }
  }

  wsOpened() {
    if (this.ws.readyState !== 1) {
      return
    }
    var audioData = buffer.splice(0, 1280)
    this.ws.send(new Int8Array(audioData))
    this.handlerInterval = setInterval(() => {
      // websocket未连接
      if (this.ws.readyState !== 1) {
        clearInterval(this.handlerInterval)
        return
      }
      if (buffer.length === 0) {
        if (this.state === 'end') {
          this.ws.send("{\"end\": true}")
          console.log("发送结束标识");
          clearInterval(this.handlerInterval)
        }
        return false
      }
      var audioData = buffer.splice(0, 1280)
      if (audioData.length > 0) {
        this.ws.send(new Int8Array(audioData))
      }
    }, 40)
  }

  wsOnMessage(e) {
    let jsonData = JSON.parse(e.data)
    if (jsonData.action == "started") {
      // 握手成功
      console.log("握手成功");
    } else if (jsonData.action == "result") {
      // 转写结果
      if (this.config.onMessage && typeof this.config.onMessage == 'function') {
        this.config.onMessage(jsonData.data)
      }
    } else if (jsonData.action == "error") {
      // 连接发生错误
      console.log("出错了:", jsonData);
    }
  }


  ArrayBufferToBase64(buffer) {
    var binary = ''
    var bytes = new Uint8Array(buffer)
    var len = bytes.byteLength
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }
}

class IatRTCRecord {
  constructor() {
    var iatRecorder = new IatRecorder({
      onClose: () => {
        this.stop()
        this.reset()
      },
      onError: (data) => {
        this.stop()
        this.reset()
        alert('WebSocket连接失败')
      },
      onMessage: (message) => {
        this.setResult(JSON.parse(message))
      },
    })
    this.iatRecorder = iatRecorder
  }

  start() {
    this.iatRecorder.start()
  }

  stop() {
    this.iatRecorder.stop()
  }

  reset() {
    this.counterDownTime = 0
    clearTimeout(this.counterDownTimeout)
    buffer = []
  }

  // 结果显示
 
  setResult(data) {
    let rtasrResult = []
    rtasrResult[data.seg_id] = data
    rtasrResult.forEach(i => {
    if(i.cn.st.type == 0){
      let str = ""
      i.cn.st.rt.forEach(j => {
        j.ws.forEach(k => {
          k.cw.forEach(l => {
            str += l.w
          })
        })
      })
      window.emitMessage(str);
    }
    })
  }

  counterDown() {
    /*//计时5分钟
    if (this.counterDownTime === 300) {
      this.counterDownDOM.text('05: 00')
      this.stop()
    } else if (this.counterDownTime > 300) {
      this.reset()
      return false
    } else */
    if (this.counterDownTime >= 0 && this.counterDownTime < 10) {
      this.counterDownDOM.text('00: 0' + this.counterDownTime)
    } else if (this.counterDownTime >= 10 && this.counterDownTime < 60) {
      this.counterDownDOM.text('00: ' + this.counterDownTime)
    } else if (this.counterDownTime % 60 >= 0 && this.counterDownTime % 60 < 10) {
      this.counterDownDOM.text('0' + parseInt(this.counterDownTime / 60) + ': 0' + this.counterDownTime % 60)
    } else {
      this.counterDownDOM.text('0' + parseInt(this.counterDownTime / 60) + ': ' + this.counterDownTime % 60)
    }
    this.counterDownTime++
    this.counterDownTimeout = setTimeout(() => {
      this.counterDown()
    }, 1000)
  }
}

export const iatrtcrecord = new IatRTCRecord()