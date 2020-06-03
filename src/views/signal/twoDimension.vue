<template>
  <div class="app-container">

    <div class="chart-container">
      <div class="title">
        <span>阀值设置下的二维振动</span>
        <el-input v-model="monitorEdit.col" placeholder="请输入距离" style="width:120px;position:absolute;right:120px" />
        <el-button v-if="audioStatus == 0" type="primary" style="position:absolute;right:10px" @click="monitorStart">开始监听</el-button>
        <el-button v-else type="primary" style="position:absolute;right:10px" @click="monitorEnd">结束监听</el-button>
        <audio id="aud" />
      </div>
      <div id="myChart" style="width:100%;height:30%" />
      <div id="vibrateChart" style="  height:80%" />
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
      chart1: null
    }
  },
  created() { },
  mounted() {
    this.initChart()
    this.mychart()
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getVibQuery()
    })
  },

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
      this.mychart(data)
    },
    getWsData1(data) {
      var audio = document.getElementById('aud')
      if (window.URL) {
        audio.src = window.URL.createObjectURL(event.data)
      } else {
        audio.src = event
      }
      console.log('解析')
      audio.autoplay = true
      console.log('播放')
    },

    // 提交数据
    submit() {

    },
    // 监听
    monitorStart() {
      if (!this.monitorEdit.col) {
        this.$message.error('请输入距离')
        return false
      }
      realtimeAudioQuery(this.monitorEdit).then(response => {
        this.data = response.data
        this.audioStatus = 1
        this.createWs1()
      })
    },
    monitorEnd() {
      var audio = document.getElementById('aud')
      this.audioStatus = 0
      audio.pause()
    },
    // spectrogram() {
    //   realtimeAudioQuery(this.spectrogramEdit).then(response => {
    //     this.data = response.data
    //     this.createWs()
    //   })
    // },
    mychart(data) {
      this.chart = echarts.init(document.getElementById('myChart'))
      const option = {
        backgroundColor: '#F2F6FC',
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
          // show: false,
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
      if (this.yData.length > 100) {
        this.yData.shift()
      }
      console.log(this.yData)

      this.Data1.forEach((item, index) => {
        if (item > 50) {
          this.twoData.push([index, now, item])
        }
      })
      if (this.twoData.length > 50000) {
        this.twoData.splice(0, 2500)
      }
      // this.twoData.forEach((item, index) => {
      //   if (index < this.xData.length) {
      //     this.twoData.splice(item, 1)
      //   }
      // })

      console.log(this.twoData, '1')
      console.log(this.xData)

      this.chart1 = echarts.init(document.getElementById('vibrateChart'))
      const option = {
        tooltip: {},
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
        // 缩放
        // dataZoom: [
        //   {
        //     rangeMode: ['value'],
        //     show: true,
        //     height: 20,
        //     xAxisIndex: [0],
        //     bottom: 80,
        //     startValue: this.dataZoom_start,
        //     endValue: this.dataZoom_end,
        //     handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        //     handleSize: '110%',
        //     handleStyle: {
        //       color: '#675bba'
        //     },
        //     textStyle: {
        //       color: '#fff'
        //     },
        //     borderColor: '#90979c'
        //   },

        //   {
        //     type: 'inside',
        //     show: true,
        //     height: 15,
        //     start: 1,
        //     end: 35
        //   }
        // ],
        // dataZoom: {
        //   show: true,
        //   yAxisIndex: false,
        //   title: {
        //     zoom: '区域选择',
        //     back: '后退'
        //   }, // 三角形图标: // 空图标:
        //   icon: {
        //     back: ''
        //   },
        //   minPoints: 20
        // },
        visualMap: {
          type: 'piecewise',
          // min: 0,
          // max: 2000,
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
          name: '距离:强度',
          type: 'heatmap',
          // type: 'scatter',
          data: [],
          largeThreshold: 200, // 点的大小
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
        // this.websocket = new WebSocket('ws://' + process.env.LINK_API)
        this.websocket = new WebSocket('ws://192.168.199.108:9005/')

        // 当有消息过来的时候触发
        const that = this
        this.websocket.onmessage = function(event) {
          // const data = JSON.parse(event.data)
          that.getWsData1(event.data)
        }

        // 连接关闭的时候触发
        this.websocket.onclose = function(event) {
          console.log('断开连接')
        }

        // 连接打开的时候触发
        this.websocket.onopen = function(event) {
          that.websocket.send(that.data)
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
  margin-top: 80px
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
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
