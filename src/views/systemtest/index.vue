<template>
  <div v-loading="loading" class="app-container">
    <!--新增编辑页面 -->
    <div class="content">
      <el-form>
        <div class="basic">
          <div class="title">
            <span>{{ $t('systemtest.shebeizhuangtai') }}</span>
            <el-button
              type="primary"
              size="small"
              @click="connect"
            >{{ $t('systemtest.gengxinzhuangtai') }}</el-button>
          </div>
          <table class="table">
            <tr>
              <td class="width5">
                <svg-icon v-if="info.DeviceStatus_Power == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">{{ $t('systemtest.dianyuan') }}
              </td>
              <td class="width5">
                <svg-icon v-if="info.DeviceStatus_Net == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">{{ $t('systemtest.wangluotongxin') }}
              </td>
              <td class="width5">
                <svg-icon v-if="info.DeviceStatus_AcqCard == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">{{ $t('systemtest.caijika') }}
              </td>
              <td class="width5">
                <svg-icon v-if="info.DeviceStatus_Alarm == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">{{ $t('systemtest.baojingzhuangtai') }}
              </td>
              <td class="width5">
                <svg-icon v-if="info.DeviceStatus_OSrc == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">{{ $t('systemtest.guangyuan') }}
              </td>
              <td class="width5">
                <svg-icon v-if="info.DeviceStatus_OSwitch == 0" icon-class="open" />
                <svg-icon v-else icon-class="close" />
              </td>
              <td class="width9">{{ $t('systemtest.guangkaiguan') }}
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
      >
        <div class="basic">
          <div class="title">
            <span>{{ $t('systemtest.shebeicanshu') }}</span>
            <el-button
              type="primary"
              size="small"
              @click="connect1"
            >{{ $t('systemtest.gengxincanshu') }}</el-button>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">{{ $t('systemtest.guangyuandianya') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_OSrcVoltage || info.DeviceParam_OSrcVoltage == 0">{{ info.DeviceParam_OSrcVoltage }}V</span>
                <span v-else>null</span>
              </td>
              <td class="blackMark">{{ $t('systemtest.jixiangwendu') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_Temperature || info.DeviceParam_Temperature == 0">{{ info.DeviceParam_Temperature }}℃</span>
                <span v-else>null</span>
              </td>
              <td class="blackMark">{{ $t('systemtest.guanggonglv') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_OSrcPower || info.DeviceParam_OSrcPower == 0">{{ info.DeviceParam_OSrcPower }}mW</span>
                <span v-else>null</span>
              </td>
              <td class="blackMark">{{ $t('systemtest.tongdaoshu') }}</td>
              <td class="width9">
                <span v-if="info.trainReminderTime || info.trainReminderTime == 0">{{ info.trainReminderTime }}</span>
                <span v-else>8</span>
              </td>
            </tr>
            <tr>
              <td class="blackMark">{{ $t('systemtest.dianluzhukongbandianliu1') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_Current1 || info.DeviceParam_Current1 == 0">{{ info.DeviceParam_Current1 }}</span>
                <span v-else>null</span>
                <span>mA</span>
              </td>
              <td class="blackMark">{{ $t('systemtest.dianluzhukongbandianliu2') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_Current2 || info.DeviceParam_Current2 == 0">{{ info.DeviceParam_Current2 }}</span>
                <span v-else>null</span>
                <span>mA</span>
              </td>
              <td class="blackMark">{{ $t('systemtest.dianluzhukongbandianliu3') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_Current3 || info.DeviceParam_Current3 == 0">{{ info.DeviceParam_Current3 }}</span>
                <span v-else>null</span>
                <span>mA</span>
              </td>
              <td class="blackMark">{{ $t('systemtest.dianluzhukongbandianliu4') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_Current4 || info.DeviceParam_Current4 == 0">{{ info.DeviceParam_Current4 }}</span>
                <span v-else>null</span>
                <span>mA</span>
              </td>
            </tr>
            <tr>
              <td class="blackMark">{{ $t('systemtest.shuaijianqi1') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_Attenuator1 || info.DeviceParam_Attenuator1 == 0">{{ info.DeviceParam_Attenuator1 }}</span>
                <span v-else>null</span>
                <span>dB</span>
              </td>
              <td class="blackMark">{{ $t('systemtest.shuaijianqi2') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_Attenuator2 || info.DeviceParam_Attenuator2 == 0">{{ info.DeviceParam_Attenuator2 }}</span>
                <span v-else>null</span>
                <span>dB</span>
              </td>
              <td class="blackMark">{{ $t('systemtest.shuaijianqi3') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_Attenuator3 || info.DeviceParam_Attenuator3 == 0">{{ info.DeviceParam_Attenuator3 }}</span>
                <span v-else>null</span>
                <span>dB</span>
              </td>
              <td class="blackMark">{{ $t('systemtest.shuaijianqi4') }}</td>
              <td class="width9">
                <span v-if="info.DeviceParam_Attenuator4 || info.DeviceParam_Attenuator4 == 0">{{ info.DeviceParam_Attenuator4 }}</span>
                <span v-else>null</span>
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
      >
        <div class="basic">
          <div class="title">
            <span>{{ $t('systemtest.xitongcanshu') }}</span>
            <el-button
              v-show="ope2Status == 'update2'"
              type="primary"
              style="position:absolute;right:170px"
              @click="updateData2"
            >{{ $t('systemtest.queren') }}</el-button>
            <el-button
              v-if="checkPermission(['systemtest/deviceParamSetting'])"
              v-show="ope2Status == 'info2'"
              style="position:absolute;right:150px"
              type="warning"
              @click="ope2Status = 'update2'"
            >{{ $t('systemtest.bianji') }}</el-button>
            <el-button v-show="ope2Status == 'update2'" style="position:absolute;right:90px" @click="ope2Status = 'info2'">{{ $t('quxiao') }}</el-button>
            <el-button
              type="primary"
              size="small"
              @click="connect2"
            >{{ $t('systemtest.gengxincanshu') }}</el-button>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">
                <span style="color: red">*</span>
                {{ $t('systemtest.kongjianfenbianlv') }}
              </td>
              <td class="width9">
                <span v-if="info.SysConfig_Resolution || info.SysConfig_Resolution == 0">{{ info.SysConfig_Resolution }}</span>
                <span v-else>null</span>
                <span>m</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                {{ $t('systemtest.shijiancaiyanglv') }}
              </td>
              <td class="width9">
                <span v-if="info.SysConfig_SampleRate || info.SysConfig_SampleRate == 0">{{ info.SysConfig_SampleRate }}</span>
                <span v-else>null</span>
                <span>Hz</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                {{ $t('systemtest.pingjuncishu') }}
              </td>
              <td class="width9">
                <span v-if="info.SysConfig_MeanCount || info.SysConfig_MeanCount == 0">{{ info.SysConfig_MeanCount }}</span>
                <span v-else>null</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                {{ $t('systemtest.gongzuomoshi') }}
              </td>
              <td class="width9">
                <el-select
                  v-show="ope2Status == 'update2'"
                  v-model="configurationEdit.SysConfig_WorkMode"
                  size="small"
                  style="width: 150px;"
                  :placeholder="$t('systemtest.qingxuanze')"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in modeList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.value"
                  />
                </el-select>
                <span v-show="ope2Status == 'info2'" v-if="info.SysConfig_WorkMode==1 || info.SysConfig_WorkMode==0">{{ info.SysConfig_WorkMode | standMode }}</span>
                <span v-show="ope2Status == 'info2'" v-else>null</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                {{ $t('systemtest.gongzuotongdao') }}
              </td>
              <td class="width9">
                <el-select
                  v-show="ope2Status == 'update2'"
                  v-model="configurationEdit.SysConfig_WorkChannel"
                  size="small"
                  style="width: 150px;"
                  placeholder="$t('systemtest.qingxuanze')"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in workChanneList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.value"
                  />
                </el-select>
                <span v-show="ope2Status == 'info2'" v-if="info.SysConfig_WorkChannel || info.SysConfig_WorkChannel == 0">{{ info.SysConfig_WorkChannel | SysConfig_WorkChannel }}</span>
                <span v-show="ope2Status == 'info2'" v-else>null</span>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
    </div>

    <div class="content">
      <el-form
        ref="deviceEdit"
      >
        <div class="basic">
          <div class="title">
            <span>{{ $t('systemtest.guangqijiancanshushezhi') }}</span>
            <el-button
              type="primary"
              size="small"
              @click="connect3"
            >{{ $t('systemtest.gengxincanshu') }}</el-button>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">
                <span style="color: red">*</span>
                EDFA：
              </td>
              <td class="width9">
                <span v-if="info.OptDevice_EDFACurrent || info.OptDevice_EDFACurrent == 0">{{ info.OptDevice_EDFACurrent }}</span>
                <span v-else>null</span>
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
                <span v-if="info.OptDevice_RamanPower || info.OptDevice_RamanPower == 0">{{ info.OptDevice_RamanPower }}</span>
                <span v-else>null</span>
                <span>dB</span>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
    </div>
    <div style="background:blue;height:2px" />
    <div class="content">
      <el-form
        ref="vibrationEdit"
        :model="vibrationEdit"
        inline
        status-icon
      >
        <div class="basic">
          <div class="title">
            <span>{{ $t('systemtest.guanglancanshu') }}</span>
            <el-button
              v-show="ope3Status == 'update3'"
              type="primary"
              style="position:absolute;right:160px"
              @click="updateData3"
            >{{ $t('systemtest.queren') }}</el-button>
            <el-button
              v-if="checkPermission(['systemtest/deviceParamSetting'])"
              v-show="ope3Status == 'info3'"
              type="warning"
              style="position:absolute;right:110px"
              @click="editUpdateData3"
            >{{ $t('systemtest.bianji') }}</el-button>
            <el-button v-show="ope3Status == 'update3'" style="position:absolute;right:70px" @click="cancelUpdateData3">{{ $t('quxiao') }}</el-button>
            <el-button
              type="primary"
              size="small"
              @click="connect4"
            >{{ $t('systemtest.lianjie') }}</el-button>
          </div>
          <el-table
            :data="tableData"
            border
            style="width: 50%"
          >
            <el-table-column :label="$t('systemtest.tongdaohao')" width="180">
              <template slot-scope="scope">
                <span v-show="scope.row.index !== 'null'">{{ $t('systemtest.tongdao') }}</span>
                <span>{{ scope.row.index }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('systemtest.guangxianchangdu')" width="180">
              <template slot-scope="scope">
                <el-input v-if="ope3Status == 'update3'" v-model="scope.row.length" :placeholder="$t('systemtest.qingshuru')" size="small" type="number" />
                <span v-else>{{ scope.row.length }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('systemtest.guanglanzongshunhaobaojingyuzhi')">
              <template slot-scope="scope">
                <el-input v-if="ope3Status == 'update3'" v-model="scope.row.allLossAlarmThr" :placeholder="$t('systemtest.qingshuru')" size="small" type="number" />
                <span v-else>{{ scope.row.allLossAlarmThr }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
    </div>
    <div class="title" style="position:relative;margin-top:30px">
      <label class="radio-label">{{ $t('systemtest.qidian') }}</label>
      <el-input v-model="warningEdit.origin" size="small" :placeholder="$t('systemtest.qingshuruqidian')" type="number" style="width:200px;" />

      <label class="radio-label">{{ $t('systemtest.zhongdian') }}</label>
      <el-input v-model="warningEdit.destination" size="small" :placeholder="$t('systemtest.qingshuruzhongdian')" type="number" style="width:200px;" />

      <label class="radio-label">{{ $t('systemtest.lingmingdu') }}</label>
      <el-input v-model="warningEdit.sensitivity" size="small" :placeholder="$t('systemtest.qingshurushuzi')" type="number" style="width:200px;" />

      <el-button
        v-if="checkPermission(['systemtest/deviceParamSetting'])"
        type="primary"
        @click="submit"
      >{{ $t('systemtest.tijiaoshuju') }}</el-button>
    </div>
    <div id="warnChart" style="width:100%; height:600px" />

  </div>
</template>

<script>
import { deviceParamQuery, deviceParamSetting } from '@/api/systemtest/index'
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
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '光纤振动监测模式'
          case 1:
            return '光纤性能检测模式'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Optical fiber vibration monitoring mode'
          case 1:
            return 'Optical fiber performance detection mode'
          default:
            break
        }
      }
    },
    SysConfig_WorkChannel: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 1:
            return '通道1'
          case 2:
            return '通道2'
          case 3:
            return '通道3'
          case 4:
            return '通道4'
          case 5:
            return '通道5'
          case 6:
            return '通道6'
          case 7:
            return '通道7'
          case 8:
            return '通道8'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 1:
            return 'Channel1'
          case 2:
            return 'Channel2'
          case 3:
            return 'Channel3'
          case 4:
            return 'Channel4'
          case 5:
            return 'Channel5'
          case 6:
            return 'Channel6'
          case 7:
            return 'Channel7'
          case 8:
            return 'Channel8'
          default:
            break
        }
      }
    }
  },
  data() {
    return {
      restEdit: {},
      tableData: [],
      tableDataOld: [],
      vibrationEdit: {},
      deviceEdit: {},
      warningEdit: {},
      configurationEdit: {},
      parameterEdit: {},
      info: {},
      statusInfo: {},
      configurationInfo: {},
      parameterInfo: {},
      deviceInfo: {},
      xData: [],
      warnData: [],
      websocket: null,
      time: null,
      dialogImgVisible: false,
      loading: false,
      dpq: '',
      accuracy: {},
      warnEdit: {},
      ope1Status: 'info1',
      ope2Status: 'info2',
      ope3Status: 'info3',
      ope4Status: 'info4',
      lengthList: ['30', '50', '70'],
      modeList: [{ id: 0, value: 'Optical fiber vibration monitoring mode' }, { id: 1, value: 'Optical fiber performance detection mode' }],
      workChanneList: [{ id: 1, value: 'Channel1' }, { id: 2, value: 'Channel2' }, { id: 3, value: 'Channel3' }, { id: 4, value: 'Channel4' }, { id: 5, value: 'Channel5' }, { id: 6, value: 'Channel6' }, { id: 7, value: 'Channel7' }, { id: 8, value: 'Channel8' }],
      SysConfig_WorkMode: '',
      SysConfig_WorkChannel: ''
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
    this.connectAll()
    if (localStorage.getItem('info')) {
      const info1 = localStorage.getItem('info')
      this.info = JSON.parse(info1)
      // this.getWsData(this.info)
    }
    // for (let i = 0; i < 8; i++) {
    //   this.tableData.push({ index: 'null', length: 'null', allLossAlarmThr: 'null' })
    // }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {

    })
  },
  beforeRouteLeave(to, from, next) {
    this.destroyedWs()
    next()
  },
  beforeDestroy() {
    localStorage.setItem('info', JSON.stringify(this.info))
  },
  methods: {
    checkPermission,
    baseStandUpdate() {
      baseStandUpdate({ id: 1, standMode: this.SysConfig_WorkMode, standChannel: this.SysConfig_WorkChannel }).then(response => {
        this.sort = 2
        this.getDpq()
        this.getBaseStandInfo()
      })
    },
    timer() {
      if (this.$i18n.locale === 'cn') {
        this.time = setTimeout(() => {
          this.$message.error('连接失败！')
        }, 10000)
      } else if (this.$i18n.locale === 'en') {
        this.time = setTimeout(() => {
          this.$message.error('Connection failed!')
        }, 10000)
      }
    },
    baseStandUpdate1() {
      baseStandUpdate({ id: 1, precisions: this.info.SysConfig_Resolution }).then(response => {
        this.getBaseStandInfo()
      })
    },
    getBaseStandInfo() {
      baseStandInfo().then(response => {
        this.accuracy = response.data
        // this.$set(this.info, 'SysConfig_WorkMode', response.data.standMode)
        // this.$set(this.configurationEdit, 'SysConfig_WorkMode', response.data.standMode)
        this.warnChart()
      })
    },
    getDpq() {
      deviceParamQuery({ sort: this.sort }).then(response => {
        this.dpq = response.data
        this.obj = response.data
        this.createWs()
      })
    },
    getDeviceParamSetting() {
      deviceParamSetting({ settingParam: this.settingParam }).then(response => {
        this.deviceParamSetting = response.data
        this.obj = this.deviceParamSetting
        this.createWs()
      })
    },
    // 连接
    connect() {
      this.sort = 0
      this.getDpq()
    },
    connect1() {
      this.sort = 1
      this.getDpq()
    },
    connect2() {
      this.sort = 2
      this.getDpq()
    },
    connect3() {
      this.sort = 3
      this.getDpq()
    },
    connect4() {
      this.sort = 4
      this.getDpq()
    },
    connectAll() {
      this.sort = null
      this.getDpq()
    },
    handleUpdate() {
      this.opeStatus = 'update'
      this.ope1Status = 'update1'
      this.ope2Status = 'update2'
      this.ope3Status = 'update3'
      this.ope4Status = 'update4'
    },

    submit() {
      if (this.$i18n.locale === 'cn') {
        if (!this.warningEdit.origin || !this.warningEdit.destination || !this.warningEdit.sensitivity) {
          this.$message.error('起点、终点、灵敏度都不能为空')
          return false
        }
      } else if (this.$i18n.locale === 'en') {
        if (!this.warningEdit.origin || !this.warningEdit.destination || !this.warningEdit.sensitivity) {
          this.$message.error('The start point, end point, and sensitivity cannot be empty')
          return false
        }
      }
      var sum1 = Math.floor(this.warningEdit.origin / this.accuracy.precisions)
      var sum2 = this.warningEdit.destination
      var sum3 = this.warningEdit.sensitivity
      if (this.warnData.length > 0) {
        for (let i = sum1; i < this.warnData.length; i++) {
          if (i * this.accuracy.precisions > Number(sum2)) {
            break
          } else {
            this.warnData[i] = Number(sum3)
          }
        }
      }
      this.warnEdit.Cable_VibThr = this.warnData
      this.settingParam = JSON.stringify(this.warnEdit)
      this.getDeviceParamSetting()
    },
    test(formName) {
    },
    updateData1() {
      this.ope1Status = 'info1'
      this.settingParam = JSON.stringify(this.deviceEdit)
      this.getDeviceParamSetting()
    },
    updateData2() {
      this.SysConfig_WorkMode = this.configurationEdit.SysConfig_WorkMode
      this.SysConfig_WorkChannel = this.configurationEdit.SysConfig_WorkChannel
      this.ope2Status = 'info2'
      this.settingParam = JSON.stringify(this.configurationEdit)
      this.getDeviceParamSetting()
    },
    editUpdateData3() {
      this.ope3Status = 'update3'
      this.tableDataOld = this.tableData
      console.log('编辑this.tableDataOld', this.tableDataOld)
    },
    cancelUpdateData3() {
      this.ope3Status = 'info3'
      this.tableData = this.tableDataOld
      this.vibrationEdit.Cable_AllLossAlarmThr = []
      this.vibrationEdit.Cable_Length = []
      this.tableData.forEach((item) => {
        item.allLossAlarmThr = Math.floor(parseInt(item.allLossAlarmThr))
        item.length = Math.floor(parseInt(item.length))
        console.log('allLossAlarmThr', typeof item.allLossAlarmThr)
        console.log('length', typeof item.length)
        this.vibrationEdit.Cable_AllLossAlarmThr.push(item.allLossAlarmThr)
        this.vibrationEdit.Cable_Length.push(item.length)
      })
      this.settingParam = JSON.stringify(this.vibrationEdit)
      deviceParamSetting({ settingParam: this.settingParam }).then(response => {
        this.deviceParamSetting = response.data
        this.obj = this.deviceParamSetting
        this.loading = true
        if (this.websocket) {
          this.websocket.close()
          this.websocket = null
        }
        if (window.WebSocket) {
        // this.websocket = new WebSocket('ws://' + process.env.LINK_API)
          this.websocket = new WebSocket('ws://192.168.8.131:9005/')
          // 当有消息过来的时候触发
          const that = this
          this.websocket.onmessage = function(event) {
            that.loading = false
          }

          // 连接关闭的时候触发
          this.websocket.onclose = function(event) {
            console.log('断开连接')
          }

          // 连接打开的时候触发
          this.websocket.onopen = function(event) {
            that.websocket.send(that.obj)
            that.timer()
            console.log('建立连接')
          }
          this.websocket.onerror = function(event) {
            console.log('cuwu')
          }
          this.websocket.onclose = function(event) {
            console.log('连接断开')
          // that.contextAudioStop()
          }
        } else {
          this.$message.error('浏览器不支持WebSocket')
        }
      })
    },
    updateData3() {
      this.ope3Status = 'info3'
      this.vibrationEdit.Cable_AllLossAlarmThr = []
      this.vibrationEdit.Cable_Length = []
      this.tableData.forEach((item) => {
        item.allLossAlarmThr = Math.floor(parseInt(item.allLossAlarmThr))
        item.length = Math.floor(parseInt(item.length))
        console.log('allLossAlarmThr', typeof item.allLossAlarmThr)
        console.log('length', typeof item.length)
        this.vibrationEdit.Cable_AllLossAlarmThr.push(item.allLossAlarmThr)
        this.vibrationEdit.Cable_Length.push(item.length)
      })
      this.settingParam = JSON.stringify(this.vibrationEdit)
      this.getDeviceParamSetting()
      // this.baseStandUpdate()
    },
    updateData4() {
      this.ope4Status = 'info4'
      this.settingParam = JSON.stringify(this.parameterEdit)
      this.getDeviceParamSetting()
    },
    createWs() {
      this.loading = true
      if (this.websocket) {
        this.websocket.close()
        this.websocket = null
      }
      if (window.WebSocket) {
        // this.websocket = new WebSocket('ws://' + process.env.LINK_API)
        this.websocket = new WebSocket('ws://192.168.8.131:9005/')
        // 当有消息过来的时候触发
        const that = this
        this.websocket.onmessage = function(event) {
          const data = JSON.parse(event.data)
          that.loading = false
          that.getWsData(data)
        }

        // 连接关闭的时候触发
        this.websocket.onclose = function(event) {
          console.log('断开连接')
        }

        // 连接打开的时候触发
        this.websocket.onopen = function(event) {
          that.websocket.send(that.obj)
          that.timer()
          console.log('建立连接')
        }
        this.websocket.onerror = function(event) {
          console.log('cuwu')
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
    destroyedWs() {
      if (this.websocket) {
        this.websocket.close()
        this.websocket = null
      }
    },
    getWsData(data) { // 报警消息数据处理
      clearTimeout(this.time)
      for (var key in data) {
        this.$set(this.info, key, data[key])
      }
      if (this.$i18n.locale === 'cn') {
        if (data.SysConfig_WorkChannel === true && data.SysConfig_WorkMode === true) {
          this.$message.success('修改成功！')
          this.baseStandUpdate()
        } else {
          this.$message.success('参数已更新！')
        }
        if (data.SysConfig_WorkChannel === false || data.SysConfig_WorkMode === false) {
          this.$message.error('修改失败！')
          this.getBaseStandInfo()
          this.connect2()
        }
      } else if (this.$i18n.locale === 'en') {
        if (data.SysConfig_WorkChannel === true && data.SysConfig_WorkMode === true) {
          this.$message.success('Successfully modified!')
          this.baseStandUpdate()
        } else {
          this.$message.success('Parameters have been updated!')
        }
        if (data.SysConfig_WorkChannel === false || data.SysConfig_WorkMode === false) {
          this.$message.error('Fail to edit!')
          this.getBaseStandInfo()
          this.connect2()
        }
      }
      this.$set(this.configurationEdit, 'SysConfig_WorkChannel', this.info.SysConfig_WorkChannel)
      this.$set(this.configurationEdit, 'SysConfig_WorkMode', this.info.SysConfig_WorkMode)
      this.tableData = []
      if (this.info.Cable_AllLossAlarmThr) {
        for (let i = 0; i < this.info.Cable_AllLossAlarmThr.length; i++) {
          for (let a = 0; a < this.info.Cable_Length.length; a++) {
            if (a === i) {
              this.tableData.push({ edit: false, index: i + 1, length: this.info.Cable_Length[a], allLossAlarmThr: this.info.Cable_AllLossAlarmThr[i] })
            }
          }
        }
        this.warnData = this.info.Cable_VibThr
        this.warnChart()
      }
      if (this.$i18n.locale === 'cn') {
        if (this.info.Cable_Length === true) {
          this.$message.success('修改成功！')
          this.connect4()
        }
        if (this.info.Cable_Length === false) {
          this.$message.error('修改失败！')
          this.connect4()
        }
        if (this.info.Cable_VibThr === true) {
          this.$message.success('修改成功！')
          this.connect4()
        }
        if (this.info.Cable_VibThr === false) {
          this.$message.error('修改失败！')
          this.connect4()
        }
      } else if (this.$i18n.locale === 'en') {
        if (this.info.Cable_Length === true) {
          this.$message.success('Successfully modified!')
          this.connect4()
        }
        if (this.info.Cable_Length === false) {
          this.$message.error('Fail to edit!')
          this.connect4()
        }
        if (this.info.Cable_VibThr === true) {
          this.$message.success('Successfully modified!')
          this.connect4()
        }
        if (this.info.Cable_VibThr === false) {
          this.$message.error('Fail to edit!')
          this.connect4()
        }
      }
      if (this.info.SysConfig_Resolution) {
        this.baseStandUpdate1()
      }
    },
    warnChart() {
      this.xData = []
      if (this.warnData.length) {
        for (let i = 0; i < this.warnData.length; i++) {
          this.xData.push(i * this.accuracy.precisions)
        }
      }

      this.warnchart = echarts.init(document.getElementById('warnChart'))
      if (this.$i18n.locale === 'cn') {
        const option = {
          title: {
            text: '预警恒警'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
          // data: ['恒定预警']
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
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
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
              name: '灵敏度',
              type: 'line',
              step: 'middle',
              data: []
            }
          ]
        }

        option.xAxis.data = this.xData
        option.series[0].data = this.warnData
        this.warnchart.setOption(option)
      } else if (this.$i18n.locale === 'en') {
        const option = {
          title: {
            text: 'Permanent warning'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
          // data: ['恒定预警']
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
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
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
              name: 'Sensitivity',
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
  width: 12%;
  text-align: right;
}
.blackMark1 {
  color: black;
  font-weight: 600;
  width: 20%;
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
