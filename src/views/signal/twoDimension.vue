<template>
  <div class="app-container">

    <div class="chart-top">
      <div class="title">
        <span>{{ $t('signal.dandianyinpin') }}</span>
        <el-input v-model="monitorEdit.col" :placeholder="$t('signal.qingshurujuli')" style="width:210px;position:absolute;right:180px" />
        <el-button
          v-if="checkPermission(['twoDimension/realtimeAudioQuery'])"
          v-show="websocket1 == null"
          type="primary"
          style="position:absolute;right:0px"
          @click="monitorStart"
        >{{ $t('signal.kaishijianting') }}</el-button>
        <el-button
          v-if="checkPermission(['twoDimension/realtimeAudioQuery'])"
          v-show="websocket1 !== null"
          type="danger"
          style="position:absolute;right:0px"
          @click="monitorEnd"
        >{{ $t('signal.jieshujianting') }}</el-button>
        <audio id="audioPlayer" ref="audioPlayer">
          <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
          <!-- <source src="/static/img/warning.mp3" type="audio/mp3" > -->
          <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
          <!-- <source src="/static/img/warning.ogg" type="audio/ogg" > -->
        </audio>
      </div>
      <div id="audioChart" style="width:100%;height:400px;margin:auto" />
    </div>
    <el-divider />
    <div class="chart-container">
      <div class="title">
        <span>{{ $t('signal.yuzhishezhixiadeerweizhendong') }}</span>
        <span class="radio-label" style="width:160px;position:absolute;right:240px">{{ $t('signal.Yzhoufanwei:') }}</span>
        <el-input v-model="yMax" type="number" :placeholder="$t('signal.qingshuruYzhouzuidafanwei')" style="width:160px;position:absolute;right:130px" @input="updataY" />

        <!-- <el-button style="position:absolute;right:110px" type="primary" @click="updataY">{{ $t('xiugai') }}</el-button> -->
        <el-button
          v-if="checkPermission(['twoDimension/vibQuery'])"
          v-show="websocket == null"
          type="primary"
          @click="connect"
        >{{ $t('signal.lianjie') }}</el-button>
        <el-button
          v-if="checkPermission(['twoDimension/vibQuery'])"
          v-show="websocket !== null"
          type="danger"
          @click="disconnect"
        >{{ $t('signal.duankailianjie') }}</el-button>
      </div>
      <div id="myChart1" style="width:100%;height:29%;margin:auto" />
      <div id="vibrateChart" style="width:100%;height:68%;margin:auto" />
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
      xAudioData: [],
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
      sidebarElm: null,
      autoResize: true,
      websocket: null,
      websocket1: null,
      yMax: 20,
      contextAudio: null,
      scheduleBuffersTimeout: null,
      audioStack: [],
      decodeAudioTimeout: null,
      startX: 0,
      endX: null

    }
  },
  created() { },
  mounted() {
    this.getBaseStandInfo()
    this.getStandList()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getBaseStandInfo()
    })
  },

  // beforeRouteLeave(to, from, next) {
  //   // this.destroyedWs()
  //   if (!this.chart1) {
  //     return
  //   }
  //   if (this.autoResize) {
  //     window.removeEventListener('resize', this.__resizeHandler)
  //   }
  //   this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

  //   this.chart1.dispose()
  //   next()
  // },
  // beforeDestroy() {
  // },
  methods: {
    checkPermission,
    connect() {
      if (this.$i18n.locale === 'cn') {
        if (this.baseStandInfo.standMode === 1) {
          this.$message.error('性能模式下无法查看')
          return false
        }
        this.getVibQuery()
      } else if (this.$i18n.locale === 'en') {
        if (this.baseStandInfo.standMode === 1) {
          this.$message.error('Cannot view in performance mode')
          return false
        }
        this.getVibQuery()
      }
    },
    disconnect() {
      this.destroyedWs()
    },
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    getStandList() {
      standList().then(response => {
        this.standList = response.data
      })
    },
    getBaseStandInfo() {
      baseStandInfo().then(response => {
        this.baseStandInfo = response.data
        setTimeout(() => {
          this.initChart()
          this.myChart1()
          this.audioChart()
        }, 500)
      })
    },
    getVibQuery() {
      vibQuery().then(response => {
        this.vibQuery = response.data
        this.createWs()
      })
    },
    getAudioData(buffer) {
      var audio = []
      this.xAudioData = []
      var msgView = new DataView(buffer)
      for (let i = 0; i < msgView.byteLength / 2; i++) {
        if (i % 2 === 0) {
          this.xAudioData.push(i * this.baseStandInfo.precisions)
        }
        audio.push(msgView.getInt16(i * 2, true))
      }
      console.log('audio', audio)
      return audio
    },
    getWsData(data) {
      this.Data1 = data
      this.xData = []
      for (let i = 0; i < data.length; i++) {
        this.xData.push(i * this.baseStandInfo.precisions)
      }
      if (this.endX === null) {
        this.endX = data.length
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
        var audioData
        // 信道与调距提示判断
        if (this.$i18n.locale === 'cn') {
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
        } else if (this.$i18n.locale === 'en') {
          if (buffer.byteLength === 2) {
            var msgView1 = new DataView(buffer)
            var msgRate1 = msgView1.getInt16(0, true)
            if (msgRate1 === 0) { // 信道满
              that.$message.error('The monitoring channel is full, please try again later!')
              that.contextAudioStop() // 停止
            } else { // 调距
              that.inputLength = msgRate * 10
            }
            return false
          }
        }

        // 获取采样率
        // var dataView = new DataView(buffer)
        // console.log(dataView)
        // sampleRate = dataView.getInt16(0, true)
        sampleRate = that.baseStandInfo.samplingRate

        // 自己封装的头部，前2个字节是采样率，非标准wav头部
        numberOfChannels = 1
        buffer = buffer.slice(2) // 去掉自己封装的前2个字节
        segment = {}
        audioData = that.getAudioData(buffer)
        that.audioChart(audioData)
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
      if (this.$i18n.locale === 'cn') {
        if (this.baseStandInfo.standMode !== 0) {
          this.$message.error('性能模式下无法监听')
          return false
        }
        if (!this.monitorEdit.col) {
          this.$message.error('请输入距离')
          return false
        }
      } else if (this.$i18n.locale === 'en') {
        if (this.baseStandInfo.standMode !== 0) {
          this.$message.error('Cannot monitor in performance mode')
          return false
        }
        if (!this.monitorEdit.col) {
          this.$message.error('Please enter the distance')
          return false
        }
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
    audioChart(data) {
      this.chart = echarts.init(document.getElementById('audioChart'))
      if (this.$i18n.locale === 'cn') {
        const option = {
          backgroundColor: '#394056',
          title: {
            top: 20,
            text: '波形曲线',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#F1F1F3'
            },
            left: '2%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B'
              }
            }
          },
          legend: {
            top: 20,
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: ['波形'],
            right: '50%',
            textStyle: {
              fontSize: 12,
              color: '#F1F1F3'
            }
          },
          grid: {
            top: 100,
            left: '4%',
            right: '4%',
            bottom: '4%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }],
          yAxis: [{
            type: 'value',
            name: '振幅',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }],
          series: [{
            name: '波形',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12

              }
            }
          }]
        }
        option.xAxis.data = this.xAudioData
        option.yAxis.data = data
        option.series[0].data = data
        this.chart.setOption(option)
      } else if (this.$i18n.locale === 'en') {
        const option = {
          backgroundColor: '#394056',
          title: {
            top: 20,
            text: 'Wave curve',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#F1F1F3'
            },
            left: '2%'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B'
              }
            }
          },
          legend: {
            top: 20,
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: ['Waveform'],
            right: '50%',
            textStyle: {
              fontSize: 12,
              color: '#F1F1F3'
            }
          },
          grid: {
            top: 100,
            left: '4%',
            right: '4%',
            bottom: '4%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }],
          yAxis: [{
            type: 'value',
            name: '(Amplitude)',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }],
          series: [{
            name: 'Waveform',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12

              }
            }
          }]
        }
        option.xAxis.data = this.xAudioData
        option.yAxis.data = data
        option.series[0].data = data
        this.chart.setOption(option)
      }
    },
    myChart1(data) {
      this.chart = echarts.init(document.getElementById('myChart1'))
      if (this.$i18n.locale === 'cn') {
        const option = {
          backgroundColor: '#F2F6FC',
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            right: 60,
            feature: {
            // dataZoom: {
            //   yAxisIndex: 'none'
            // },
            // restore: {},
              saveAsImage: { title: '保存为图片' }
            }
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
            splitLine: {// 去除网格线
              show: false
            },
            type: 'category',
            data: [],
            min: this.startX,
            max: this.endX
          },
          yAxis: {
            axisLabel: {
              formatter: function() {
                return ''
              }
            },
            splitLine: {// 去除网格线
              show: false
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
        this.chart.setOption(option)
      } else if (this.$i18n.locale === 'en') {
        const option = {
          backgroundColor: '#F2F6FC',
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            right: 60,
            feature: {
            // dataZoom: {
            //   yAxisIndex: 'none'
            // },
            // restore: {},
              saveAsImage: { title: 'Save as picture' }
            }
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
            splitLine: {// 去除网格线
              show: false
            },
            type: 'category',
            data: [],
            min: this.startX,
            max: this.endX
          },
          yAxis: {
            axisLabel: {
              formatter: function() {
                return ''
              }
            },
            splitLine: {// 去除网格线
              show: false
            },
            type: 'value'
          },
          series: [{
            name: 'Strength',
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
        this.chart.setOption(option)
      }
    },
    initChart() {
      var myDate = new Date()
      var now = myDate.toLocaleTimeString()// 时间
      var arr = this.yData.indexOf(now)
      if (this.Data1.length > 0) {
        if (arr === -1) {
          this.yData.push(now)
        }
      }
      if (this.yData.length > this.yMax) {
        this.yData.splice(0, this.yData.length - this.yMax)
      }
      var key = 0
      var mx = this.Data1[0]
      this.Data1.forEach((item, index) => {
        for (let i = index * 5; i < index * 5 + 4; i++) {
          if (this.Data1[i] > this.Data1[0]) {
            mx = this.Data1[i]
            key = i
          }
          if (mx > this.baseStandInfo.alarmThreshold) {
            this.twoData.push([key, now, mx])
          }
        }
        // const x = Math.max(this.Data1[index * 5], this.Data1[index * 5 + 1], this.Data1[index * 5 + 2], this.Data1[index * 5 + 3], this.Data1[index * 5 + 4])
      })
      for (var i = 0; i < this.twoData.length; i++) {
        for (var j = i + 1; j < this.twoData.length; j++) {
          if (this.twoData[i][0] === this.twoData[j][0] && this.twoData[i][1] === this.twoData[j][1] && this.twoData[i][2] === this.twoData[j][2]) {
            this.twoData.splice(j, 1)
            j--
          }
        }
      }
      if (this.twoData.length > 2500) {
        this.twoData.splice(0, this.twoData.length - 2500)
      }
      this.chart1 = echarts.init(document.getElementById('vibrateChart'))
      if (this.$i18n.locale === 'cn') {
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
            right: 60,
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
                title: {
                  zoom: '区域缩放',
                  back: '区域缩放还原'
                }
              },
              restore: { title: '还原' },
              saveAsImage: { title: '保存为图片' }
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
                gt: this.baseStandInfo.tdColor1,
                lte: this.baseStandInfo.tdColor2,
                color: '#6495ED'
              }, {
                gt: this.baseStandInfo.tdColor2,
                lte: this.baseStandInfo.tdColor3,
                color: '#0000FF'
              }, {
                gt: this.baseStandInfo.tdColor3,
                lte: this.baseStandInfo.tdColor4,
                color: '#FFD700'
              }, {
                gt: this.baseStandInfo.tdColor4,
                lte: this.baseStandInfo.tdColor5,
                color: '#FFA500'
              }, {
                gt: this.baseStandInfo.tdColor5,
                lte: this.baseStandInfo.tdColor6,
                color: '#FF4500'
              }, {
                gt: this.baseStandInfo.tdColor6,
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

        this.chart1.on('restore', function(params) { // 选取的x轴值
          that.startX = 0
          that.endX = that.Data1.length
        })
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
        this.chart1.setOption(option)
      } else if (this.$i18n.locale === 'en') {
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
            right: 60,
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
                title: {
                  zoom: 'Area zoom',
                  back: 'Area zoom restore'
                }
              },
              restore: { title: 'Restore' },
              saveAsImage: { title: 'Save as picture' }
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
                gt: this.baseStandInfo.tdColor1,
                lte: this.baseStandInfo.tdColor2,
                color: '#6495ED'
              }, {
                gt: this.baseStandInfo.tdColor2,
                lte: this.baseStandInfo.tdColor3,
                color: '#0000FF'
              }, {
                gt: this.baseStandInfo.tdColor3,
                lte: this.baseStandInfo.tdColor4,
                color: '#FFD700'
              }, {
                gt: this.baseStandInfo.tdColor4,
                lte: this.baseStandInfo.tdColor5,
                color: '#FFA500'
              }, {
                gt: this.baseStandInfo.tdColor5,
                lte: this.baseStandInfo.tdColor6,
                color: '#FF4500'
              }, {
                gt: this.baseStandInfo.tdColor6,
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
            name: 'Strength',
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

        this.chart1.on('restore', function(params) { // 选取的x轴值
          that.startX = 0
          that.endX = that.Data1.length
        })
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
        this.chart1.setOption(option)
      }
    },
    createWs1() { // 监听
      if (window.WebSocket) {
        // this.WebSocket1 = new WebSocket1('ws://' + process.env.LINK_API)
        this.websocket1 = new WebSocket('ws://192.168.8.100:9005/')
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
        if (this.$i18n.locale === 'cn') {
          this.$message.error('浏览器不支持WebSocket')
        } else if (this.$i18n.locale === 'en') {
          this.$message.error('The browser does not support WebSocket')
        }
      }
    },
    createWs() { // 二维振动ws
      if (window.WebSocket) {
        // this.websocket = new WebSocket('ws://' + process.env.LIN K_API)
        this.websocket = new WebSocket('ws://192.168.8.100:9005/')

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
        if (this.$i18n.locale === 'cn') {
          this.$message.error('浏览器不支持WebSocket')
        } else if (this.$i18n.locale === 'en') {
          this.$message.error('The browser does not support WebSocket')
        }
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
    },
    updataY() {
      // if (this.yMax === '') {
      //   this.yMax = 20
      // }
      console.log(this.yMax)
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
  font-size: 18px;
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
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
