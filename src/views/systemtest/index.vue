<template>
  <div class="app-container">
    <!--新增编辑页面 -->
    <div class="content">
      <el-form>
        <div class="basic">
          <div class="title">
            <span>设备状态</span>
          </div>
          <table>
            <tr>
              <td>
                <el-form-item>
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <span>电源</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <span>网络通信</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <span>采集卡</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <span>报警状态</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <span>光源</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <i v-show="scope.row.status == 0" icon="icon" />
                  <span>光开关</span>
                </el-form-item>
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
          <table>
            <tr>
              <td>
                <el-form-item>
                  <span slot="label">光源电压：</span>
                  <span>{{ info.trainReminderTime }}</span>
                  <span>V</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <span slot="label">机箱温度：</span>
                  <span>{{ info.trainReminderTime }}</span>
                  <span>℃</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <span slot="label">光功率：</span>
                  <span>{{ info.trainReminderTime }}</span>
                  <span>mW</span>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item>
                  <span slot="label">电路主控板电流：</span>
                  <span>{{ info.trainReminderTime }}</span>
                  <span>mA</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <span slot="label">衰减器：</span>
                  <span>{{ info.trainReminderTime }}</span>
                  <span>dB</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <span slot="label">通道数：</span>
                  <span>{{ info.trainReminderTime }}</span>
                </el-form-item>
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
          <table>
            <tr>
              <td>
                <el-form-item>
                  <span slot="label">
                    <span style="color: red">*</span>
                    空间分辨率：
                  </span>
                  <el-input
                    v-show="ope2Status == 'update2'"
                    v-model="configEdit.creditQueryPrice"
                    size="small"
                    :placeholder="$t('form.input')"
                    style="width: 100px;"
                  />
                  <span v-show="ope2Status == 'info2'">{{ info.creditQueryPrice }}</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <span slot="label">
                    <span style="color: red">*</span>
                    时间采样率：
                  </span>
                  <el-input
                    v-show="ope2Status == 'update2'"
                    v-model="configEdit.creditQueryPrice"
                    size="small"
                    :placeholder="$t('form.input')"
                    style="width: 100px;"
                  />
                  <span v-show="ope2Status == 'info2'">{{ info.creditQueryPrice }}</span>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <span slot="label">
                    <span style="color: red">*</span>
                    平均次数：
                  </span>
                  <el-input
                    v-show="ope2Status == 'update2'"
                    v-model="configEdit.averageNumber"
                    size="small"
                    :placeholder="$t('form.input')"
                    style="width: 100px;"
                  />
                  <span v-show="ope2Status == 'info2'">{{ info.averageNumber }}</span>
                </el-form-item>
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
        >{{ $t('table.confirm') }}</el-button>
        <el-button
          v-show="ope2Status == 'info2'"
          type="warning"
          @click="ope2Status = 'update2'"
        >{{ $t('table.update') }}</el-button>
        <el-button v-show="ope2Status == 'update2'" @click="ope2Status = 'info2'">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="reset">恢复出厂设置</el-button>
      </div>
    </div>

    <div class="content">
      <el-form>
        <div class="basic">
          <div class="title">
            <span>震动阀值设置</span>
          </div>
          <table>
            <tr>
              <td>
                <el-form-item>
                  <span slot="label">
                    <span style="color: red">*</span>
                    光纤长度：
                  </span>
                  <el-select
                    v-show="ope3Status == 'update3'"
                    v-model="configEdit.length"
                    size="small"
                    style="width: 150px;"
                    placeholder="请选择长度"
                    filterable
                    clearable
                    class="filter-item"
                  >
                    <el-option
                      v-for="item in lengthList"
                      :key="item.id"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                  <span v-show="ope3Status == 'info3'">{{ info.length }}</span>
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div style="text-align:right;">
        <el-button
          v-show="ope3Status == 'update3'"
          type="primary"
          @click="updateData3"
        >{{ $t('table.confirm') }}</el-button>
        <el-button
          v-show="ope3Status == 'info3'"
          type="warning"
          @click="ope3Status = 'update3'"
        >{{ $t('table.update') }}</el-button>
        <el-button v-show="ope3Status == 'update3'" @click="ope3Status = 'info3'">{{ $t('table.cancel') }}</el-button>
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
// import { update, info } from '@/api/system/config'
// import waves from '@/directive/waves' // 水波纹指令
// import checkPermission from '@/utils/permission' // 权限判断函数
// export default {
//   name: 'OrgBasicInfo',
//   directives: {
//     waves
//   },
//   filters: {

