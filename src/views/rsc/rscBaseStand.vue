<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">
      <el-input
        v-model="listQuery.keywords"
        :placeholder="$t('rscBaseStand.qingshurujizhanmingcheng')"
        style="width: 280px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />
    </div>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :header-cell-style="{background: 'rgb(22, 144, 255)', textAlign: 'center', color: 'white'}"
      :data="list"
      stripe
      :row-style="{textAlign: 'center'}"
      highlight-current-row
      height="500"
      @row-click="handleDetail"
    >
      <el-table-column :label="$t('rscBaseStand.jizhanmingcheng')" prop="standName" />
      <el-table-column :label="$t('rscBaseStand.jizhanbianhao')" prop="standNo" />
      <el-table-column :label="$t('rscBaseStand.jizhantongdao')" prop="standChannel" />
      <el-table-column :label="$t('rscBaseStand.jizhanIP')" prop="standIp" />
      <el-table-column :label="$t('rscBaseStand.jizhanjingdu')" prop="precisions" />
      <el-table-column :label="$t('rscBaseStand.jizhanmoshi')" width="165">
        <template slot-scope="scope">
          {{ scope.row.standMode | standMode }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('rscBaseStand.yinpincaiyanglv')" prop="samplingRate" />
      <el-table-column :label="$t('rscBaseStand.baojingyuzhi')" prop="alarmThreshold" />
      <el-table-column :label="$t('rscBaseStand.caozuo')" width="150">
        <template slot-scope="scope">
          <!-- <el-button
            v-if="checkPermission(['baseStand/getPrecisions'])"
            type="primary"
            size="small"
            @click.stop="handlePre(scope.row)"
          >获取精度</el-button> -->
          <el-button
            v-if="checkPermission(['baseStand/update'])"
            type="primary"
            size="small"
            @click.stop="handleUpdate(scope.row)"
          >{{ $t('rscBaseStand.bianji') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增编辑页面 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="100%">
      <el-form
        ref="standEdit"
        :rules="rules"
        :model="standEdit"
        inline
        :show-message="false"
        status-icon
      >
        <div class="basic">
          <div class="title">
            <span>{{ $t('rscBaseStand.taizhanxinxi') }}</span>
          </div>
          <table>
            <tr>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.jizhanmingcheng')" prop="standName">
                  <el-input v-model="standEdit.standName" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.jizhanbianhao')" prop="standNo">
                  <el-input v-model="standEdit.standNo" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.jizhanIP')" prop="standIp">
                  <el-input v-model="standEdit.standIp" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.yinpincaiyanglv')" prop="samplingRate">
                  <el-input v-model="standEdit.samplingRate" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.baojingyuzhi')" prop="alarmThreshold">
                  <el-input v-model="standEdit.alarmThreshold" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
            </tr>

            <tr>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.yansequzhifanwei1')" prop="tdColor1">
                  <el-input v-model="standEdit.tdColor1" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.yansequzhifanwei2')" prop="tdColor2">
                  <el-input v-model="standEdit.tdColor2" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.yansequzhifanwei3')" prop="tdColor3">
                  <el-input v-model="standEdit.tdColor3" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.yansequzhifanwei4')" prop="tdColor4">
                  <el-input v-model="standEdit.tdColor4" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.yansequzhifanwei5')" prop="tdColor5">
                  <el-input v-model="standEdit.tdColor5" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item :label="$t('rscBaseStand.yansequzhifanwei6')" prop="tdColor6">
                  <el-input v-model="standEdit.tdColor6" size="small" :placeholder="$t('rscBaseStand.qingshuru')" />
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData('standEdit'):updateData('standEdit')"
        >{{ $t('rscBaseStand.queren') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('rscBaseStand.quxiao') }}</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog :visible.sync="dialogDetVisible" :title="$t('rscBaseStand.xiangqing')" width="100%">
      <div class="basic">
        <div class="title">{{ $t('rscBaseStand.jizhanxinxi') }}</div>
        <table>
          <tr>
            <td class="blackMark">{{ $t('rscBaseStand.jizhanmingcheng:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.standName }}</span>
            </td>
            <td class="blackMark">{{ $t('rscBaseStand.jizhanbianhao:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.standNo }}</span>
            </td>
            <td class="blackMark">{{ $t('rscBaseStand.jizhantongdao:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.standChannel }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('rscBaseStand.jizhanIP:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.standIp }}</span>
            </td>
            <td class="blackMark">{{ $t('rscBaseStand.jizhanjingdu:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.precisions }}</span>
            </td>
            <td class="blackMark">{{ $t('rscBaseStand.jizhanmoshi:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.standMode | standMode }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('rscBaseStand.yinpincaiyanglv:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.samplingRate }}</span>
            </td>
            <td class="blackMark">{{ $t('rscBaseStand.baojingyuzhi:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.alarmThreshold }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('rscBaseStand.yansequzhifanwei1:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor1 }}</span>
            </td>
            <td class="blackMark">{{ $t('rscBaseStand.yansequzhifanwei2:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor2 }}</span>
            </td>
            <td class="blackMark">{{ $t('rscBaseStand.yansequzhifanwei3:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor3 }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('rscBaseStand.yansequzhifanwei4:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor4 }}</span>
            </td>
            <td class="blackMark">{{ $t('rscBaseStand.yansequzhifanwei5:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor5 }}</span>
            </td>
            <td class="blackMark">{{ $t('rscBaseStand.yansequzhifanwei6:') }}</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor6 }}</span>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetVisible = false">{{ $t('rscBaseStand.quxiao') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllList, save, deleteData, update, getInfo } from '@/api/rsc/baseStand'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { validIp } from '@/utils'
// import FilenameOption from '@/views/components/FilenameOption'
export default {
  name: 'SysUser',
  // components: { FilenameOption },
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
            return 'Vibration monitor mode'
          case 1:
            return 'Capability detection mode'
          default:
            break
        }
      }
    }
  },
  data() {
    return {
      list: [],
      total: null,
      rscInfo: {},
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      dialogDetVisible: false,
      dialogStatus: '',
      yemianbiaoti: '',
      textMap: {
        update: 'Modify',
        create: 'Add'
      },
      rules: {
        standName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        standNo: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        standChannel: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        tdColor1: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        tdColor2: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        tdColor3: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        tdColor4: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        tdColor5: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        tdColor6: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        standIp: [
          { required: true, message: '请输入', trigger: 'blur' },
          { required: true, validator: validIp, trigger: 'blur' }
        ]
      },
      standEdit: {},
      filename: ''
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && setTimeout(() => {
        this.$refs['standEdit'].resetFields()
        this.standEdit = {}
      }, 100)
    },
    dialogStatus(val) {
      if (this.$i18n.locale === 'cn') {
        switch (val) {
          case 'update':
            this.yemianbiaoti = '编辑'
            return this.yemianbiaoti
          case 'create':
            this.yemianbiaoti = '新增'
            return this.yemianbiaoti
          default:
            break
        }
      } else if (this.$i18n.locale === 'en') {
        switch (val) {
          case 'update':
            this.yemianbiaoti = 'Modify'
            return this.yemianbiaoti
          case 'create':
            this.yemianbiaoti = 'Create'
            return this.yemianbiaoti
          default:
            break
        }
      }
    }
  },
  created() { },
  mounted() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      getAllList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      if (this.listQuery.keywords === '') {
        this.listQuery.keywords = undefined
      }
      this.listQuery.page = 1
      this.getList()
    },
    // 新增
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 新增提交
    createData(formName) {
      if (this.$i18n.locale === 'cn') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            save(this.standEdit).then((response) => {
              if (response.data) {
                this.$message.success('保存成功')
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        })
      } else if (this.$i18n.locale === 'en') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            save(this.standEdit).then((response) => {
              if (response.data) {
                this.$message.success('Saved successfully')
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('Save failed')
              }
            })
          }
        })
      }
    },
    // 修改
    handleUpdate(row) {
      // if (!checkPermission(['rscStation/info'])) {
      //   this.$message.error('您没有详情权限')
      //   return false
      // }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getInfo({ id: row.id }).then(response => {
        this.standEdit = response.data
      })
    },
    // 修改提交
    updateData(formName) {
      if (this.$i18n.locale === 'cn') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            update(this.standEdit).then((response) => {
              if (response.data) {
                this.$message.success('修改成功')
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('修改失败')
              }
            })
          }
        })
      } else if (this.$i18n.locale === 'en') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            update(this.standEdit).then((response) => {
              if (response.data) {
                this.$message.success('Successfully modified')
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('Save failed')
              }
            })
          }
        })
      }
    },
    handleDelete(row) {
      if (this.$i18n.locale === 'cn') {
        this.$confirm('将删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteData({ id: row.id }).then(response => {
            if (response.data) {
              this.$message.success('删除成功')
              this.getList()
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (this.$i18n.locale === 'en') {
        this.$confirm('This record will be deleted, do you want to continue?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteData({ id: row.id }).then(response => {
            if (response.data) {
              this.$message.success('Successfully deleted')
              this.getList()
            } else {
              this.$message.error('Failed to delete')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancelled to delete'
          })
        })
      }
    },
    handleDownload() {
      if (this.$i18n.locale === 'cn') {
        getAllList({ page: 1, limit: this.total }).then(response => {
          const list = response.data.list
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['基站名称', '基站编号', '基站IP', '基站精度']
            const filterVal = ['standName', 'standNo', 'standIp', 'precisions']
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename
            })
          })
        })
      } else if (this.$i18n.locale === 'en') {
        getAllList({ page: 1, limit: this.total }).then(response => {
          const list = response.data.list
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['BaseStation name', 'BaseStation number', 'BaseStation IP', 'BaseStation ACC']
            const filterVal = ['standName', 'standNo', 'standIp', 'precisions']
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename
            })
          })
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleDetail(row) {
      // if (!checkPermission(['aiModel/info'])) {
      //   this.$message.error('您没有详情权限')
      //   return false
      // }
      this.dialogDetVisible = true
      getInfo({ id: row.id }).then(response => {
        this.rscInfo = response.data
      })
    }
  }
}
</script>
