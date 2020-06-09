<template>
  <div class="app-container">
    <div class="chart-container">
      <div class="title">
        <span>全线时序图</span>
        <el-button v-if="websocket == null" type="primary" @click="connect">连接</el-button>
        <el-button v-else type="danger" @click="disconnect">断开连接</el-button>
      </div>

      <div id="myChart" style="width: 100%; height: 80%" />
    </div>

  </div>
</template>

<script>
// import { list } from '@/api/signal/squiggle'
import { rscQuery } from '@/api/signal/squiggle'
import { baseStandInfo } from '@/api/public'
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
      accuracy: {},
      infoCount: {
        noPassCount: 0,
        getPastCount: 0,
        passRate: 0
      },
      xData: [],
      yData: [],
      y1Data: [],
      y2Data: [],
      y3Data: [],
      chart: null,
      websocket: null,
      platformList: [],
      categoryList: [],
      trainJobList: [],
      carrierList: []
    }
  },
  created() { },
  mounted() {
    this.getBaseStandInfo()
    this.initChart()
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.getRsc()
  //   })
  // },

  beforeRouteLeave(to, from, next) {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
    next()
  },
  methods: {
    checkPermission,
    getBaseStandInfo() {
      baseStandInfo().then(response => {
        this.accuracy = response.data
      })
    },
    connect() {
      this.getRsc()
    },
    disconnect() {
      this.websocket.close()
      this.websocket = null
    },
    getRsc() {
      rscQuery().then(response => {
        this.rsc = response.data
        this.createWs()
      })
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
          that.websocket.send(that.rsc)
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
    getWsData(data) {
      this.yData = data
      this.xData = []
      for (let i = 0; i < data.length; i++) {
        this.xData.push(i * this.accuracy.precisions)
      }
      this.initChart()
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('myChart'))
      const option = {
        backgroundColor: '#F2F6FC',
        tooltip: {
          trigger: 'axis'
        },
        title: {
          left: 'center'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     animation: false
        //   }
        // },
        legend: {
          data: ['频谱', '距离'],
          left: 10
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

        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          name: '强度',
          type: 'value'
          // max: 1000
        },
        series: [{

          name: '频谱',
          data: [],
          type: 'line',
          progressive: 1000,
          animation: false
        }]

      }
      option.xAxis.data = this.xData
      // option.yAxis[0].data = this.yData
      option.series[0].data = this.yData
      this.chart.setOption(option)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.chart-container {
  width: 100%;
  height: calc(100vh - 84px);
  margin-bottom: 150px;
}
.title {
  height: 40px;
  position: relative;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size:22px;
  color:rgba(0,0,0,1);
  line-height:42px;
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
