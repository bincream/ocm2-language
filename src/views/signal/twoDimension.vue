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
      <!--
      <div class="title" style="position:relative">
        <span>预警恒警信息</span>
        <label class="radio-label" style="position:absolute;right:890px">基站名:</label>
        <el-select
          v-model="warningEdit.standId"
          filterable
          clearable
          placeholder="请选择基站"
          style="position:absolute;width:150px;right:750px"
          size="small"
        >
          <el-option
            v-for="item in standList"
            :key="item.id"
            :value="item.id"
            :label="item.standName"
          />
        </el-select>
        <label class="radio-label" style="position:absolute;right:680px">起点:</label>
        <el-input v-model="warningEdit.origin" size="small" placeholder="请输入距离(米)" type="number" style="position:absolute;width:150px;right:540px" />

        <label class="radio-label" style="position:absolute;right:470px">终点:</label>
        <el-input v-model="warningEdit.destination" size="small" placeholder="请输入距离(米)" type="number" style="position:absolute;width:150px;right:330px" />

        <label class="radio-label" style="position:absolute;right:260px">灵敏度:</label>
        <el-input v-model="warningEdit.sensitivity" size="small" placeholder="请输入数字" type="number" style="position:absolute;width:150px;right:120px" />

        <el-button type="primary" style="position:absolute;right:10px" @click="submit">提交数据</el-button>
      </div>
      <div id="warnChart" style="width:100%; height:40%" /> -->
      <!-- <div class="title">单点频谱图
        <el-input v-model="spectrogramEdit.col" placeholder="请输入距离" style="width:120px;position:absolute;right:120px" />
        <el-button type="primary" style="position:absolute;right:10px" @click="spectrogram">开始</el-button>
      </div> -->
    </div>

  </div>
</template>

<script>
import { realtimeAudioQuery, vibQuery } from '@/api/signal/twoDimension'
import { standList, baseStandInfo } from '@/api/public'
import { debounce } from '@/utils'
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
      baseStandInfo: [],
      chart: null,
      websocket: null,
      websocket1: null,
      chart1: null,
      contextAudio: null,
      scheduleBuffersTimeout: null,
      audioStack: [],
      decodeAudioTimeout: null

    }
  },
  created() { },
  mounted() {
    this.initChart()
    this.myChart1()
    // this.warnChart()
    this.getStandList()
    this.getBaseStandInfo()

    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
        if (this.chart1) {
          this.chart1.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
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
    getWsData1(event) {
      var audio = document.getElementById('audioPlayer')
      const blob = new Blob([event.data], { type: 'autio/wave' })
      if (window.URL) {
        audio.src = window.URL.createObjectURL(blob)
      } else {
        audio.src = event
      }
      console.log(audio.src)
      audio.play()
      console.log('播放')

      // let buffer = event
      // let numberOfChannels = void 0
      // let sampleRate = void 0
      // let segment = void 0
      // console.log(buffer)

      // const audioStack = []
      // // 信道与调距提示判断
      // if (buffer.byteLength === 4) {
      //   var msgView = new DataView(buffer)
      //   var msgRate = msgView.getUint32(1, true)
      //   if (msgRate === 0) { // 信道满
      //     this.$message.error('监听信道已满,请稍后再试!')
      //     this.contextAudioStop() // 停止
      //   } else { // 调距
      //     this.inputLength = msgRate * 10
      //   }
      //   return false
      // }

      // var dataView = new DataView(buffer)
      // sampleRate = dataView.getUint32(1, true)
      // // 自己封装的头部，前四个字节是采样率，非标准wav头部
      // numberOfChannels = 1
      // buffer = buffer.slice(4) // 去掉自己封装的前4个字节
      // segment = {}

      // const that = this
      // // 解码，ArrayBuffer => audioBuffer
      // this.contextAudio.decodeAudioData(this.wavify(event.data, numberOfChannels, sampleRate)).then((audioBuffer) => {
      //   segment.buffer = audioBuffer
      //   that.audioStack.push(segment)
      //   that.decodeAudioTimeout = setTimeout(() => {
      //     that.scheduleBuffers(audioStack)
      //   }, 50)
      // })
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
      var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)

      tmp.set(new Uint8Array(buffer1), 0)
      tmp.set(new Uint8Array(buffer2), buffer1.byteLength)

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

      return this.concat(header, data)
    },
    contextAudioStop() {
      console.log('停止声音流')

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
          type: 'value',
          max: 2000
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
      if (this.yData.length > 30) {
        this.yData.shift()
      }
      console.log(this.yData)

      this.Data1.forEach((item, index) => {
        if (item > 500) {
          this.twoData.push([index, now, item])
        }
      })

      console.log(this.twoData, '1')
      console.log(this.xData)

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
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          type: 'piecewise',
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '5%',
          // inRange: {
          //   color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          // }
          splitNumber: 8,
          pieces: [{
            gt: 0,
            lte: 200,
            color: '#096'
          }, {
            gt: 200,
            lte: 1000,
            color: '#ffde33'
          }, {
            gt: 1000,
            lte: 1500,
            color: '#ff9933'
          }, {
            gt: 1500,
            lte: 2000,
            color: '#cc0033'
          }, {
            gt: 2000,
            lte: 4000,
            color: '#660099'
          }, {
            gt: 4000,
            color: '#7e0023'
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
      this.chart1.setOption(option)
    },
    createWs1() { // 二维振动ws
      if (window.WebSocket) {
        // this.WebSocket1 = new WebSocket1('ws://' + process.env.LINK_API)
        this.websocket1 = new WebSocket('ws://192.168.199.108:9005/')
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
        this.websocket = new WebSocket('ws://192.168.199.108:9005/')

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

