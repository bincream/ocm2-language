/* eslint-disable vue/no-v-html */
<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">
      <el-input
        v-model="listQuery.keywords"
        placeholder="请输入类型中英文名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />
    </div>

    <el-table
      ref="typeTable"
      v-loading="listLoading"
      :header-cell-style="{background: 'rgb(22, 159, 231)', textAlign: 'center', color: 'white'}"
      :data="list"
      stripe
      :row-style="{textAlign: 'center'}"
      highlight-current-row
      height="500"
      @row-click="handleDetail"
    >
      <el-table-column label="类型英文名" prop="typeEnName" />
      <el-table-column label="类型中文名" prop="typeZhName" />
      <el-table-column label="所属模型" prop="modelName" />
      <el-table-column label="权重因子">
        <template slot-scope="scope">
          <span>{{ scope.row.weight | weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型图标">
        <template slot-scope="scope">
          <img :src="scope.row.typeIcon" al class="mini" @click.stop="bigImg(scope.row.typeIcon)">
        </template>
      </el-table-column>
      <el-table-column label="红色报警图标">
        <template slot-scope="scope">
          <img :src="scope.row.alarmIconRed" al class="mini" @click.stop="bigImg(scope.row.alarmIconRed)">
        </template>
      </el-table-column>
      <el-table-column label="橙色报警图标">
        <template slot-scope="scope">
          <img :src="scope.row.alarmIconOrange" al class="mini" @click.stop="bigImg(scope.row.alarmIconOrange)">
        </template>
      </el-table-column>
      <el-table-column label="黄色报警图标">
        <template slot-scope="scope">
          <img :src="scope.row.alarmIconYellow" al class="mini" @click.stop="bigImg(scope.row.alarmIconYellow)">
        </template>
      </el-table-column>
      <el-table-column label="蓝色报警图标">
        <template slot-scope="scope">
          <img :src="scope.row.alarmIconBlue" al class="mini" @click.stop="bigImg(scope.row.alarmIconBlue)">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
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
            v-show="scope.row.type == 0"
            type="warning"
            size="small"
            @click.stop="handleSolu(scope.row)"
          >处理报警</el-button>
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

    <!-- 修改 -->
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
          @click="updateData('typeEdit')"
        >确认</el-button>
        <el-button @click="dialogAddVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog :visible.sync="dialogDetVisible" title="类型详情" width="100%">
      <div class="basic">
        <div class="title">类型信息</div>
        <table>
          <tr>
            <td class="blackMark">类型英文名:</td>
            <td class="width21">
              <span v-text="typeInfo.typeEnName" />
            </td>
            <td class="blackMark">类型中文名:</td>
            <td class="width21">
              <span v-text="typeInfo.typeZhName" />
            </td>
            <td class="blackMark">权重因子:</td>
            <td class="width21">
              <span>{{ typeInfo.weight | weight }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">类型图标：</td>
            <td width="21%">
              <img
                v-show="typeInfo.typeIcon"
                :src="typeInfo.typeIcon"
                alt
                class="border"
                @click="bigImg(typeInfo.typeIcon)"
              >
            </td>
            <td class="blackMark">红色报警图标：</td>
            <td width="21%">
              <img
                v-show="typeInfo.alarmIconRed"
                :src="typeInfo.alarmIconRed"
                alt
                class="border"
                @click="bigImg(typeInfo.alarmIconRed)"
              >
            </td>
            <td class="blackMark">橙色报警图标：</td>
            <td width="21%">
              <img
                v-show="typeInfo.alarmIconOrange"
                :src="typeInfo.alarmIconOrange"
                alt
                class="border"
                @click="bigImg(typeInfo.alarmIconOrange)"
              >
            </td>
          </tr>
          <tr>
            <td class="blackMark">黄色报警图标：</td>
            <td width="21%">
              <img
                v-show="typeInfo.alarmIconYellow"
                :src="typeInfo.alarmIconYellow"
                alt
                class="border"
                @click="bigImg(typeInfo.alarmIconYellow)"
              >
            </td>
            <td class="blackMark">蓝色报警图标：</td>
            <td width="21%">
              <img
                v-show="typeInfo.alarmIconBlue"
                :src="typeInfo.alarmIconBlue"
                alt
                class="border"
                @click="bigImg(typeInfo.alarmIconBlue)"
              >
            </td>
          </tr>
        </table>
        <div class="title">音频信息</div>
        <table>
          <tr
            v-for="(item,index) in typeInfo.typeAlarmList"
            :key="index"
            style="border-bottom: 1px solid #eeeeee;"
          >
            <td class="blackMark">中心点：</td>
            <td class="width21">
              <span>{{ item.centerCol }}</span>
            </td>
            <td class="blackMark">基站精度：</td>
            <td class="width21">
              <span>{{ item.precisions }}</span>
            </td>
            <td class="blackMark">音频：</td>
            <td class="width21">
              <audio :id="item.id" controls="controls">
                <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
                <source :src="item.oggUrl" >
                <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
                <!-- <source :src="scope.row.fileName" > -->
              </audio>
            </td>

          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--新增编辑页面 -->
    <!-- <el-dialog title="处理告警" :visible.sync="dialogFormVisible" width="30%">
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
                <el-form-item label="处理措施" prop="solution">
                  <el-input
                    v-model="typeEdit.solution"
                    type="textarea"
                    :rows="5"
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
          v-show="typeEdit.id"
          type="primary"
          @click="createData('typeEdit')"
        >确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog> -->

    <el-dialog :visible.sync="dialogImgVisible" width="800px" style="text-align: center">
      <div style="border: 1px solid #ededed">
        <img :src="bigImgSrc" alt style="width: 600px;">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllList, getInfo, update } from '@/api/AI/aiModelType'
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
      bigImgSrc: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogDetVisible: false,
      dialogAddVisible: false,
      dialogImgVisible: false,
      typeInfo: {},
      typeEdit: {},
      soluTypelList: [{ id: 0, value: '未处理' }, { id: 1, value: '已处理' }],
      weightlList: [{ id: 0, value: '0' }, { id: 1, value: '1' }],
      dialogFormVisible: false,
      uploadUrl: process.env.VUE_APP_BASE_API + 'api-web/public/uploadFile',
      rules: {
        solution: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
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
        this.typeInfo = {}
      }, 100)
    },
    dialogAddVisible(val) {
      !val && setTimeout(() => {
        this.$refs['typeEdit'].resetFields()
        this.typeEdit = {}
      }, 100)
    },
    dialogFormVisible(val) {
      !val && setTimeout(() => {
        this.$refs['typeEdit'].resetFields()
        this.typeEdit = {}
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
      getInfo({ id: row.id }).then(response => {
        this.typeInfo = response.data
        response.data.typeAlarmList.forEach((item, index) => {
          this.$set(this.typeInfo.typeAlarmList[index], 'oggUrl', item.oggUrl)
        })
      })
    },
    handleUpdate(row) {
      this.dialogAddVisible = true
      getInfo({ id: row.id }).then(response => {
        this.typeEdit = response.data
      })
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          update(this.typeEdit).then(response => {
            if (response.data) {
              this.$message.success('修改成功')
              this.dialogAddVisible = false
              this.getList()
            } else {
              this.$message.error('修改失败')
            }
          })
        }
      })
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
    },
    bigImg(src) {
      this.dialogImgVisible = true
      this.bigImgSrc = src
    }
  }
}
</script>
