<template>
  <div class="app-container">
    <div class="chart-container">
      <div class="title">
        <span>OTDR</span>
        <!-- <label class="radio-label" style="position:absolute;right:740px">起点:</label> -->
        <span class="radio-label" style="position:absolute;width:150px;right:530px">{{ $t('signal.guangxianchangdu') }}{{ otdrList.FiberLength }}</span>

        <!-- <label class="radio-label" style="position:absolute;right:520px">终点:</label> -->
        <span class="radio-label" style="position:absolute;width:180px;right:330px">{{ $t('signal.zongsunhao') }}{{ otdrList.AllLoss }}db</span>

        <!-- <label class="radio-label" style="position:absolute;right:280px">灵敏度:</label> -->
        <span class="radio-label" style="position:absolute;width:200px;right:120px">{{ $t('signal.zongfanshesunhao') }}{{ otdrList.AllRefLoss }}</span>

        <el-button v-if="websocket == null" type="primary" @click="connect">{{ $t('signal.lianjie') }}</el-button>
        <el-button v-else type="danger" @click="disconnect">{{ $t('signal.duankailianjie') }}</el-button>
      </div>
      <div id="myChart" style="width: 100%; height: 50%" />

      <el-table
        ref="multipleTable"
        :header-cell-style="{background: 'rgb(22, 144, 255)', textAlign: 'center', color: 'white'}"
        :data="list"
        stripe
        :row-style="{textAlign: 'center'}"
        highlight-current-row
        height="500"
      >
        <el-table-column :label="id" prop="id" />
        <el-table-column :label="$t('signal.weizhi')" prop="location" />
        <el-table-column :label="$t('signal.sunhao')" prop="loss" />
        <el-table-column :label="$t('signal.fanshesunhao')" prop="refloss" />
        <el-table-column :label="$t('signal.leijisunhao')" prop="cumloss" />
        <el-table-column :label="$t('signal.shijianleixing')">
          <template slot-scope="scope">
            <span>{{ scope.row.type | status }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// import { list } from '@/api/signal/squiggle'
import { otdrQuery } from '@/api/signal/otdr'
import { baseStandInfo } from '@/api/public'
import echarts from 'echarts'
import checkPermission from '@/utils/permission' // 权限判断函数
import waves from '@/directive/waves' // 水波纹指令
import resize from '@/components/Charts/mixins/resize'
export default {
  name: 'Dashboard',
  filters: {
    status: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '非反射事件'
          case 1:
            return '反射事件'
          case 2:
            return '光纤始端'
          case 3:
            return '光纤末端'
          case 4:
            return '其它事件'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Non-reflective event'
          case 1:
            return 'Reflection event'
          case 2:
            return 'Fiber beginning'
          case 3:
            return 'Fiber end'
          case 4:
            return 'Other events'
          default:
            break
        }
      }
    }
  },
  directives: {
    waves
  },
  mixins: [resize],
  data() {
    return {
      listQuery: {},
      baseStandInfo: {},
      list: [],
      accuracy: {},
      infoCount: {
        noPassCount: 0,
        getPastCount: 0,
        passRate: 0
      },
      xData: [],
      otdrList: {},
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
    this.initChart()
    this.getBaseStandInfo()
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
        if (this.accuracy.standMode === 0) {
          this.$message.error('振动模式下无法查看')
          return false
        }
      } else if (this.$i18n.locale === 'en') {
        if (this.accuracy.standMode === 0) {
          this.$message.error('Cannot view in vibration mode')
          return false
        }
      }
      this.getOtdr()
    },
    disconnect() {
      this.websocket.close()
      this.websocket = null
    },
    getOtdr() {
      otdrQuery().then(response => {
        this.otdr = response.data
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
          that.websocket.send(that.otdr)
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
      this.otdrList = data
      this.yData = data.WaveData
      this.list = data.Events
      this.xData = []
      for (let i = 0; i < data.WaveData.length; i++) {
        this.xData.push(i)
      }
      console.log(this.xData, 'xdata')
      this.initChart()
      console.log(this.yData, 'ydata')
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('myChart'))
      if (this.$i18n.locale === 'cn') {
        const option = {
          backgroundColor: '#F2F6FC',
          title: {
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
            //   axisPointer: {
            //     animation: false
            //   }
          },
          legend: {
            data: ['频谱', '距离'],
            left: 10
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
          axisPointer: {
            link: { xAxisIndex: 'all' }
          },
          grid: {
            left: '5%',
            right: '5%',
            borderWidth: 0,
            top: 80,
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
            data: [],
            type: 'line',
            progressive: 1000,
            animation: false
          }]

        }
        option.xAxis.data = this.xData
        // option.yAxis[0].data = this.yData
        option.series[0].data = this.yData
        console.log(this.yData, 'ydata2')
        this.chart.setOption(option)
      } else if (this.$i18n.locale === 'en') {
        const option = {
          backgroundColor: '#F2F6FC',
          title: {
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
            //   axisPointer: {
            //     animation: false
            //   }
          },
          legend: {
            data: ['Spectrum', 'Distance'],
            left: 10
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
          axisPointer: {
            link: { xAxisIndex: 'all' }
          },
          grid: {
            left: '5%',
            right: '5%',
            borderWidth: 0,
            top: 80,
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
            name: 'Strength',
            type: 'value'
          // max: 1000
          },
          series: [{
            data: [],
            type: 'line',
            progressive: 1000,
            animation: false
          }]

        }
        option.xAxis.data = this.xData
        // option.yAxis[0].data = this.yData
        option.series[0].data = this.yData
        console.log(this.yData, 'ydata2')
        this.chart.setOption(option)
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
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 10px 0 30px;
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
