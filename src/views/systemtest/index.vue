<template>
  <div class="app-container">
    <!--新增编辑页面 -->
    <div class="content">
      <el-form>
        <div class="basic">
          <div class="title">设备状态</div>
          <table class="table">
            <tr>
              <td class="width5">
                <svg-icon v-if="restEdit.DeviceStatus_Power == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">电源
              </td>
              <td class="width5">
                <svg-icon v-if="restEdit.DeviceStatus_Net == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">网络通信
              </td>
              <td class="width5">
                <svg-icon v-if="restEdit.DeviceStatus_AcqCard == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">采集卡
              </td>
              <td class="width5">
                <svg-icon v-if="restEdit.DeviceStatus_Alarm == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">报警状态
              </td>
              <td class="width5">
                <svg-icon v-if="restEdit.DeviceStatus_OSrc == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">光源
              </td>
              <td class="width5">
                <svg-icon v-if="restEdit.DeviceStatus_OSwitch == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">光开关
              </td>
            </tr>
          </table>
        </div>
      </el-form>
    </div>
    <div style="background:blue;height:2px" />
    <div class="content">
      <el-form
        ref="parameterEdit"
        :v-model="parameterEdit"
      >
        <div class="basic">
          <div class="title">
            <span>设备参数</span>
            <el-button
              v-show="ope4Status == 'update4'"
              type="primary"
              style="position:absolute;right:100px"
              @click="updateData4"
            >确认</el-button>
            <el-button
              v-if="checkPermission(['systemtest/deviceParamSetting'])"
              v-show="ope4Status == 'info4'"
              style="position:absolute;right:100px"
              type="warning"
              @click="ope4Status = 'update4'"
            >编辑</el-button>
            <el-button v-show="ope4Status == 'update4'" style="position:absolute;right:0px" @click="ope4Status = 'info4'">取消</el-button>
            <el-button
              v-show="ope4Status == 'info4'"
              type="primary"
              size="small"
              @click="test"
            >全线自测</el-button>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">光源电压：</td>
              <td class="width9">
                <span>{{ info.DeviceParam_OSrcVoltage }}V</span>
              </td>
              <td class="blackMark">机箱温度：</td>
              <td class="width9">
                <span>{{ info.DeviceParam_Temperature }}℃</span>
              </td>
              <td class="blackMark">光功率：</td>
              <td class="width9">
                <span>{{ info.DeviceParam_OSrcPower }}mW</span>
              </td>
              <td class="blackMark">通道数：</td>
              <td class="width9">
                <span>{{ info.trainReminderTime }}</span>
              </td>
            </tr>
            <tr>
              <td class="blackMark">电路主控板电流1：</td>
              <td class="width9">
                <el-input
                  v-show="ope4Status == 'update4'"
                  v-model="parameterEdit.DeviceParam_Current1"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope4Status == 'info4'">{{ info.DeviceParam_Current1 }}</span>
                <span>mA</span>
              </td>
              <td class="blackMark">电路主控板电流2：</td>
              <td class="width9">
                <el-input
                  v-show="ope4Status == 'update4'"
                  v-model="parameterEdit.DeviceParam_Current2"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope4Status == 'info4'">{{ info.DeviceParam_Current2 }}</span>
                <span>mA</span>
              </td>
              <td class="blackMark">电路主控板电流3：</td>
              <td class="width9">
                <el-input
                  v-show="ope4Status == 'update4'"
                  v-model="parameterEdit.DeviceParam_Current3"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope4Status == 'info4'">{{ info.DeviceParam_Current3 }}</span>
                <span>mA</span>
              </td>
              <td class="blackMark">电路主控板电流4：</td>
              <td class="width9">
                <el-input
                  v-show="ope4Status == 'update4'"
                  v-model="parameterEdit.DeviceParam_Current4"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope4Status == 'info4'">{{ info.DeviceParam_Current4 }}</span>
                <span>mA</span>
              </td>
            </tr>
            <tr>
              <td class="blackMark">衰减器1：</td>
              <td class="width9">
                <el-input
                  v-show="ope4Status == 'update4'"
                  v-model="parameterEdit.DeviceParam_Attenuator1"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope4Status == 'info4'">{{ info.DeviceParam_Attenuator1 }}</span>
                <span>dB</span>
              </td>
              <td class="blackMark">衰减器2：</td>
              <td class="width9">
                <el-input
                  v-show="ope4Status == 'update4'"
                  v-model="parameterEdit.DeviceParam_Attenuator2"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope4Status == 'info4'">{{ info.DeviceParam_Attenuator2 }}</span>
                <span>dB</span>
              </td>
              <td class="blackMark">衰减器3：</td>
              <td class="width9">
                <el-input
                  v-show="ope4Status == 'update4'"
                  v-model="parameterEdit.DeviceParam_Attenuator3"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope4Status == 'info4'">{{ info.DeviceParam_Attenuator3 }}</span>
                <span>dB</span>
              </td>
              <td class="blackMark">衰减器4：</td>
              <td class="width9">
                <el-input
                  v-show="ope4Status == 'update4'"
                  v-model="parameterEdit.DeviceParam_Attenuator4"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope4Status == 'info4'">{{ info.DeviceParam_Attenuator4 }}</span>
                <span>dB</span>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div style="text-align:right;" />
    </div>
    <div style="background:blue;height:2px" />
    <div class="content">
      <el-form
        ref="configurationEdit"
        :model="configurationEdit"
      >
        <div class="basic">
          <div class="title">
            <span>系统参数</span>
            <el-button
              v-show="ope2Status == 'update2'"
              type="primary"
              style="position:absolute;right:100px"
              @click="updateData2"
            >确认</el-button>
            <el-button
              v-if="checkPermission(['systemtest/deviceParamSetting'])"
              v-show="ope2Status == 'info2'"
              style="position:absolute;right:150px"
              type="warning"
              @click="ope2Status = 'update2'"
            >编辑</el-button>
            <el-button v-show="ope2Status == 'update2'" style="position:absolute;right:0px" @click="ope2Status = 'info2'">取消</el-button>
            <el-button v-show="ope2Status == 'info2'" style="position:absolute;right:0px" type="primary" @click="reset">恢复出厂设置</el-button>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">
                <span style="color: red">*</span>
                空间分辨率：
              </td>
              <td class="width9">
                <el-input
                  v-show="ope2Status == 'update2'"
                  v-model="configurationEdit.SysConfig_Resolution"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope2Status == 'info2'">{{ info.SysConfig_Resolution }}</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                时间采样率：
              </td>
              <td class="width9">
                <el-input
                  v-show="ope2Status == 'update2'"
                  v-model="configurationEdit.SysConfig_SampleRate"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope2Status == 'info2'">{{ info.SysConfig_SampleRate }}</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                平均次数：
              </td>
              <td class="width9">
                <el-input
                  v-show="ope2Status == 'update2'"
                  v-model="configurationEdit.SysConfig_MeanCount"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope2Status == 'info2'">{{ info.SysConfig_MeanCount }}</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                工作模式：
              </td>
              <td class="width9">
                <el-select
                  v-show="ope2Status == 'update2'"
                  v-model="configurationEdit.SysConfig_WorkMode"
                  size="small"
                  style="width: 150px;"
                  placeholder="请选择光纤长度"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in modeList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.value"
                  />
                </el-select>
                <span v-show="ope2Status == 'info2'">{{ info.SysConfig_WorkMode | standMode }}</span>
              </td>
              <td />
            </tr>
          </table>
        </div>
      </el-form>
    </div>

    <div class="content">
      <el-form
        ref="deviceEdit"
        :model="deviceEdit"
      >
        <div class="basic">
          <div class="title">
            <span>光器件参数设置</span>
            <el-button
              v-show="ope1Status == 'update1'"
              type="primary"
              style="position:absolute;right:100px"
              @click="updateData1('deviceEdit')"
            >确认</el-button>
            <el-button
              v-if="checkPermission(['systemtest/deviceParamSetting'])"
              v-show="ope1Status == 'info1'"
              style="position:absolute;right:0px"
              type="warning"
              @click="ope1Status = 'update1'"
            >编辑</el-button>
            <el-button v-show="ope1Status == 'update1'" style="position:absolute;right:0px" @click="ope1Status = 'info1'">取消</el-button>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">
                <span style="color: red">*</span>
                EDFA：
              </td>
              <td class="width9">
                <el-input
                  v-show="ope1Status == 'update1'"
                  v-model="deviceEdit.OptDevice_EDFACurrent"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope1Status == 'info1'">{{ info.OptDevice_EDFACurrent }}</span>
                <span>mA</span>
              </td>
              <td class="blackMark" />
              <td class="width9" />
              <td />
            </tr>
            <tr>
              <td class="blackMark">
                <span style="color: red">*</span>
                RAMAN：
              </td>
              <td class="width9">
                <el-input
                  v-show="ope1Status == 'update1'"
                  v-model="deviceEdit.OptDevice_RamanPower"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope1Status == 'info1'">{{ info.OptDevice_RamanPower }}</span>
                <span>dB</span>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
    </div>

    <div class="content">
      <el-form
        ref="vibrationEdit"
        :model="vibrationEdit"
        inline
        status-icon
      >
        <div class="basic">
          <div class="title">
            <span>震动阀值设置</span>
            <el-button
              v-show="ope3Status == 'update3'"
              type="primary"
              style="position:absolute;right:90px"
              @click="updateData3"
            >确认</el-button>
            <el-button
              v-if="checkPermission(['systemtest/deviceParamSetting'])"
              v-show="ope3Status == 'info3'"
              type="warning"
              style="position:absolute;right:0px"
              @click="ope3Status = 'update3'"
            >编辑</el-button>
            <el-button v-show="ope3Status == 'update3'" style="position:absolute;right:0px" @click="ope3Status = 'info3'">取消</el-button>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">
                <span style="color: red">*</span>
                光纤长度：
              </td>
              <td class="width9">
                <el-select
                  v-show="ope3Status == 'update3'"
                  v-model="vibrationEdit.Cable_Length"
                  size="small"
                  style="width: 150px;"
                  placeholder="请选择光纤长度"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in lengthList"
                    :key="item"
                    :value="item"
                    :label="item"
                  />
                </el-select>
                <span v-show="ope3Status == 'info3'">{{ info.Cable_Length }}</span>
              </td>
              <td />
            </tr>
          </table>
        </div>
      </el-form>
    </div>
    <div style="background:blue;height:2px" />

    <div class="title" style="position:relative;margin-top:30px">
      <span>预警恒警信息</span>
      <label class="radio-label" style="position:absolute;right:740px">起点:</label>
      <el-input v-model="warningEdit.origin" size="small" placeholder="请输入距离(米)" type="number" style="position:absolute;width:150px;right:580px" />

      <label class="radio-label" style="position:absolute;right:520px">终点:</label>
      <el-input v-model="warningEdit.destination" size="small" placeholder="请输入距离(米)" type="number" style="position:absolute;width:150px;right:360px" />

      <label class="radio-label" style="position:absolute;right:280px">灵敏度:</label>
      <el-input v-model="warningEdit.sensitivity" size="small" placeholder="请输入数字" type="number" style="position:absolute;width:150px;right:120px" />

      <el-button
        v-if="checkPermission(['systemtest/deviceParamSetting'])"
        type="primary"
        style="position:absolute;right:10px"
        @click="submit"
      >提交数据</el-button>
    </div>
    <div id="warnChart" style="width:100%; height:600px" />

  </div>
