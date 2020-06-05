<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">
      <el-input
        v-model="listQuery.keywords"
        placeholder="请输入账号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />

      <el-select
        v-model="listQuery.roleId"
        class="filter-item"
        placeholder="系统角色筛选"
        clearable
        filterable
        style="width: 150px"
        @change="handleFilter"
      >
        <el-option
          v-for="(item, index) in roleList"
          :key="index"
          :value="item.id"
          :label="item.roleName"
        />
      </el-select>

      <el-button
        v-if="checkPermission(['systemUser/save'])"
        class="filter-item"
        style="position:absolute;right:0px"
        type="primary"
        @click="handleCreate"
      >新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :header-cell-style="{background: 'rgb(22, 159, 231)', textAlign: 'center', color: 'white'}"
      :data="list"
      stripe
      highlight-current-row
      fit
      height="500"
    >
      <el-table-column label="角色名称" prop="roleName" />
      <el-table-column label="账号" prop="username" />
      <el-table-column label="真实姓名" prop="realname" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | status(translate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="330">
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['systemUser/changeStatus'])"
            v-show="scope.row.status == 1 && scope.row.id !== 1"
            type="primary"
            size="small"
            @click.stop="handleChangeStatus(scope.row)"
          >启用</el-button>
          <el-button
            v-if="checkPermission(['systemUser/changeStatus'])"
            v-show="scope.row.status == 0 && scope.row.id !== 1"
            type="warning"
            size="small"
            @click.stop="handleChangeStatus(scope.row)"
          >停用</el-button>
          <el-button
            v-if="checkPermission(['systemUser/resetPassword'])"
            type="danger"
            size="small"
            @click.stop="handleReset(scope.row)"
          >重置密码</el-button>
          <el-button
            v-if="checkPermission(['systemUser/update'])"
            type="primary"
            size="small"
            @click.stop="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="checkPermission(['systemUser/delete'])"
            v-show="scope.row.id !== 1"
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
        ref="sysUserEdit"
        :rules="rules"
        :model="sysUserEdit"
        inline
        :show-message="false"
        status-icon
      >
        <div class="basic">
          <div class="title">
            <span>系统用户信息</span>
          </div>
          <table>
            <tr>
              <td width="33%">
                <el-form-item label="角色名称" prop="roleId">
                  <el-select
                    v-model="sysUserEdit.roleId"
                    filterable
                    clearable
                    placeholder="请选择"
                    size="small"
                    @change="roleChange"
                  >
                    <el-option
                      v-for="item in roleList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.roleName"
                    />
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <el-form-item label="手机号" prop="mobile">
                  <el-input
                    v-model="sysUserEdit.mobile"
                    size="small"
                    placeholder="请输入"
                  />
                </el-form-item>
              </td>
              <td width="33%">
                <el-form-item label="账号" prop="username">
                  <el-input
                    v-show="dialogStatus == 'create'"
                    v-model="sysUserEdit.username"
                    size="small"
                    placeholder="请输入"
                  />
                  <span v-show="dialogStatus == 'update'">：</span>
                  <span v-show="dialogStatus == 'update'" v-text="sysUserEdit.username" />
                </el-form-item>
              </td>
              <td v-if="dialogStatus == 'create'" width="33%">
                <el-form-item label="密码" prop="password">
                  <el-input
                    v-model="sysUserEdit.password"
                    size="small"
                    placeholder="请输入"
                  />
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData('sysUserEdit'):updateData('sysUserEdit')"
        >确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllList, save, deleteData, update, getInfo, changeStatus, resetPassword } from '@/api/system/systemUser'
import waves from '@/directive/waves' // 水波纹指令
import { validPhone } from '@/utils'

import { roleList } from '@/api/public'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'SysUser',

  directives: {
    waves
  },
  filters: {
    status: function(val, translate) {
      switch (val) {
        case 0:
          return '启用'
        case 1:
          return '停用'

        default:
          break
      }
    }
  },
  data() {
    return {
      list: [],
      filename: '',
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
        companyId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        platformId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        carrierId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validPhone, trigger: 'blur' }
        ]
      },
      roleList: [],
      thirdPartyCompanyList: [],
      sysUserEdit: {},
      orgSelectList: [],
      TPCList: []
    }
  },
  watch: {
    dialogFormVisible(val) {
      !val && setTimeout(() => {
        this.$refs['sysUserEdit'].resetFields()
        this.sysUserEdit = {}
      }, 100)
    }
  },
  created() { },
  mounted() {
    this.getList()
    this.getSelectList()
  },
  methods: {
    checkPermission,
    translate(str) {
      return (str)
    },
    getSelectList() {
      roleList().then(response => {
        this.roleList = response.data
      })
    },

    handleOrgChange() {
      if (this.listQuery.keywords === '') {
        this.listQuery.keywords = undefined
      }
      this.listQuery.page = 1
      this.getTPCList()
      this.getList()
    },

    getList() {
      this.listLoading = true
      getAllList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        this.userid = response.data.list.id
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
    roleChange() {
      this.$set(this.sysUserEdit, 'platformId', null)
      this.$set(this.sysUserEdit, 'carrierId', null)
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
          save(this.sysUserEdit).then((response) => {
            if (response.data) {
              this.$message.success('新增成功')
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$message.error('新增失败')
            }
          })
        }
      })
    },
    // 修改
    handleUpdate(row) {
      if (!checkPermission(['systemUser/info'])) {
        this.$message.error('没有详情权限')
        return false
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getInfo({ id: row.id }).then(response => {
        this.sysUserEdit = response.data
        this.sysUserEdit.id = response.data.id
      })
    },
    // 修改提交
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          update(this.sysUserEdit).then((response) => {
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
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        deleteData({ id: row.id }).then(response => {
          if (response.data) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error('删除成功')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleChangeStatus(row) {
      changeStatus({ id: row.id }).then(res => {
        if (res.data) {
          this.$message.success('操作成功')
          this.getList()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    handleReset(row) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).then(() => {
        resetPassword({ id: row.id }).then(response => {
          if (response.data) {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error('操作失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },
    handleDownload() {
      getAllList({ page: 1, limit: this.total }).then(response => {
        const list = response.data.list
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['角色名称', '平台名称', '承运商名称', '账号', '手机号', '状态']
          const filterVal = ['roleName', 'platformName', 'carrierName', 'username', 'mobile', 'status']
          list.forEach((item, index) => {
            if (item.status === 0) {
              item.status = ('system.sysUser.status0')
            } else if (item.status === 1) {
              item.status = ('system.sysUser.status1')
            }
          })

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
