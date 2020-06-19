<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">
      <el-input
        v-model="listQuery.keywords"
        placeholder="请输入基站名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />
    </div>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :header-cell-style="{background: 'rgb(22, 159, 231)', textAlign: 'center', color: 'white'}"
      :data="list"
      stripe
      :row-style="{textAlign: 'center'}"
      highlight-current-row
      height="500"
      @row-click="handleDetail"
    >
      <el-table-column label="基站名称" prop="standName" />
      <el-table-column label="基站编号" prop="standNo" />
      <el-table-column label="基站通道" prop="standChannel" />
      <el-table-column label="基站IP" prop="standIp" />
      <el-table-column label="基站精度" prop="precisions" />
      <el-table-column label="基站模式">
        <template slot-scope="scope">
          {{ scope.row.standMode | standMode }}
        </template>
      </el-table-column>
      <el-table-column label="音频采样率" prop="samplingRate" />
      <el-table-column label="报警阈值" prop="alarmThreshold" />
      <el-table-column label="操作" width="260">
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
          >编辑</el-button>
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
            <span>台站信息</span>
          </div>
          <table>
            <tr>
              <td class="width33">
                <el-form-item label="基站名称" prop="standName">
                  <el-input v-model="standEdit.standName" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item label="基站编号" prop="standNo">
                  <el-input v-model="standEdit.standNo" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item label="基站IP" prop="standIp">
                  <el-input v-model="standEdit.standIp" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="width33">
                <el-form-item label="音频采样率" prop="samplingRate">
                  <el-input v-model="standEdit.samplingRate" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item label="报警阈值" prop="alarmThreshold">
                  <el-input v-model="standEdit.alarmThreshold" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
            </tr>

            <tr>
              <td class="width33">
                <el-form-item label="颜色取值范围1" prop="tdColor1">
                  <el-input v-model="standEdit.tdColor1" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item label="颜色取值范围2" prop="tdColor2">
                  <el-input v-model="standEdit.tdColor2" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item label="颜色取值范围3" prop="tdColor3">
                  <el-input v-model="standEdit.tdColor3" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="width33">
                <el-form-item label="颜色取值范围4" prop="tdColor4">
                  <el-input v-model="standEdit.tdColor4" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item label="颜色取值范围5" prop="tdColor5">
                  <el-input v-model="standEdit.tdColor5" size="small" placeholder="请输入" />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item label="颜色取值范围6" prop="tdColor6">
                  <el-input v-model="standEdit.tdColor6" size="small" placeholder="请输入" />
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
        >确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog :visible.sync="dialogDetVisible" title="详情" width="100%">
      <div class="basic">
        <div class="title">基站信息</div>
        <table>
          <tr>
            <td class="blackMark">基站名称：</td>
            <td class="width21">
              <span>{{ rscInfo.standName }}</span>
            </td>
            <td class="blackMark">基站编号：</td>
            <td class="width21">
              <span>{{ rscInfo.standNo }}</span>
            </td>
            <td class="blackMark">基站通道：</td>
            <td class="width21">
              <span>{{ rscInfo.standChannel }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">基站IP：</td>
            <td class="width21">
              <span>{{ rscInfo.standIp }}</span>
            </td>
            <td class="blackMark">基站精度：</td>
            <td class="width21">
              <span>{{ rscInfo.precisions }}</span>
            </td>
            <td class="blackMark">基站模式：</td>
            <td class="width21">
              <span>{{ rscInfo.standMode | standMode }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">采样率：</td>
            <td class="width21">
              <span>{{ rscInfo.samplingRate }}</span>
            </td>
            <td class="blackMark">报警阈值：</td>
            <td class="width21">
              <span>{{ rscInfo.alarmThreshold }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">颜色取值范围1：</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor1 }}</span>
            </td>
            <td class="blackMark">颜色取值范围2：</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor2 }}</span>
            </td>
            <td class="blackMark">颜色取值范围3：</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor3 }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">颜色取值范围4：</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor4 }}</span>
            </td>
            <td class="blackMark">颜色取值范围5：</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor5 }}</span>
            </td>
            <td class="blackMark">颜色取值范围6：</td>
            <td class="width21">
              <span>{{ rscInfo.tdColor6 }}</span>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetVisible = false">取消</el-button>
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
      textMap: {
        update: '修改',
        create: '新增'
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
    },
    handleDelete(row) {
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
    },
    handleDownload() {
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
