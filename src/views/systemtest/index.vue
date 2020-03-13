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
                <i class="icon" icon="el-icon-s-help" />
                <i v-show="restEdit.status == 1" icon="icon" />
              </td>
              <td class="width10">电源
              </td>
              <td class="width5">
                <i v-show="restEdit.status == 0" icon="icon" />
                <i v-show="restEdit.status == 1" icon="icon" />
              </td>
              <td class="width10">网络通信
              </td>
              <td>
                <i v-show="restEdit.status == 0" icon="icon" />
                <i v-show="restEdit.status == 1" icon="icon" />
              </td>
              <td class="width10">采集卡
              </td>
              <td>
                <i v-show="restEdit.status == 0" icon="icon" />
                <i v-show="restEdit.status == 1" icon="icon" />
              </td>
              <td class="width10">报警状态
              </td>
              <td>
                <i v-show="restEdit.status == 0" icon="icon" />
                <i v-show="restEdit.status == 1" icon="icon" />
              </td>
              <td class="width10">光源
              </td>
              <td>
                <i v-show="restEdit.status == 0" icon="icon" />
                <i v-show="restEdit.status == 1" icon="icon" />
              </td>
              <td class="width10">光开关
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
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">光源电压：</td>
              <td class="width21">
                <span>{{ info.trainReminderTime }}V</span>
              </td>
              <td class="blackMark">机箱温度：</td>
              <td class="width21">
                <span>{{ info.trainReminderTime }}℃</span>
              </td>
              <td class="blackMark">光功率：</td>
              <td class="width21">
                <span>{{ info.trainReminderTime }}mW</span>
              </td>
            </tr>
            <tr>
              <td class="blackMark">电路主控板电流：</td>
              <td class="width21">
                <span>{{ info.trainReminderTime }}mA</span>
              </td>
              <td class="blackMark">衰减器：</td>
              <td class="width21">
                <span>{{ info.trainReminderTime }}dB</span>
              </td>
              <td class="blackMark">通道数：</td>
              <td class="width21">
                <span>{{ info.trainReminderTime }}</span>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="primary"
          size="small"
          @click="test"
        >全线自测</el-button>
      </div>
    </div>

    <div class="content">
      <el-form>
        <div class="basic">
          <div class="title">
            <span>系统配置</span>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">
                <span style="color: red">*</span>
                空间分辨率：
              </td>
              <td class="width21">
                <el-input
                  v-show="ope2Status == 'update2'"
                  v-model="restEdit.creditQueryPrice"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope2Status == 'info2'">{{ info.creditQueryPrice }}</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                时间采样率：
              </td>
              <td class="width21">
                <el-input
                  v-show="ope2Status == 'update2'"
                  v-model="restEdit.creditQueryPrice"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope2Status == 'info2'">{{ info.creditQueryPrice }}</span>
              </td>
              <td class="blackMark">
                <span style="color: red">*</span>
                平均次数：
              </td>
              <td class="width21">
                <el-input
                  v-show="ope2Status == 'update2'"
                  v-model="restEdit.averageNumber"
                  size="small"
                  placeholder="请输入"
                  style="width: 100px;"
                />
                <span v-show="ope2Status == 'info2'">{{ info.averageNumber }}</span>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div style="text-align:right;">
        <el-button
          v-show="ope2Status == 'update2'"
          type="primary"
          @click="updateData2"
        >确认</el-button>
        <el-button
          v-show="ope2Status == 'info2'"
          type="warning"
          @click="ope2Status = 'update2'"
        >编辑</el-button>
        <el-button v-show="ope2Status == 'update2'" @click="ope2Status = 'info2'">取消</el-button>
        <el-button v-show="ope2Status == 'info2'" type="primary" @click="reset">恢复出厂设置</el-button>
      </div>
    </div>
    <div class="content">
      <el-form>
        <div class="basic">
          <div class="title">
            <span>震动阀值设置</span>
          </div>
          <table class="table">
            <tr>
              <td class="blackMark">
                <span style="color: red">*</span>
                光纤长度：
              </td>
              <td class="width21">
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
      <div style="text-align:right;">
        <el-button
          v-show="ope3Status == 'update3'"
          type="primary"
          @click="updateData3"
        >确认</el-button>
        <el-button
          v-show="ope3Status == 'info3'"
          type="warning"
          @click="ope3Status = 'update3'"
        >编辑</el-button>
        <el-button v-show="ope3Status == 'update3'" @click="ope3Status = 'info3'">取消</el-button>
      </div>
    </div>

    <el-dialog :visible.sync="dialogImgVisible" width="800px" style="text-align: center">
      <div style="border: 1px solid #ededed">
        <img :src="bigImgSrc" alt style="width: 600px;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { update, info } from '@/api/systemtest/index'
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
      uploadUrl: process.env.VUE_APP_BASE_API + 'api-web/ossUpload/uploadFile',
      uploadUrl1: process.env.VUE_APP_BASE_API + 'api-web/ossUpload/uploadFile',
      bigImgSrc: null,
      dialogImgVisible: false,
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
    this.getInfo()
    this.ope2Status = 'info2'
    this.ope3Status = 'info3'
  },
  methods: {
    checkPermission,

    getInfo() {
      info().then(response => {
        this.info = response.data
        this.restEdit = response.data
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
          this.ope2Status = 'info2'
          this.getInfo()
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
    }
  }
}
</script>
<style>
.content {
  width: 100%;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0.5px 0.5px 2px 2px #c2c5c5b6;
  padding: 10px;
  border-radius: 10px 10px 10px 10px;
}

</style>
