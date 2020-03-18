<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">
      <el-input
        v-model="listQuery.keywords"
        placeholder="请输入模型名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />

      <el-button
        class="filter-item"
        style="position:absolute;right:120px"
        type="primary"
        @click="handleCreate(scope.row)"
      >模型添加</el-button>
      <el-button
        class="filter-item"
        style="position:absolute;right:0px"
        type="primary"
        @click="handleImport"
      >模型导入</el-button>
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
      <el-table-column label="模型名称" prop="alarmType" />
      <el-table-column label="描述" prop="amplitude" />
      <el-table-column label="训练进度" prop="beginCol" />
      <el-table-column label="模型类型数" prop="centerCol" />
      <el-table-column label="模型存放路径" prop="endCol" />
      <el-table-column label="模型置信度" prop="beginTime" />
      <el-table-column label="操作" width="460">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click.stop="handleDetail(scope.row)"
          >修改</el-button>
          <el-button
            type="danger"
            size="small"
            @click.stop="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            type="primary"
            size="small"
            @click.stop="handleSolu(scope.row)"
          >标记</el-button>
          <el-button
            type="primary"
            size="small"
            @click.stop="handleSolu(scope.row)"
          >训练</el-button>
          <el-button
            type="primary"
            size="small"
            @click.stop="handleAdd(scope.row)"
          >添加类型</el-button>
          <el-button
            type="primary"
            size="small"
            @click.stop="handleSolu(scope.row)"
          >导出</el-button>
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
    <el-dialog title="模型添加" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        ref="modelEdit"
        :rules="rules"
        :model="modelEdit"
        :show-message="false"
        inline
        status-icon
      >
        <div class="basic">
          <table>
            <tr>
              <td class="width33">
                <el-form-item label="模型名称" prop="solution">
                  <el-input
                    v-model="modelEdit.solution"
                    type="textarea"
                    size="small"
                    placeholder="请输入模型名称"
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="width33">
                <el-form-item label="描述" prop="solution">
                  <el-input
                    v-model="modelEdit.solution"
                    type="textarea"
                    size="small"
                    placeholder="请输入模型描述"
                  />
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-show="modelEdit.id"
          type="primary"
          @click="createData('modelEdit')"
        >确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--添加类型页面 -->
    <el-dialog title="添加类型" :visible.sync="dialogAddVisible" width="30%">
      <el-form
        ref="modelEdit"
        :rules="rules"
        :model="modelEdit"
        :show-message="false"
        inline
        status-icon
      >
        <div class="basic">
          <table>
            <tr>
              <td width="33%">
                <el-form-item label="报警图标">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="modelEdit.logoUrl" :src="modelEdit.logoUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-show="modelEdit.id"
          type="primary"
          @click="typeData('modelEdit')"
        >确认</el-button>
        <el-button @click="dialogAddVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog
      :visible.sync="uploadVisible"
      :close-on-click-modal="false"
      title="提示"
      width="30%"
      style="text-align: center"
    >
      <el-upload
        ref="uploadExcel"
        :action="importUrl"
        :file-list="fileList"
        :show-file-list="false"
        :on-progress="uploadExcelProcess"
        :on-error="importError"
        :on-success="importSuccess"
        :headers="headers"
        class="uploadExcel"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处,或
          <em>点击上传</em>
        </div>
        <el-progress
          v-if="excelFlag == true"
          type="circle"
          :width="183"
          :percentage="uploadPercent"
          class="progress"
        />
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getAllList, getInfo, resolve } from '@/api/alarm/alarmInfo'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'SysUser',
  directives: {
    waves
  },
  filters: {
    type: function(val) {
      switch (val) {
        case 0:
          return '未处理'
        case 1:
          return '已处理'
        default:
          break
      }
    },
    dangerLevel: function(val) {
      switch (val) {
        case 0:
          return '断纤'
        case 1:
          return 1
        case 2:
          return 2
        case 3:
          return 3
        default:
          break
      }
    },
    isAlarm: function(val) {
      switch (val) {
        case 0:
          return '提醒'
        case 1:
          return '报警'
        default:
          break
      }
    }
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
      dialogDetVisible: false,
      dialogAddVisible: false,
      uploadVisible: false,
      excelFlag: false,
      importUrl: process.env.BASE_API + 'api-web/rsc/rscCable/uploadExcel', uploadUrl: process.env.VUE_APP_BASE_API + 'api-web/ossUpload/uploadFile',
      fileList: [],
      alarmInfo: {},
      modelEdit: {},
      soluTypelList: [{ id: 0, value: '未处理' }, { id: 1, value: '已处理' }],
      dialogFormVisible: false,
      rules: {
        solution: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    headers() {
      return {
        'Authorization': 'Bearer ' + this.$store.getters.token,
        'orgId': this.$store.getters.orgId
      }
    }
  },
  watch: {
    dialogDetVisible(val) {
      !val && setTimeout(() => {
        this.alarmInfo = {}
      }, 100)
    },
    dialogFormVisible(val) {
      !val && setTimeout(() => {
        this.$refs['modelEdit'].resetFields()
        this.modelEdit = {}
      }, 100)
    },
    uploadVisible(val) {
      !val && setTimeout(() => {
        this.$refs['uploadExcel'].clearFiles()
        this.$refs['uploadExcel'].abort()
        this.excelFlag = false
        this.uploadPercent = 0
        this.fileList = []
      }, 100)
    },
    dialogAddVisible(val) {
      !val && setTimeout(() => {
        this.$refs['modelEdit'].resetFields()
        this.modelEdit = {}
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
    handleDetail(row) {
      this.dialogDetVisible = true
    //   getInfo({ id: row.id }).then(response => {
    //     this.alarmInfo = response.data
    //   })
    },

    handleImport() {
      this.uploadVisible = true
    },
    // 新增
    handleCreate(row) {
      this.modelEdit.id = row.id
      this.dialogFormVisible = true
    },
    // 添加类型
    handleAdd(row) {
      this.modelEdit.id = row.id
      this.dialogAddVisible = true
    },
    handleSeeSolu(row) {
      this.modelEdit.solution = row.solution
      this.dialogFormVisible = true
    },
    // 新增提交
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //   resolve(this.modelEdit).then((response) => {
        //     if (response.data) {
        //       this.$message.success('操作成功')
        //       this.dialogFormVisible = false
        //       this.getList()
        //     } else {
        //       this.$message.error('操作失败')
        //     }
        //   })
        }
      })
    },
    // 添加类型提交
    typeData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //   resolve(this.modelEdit).then((response) => {
        //     if (response.data) {
        //       this.$message.success('操作成功')
        //       this.dialogAddVisible = false
        //       this.getList()
        //     } else {
        //       this.$message.error('操作失败')
        //     }
        //   })
        }
      })
    },
    excelImport() {
      this.uploadVisible = true
    },
    importSuccess(response, file, fileList) {
      if (response.code !== 200) {
        this.excelFlag = false
        this.$message.error(response.msg)
      } else {
        this.dialogFormVisible = true
        this.excelFlag = false
        this.uploadVisible = false
        this.dialogStatus = 'create'
        this.cableEdit = response.data
      }
    },
    importError(err, file, fileList) {
      this.excelFlag = false
      this.$message.error('导入出现错误')
      console.log(err)
    },
    uploadExcelProcess(event, file, fileList) {
      this.excelFlag = true
      this.uploadPercent = parseInt(file.percentage)
    },
    // 上传图片
    uploadAvatarSuccess(response, file, fileList) {
      this.modelEdit.logoUrl = response.data
    },
    // 文件大小限制提示
    beforeAvatarUpload(file) {
      // if (!checkPermission(['ossUpload/**'])) {
      //   this.$message.error('您没有文件上传权限')
      //   return false
      // }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传大小不能超过 5MB!')
      }
      return isLt2M
    }
  }
}
</script>
