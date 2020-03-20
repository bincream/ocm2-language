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
                <svg-icon icon-class="open" />
                <svg-icon v-show="restEdit.status == 1" icon-class="close" />
              </td>
              <td class="width9">电源
              </td>
              <td class="width5">
                <svg-icon v-show="restEdit.status == 0" icon-class="open" />
                <svg-icon icon-class="close" />
              </td>
              <td class="width9">网络通信
              </td>
              <td>
                <svg-icon v-show="restEdit.status == 0" icon-class="open" />
                <svg-icon v-show="restEdit.status == 1" icon-class="close" />
              </td>
              <td class="width9">采集卡
              </td>
              <td>
                <svg-icon v-show="restEdit.status == 0" icon-class="open" />
                <svg-icon v-show="restEdit.status == 1" icon-class="close" />
              </td>
              <td class="width9">报警状态
              </td>
              <td>
                <svg-icon v-show="restEdit.status == 0" icon-class="open" />
                <svg-icon v-show="restEdit.status == 1" icon-class="close" />
              </td>
              <td class="width9">光源
              </td>
              <td>
                <svg-icon v-show="restEdit.status == 0" icon-class="open" />
                <svg-icon v-show="restEdit.status == 1" icon-class="close" />
              </td>
              <td class="width9">光开关
              </td>
            </tr>
          </table>
        </div>
      </el-form>
    </div>
    <div class="content">
      <el-form>
        <div class="basic">
          <div class="title">
            <span>设备参数</span>
            <el-button
              type="primary"
              size="small"
              @click="test"
            >全线自测</el-button>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">光源电压：</td>
              <td class="width9">
                <span>{{ info.OSrc_Voltage }}V</span>
              </td>
              <td class="blackMark">机箱温度：</td>
              <td class="width9">
                <span>{{ info.Amb_InBoxTemp }}℃</span>
              </td>
              <td class="blackMark">光功率：</td>
              <td class="width9">
                <span>{{ info.OSrc_Power }}mW</span>
              </td>
              <td class="blackMark">电路主控板电流：</td>
              <td class="width9">
                <span>{{ info.trainReminderTime }}mA</span>
              </td>
              <td class="blackMark">衰减器：</td>
              <td class="width9">
                <span>{{ info.trainReminderTime }}dB</span>
              </td>
              <td class="blackMark">通道数：</td>
              <td class="width9">
                <span>{{ info.trainReminderTime }}</span>
              </td>
            </tr>

          </table>
        </div>
      </el-form>
      <div style="text-align:right;" />
    </div>

    <div class="content">
      <el-form>
        <div class="basic">
          <div class="title">
            <span>系统配置</span>
            <el-button
              v-show="ope2Status == 'update2'"
              type="primary"
              style="position:absolute;right:100px"
              @click="updateData2"
            >确认</el-button>
            <el-button
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
                  v-model="restEdit.SysCfg_SpaceR"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope2Status == 'info2'">{{ info.SysCfg_SpaceR }}</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                时间采样率：
              </td>
              <td class="width9">
                <el-input
                  v-show="ope2Status == 'update2'"
                  v-model="restEdit.SysCfg_TimeR"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope2Status == 'info2'">{{ info.SysCfg_TimeR }}</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                平均次数：
              </td>
              <td class="width9">
                <el-input
                  v-show="ope2Status == 'update2'"
                  v-model="restEdit.SysCfg_AvgTime"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope2Status == 'info2'">{{ info.SysCfg_AvgTime }}</span>
              </td>
              <td />
            </tr>
          </table>
        </div>
      </el-form>
    </div>

    <div class="content">
      <el-form>
        <div class="basic">
          <div class="title">
            <span>光器件参数设置</span>
            <el-button
              v-show="ope1Status == 'update1'"
              type="primary"
              style="position:absolute;right:100px"
              @click="updateData1"
            >确认</el-button>
            <el-button
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
                  v-model="restEdit.EDFA"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope1Status == 'info1'">{{ info.EDFA }}</span>
                <span>mA</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                RAMAN：
              </td>
              <td class="width9">
                <el-input
                  v-show="ope1Status == 'update1'"
                  v-model="restEdit.RAMAN"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope1Status == 'info1'">{{ info.RAMAN }}</span>
                <span>dB</span>
              </td>
              <td class="blackMark" />
              <td class="width9" />
              <td />
            </tr>
          </table>
        </div>
      </el-form>
    </div>

    <div class="content">
      <el-form>
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
                  v-model="restEdit.length"
                  size="small"
                  style="width: 150px;"
                  placeholder="请选择光纤长度"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in lengthList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.value"
                  />
                </el-select>
                <span v-show="ope3Status == 'info3'">{{ info.length }}</span>
              </td>
              <td />
            </tr>
          </table>
        </div>
      </el-form>
    </div>

  </div>
