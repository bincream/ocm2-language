<template>
  <div class="app-container">
    <!--新增编辑页面 -->

    <div class="content">
      <el-form>
        <div class="basic">
          <table class="table_table">
            <tr>
              <td class="blackMark">当前版本</td>
              <td class="width20">
                <span>{{ info.trainReminderTime }}1.1.0.001</span>
              </td>
              <td class="blackMark" />
            </tr>
          </table>
        </div>
      </el-form>
    </div>

    <div class="content">
      <el-form style="display:flex;flex-direction:row">
        <div class="basic">
          <table class="table_table">
            <tr>
              <td class="blackMark">
                设备升级
              </td>
              <td style="width: 10%" />
            </tr>
          </table>
        </div>
        <div class="basic">
          <table class="table_table">
            <tr>
              <td class="blackMark">
                DSP远程升级
                <i class="el-icon-share" />
              </td>
              <td style="width: 10%" />
            </tr>
            <tr>
              <td class="blackMark">
                FPGA远程升级
                <i class="el-icon-share" />
              </td>
              <td style="width: 10%" />
            </tr>
          </table>
        </div>
      </el-form>
    </div>

    <div class="content">
      <el-form>
        <div class="basic">
          <table class="table_table">
            <tr>
              <td class="blackMark">
                恢复出厂设置
              </td>
              <td class="width20">
                <el-button type="primary" @click="reset">确定</el-button>
              </td>
              <td class="blackMark" />
            </tr>
          </table>
        </div>
      </el-form>
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
<style scoped>
.content {
  width: 60%;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0.5px 0.5px 2px 2px #c2c5c5b6;
  padding: 10px;
  border-radius: 10px 10px 10px 10px;
}
.blackMark{
    color: black;
  font-weight: 600;
  width: 10%;
  text-align: right;
}

</style>
