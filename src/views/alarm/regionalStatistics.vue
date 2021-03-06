<template>
  <div class="lineChartArea">
    <div class="top">
      <el-date-picker
        v-model="date"
        style="width: 400px;margin-left: 10px;"
        type="datetimerange"
        class="filter-item"
        :start-placeholder="$t('alarmInfo.kaishishijian')"
        range-separator="~"
        :end-placeholder="$t('alarmInfo.gaojingshijian')"
        value-format="yyyy-MM-dd HH:mm:ss"
        clearable
      />
      <el-button
        v-waves
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px;"
        @click="getList"
      />
    </div>
    <div id="lineChart" style="height: 600px; width: 90%;margin:10px auto;" />
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getAllList } from '@/api/alarm/regional'
import { standList } from '@/api/public'
import waves from '@/directive/waves' // 水波纹指令
export default {
  directives: {
    waves
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
      autoResize: true,
      date: [],
      listQuery: {
        baseStandId: null,
        beginTime: '',
        endTime: ''
      },
      standList: [],
      xData: [],
      yData: []
    }
  },
  created() { },
  mounted() {
    this.getBaseStandList()

    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getBaseStandList() {
      standList().then(response => {
        this.listQuery.baseStandId = response.data[0].id
        this.standList = response.data
        this.$nextTick(() => {
          this.listQuery.baseStandId = this.standList[0].id
          this.listQuery.beginTime = this.formatTime2()
          this.listQuery.endTime = this.formatTime()
        })
      })
    },

    formatTime() {
      var now = new Date()
      var yy = now.getFullYear() // 年
      var mm = now.getMonth() + 1 // 月
      var dd = now.getDate() // 日
      var hh = now.getHours() // 时
      var ii = now.getMinutes() // 分
      var ss = now.getSeconds() // 秒
      var time = yy + '-'
      if (mm < 10) time += '0'
      time += mm + '-'
      if (dd < 10) time += '0'
      time += dd + ' '
      if (hh < 10) time += '0'
      time += hh + ':'
      if (ii < 10) time += '0'
      time += ii + ':'
      if (ss < 10) time += '0'
      time += ss
      return time
    },

    formatTime2() {
      var now = new Date()
      var yy = now.getFullYear() // 年
      var mm = now.getMonth() + 1 // 月
      var dd = parseInt(now.getDate() - 1) // 日
      var hh = now.getHours() // 时
      var ii = now.getMinutes() // 分
      var ss = now.getSeconds() // 秒
      var time = yy + '-'
      if (mm < 10) time += '0'
      time += mm + '-'
      if (dd < 10) time += '0'
      time += dd + ' '
      if (hh < 10) time += '0'
      time += hh + ':'
      if (ii < 10) time += '0'
      time += ii + ':'
      if (ss < 10) time += '0'
      time += ss
      return time
    },

    getList() {
      if (this.date.length > 0) {
        this.listQuery.beginTime = this.date[0]
        this.listQuery.endTime = this.date[1]
      }
      this.xData = []
      this.yData = []
      getAllList(this.listQuery).then(response => {
        if (this.$i18n.locale === 'cn') {
          if (response.data && response.data.length > 0) {
            response.data.forEach(item => {
              this.xData.push(item.distance)
              this.yData.push(item.count)
            })
            this.xData.push(50000)
            this.yData.push(0)
            this.initChart()
          } else {
            this.$message.error('该搜索条件下没有报警信息')
          }
        } else if (this.$i18n.locale === 'en') {
          if (response.data && response.data.length > 0) {
            response.data.forEach(item => {
              this.xData.push(item.distance)
              this.yData.push(item.count)
            })
            this.xData.push(50000)
            this.yData.push(0)
            this.initChart()
          } else {
            this.$message.error('There is no alarm information under this search condition')
          }
        }
      })
    },
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    initChart() {
      if (this.$i18n.locale === 'cn') {
        const option = {
          title: {
            top: '5%',
            text: '区域报警分析图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            top: '5%',
            data: ['报警次数']
          },
          toolbox: {
            right: 60,
            show: true,
            feature: {
              dataView: { show: true, readOnly: false, title: '数据视图', lang: ['数据视图', '关闭', '刷新'] },
              magicType: {
                show: true,
                type: ['line', 'bar'],
                title: {
                  line: '切换为折线图',
                  bar: '切换为柱状图'
                }
              },
              restore: { show: true, title: '还原' },
              saveAsImage: { show: true, title: '保存为图片' }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '报警次数',
              type: 'line',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              areaStyle: { normal: {}},
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        }
        this.chart = echarts.init(document.getElementById('lineChart'))
        option.xAxis[0].data = this.xData
        option.series[0].data = this.yData
        this.chart.setOption(option, true)
      } else if (this.$i18n.locale === 'en') {
        const option = {
          title: {
            top: '5%',
            text: 'Regional alarm analysis chart'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            top: '5%',
            data: ['Number of alarms']
          },
          toolbox: {
            right: 60,
            show: true,
            feature: {
              dataView: { show: true, readOnly: false, title: 'Data view', lang: ['Data view', 'Close', 'Refresh'] },
              magicType: {
                show: true,
                type: ['line', 'bar'],
                title: {
                  line: 'Switch to line chart',
                  bar: 'Switch to bar chart'
                }
              },
              restore: { show: true, title: 'Restore' },
              saveAsImage: { show: true, title: 'Save as picture' }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['Mon', 'Tue', 'Wed', 'Turs', 'Fri', 'Sat', 'Sun']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '报警次数',
              type: 'line',
              stack: 'Total',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              areaStyle: { normal: {}},
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        }
        this.chart = echarts.init(document.getElementById('lineChart'))
        option.xAxis[0].data = this.xData
        option.series[0].data = this.yData
        this.chart.setOption(option, true)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.lineChartArea {
  background-color: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  margin-bottom: 22px;
  margin-top: 90px;
  .top {
    display: flex;
    align-items: center;
    padding: 15px 20px 0 20px;
  }
}
</style>
