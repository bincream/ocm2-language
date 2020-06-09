<template>
  <div class="app-container">

    <div class="chart-container">
      <div class="title">
        <span>阀值设置下的二维振动</span>
        <el-input v-model="monitorEdit.col" placeholder="请输入距离" style="width:120px;position:absolute;right:220px" />
        <el-button
          v-if="checkPermission(['twoDimension/realtimeAudioQuery'])"
          v-show="websocket1 == null"
          type="primary"
          style="position:absolute;right:100px"
          @click="monitorStart"
        >开始监听</el-button>
        <el-button
          v-if="checkPermission(['twoDimension/realtimeAudioQuery'])"
          v-show="websocket1 !== null"
          type="primary"
          style="position:absolute;right:100px"
          @click="monitorEnd"
        >结束监听</el-button>
        <audio id="audioPlayer" ref="audioPlayer">
          <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
          <!-- <source src="/static/img/warning.mp3" type="audio/mp3" > -->
          <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
          <!-- <source src="/static/img/warning.ogg" type="audio/ogg" > -->
        </audio>
        <el-button
          v-if="checkPermission(['twoDimension/vibQuery'])"
          v-show="websocket == null"
          type="primary"
          @click="connect"
        >连接</el-button>
        <el-button
          v-if="checkPermission(['twoDimension/vibQuery'])"
          v-show="websocket !== null"
          type="danger"
          @click="disconnect"
        >断开连接</el-button>
      </div>
      <div id="myChart1" style="width:1600px;height:30%;margin:auto" />
      <div id="vibrateChart" style="width:1600px;height:80%;margin:auto" />
    </div>

  </div>
</template>

