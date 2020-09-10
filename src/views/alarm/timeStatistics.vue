<template>
  <div class="lineChartArea">
    <div class="top">
      <el-select
        v-model="listQuery.type"
        style="width: 200px;margin-left: 10px;"
        class="filter-item"
        :placeholder="$t('alarmInfo.qingxuanzeriqileixing')"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="listQuery.ymd"
        style="width: 200px;margin-left: 10px;"
        class="filter-item"
        type="date"
        :placeholder="$t('alarmInfo.xuanzeriqi')"
        value-format="yyyy-MM-dd"
      />
      <el-button
        v-waves
        icon="el-icon-search"
        style="margin-left: 10px;"
        type="primary"
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
import { getAllList } from '@/api/alarm/time'
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
      countList: [],
      autoResize: true,
      listQuery: {
        baseStandId: undefined,
        type: undefined,
        ymd: ''
      },
      standList: [],
      options: [{ value: 1, label: 'Month' }, { value: 2, label: 'Day' }, { value: 3, label: 'Hour' }],
      xData: [],
      max: '',
      maxIndex: '',
      min: '',
      minIndex: '',
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
        this.standList = response.data
        this.$nextTick(() => {
          this.listQuery.baseStandId = this.standList[0].id
          this.listQuery.type = 1
        })
        this.$set(this.listQuery, 'ymd', new Date().toLocaleDateString().replace(/\//g, '-'))

        this.getList()
      })
    },
    getList() {
      this.xData = []
      this.yData = []
      const monthData = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st']
      const dayData = ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
      getAllList(this.listQuery).then(response => {
        // x轴数据，y轴数据，最大值，最小值，最大值index,最小值index
        if (this.$i18n.locale === 'cn') {
          if (response.data.length > 0) {
            let time = ''
            if (this.listQuery.type === 1) {
              time = '月'
            } else if (this.listQuery.type === 2) {
              time = '日'
            } else {
              time = '时'
            }
            response.data.forEach((item, index) => {
              this.xData.push(index + 1 + time)
            })
            this.yData = response.data
            this.initChart()
          } else {
            this.$message.error('该搜索条件下没有报警信息')
          }
        } else if (this.$i18n.locale === 'en') {
          if (response.data.length > 0) {
            if (this.listQuery.type === 1) {
              this.xData = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
            } else if (this.listQuery.type === 2) {
              response.data.forEach((item, index) => {
                this.xData.push(monthData[index])
              })
            } else {
              response.data.forEach((item, index) => {
                this.xData.push(dayData[index])
              })
            }
            this.yData = response.data
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
            text: '报警情况综合统计'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top: '5%',
            data: ['报警合计']
          },
          toolbox: {
            right: 120,
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
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '报警合计',
              type: 'bar',
              data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' }
                ]
              }
            }
          // {
          //   name: '降水量',
          //   type: 'bar',
          //   data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          //   markPoint: {
          //     data: [
          //       { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
          //       { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
          //     ]
          //   }
          // }
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
            text: 'Comprehensive statistics of alarm conditions'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top: '5%',
            data: ['Total Alarm']
          },
          toolbox: {
            right: 120,
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
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'Total Alarm',
              type: 'bar',
              data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
              markPoint: {
                data: [
                  { type: 'max', name: 'Maximum' },
                  { type: 'min', name: 'Minimum' }
                ]
              }
            }
          // {
          //   name: '降水量',
          //   type: 'bar',
          //   data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          //   markPoint: {
          //     data: [
          //       { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
          //       { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
          //     ]
          //   }
          // }
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
