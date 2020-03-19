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
        @click="handleCreate"
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
      @row-click="handleDetail"
    >
      <el-table-column label="模型名称" prop="modelName" />
      <el-table-column label="描述" prop="modelDesc" />
      <el-table-column label="训练进度" width="160">
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.process" />
        </template>
      </el-table-column>
      <el-table-column label="模型类型数" prop="typeCount" />
      <el-table-column label="模型存放路径" prop="path" />
      <el-table-column label="模型置信度" prop="score" />
      <el-table-column label="操作" width="460">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click.stop="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            type="danger"
            size="small"
            @click.stop="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            type="primary"
            size="small"
            @click.stop="handleSign(scope.row)"
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="25%">
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
                <el-form-item label="模型名称" prop="modelName">
                  <el-input
                    v-model="modelEdit.modelName"
                    style="width:60%"
                    size="small"
                    placeholder="请输入模型名称"
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="width33">
                <el-form-item label="描述" prop="modelDesc">
                  <el-input
                    v-model="modelEdit.modelDesc"
                    style="width:60%"
                    type="textarea"
                    :rows="2"
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
          type="primary"
          @click="dialogStatus == 'create' ? createData('modelEdit') : updateData('modelEdit')"
        >确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 标记 -->
    <el-dialog :visible.sync="dialogSignVisible" title="标记" width="100%">
      <el-form
        ref="signEdit"
        :rules="rules"
        :model="signEdit"
        :show-message="false"
        inline
        status-icon
      >
        <div class="basic">
          <div class="filter-container" style="position:relative">
            <td>
              <el-form-item label="标记类型" prop="typeId">
                <el-select
                  v-model="signEdit.typeId"
                  placeholder="请选择标记类型"
                  style="width: 200px;"
                  class="filter-item"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in aiModelTypeList"
                    :key="item.id"
                    :label="item.typeZhName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </td>
          </div>
          <div class="title">
            <span>历史告警列表</span>
          </div>
          <div class="filter-container" style="position:relative">
            <el-input
              v-model="listQueryType.keywords"
              placeholder="请输入中心点"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleTypeFilter"
            />
            <el-button class="filter-item" icon="el-icon-search" @click="handleTypeFilter" />
          </div>
          <el-table
            ref="historyTable"
            :header-cell-style="{background: 'rgb(22, 159, 231)', textAlign: 'center', color: 'white'}"
            :data="historyList"
            stripe
            highlight-current-row
            height="500"
            row-key="historyId"
            @selection-change="handleHistoryChange"
          >
            <el-table-column type="selection" width="55" reserve-selection />
            <el-table-column label="基站" prop="standName" />
            <el-table-column label="开始点" prop="startCol" />
            <el-table-column label="中心点" prop="centerCol" />
            <el-table-column label="结束点" prop="endCol" />
            <el-table-column label="识别类型" prop="typeId" />
            <el-table-column label="开始时间" prop="beginTime" width="110" />
            <el-table-column label="结束时间" prop="endTime" width="110" />
            <el-table-column label="震动次数" prop="freq" />
            <el-table-column label="是否处理">
              <template slot-scope="scope">
                <span>{{ scope.row.type | type }}</span>
              </template>
            </el-table-column>
            <el-table-column label="音频" width="320">
              <template slot-scope="scope">
                <audio :id="scope.row.id" controls="controls">
                  <source :src="scope.row.oggUrl">
                  <source :src="scope.row.fileName">
                </audio>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-show="historyTotal>0"
              :current-page="listQueryType.page"
              :page-sizes="[10,20,30, 50]"
              :page-size="listQueryType.limit"
              :total="historyTotal"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChangeType"
              @current-change="handleCurrentChangeType"
            />
          </div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="signCreate('signEdit')"
        >确认</el-button>
        <el-button @click="dialogSignVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--添加类型页面 -->
    <el-dialog title="添加类型" :visible.sync="dialogAddVisible" width="80%">
      <el-form
        ref="typeEdit"
        :rules="rules"
        :model="typeEdit"
        :show-message="false"
        inline
        status-icon
      >
        <div class="basic">
          <table>
            <tr>
              <td class="width33">
                <el-form-item label="类型英文名" prop="typeEnName">
                  <el-input
                    v-model="typeEdit.typeEnName"
                    style="width:60%"
                    size="small"
                    placeholder="请输入模型名称"
                  />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item label="模型中文名" prop="typeZhName">
                  <el-input
                    v-model="typeEdit.typeZhName"
                    style="width:60%"
                    size="small"
                    placeholder="请输入模型描述"
                  />
                </el-form-item>
              </td>
              <td>
                <el-form-item label="权重因子" prop="weight">
                  <el-select
                    v-model="typeEdit.weight"
                    placeholder="请选择"
                    style="width:60%;"
                    class="filter-item"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in weightlList"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <el-form-item label="类型图标">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess1"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="typeEdit.typeIcon" :src="typeEdit.typeIcon" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
              <td width="33%">
                <el-form-item label="红色报警图标">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess2"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="typeEdit.alarmIconRed" :src="typeEdit.alarmIconRed" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
              <td width="33%">
                <el-form-item label="橙色报警图标">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess3"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="typeEdit.alarmIconOrange" :src="typeEdit.alarmIconOrange" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <el-form-item label="黄色报警图标">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess4"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="typeEdit.alarmIconYellow" :src="typeEdit.alarmIconYellow" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
              <td width="33%">
                <el-form-item label="蓝色报警图标">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess5"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="typeEdit.alarmIconBlue" :src="typeEdit.alarmIconBlue" class="avatar">
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
          type="primary"
          @click="typeData('typeEdit')"
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

    <!-- 详情 -->
    <el-dialog :visible.sync="dialogDetVisible" title="详情" width="100%">
      <div class="basic">
        <div class="title">模型信息</div>
        <table>
          <tr>
            <td class="blackMark">模型名称：</td>
            <td class="width21">
              <span>{{ modelInfo.modelName }}</span>
            </td>
            <td class="blackMark">模型描述：</td>
            <td class="width21">
              <span>{{ modelInfo.modelDesc }}</span>
            </td>
            <td class="blackMark">训练进度：</td>
            <td class="width21">
              <span>{{ modelInfo.process }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">模型存放路径：</td>
            <td class="width21">
              <span>{{ modelInfo.path }}</span>
            </td>
            <td class="blackMark">置信度：</td>
            <td class="width21">
              <span>{{ modelInfo.score }}</span>
            </td>
          </tr>
        </table>
        <div class="title">类型信息</div>
        <table>
          <tr
            v-for="(item,index) in modelInfo.typeList"
            :key="index"
            style="border-bottom: 1px solid #eeeeee;"
          >
            <td class="blackMark">类型英文名：</td>
            <td class="width21">
              <span>{{ item.typeEnName }}</span>
            </td>
            <td class="blackMark">类型中文名：</td>
            <td class="width21">
              <span>{{ item.typeZhName }}</span>
            </td>
            <td class="blackMark">权重因子：</td>
            <td class="width21">
              <span>{{ item.weight | weight }}</span>
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
import { getAllList, getInfo, saveType, update, getHisList, save, deleteData, bindAlarm } from '@/api/AI/aimodel'
import { aiModelTypeList } from '@/api/public'
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
    weight: function(val) {
      switch (val) {
        case 0:
          return '0'
        case 1:
          return '1'
        default:
          break
      }
    }
  },
  data() {
    return {
      list: [],
      total: null,
      historyTotal: null,
      listLoading: true,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      listQueryType: {
        page: 1,
        limit: 20
      },
      dialogDetVisible: false,
      dialogSignVisible: false,
      dialogAddVisible: false,
      uploadVisible: false,
      excelFlag: false,
      importUrl: process.env.VUE_APP_BASE_API + 'api-web/rsc/rscCable/uploadExcel',
      uploadUrl: process.env.VUE_APP_BASE_API + 'api-web/public/uploadFile',
      fileList: [],
<<<<<<< HEAD
      ids: [],
=======
>>>>>>> aef9e9e31343607694c1dfe917dfc44713e9a0a7
      aiModelTypeList: [],
      modelInfo: {},
      modelEdit: {},
      signEdit: {},
      typeEdit: {},
      historyList: [],
      weightlList: [{ id: 0, value: '0' }, { id: 1, value: '1' }],
      soluTypelList: [{ id: 0, value: '未处理' }, { id: 1, value: '已处理' }],
      dialogFormVisible: false,
      rules: {
        modelName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        modelDesc: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择', trigger: 'chage' }
<<<<<<< HEAD
        ],
=======
        ]
      },
      AddRules: {
>>>>>>> aef9e9e31343607694c1dfe917dfc44713e9a0a7
        weight: [
          { required: true, message: '请选择', trigger: 'chage' }
        ],
        typeEnName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        typeZhName: [
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
        this.modelInfo = {}
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
        this.$refs['typeEdit'].resetFields()
        this.typeEdit = {}
      }, 100)
    },
    dialogSignVisible(val) {
      !val && setTimeout(() => {
        this.signEdit = {}
        this.listQueryType = {
          page: 1,
          limit: 20
        }
        this.$refs['historyTable'].clearSelection()
      }, 100)
    }
  },
  created() { },
  mounted() {
    this.getList()
  },
  methods: {
    checkPermission,
    getHistoryList() {
      this.listLoading = true
      getHisList(this.listQueryType).then(response => {
        this.historyList = response.data.list
        this.historyTotal = response.data.total
        this.listLoading = false
      })
    },
    getList() {
      this.listLoading = true
      getAllList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getMtList() {
      aiModelTypeList({ aiModelId: this.aiModelId }).then(response => {
        this.aiModelTypeList = response.data
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
<<<<<<< HEAD
    handleTypeFilter() {
      if (this.listQueryType.keywords === '') {
        this.listQueryType.keywords = undefined
      }
      this.listQueryType.page = 1
      this.getHistoryList()
    },
=======
>>>>>>> aef9e9e31343607694c1dfe917dfc44713e9a0a7
    handleDetail(row) {
      this.dialogDetVisible = true
      getInfo({ id: row.id }).then(response => {
        this.modelInfo = response.data
      })
    },
    handleCurrentChangeType(val) {
<<<<<<< HEAD
      this.listQueryType.page = val
      this.getHistoryList()
=======
      this.listQueryMember.page = val
      this.getMembersList()
>>>>>>> aef9e9e31343607694c1dfe917dfc44713e9a0a7
    },
    handleSizeChangeType(val) {
      this.listQueryType.limit = val
      this.getHistoryList()
    },
    handleImport() {
      this.uploadVisible = true
    },
    handleHistoryChange(val) {
      this.ids = val.map(x => x.id)
      console.log(this.ids)
    },
    // 标记
    handleSign(row) {
      this.aiModelId = row.id
      this.dialogSignVisible = true
      this.getHistoryList()
      this.getMtList()
    },
    // 标记
    signCreate() {
<<<<<<< HEAD
      if (this.ids.length === 0) {
        this.$message.error('至少需要选择一条数据')
        return false
      }
=======
>>>>>>> aef9e9e31343607694c1dfe917dfc44713e9a0a7
      this.signEdit.alarmIdList = this.ids
      bindAlarm(this.signEdit).then((response) => {
        if (response.data) {
          this.$message.success('标记成功')
          this.dialogSignVisible = false
          this.getList()
        } else {
          this.$message.error('标记失败')
        }
      })
    },

    // 新增
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 修改
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getInfo({ id: row.id }).then(response => {
        this.modelEdit = response.data
      })
    },
    // 添加类型
    handleAdd(row) {
      this.id = row.id
      this.dialogAddVisible = true
    },
    // 新增提交
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          save(this.modelEdit).then((response) => {
            if (response.data) {
              this.$message.success('操作成功')
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$message.error('操作失败')
            }
          })
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          update(this.modelEdit).then(response => {
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
    // 添加类型提交
    typeData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.typeEdit.modelId = this.id
          saveType(this.typeEdit).then((response) => {
            if (response.data) {
              this.$message.success('操作成功')
              this.dialogAddVisible = false
              this.getList()
            } else {
              this.$message.error('操作失败')
            }
          })
        }
      })
    },
    // 删除
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
    uploadAvatarSuccess1(response, file, fileList) {
      this.$set(this.typeEdit, 'typeIcon', response.data)
    },
    uploadAvatarSuccess2(response, file, fileList) {
      this.$set(this.typeEdit, 'alarmIconRed', response.data)
    },
    uploadAvatarSuccess3(response, file, fileList) {
      this.$set(this.typeEdit, 'alarmIconOrange', response.data)
    },
    uploadAvatarSuccess4(response, file, fileList) {
      this.$set(this.typeEdit, 'alarmIconYellow', response.data)
    },
    uploadAvatarSuccess5(response, file, fileList) {
      this.$set(this.typeEdit, 'alarmIconBlue', response.data)
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