<script>
import { realtimeAudioQuery, vibQuery } from '@/api/signal/twoDimension'
import { standList, baseStandInfo } from '@/api/public'
import echarts from 'echarts'
import checkPermission from '@/utils/permission' // 权限判断函数
import waves from '@/directive/waves' // 水波纹指令
import resize from '@/components/Charts/mixins/resize'
export default {
  name: 'Dashboard',
  directives: {
    waves
  },
  mixins: [resize],
  data() {
    return {
      listQuery: {},
      standList: [],
      warningEdit: {},
      spectrogramEdit: {},
      audioStatus: 0,
      infoCount: {
        noPassCount: 0,
        getPastCount: 0,
        passRate: 0
      },
      monitorEdit: {},
      yData: [],
      xData: [],
      Data1: [],
      twoData: [],
      baseStandInfo: {},
      chart: null,
      websocket: null,
      websocket1: null,
      chart1: null,
      contextAudio: null,
      scheduleBuffersTimeout: null,
      audioStack: [],
      decodeAudioTimeout: null,
      startX: 0,
      endX: 2500

    }
  },
  created() { },
  mounted() {
    // this.initChart()
    // this.myChart1()
    // this.warnChart()
    this.getStandList()
    this.getBaseStandInfo()
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //   })
  // },

  beforeRouteLeave(to, from, next) {
    this.destroyedWs()
    next()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    if (!this.chart1) {
      return
    }
    this.chart1.dispose()
    this.chart1 = null
  },
  methods: {
    checkPermission,
    connect() {
      this.getVibQuery()
    },
    disconnect() {
      this.destroyedWs()
    },
    getStandList() {
      standList().then(response => {
        this.standList = response.data
      })
    },
    getBaseStandInfo() {
      baseStandInfo().then(response => {
        this.baseStandInfo = response.data
      })
    },
    getVibQuery() {
      vibQuery().then(response => {
        this.vibQuery = response.data
        this.createWs()
      })
    },
    getWsData(data) {
      this.Data1 = data
      this.xData = []
      for (let i = 0; i < data.length; i++) {
        this.xData.push(i * this.baseStandInfo.precisions)
      }
      this.initChart()
      this.myChart1(data)
    },

    blob2Arrraybuffer(data) {
      const reader = new FileReader()

      reader.readAsArrayBuffer(data)
      reader.onload = function(e) {
        return e.currentTarget.result
      }
    },

    getWsData1(event) {
      const that = this

      const reader = new FileReader()

      reader.readAsArrayBuffer(event.data)
      reader.onload = function(e) {
        let buffer = e.currentTarget.result.slice(0)

        let numberOfChannels = void 0
        let sampleRate = void 0
        let segment = void 0

        const audioStack = []
        // 信道与调距提示判断
        if (buffer.byteLength === 2) {
          var msgView = new DataView(buffer)
          var msgRate = msgView.getInt16(0, true)
          if (msgRate === 0) { // 信道满
            that.$message.error('监听信道已满,请稍后再试!')
            that.contextAudioStop() // 停止
          } else { // 调距
            that.inputLength = msgRate * 10
          }
          return false
        }
        // 获取采样率
        // var dataView = new DataView(buffer)
        // console.log(dataView)
        // sampleRate = dataView.getInt16(0, true)
        sampleRate = this.baseStandInfo.samplingRate

        // 自己封装的头部，前2个字节是采样率，非标准wav头部
        numberOfChannels = 1
        buffer = buffer.slice(2) // 去掉自己封装的前2个字节
        segment = {}

        // 解码，ArrayBuffer => audioBuffer
        that.contextAudio.decodeAudioData(that.wavify(buffer, numberOfChannels, sampleRate)).then((audioBuffer) => {
          segment.buffer = audioBuffer
          that.audioStack.push(segment)
          that.decodeAudioTimeout = setTimeout(() => {
            that.scheduleBuffers(audioStack)
          }, 50)
        })
      }
    },
    scheduleBuffers() {
      let nextTime = 0
      clearTimeout(this.decodeAudioTimeout)
      this.decodeAudioTimeout = null
      clearTimeout(this.scheduleBuffersTimeout)
      this.scheduleBuffersTimeout = null

      while (this.audioStack.length > 0 && this.audioStack[0].buffer !== undefined) {
        var currentTime = this.contextAudio.currentTime
        var source = this.contextAudio.createBufferSource()
        var segment = this.audioStack.shift()
        if (this.audioStack.length > 1) {
          segment = this.audioStack.shift()
        }
        source.loop = true
        source.buffer = segment.buffer
        source.connect(this.contextAudio.destination)
        if (nextTime === 0) {
          nextTime = currentTime + 0.3
        }
        var duration = source.buffer.duration
        if (currentTime > nextTime) {
          nextTime = currentTime
        }
        source.start(nextTime, 0)

        source.stop(nextTime + duration)
        nextTime += duration
      }
      const that = this
      this.scheduleBuffersTimeout = setTimeout(() => {
        that.scheduleBuffers()
      }, 50)
    },
    concat(buffer1, buffer2) {
      const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)

      const buffer12Unit8 = new Uint8Array(buffer1)
      const buffer22Unit8 = new Uint8Array(buffer2)
      tmp.set(buffer12Unit8, 0)

      tmp.set(buffer22Unit8, buffer1.byteLength)
      // console.log(Buffer.from(tmp, 'hex'), 'buffer.from')
      // Buffer.from(unit8Array.buffer)

      return tmp.buffer
    },
    wavify(data, numberOfChannels, sampleRate) {
      var header = new ArrayBuffer(44)

      var d = new DataView(header)

      d.setUint8(0, 'R'.charCodeAt(0))
      d.setUint8(1, 'I'.charCodeAt(0))
      d.setUint8(2, 'F'.charCodeAt(0))
      d.setUint8(3, 'F'.charCodeAt(0))

      d.setUint32(4, data.byteLength / 2 + 44, true)

      d.setUint8(8, 'W'.charCodeAt(0))
      d.setUint8(9, 'A'.charCodeAt(0))
      d.setUint8(10, 'V'.charCodeAt(0))
      d.setUint8(11, 'E'.charCodeAt(0))
      d.setUint8(12, 'f'.charCodeAt(0))
      d.setUint8(13, 'm'.charCodeAt(0))
      d.setUint8(14, 't'.charCodeAt(0))
      d.setUint8(15, ' '.charCodeAt(0))

      d.setUint32(16, 16, true)
      d.setUint16(20, 1, true)
      d.setUint16(22, numberOfChannels, true)
      d.setUint32(24, sampleRate, true)
      d.setUint32(28, sampleRate * 1 * 2)
      d.setUint16(32, numberOfChannels * 2)
      d.setUint16(34, 16, true)

      d.setUint8(36, 'd'.charCodeAt(0))
      d.setUint8(37, 'a'.charCodeAt(0))
      d.setUint8(38, 't'.charCodeAt(0))
      d.setUint8(39, 'a'.charCodeAt(0))
      d.setUint32(40, data.byteLength, true)
      console.log(d)
      return this.concat(header, data)
    },
    contextAudioStop() {
      if (this.contextAudio && this.contextAudio.state === 'running') {
        this.contextAudio.close()
      }

      if (this.websocket2 && this.websocket2.readyState === 1) {
        this.websocket2.close()
        this.websocket2 = null
      }

      this.isPlay = false

      if (this.alarmList.length > 0) {
        for (let i = 0; i < this.alarmList.length; i++) {
          const item = this.alarmList[i]
          item.alarmInfo.isPlay = false
        }
      }

      clearTimeout(this.scheduleBuffersTimeout)
      this.scheduleBuffersTimeout = null
      this.decodeAudioTimeout = null
      clearTimeout(this.decodeAudioTimeout)
    },
    // 监听
    monitorStart() {
      if (!this.monitorEdit.col) {
        this.$message.error('请输入距离')
        return false
      }
      realtimeAudioQuery(this.monitorEdit).then(response => {
        this.monitorData = response.data
        this.createWs1()
      })
    },
    monitorEnd() {
      var audio = document.getElementById('audioPlayer')
      this.websocket1.close()
      this.websocket1 = null
      audio.pause()
    },
    // spectrogram() {
    //   realtimeAudioQuery(this.spectrogramEdit).then(response => {
    //     this.data = response.data
    //     this.createWs()
    //   })
    // },
    myChart1(data) {
      this.chart = echarts.init(document.getElementById('myChart1'))
      const option = {
        backgroundColor: '#F2F6FC',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          height: '50%',
          bottom: '1%'
        },
        xAxis: {
          axisLabel: {
            formatter: function() {
              return ''
            }
          },
          show: false,
          type: 'category',
          data: []
        },
        yAxis: {
          axisLabel: {
            formatter: function() {
              return ''
            }
          },
          type: 'value'
        },
        series: [{
          name: '强度',
          data: data,
          type: 'line',
          itemStyle: {
            color: '#313695'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#4575b4'
            }, {
              offset: 1,
              color: '#74add1'
            }])
          }
        }]
      }
      option.xAxis.data = this.xData
      option.yAxis.data = data
      option.series[0].data = data
      this.chart.setOption(option, true)
    },

    initChart() {
      var myDate = new Date()
      // var now = myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds()// 时分秒
      // var now = myDate.toLocaleString() // 日期+时间
      var now = myDate.toLocaleTimeString()// 时间
      var arr = this.yData.indexOf(now)
      if (arr === -1) {
        this.yData.push(now)
      }
      if (this.yData.length > 15) {
        this.yData.shift()
      }
      const sum = this.endX - this.startX
      console.log(sum)

      if (sum > 50) {
        this.Data1.forEach((item, index) => {
          const x = Math.max(this.Data1[index * 5], this.Data1[index * 5 + 1], this.Data1[index * 5 + 2], this.Data1[index * 5 + 3], this.Data1[index * 10 + 4])
          if (x > this.baseStandInfo.alarmThreshold) {
            this.twoData.push([index * 5, now, x])
          }
        })
      } else {
        this.Data1.forEach((item, index) => {
          if (item > this.baseStandInfo.alarmThreshold && index > this.startX && index < this.endX) {
            this.twoData.push([index, now, item])
          }
          // if (item > this.baseStandInfo.alarmThreshold && (index < this.startX || index > this.endX)) {
          //   const x = Math.max(this.Data1[index * 5], this.Data1[index * 5 + 1], this.Data1[index * 5 + 2], this.Data1[index * 5 + 3], this.Data1[index * 10 + 4])
          //   this.twoData.push([index * 5, now, x])
          // }
        })
      }

      if (this.twoData.length > 2500) {
        this.twoData.splice(0, this.twoData.length - 2500)
      }

      this.chart1 = echarts.init(document.getElementById('vibrateChart'))
      const option = {
        tooltip: {
          trigger: 'item'
        },
        backgroundColor: '#F2F6FC',
        grid: {
          height: '80%',
          top: '0'
        },

        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'category',
          data: []
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            saveAsImage: {}
          }
        },
        visualMap: {
          type: 'piecewise',
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '5%',
          splitNumber: 8,
          pieces: [
            {
              gt: 2000,
              lte: 4000,
              color: '#6495ED'
            }, {
              gt: 4000,
              lte: 6000,
              color: '#0000FF'
            }, {
              gt: 6000,
              lte: 8000,
              color: '#FFD700'
            }, {
              gt: 8000,
              lte: 10000,
              color: '#FFA500'
            }, {
              gt: 10000,
              lte: 12000,
              color: '#FF4500'
            }, {
              gt: 12000,
              color: '#FF0000'
            }],
          outOfRange: {
            color: '#999'
          },
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        },
        series: [{
          name: '强度',
          type: 'heatmap',
          // type: 'scatter',

          data: [],
          symbolSize: function(param) {
            // 每个点是一个矩形，其[宽px, 高px]
            return [6, 16]
          },
          emphasis: {
            itemStyle: {
              borderColor: '#333',
              borderWidth: 1
            }
          },
          progressive: 1000,
          animation: false
        }]
      }
      option.xAxis.data = this.xData
      option.yAxis.data = this.yData
      option.series[0].data = this.twoData
      const that = this

      this.chart1.on('dataZoom', function(params) { // 选取的x轴值
        var start = params.batch[0].startValue
        var end = params.batch[0].endValue
        // var startX = option.xAxis.data[start] / that.baseStandInfo.precisions
        // var endX = option.xAxis.data[end] / that.baseStandInfo.precisions
        if (start !== undefined) {
          that.startX = start
          that.endX = end
        } else {
          that.startX = 0
          that.endX = that.Data1.length
        }
      })
      console.log(that.startX)// 区间开始值："17-11-06"
      console.log(that.endX)// 区间结束值："17-11-08"
      this.chart1.setOption(option)
    },
    createWs1() { // 二维振动ws
      if (window.WebSocket) {
        // this.WebSocket1 = new WebSocket1('ws://' + process.env.LINK_API)
        this.websocket1 = new WebSocket('ws://192.168.8.110:9005/')
        this.contextAudio = new AudioContext()

        // 当有消息过来的时候触发
        const that = this
        this.websocket1.onmessage = function(event) {
          // const data = JSON.parse(event.data)
          that.getWsData1(event)
        }

        // 连接关闭的时候触发
        this.websocket1.onclose = function(event) {
          console.log('断开连接')
        }

        // 连接打开的时候触发
        this.websocket1.onopen = function(event) {
          that.websocket1.send(that.monitorData)
          console.log('建立连接')
        }

        this.websocket1.onclose = function(event) {
          console.log('连接断开')
          // that.contextAudioStop()
        }
      } else {
        this.$message.error('浏览器不支持WebSocket')
      }
    },
    createWs() { // 二维振动ws
      if (window.WebSocket) {
        // this.websocket = new WebSocket('ws://' + process.env.LINK_API)
        this.websocket = new WebSocket('ws://192.168.8.110:9005/')

        // 当有消息过来的时候触发
        const that = this
        this.websocket.onmessage = function(event) {
          const data = JSON.parse(event.data)
          that.getWsData(data)
        }

        // 连接关闭的时候触发
        this.websocket.onclose = function(event) {
          console.log('断开连接')
        }

        // 连接打开的时候触发
        this.websocket.onopen = function(event) {
          that.websocket.send(that.vibQuery)
          console.log('建立连接')
        }

        this.websocket.onclose = function(event) {
          console.log('连接断开')
          // that.contextAudioStop()
        }
      } else {
        this.$message.error('浏览器不支持WebSocket')
      }
    },
    destroyedWs() {
      if (this.websocket) {
        this.websocket.close()
        this.websocket = null
      }
      if (this.websocket1) {
        this.websocket1.close()
        this.websocket1 = null
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.chart-container {
  width: 100%;
  height: calc(100vh - 84px);
  margin-bottom: 100px;
}
.title {
  position: relative;
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height:42px;
  font-size:30px;
  font-weight:500;
  color:rgba(0,0,0,1);
  margin-top: 20px
}

.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}

.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }

}
</style>

