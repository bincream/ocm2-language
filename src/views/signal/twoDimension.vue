<template>
  <div class="app-container">

    <div class="chart-container">
      <div class="title">
        <span>阀值设置下的二维振动</span>
        <el-input v-model="monitorEdit.col" placeholder="请输入距离" style="width:120px;position:absolute;right:120px" />
        <el-button type="primary" style="position:absolute;right:10px" @click="monitor">开始监听</el-button>
      </div>

      <div id="vibrateChart" style="width: 100%; height: 30%" />

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
      <div id="warnChart" style="width: 100%; height: 25%" />
      <div class="title">单点频谱图
        <el-input v-model="spectrogramEdit.col" placeholder="请输入距离" style="width:120px;position:absolute;right:120px" />
        <el-button type="primary" style="position:absolute;right:10px" @click="spectrogram">开始</el-button>
      </div>
      <div id="myChart" style="width: 100%; height: 30%" />
    </div>

  </div>
</template>

<script>
import { realtimeAudioQuery, vibQuery } from '@/api/signal/squiggle'
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
      xData: [],
      y1Data: [],
      y2Data: [],
      y3Data: [],
      monitorEdit: {},
      chart: null
    }
  },
  created() { },
  mounted() {
    this.initChart()
    this.warnChart()
    this.myChart()
    this.getStandList()
    this.createWs()
    this.getVibQuery()
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
      })
    },

    getWsData() {
      this.xData = []
      this.y1Data = []
      this.y2Data = []
      this.y3Data = []
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
    spectrogram() {
      realtimeAudioQuery(this.spectrogramEdit).then(response => {
        this.data = response.data
        this.createWs()
      })
    },
    initChart() {
      var data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]]

      for (let i = 0; i < data.length; i++) {
        var xData = []
        xData.push([i])
        console.log(xData)
      }
      data = data.map(function(item) {
        return [item[1], item[0], item[2] || '-']
      })
      this.chart = echarts.init(document.getElementById('vibrateChart'))
      const option = {

        tooltip: {
          position: 'top'
        },
        animation: false,
        grid: {
          height: '50%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: xData,
          splitArea: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          data: ['Saturday', 'Friday', 'Thursday',
            'Wednesday', 'Tuesday', 'Monday', 'Sunday', 'Saturday', 'Friday'],
          splitArea: {
            show: true
          }
        },
        visualMap: {
          min: 0,
          max: 10,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%'
        },
        series: [{
          name: 'Punch Card',
          type: 'heatmap',
          data: data,
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }

        }]
      }
      //   option.xAxis[0].data = this.xData
      //   option.series[0].data = this.y1Data
      //   option.series[1].data = this.y2Data
      this.chart.setOption(option)
    },
    warnChart() {
      this.warnchart = echarts.init(document.getElementById('warnChart'))
      const option = {
        title: {
          text: '预警恒警'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['恒定预警', '有序统计量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '恒定预警',
            type: 'line',
            step: 'middle',
            data: [220, 282, 201, 234, 290, 430, 410]
          },
          {
            name: '有序统计量',
            type: 'line',
            step: 'end',
            data: [450, 432, 401, 454, 590, 530, 510]
          }
        ]
      }
      this.warnchart.setOption(option)
    },
    myChart() {
      this.chart = echarts.init(document.getElementById('myChart'))
      const option = {
        backgroundColor: '#F2F6FC',
        title: {
          text: '',
          x: 'center',
          top: '20',
          textStyle: {
            color: 'black',
            fontSize: '18'
          },
          subtextStyle: {
            color: 'black',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              type: 'cross',
              color: '#fff'
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
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          data: ['0', '1', '2']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          data: []
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
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
        ],
        series: [
          {
            name: '强度',
            type: 'bar',
            barMaxWidth: 25,
            itemStyle: {
              normal: {
                color: '#409EFF',
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value
                  }
                }
              }
            },
            data: []
          },

          {
            name: '',
            type: 'bar',
            barMaxWidth: 25,
            itemStyle: {
              normal: {
                color: '#d14a61',
                barBorderRadius: 1,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value
                  }
                }
              }
            },
            data: []
          }, {
            name: '',
            type: 'line',
            stack: 'total',
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              normal: {
                color: '#675bba',
                barBorderRadius: 0,
                label: {
                  show: true,
                  position: 'top',
                  formatter(p) {
                    return p.value + '%'
                  }
                }
              }
            },
            data: []
          }
        ]
      }
      option.xAxis[0].data = this.xData
      option.series[0].data = this.y1Data
      option.series[1].data = this.y2Data
      option.series[2].data = this.y3Data
      this.chart.setOption(option)
    },
    createWs() { // 二维振动ws
      if (window.WebSocket) {
        // this.websocket = new WebSocket('ws://' + process.env.LINK_API)
        this.websocket = new WebSocket('ws://192.168.199.108:9042/')

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
    createWs1() { // 实时监听ws
      if (window.WebSocket) {
        // this.websocket = new WebSocket('ws://' + process.env.LINK_API)
        this.websocket = new WebSocket('ws://192.168.199.108:9041/')

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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.chart-container {
  width: 100%;
  height: calc(300vh - 84px);
  margin-bottom: 150px;
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