//   },
//   data() {
//     return {
//       configEdit: {},
//       info: [],
//       uploadUrl: process.env.VUE_APP_BASE_API + 'api-web/ossUpload/uploadFile',
//       uploadUrl1: process.env.VUE_APP_BASE_API + 'api-web/ossUpload/uploadFile',
//       bigImgSrc: null,
//       dialogImgVisible: false,
//       opeStatus: 'info',
//       ope1Status: 'info1',
//       ope2Status: 'info2',
//       ope3Status: 'info3',
//       lengthList: [{ id: 0, value: 30 }, { id: 1, value: 50 }, { id: 2, value: 70 }]
//     }
//   },
//   computed: {
//     headers() {
//       return {
//         'Authorization': 'Bearer ' + this.$store.getters.token
//       }
//     }
//   },
//   created() { },
//   mounted() {
//     this.getInfo()
//     this.opeStatus = 'info'
//     this.ope1Status = 'info1'
//     this.ope2Status = 'info2'
//     this.ope3Status = 'info3'
//   },
//   methods: {
//     checkPermission,

//     getInfo() {
//       info().then(response => {
//         this.info = response.data
//         this.configEdit = response.data
//         this.info.smsSign = this.info.smsSign.substring(1, this.info.smsSign.length - 1)
//       })
//     },
//     handleUpdate() {
//       this.opeStatus = 'update'
//       this.ope1Status = 'update1'
//       this.ope2Status = 'update2'
//       this.ope3Status = 'update3'
//     },
//     // 修改提交
//     updateData2(formName) {
//       if (!this.configEdit.creditQueryPrice) {
//         this.$message.error(this.$t('system.config.timeIsNull2'))
//         return false
//       }
//       if (this.configEdit.creditQueryPrice < 0) {
//         this.$message.error(this.$t('system.config.tip2'))
//         return false
//       }
//       update(this.configEdit).then((response) => {
//         if (response.data) {
//           this.$message.success(this.$t('form.updateSuccess'))
//           this.ope2Status = 'info2'
//           this.getInfo()
//         } else {
//           this.$message.error(this.$t('form.updateFail'))
//         }
//       })
//     },
//     test(formName) {
//       if (!this.configEdit.trainReminderTime) {
//         this.$message.error(this.$t('system.config.timeIsNull1'))
//         return false
//       }
//       if (this.configEdit.trainReminderTime < 0) {
//         this.$message.error(this.$t('system.config.tip1'))
//         return false
//       }
//       update(this.configEdit).then((response) => {
//         if (response.data) {
//           this.$message.success(this.$t('form.updateSuccess'))
//           this.ope1Status = 'info1'
//           this.getInfo()
//         } else {
//           this.$message.error(this.$t('form.updateFail'))
//         }
//       })
//     },
//     updateData3(formName) {
//       if (!this.configEdit.smsSign) {
//         this.$message.error(this.$t('system.config.timeIsNull3'))
//         return false
//       }

//       this.configEdit.smsSign = ('【' + this.configEdit.smsSign + '】')
//       update(this.configEdit).then((response) => {
//         if (response.data) {
//           this.$message.success(this.$t('form.updateSuccess'))
//           this.ope3Status = 'info3'
//           this.getInfo()
//         } else {
//           this.$message.error(this.$t('form.updateFail'))
//         }
//       })
//     }
//   }
// }
</script>
<style>
.content {
  width: 100%;
  margin-top: 20px;
  background-color: white;
  box-shadow: 1px 1px 5px 5px #dceeed;
  padding: 10px;
  border-radius: 10px 10px 10px 10px;
}
</style>