</template>

<script>
import { update } from '@/api/systemtest/index'
import { deviceParamQuery } from '@/api/public'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'OrgBasicInfo',
  directives: {
    waves
  },
  filters: {

  },
  data() {
    return {
      restEdit: {},
      info: [],
      websocket: null,
      dialogImgVisible: false,
      dpq: '',
      ope1Status: 'info1',
      ope2Status: 'info2',
      ope3Status: 'info3',
      lengthList: [{ id: 0, value: '30' }, { id: 1, value: '50' }, { id: 2, value: '70' }]
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
    this.getDpq()
    this.ope1Status = 'info1'
    this.ope2Status = 'info2'
    this.ope3Status = 'info3'
  },
  beforeDestroy() {
    this.destroyedWs()
  },
  methods: {
    checkPermission,
    getDpq() {
      deviceParamQuery().then(response => {
        this.dpq = response.data
        this.createWs()
      })
    },
    handleUpdate() {
      this.opeStatus = 'update'
      this.ope1Status = 'update1'
      this.ope2Status = 'update2'
      this.ope3Status = 'update3'
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

    test(formName) {
      if (!this.restEdit.trainReminderTime) {
        this.$message.error(this.$t('system.config.timeIsNull1'))
        return false
      }
      if (this.restEdit.trainReminderTime < 0) {
        this.$message.error(this.$t('system.config.tip1'))
        return false
      }
      update(this.restEdit).then((response) => {
        if (response.data) {
          this.$message.success('修改成功!')
          this.getInfo()
        } else {
          this.$message.error('修改失败!')
        }
      })
    },
    updateData1() {
      update(this.restEdit).then((response) => {
        if (response.data) {
          this.$message.success('修改成功!')
          this.getInfo()
        } else {
          this.$message.error('修改失败!')
        }
      })
    },
    updateData2() {
      if (!this.restEdit.trainReminderTime) {
        this.$message.error(this.$t('system.config.timeIsNull1'))
        return false
      }
      if (this.restEdit.trainReminderTime < 0) {
        this.$message.error(this.$t('system.config.tip1'))
        return false
      }
      update(this.restEdit).then((response) => {
        if (response.data) {
          this.$message.success('修改成功!')
          this.getInfo()
        } else {
          this.$message.error('修改失败!')
        }
      })
    },
    updateData3(formName) {
      if (!this.restEdit.smsSign) {
        this.$message.error(this.$t('system.config.timeIsNull3'))
        return false
      }
      update(this.restEdit).then((response) => {
        if (response.data) {
          this.$message.success('修改成功!')
          this.ope3Status = 'info3'
          this.getInfo()
        } else {
          this.$message.error('修改失败!')
        }
      })
    },

    createWs() { // 创建报警消息ws
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
          that.websocket.send(that.dpq)
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
      if (this.websocket && this.websocket.readyState === 1) {
        this.websocket.close()
        this.websocket = null
      }
    },
    getWsData(data) { // 报警消息数据处理
      if (!data.alarmInfo) {
        return false
      }

      if (data.alarmInfo.freq <= 10) {
        data.alarmInfo.freqColor = 1
      } else if (data.alarmInfo.freq > 10 && data.alarmInfo.freq < 50) {
        data.alarmInfo.freqColor = 2
      } else if (data.alarmInfo.freq >= 50) {
        data.alarmInfo.freqColor = 3
      }

      data.alarmInfo.selfId = data.alarmInfo.standNo + '-' + data.alarmInfo.centerCol + '-' + data.alarmInfo.dangerLevel
      data.alarmInfo.isPlay = false

      data.alarmInfo.beginTime = this.timestampToTime(data.alarmInfo.beginTime)
      data.alarmInfo.endTime = this.timestampToTime(data.alarmInfo.endTime)
      data.alarmInfo.cableName = data.rscCable.cableName
      data.alarmInfo.standId = data.rscCable.standId

      let lastPoint = {}
      let nextPoint = {}

      for (let i = 0; i < data.cablePointList.length; i++) {
        if (data.alarmInfo.centerCol >= data.cablePointList[i].length && data.cablePointList[i + 1] && data.alarmInfo.centerCol < data.cablePointList[i + 1].length) {
          lastPoint = data.cablePointList[i]
          nextPoint = data.cablePointList[i + 1]
        }
      }
      data.alarmInfo.lastPointLength = data.alarmInfo.centerCol - lastPoint.length

      data.alarmInfo.nextPointLength = nextPoint.length - data.alarmInfo.centerCol
    }
  }
}
</script>
<style scoped>
.content {
  width: 100%;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0.5px 0.5px 2px 2px #c2c5c5b6;
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
