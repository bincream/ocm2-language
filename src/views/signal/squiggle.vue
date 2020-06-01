<template>
  <div class="app-container">
    <div class="chart-container">
      <div class="title">全线时序图</div>
      <div id="myChart" style="width: 100%; height: 80%" />
    </div>

  </div>
</template>

<script>
// import { list } from '@/api/signal/squiggle'
import { rscQuery } from '@/api/signal/squiggle'
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
      platformList: [],
      categoryList: [],
      trainJobList: [],
      carrierList: []
    }
  },
  created() { },
  mounted() {
    this.initChart()
    this.getData()
  //   this.getRsc()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getRsc()
    })
  },

  beforeRouteLeave(to, from, next) {
    // this.destroyedWs()
    this.websocket.close()
    console.log(1)
    this.websocket = null
    next()
  },
  // beforeDestroy() {
  //   this.destroyedWs()
  //   if (!this.chart) {
  //     return
  //   }
  //   this.chart.dispose()
  //   this.chart = null
  // },
  methods: {
    checkPermission,
    getRsc() {
      rscQuery().then(response => {
        this.rsc = response.data
        this.createWs()
      })
    },
    getData() {
      // this.xData = []
      // this.y1Data = []
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
        this.xData.push(i)
      }
      console.log(this.xData, 'xdata')
      this.initChart()
      console.log(this.yData, 'ydata')
    },
    destroyedWs() {

    },
    initChart() {
      this.chart = echarts.init(document.getElementById('myChart'))
      const option = {
        backgroundColor: '#F2F6FC',
        title: {

          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
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
        axisPointer: {
          link: { xAxisIndex: 'all' }
        },
        // dataZoom: [
        //   {
        //     show: true,
        //     realtime: true,
        //     start: 30,
        //     end: 70,
        //     xAxisIndex: [0, 1]
        //   },
        //   {
        //     type: 'inside',
        //     realtime: true,
        //     start: 30,
        //     end: 70,
        //     xAxisIndex: [0, 1]
        //   }
        // ],
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
          type: 'line'
        }],
        // 缩放
        dataZoom: [
          {
            show: true,
            height: 20,
            xAxisIndex: [0],
            bottom: 30,
            start: 0,
            end: 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
              color: '#675bba'
            },
            textStyle: {
              color: '#fff'
            },
            borderColor: '#90979c'
          },
          {
            type: 'inside',
            show: true,
            height: 15,
            start: 1,
            end: 35
          }
        ]
      }
      option.xAxis.data = this.xData
      // option.yAxis[0].data = this.yData
      option.series[0].data = this.yData
      console.log(this.yData, 'ydata2')

      this.chart.setOption(option, true)
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
