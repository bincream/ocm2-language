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

      <FilenameOption v-model="filename" class="filter-item" />
      <el-button type="primary" icon="document" class="filter-item" @click="handleDownload">导出Excel</el-button>

      <el-button
        class="filter-item"
        style="position:absolute;right:0px"
        type="primary"
        @click="handleCreate"
      >新增</el-button>
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
    >
      <el-table-column label="基站名称" prop="standName" />
      <el-table-column label="基站编号" prop="standNo" />
      <el-table-column label="基站IP" prop="standIp" />
      <el-table-column label="基站精度" prop="precisions" />

      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click.stop="handlePre(scope.row)"
          >获取精度</el-button>
          <el-button
            type="primary"
            size="small"
            @click.stop="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click.stop="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

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
                <el-form-item label="基站精度" prop="precisions">
                  <el-input v-model="standEdit.precisions" size="small" placeholder="请输入" />
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
  </div>
</template>

<script>
import { getAllList, save, deleteData, update, getInfo, getPrecisions } from '@/api/rsc/baseStand'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { validIp } from '@/utils'
import FilenameOption from '@/views/components/FilenameOption'
export default {
  name: 'SysUser',
  components: { FilenameOption },
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
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
      if (!checkPermission(['rscStation/info'])) {
        this.$message.error('您没有详情权限')
        return false
      }
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
    handlePre(row) {
      getPrecisions({ id: row.id }).then((response) => {
        if (response.data) {
          this.$message.success('获取基站精度成功')
          this.getList()
        } else {
          this.$message.error('获取基站精度失败')
        }
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
    }
  }
}
</script>
