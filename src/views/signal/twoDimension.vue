<template>
  <div class="app-container">

    <div class="chart-container">
      <div class="title">
        <span>阀值设置下的二维振动</span>
        <el-input v-model="monitorEdit.col" placeholder="请输入距离" style="width:120px;position:absolute;right:120px" />
        <el-button type="primary" style="position:absolute;right:10px" @click="monitor">开始监听</el-button>
      </div>
      <div id="myChart" style="width:100%;height:30%" />
      <div id="vibrateChart" style="width:100%;height:80%" />
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
import { standList } from '@/api/public'
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

      chart: null
    }
  },
  created() { },
  mounted() {
    this.initChart()
    this.mychart()
    // this.warnChart()
    this.getStandList()
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
  },
  methods: {
    checkPermission,
    getStandList() {
      standList().then(response => {
        this.standList = response.data
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
        this.xData.push(i)
      }

      this.initChart()
      this.mychart(data)
    },
    getWsData1(data) {
    },
    // 提交数据
    submit() {

    },
    // 监听
    monitor() {
      realtimeAudioQuery(this.monitorEdit).then(response => {
        this.data = response.data
        this.createWs1()
      })
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
      this.yData.push(now)
      if (this.yData.length > 21) {
        this.yData.shift()
      }
      this.Data1.forEach((item, index) => {
        this.twoData.push([index, now, item])
      })
      // this.twoData.forEach((item, index) => {
      //   if (index < this.xData.length) {
      //     this.twoData.splice(item, 1)
      //   }
      // })

      console.log(this.twoData, '1')

      this.chart = echarts.init(document.getElementById('vibrateChart'))
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
        visualMap: {
          min: 0,
          max: 1000,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '5%',
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
        },
        series: [{
          name: 'Gaussian',
          type: 'heatmap',
          data: [],
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
      this.chart.setOption(option)
    },
    createWs1() { // 二维振动ws
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