</template>

<script>
import { update, deviceParamQuery, deviceParamSetting } from '@/api/systemtest/index'
import { baseStandInfo, baseStandUpdate } from '@/api/public'
import echarts from 'echarts'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'OrgBasicInfo',
  directives: {
    waves
  },
  filters: {
    standMode: function(val) {
      switch (val) {
        case 0:
          return '光纤振动监测模式'
        case 1:
          return '光纤性能检测模式'
        default:
          break
      }
    }
  },
  data() {
    return {
      restEdit: {},
      vibrationEdit: {},
      deviceEdit: {},
      warningEdit: {},
      configurationEdit: {},
      parameterEdit: {},
      info: [],
      xData: [],
      warnData: [],
      websocket: null,
      dialogImgVisible: false,
      dpq: '',
      accuracy: {},
      ope1Status: 'info1',
      ope2Status: 'info2',
      ope3Status: 'info3',
      ope4Status: 'info4',
      lengthList: ['30', '50', '70'],
      modeList: [{ id: 0, value: '光缆振动监测模式' }, { id: 1, value: '光缆性能监测模式' }]
    }
  },
  computed: {
    headers() {
      return {
        'Authorization': 'Bearer ' + this.$store.getters.token
      }
    }
  },
  created() { },
  mounted() {
    this.ope1Status = 'info1'
    this.ope2Status = 'info2'
    this.ope3Status = 'info3'
    this.ope4Status = 'info4'
    this.getBaseStandInfo()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getDpq()
    })
  },
  beforeRouteLeave(to, from, next) {
    this.destroyedWs()
    next()
  },
  // beforeDestroy() {
  //   this.destroyedWs()
  // },
  methods: {
    checkPermission,
    baseStandUpdate() {
      baseStandUpdate({ settingParam: this.settingParam }).then(response => {
      })
    },
    getBaseStandInfo() {
      baseStandInfo().then(response => {
        this.accuracy = response.data
        console.log(this.accuracy)
        this.warnChart()
      })
    },
    getDpq() {
      deviceParamQuery().then(response => {
        this.dpq = response.data
        this.obj = response.data
        this.createWs()
      })
    },
    getDeviceParamSetting() {
      deviceParamSetting({ settingParam: this.settingParam }).then(response => {
        this.deviceParamSetting = response.data
        this.obj = this.deviceParamSetting
        console.log(this.obj)
        this.createWs()
      })
    },
    handleUpdate() {
      this.opeStatus = 'update'
      this.ope1Status = 'update1'
      this.ope2Status = 'update2'
      this.ope3Status = 'update3'
      this.ope4Status = 'update4'
    },

    reset(formName) {
      update(this.restEdit).then((response) => {
        if (response.data) {
          this.$message.success('修改成功!')
        } else {
          this.$message.error('修改失败!')
        }
      })
    },
    submit() {
      var sum1 = this.warningEdit.origin
      var sum2 = this.warningEdit.destination
      var sum3 = this.warningEdit.sensitivity
      if (this.warnData.length > 0) {
        for (let i = sum1; i < this.warnData.length; i++) {
          this.warnData[i] = Number(sum3)
          if (i === Number(sum2)) {
            break
          }
        }
      }
      this.settingParam = JSON.stringify(this.warnData)
      this.getDeviceParamSetting()
    },
    test(formName) {
    },
    updateData1() {
      this.ope1Status = 'info1'
      console.log(this.deviceEdit, '11111')
      this.settingParam = JSON.stringify(this.deviceEdit)
      this.getDeviceParamSetting()
    },
    updateData2() {
      this.ope2Status = 'info2'
      this.settingParam = JSON.stringify(this.configurationEdit)
      console.log(this.settingParam)
      this.getDeviceParamSetting()
    },
    updateData3() {
      this.ope3Status = 'info3'
      this.settingParam = JSON.stringify(this.vibrationEdit)
      console.log(this.settingParam)
      this.getDeviceParamSetting()
    },
    updateData4() {
      this.ope4Status = 'info4'
      this.settingParam = JSON.stringify(this.parameterEdit)
      console.log(this.settingParam)
      this.getDeviceParamSetting()
    },
    createWs() {
      if (window.WebSocket) {
        // this.websocket = new WebSocket('ws://' + process.env.LINK_API)
        this.websocket = new WebSocket('ws://127.0.0.1:9005/')

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
          that.websocket.send(that.obj)
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
    },

    getWsData(data) { // 报警消息数据处理
      this.info = data
      this.warnData = data.Cable_AllLossAlarmThr
      if (data.SysConfig_WorkMode !== null) {
        this.baseStandUpdate()
      }
      this.warnChart()
    },
    warnChart() {
      console.log(this.warnData)
      console.log(this.accuracy)

      for (let i = 0; i < this.warnData.length; i++) {
        this.xData.push(i * Number(this.accuracy.precisions))
        console.log(this.xData)
      }
      this.warnchart = echarts.init(document.getElementById('warnChart'))
      const option = {
        title: {
          text: '预警恒警'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['恒定预警']
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
            data: []
          }
        ]
      }

      option.xAxis.data = this.xData
      option.series[0].data = this.warnData
      this.warnchart.setOption(option)
    }
  }
}
</script>
<style scoped>
.content {
  width: 100%;
  margin-top: 20px;
  background-color: white;
  /* box-shadow: 0.5px 0.5px 2px 2px #c2c5c5b6; */
  padding: 10px;
  border-radius: 10px 10px 10px 10px;
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
.blackMark {
  color: black;
  font-weight: 600;
  width: 8%;
  text-align: right;
}
.svg-icon{
  width: 20px;
  height: 20px;
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
