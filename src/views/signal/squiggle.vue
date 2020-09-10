<template>
  <div class="app-container">
    <div class="chart-container">
      <div class="title">
        <span>{{ $t('signal.quanxianguangqiangtu') }}</span>
        <span class="radio-label" style="width:160px;position:absolute;right:330px">{{ $t('signal.Yzhoufanwei:') }}</span>
        <el-input v-model="yMin" type="number" :placeholder="$t('signal.Yzhouzuixiaozhi')" style="width:100px;position:absolute;right:280px" @input="updata" />
        <span style="position:absolute;right:260px">~</span>
        <el-input v-model="yMax" type="number" :placeholder="$t('signal.Yzhouzuidazhi')" style="width:100px;position:absolute;right:150px" @input="updata" />
        <span class="radio-label" style="width:160px;position:absolute;right:650px">{{ $t('signal.Xzhoufanwei:') }}</span>
        <el-input v-model="xMin" type="number" :placeholder="$t('signal.Xzhouzuixiaozhi')" style="width:100px;position:absolute;right:600px" @input="updata" />
        <span style="position:absolute;right:580px">~</span>
        <el-input v-model="xMax" type="number" :placeholder="$t('signal.Xzhouzuidazhi')" style="width:100px;position:absolute;right:470px" @input="updata" />
        <!-- <el-button style="position:absolute;right:110px" type="primary">{{ $t('xiugai') }}</el-button> -->
        <el-button v-if="websocket == null" type="primary" @click="connect">{{ $t('signal.lianjie') }}</el-button>
        <el-button v-else type="danger" @click="disconnect">{{ $t('signal.duankailianjie') }}</el-button>
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
      yMax: null,
      yMin: null,
      xMax: null,
      xMin: null,
      carrierList: []
    }
  },
  created() { },
  mounted() {
    this.getBaseStandInfo()
    this.initChart()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getBaseStandInfo()
    })
  },

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
      if (this.$i18n.locale === 'cn') {
        if (this.accuracy.standMode === 1) {
          this.$message.error('性能模式下无法查看')
          return false
        }
        this.getRsc()
      } else if (this.$i18n.locale === 'en') {
        if (this.accuracy.standMode === 1) {
          this.$message.error('Cannot view in performance mode')
          return false
        }
        this.getRsc()
      }
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
        this.websocket = new WebSocket('ws://192.168.8.131:9005/')

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
        if (this.$i18n.locale === 'cn') {
          this.$message.error('浏览器不支持WebSocket')
        } else if (this.$i18n.locale === 'en') {
          this.$message.error('The browser does not support WebSocket')
        }
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
      if (this.$i18n.locale === 'cn') {
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
              saveAsImage: {
                title: '保存为图片'
              }
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
            data: [],
            max: this.xMax,
            min: this.xMin
          },
          yAxis: {
            name: '强度',
            type: 'value',
            max: this.yMax,
            min: this.yMin
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
      } else if (this.$i18n.locale === 'en') {
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
              saveAsImage: {
                title: 'Save as picture'
              }
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
            data: [],
            max: this.xMax,
            min: this.xMin
          },
          yAxis: {
            name: 'Strength',
            type: 'value',
            max: this.yMax,
            min: this.yMin
          },
          series: [{
            name: 'Spectrum',
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
    },
    updata() {
      if (this.yMax === '') {
        this.yMax = null
      }
      if (this.yMin === '') {
        this.yMin = null
      }
      if (this.xMax === '') {
        this.xMax = null
      }
      if (this.xMin === '') {
        this.xMin = null
      }
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
.radio-label {
  font-size: 18px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
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
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
