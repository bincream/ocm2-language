<template>
  <div class="app-container">
    <div class="chart-container">
      <div class="title">全线时序图</div>
      <div id="myChart" style="width: 100%; height: 100%" />
    </div>

  </div>
</template>

<script>
import { list } from '@/api/signal/squiggle'
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

    getData() {
      this.xData = []
      this.y1Data = []
      this.y2Data = []
      this.y3Data = []

      list(this.listQuery).then(response => {
        this.infoCount.noPassCount = response.data.noPassCount
        this.infoCount.getPastCount = response.data.getPastCount
        if (response.data.getPastCount) {
          const total = Number(response.data.noPassCount) + Number(response.data.getPastCount)
          this.infoCount.passRate = (response.data.getPastCount / total * 100)
        } else {
          this.$message.error('当前时间没有数据')
          this.infoCount.passRate = 0
        }

        // 一个月
        let time = ''
        if (this.listQuery.type === 1) {
          time = '日'
        } else if (this.listQuery.type === 2) {
          time = '月'
        }

        response.data.ylist.forEach((item, index) => {
          this.xData.push(index + 1 + time)
          let rate = ''
          if (item === 0) {
            rate = '0%'
          } else {
            const num = (Number(item) + Number(response.data.nlist[index]))
            rate = ((item / num) * 100).toFixed(2)
          }
          this.y3Data.push(rate)
        })

        this.y1Data = response.data.ylist
        this.y2Data = response.data.nlist

        this.initChart()
      })
    },
    initChart() {
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
          data: ['通过数', '未通过数', '通过率']
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
            name: 'report.examReport.passNumber',
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
            name: 'report.examReport.notpassNumber',
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
            name: 'report.examReport.passRate',
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
