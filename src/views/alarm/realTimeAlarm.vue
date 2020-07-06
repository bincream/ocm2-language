
<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">

      <el-input
        v-model="listQuery.centerCol"
        placeholder="请输入中心点"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleTypeFilter"
      />
      <el-date-picker
        v-model="date"
        style="width: 380px;margin-bottom: 10px;vertical-align: middle;"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="告警时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        clearable
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
    >
      <el-table-column label="报警类型" prop="alarmType" />
      <el-table-column label="通道号" prop="lineInfoChannel" />
      <el-table-column label="距离" prop="distance" />
      <el-table-column label="开始点" prop="beginCol" />
      <el-table-column label="中心点" prop="centerCol" />
      <el-table-column label="结束点" prop="endCol" />
      <el-table-column label="开始时间" prop="beginTime" />
      <el-table-column label="告警时间" prop="alarmTime" />
      <el-table-column label="振动次数" prop="freq" />
      <el-table-column label="强度" prop="amplitude" />
      <el-table-column label="等级" prop="level" />
      <el-table-column label="处理状态">
        <template slot-scope="scope">
          <span>{{ scope.row.solution | solution }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['alarmInfo/info'])"
            type="primary"
            size="small"
            @click.stop="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            v-if="checkPermission(['alarmInfo/handle'])"
            v-show="scope.row.solution == 0"
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

    <!-- 详情 -->
    <el-dialog :visible.sync="dialogDetVisible" title="报警详情" width="100%">
      <div class="basic">
        <div class="title">光缆信息</div>
        <table>
          <tr>
            <td class="blackMark">报警类型:</td>
            <td class="width21">
              <span v-text="alarmInfo.alarmType" />
            </td>
            <td class="blackMark">通道号:</td>
            <td class="width21">
              <span v-text="alarmInfo.lineInfoChannel" />
            </td>
            <td class="blackMark">距离:</td>
            <td class="width21">
              <span v-text="alarmInfo.distance" />
            </td>
          </tr>
          <tr>
            <td class="blackMark">开始点:</td>
            <td class="width21">
              <span v-text="alarmInfo.beginCol" />
            </td>
            <td class="blackMark">中心点:</td>
            <td class="width21">
              <span v-text="alarmInfo.centerCol" />
            </td>
            <td class="blackMark">结束点:</td>
            <td class="width21">
              <span v-text="alarmInfo.endCol" />
            </td>
          </tr>
          <tr>
            <td class="blackMark">强度:</td>
            <td class="width21">
              <span>{{ alarmInfo.amplitude }}</span>
            </td>
            <td class="blackMark">开始时间:</td>
            <td class="width21">
              <span v-text="alarmInfo.beginTime" />
            </td>
            <td class="blackMark">告警时间:</td>
            <td class="width21">
              <span>{{ alarmInfo.alarmTime }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">等级:</td>
            <td class="width21">
              <span>{{ alarmInfo.level }}</span>
            </td>
            <td class="blackMark">振动次数:</td>
            <td class="width21">
              <span>{{ alarmInfo.freq }}</span>
            </td>
            <td class="blackMark">损耗:</td>
            <td class="width21">
              <span>{{ alarmInfo.loss }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">反射损耗:</td>
            <td class="width21">
              <span>{{ alarmInfo.refloss }}</span>
            </td>
            <td class="blackMark">累计损耗:</td>
            <td class="width21">
              <span>{{ alarmInfo.cumloss }}</span>
            </td>
            <td class="blackMark">事件类型:</td>
            <td class="width21">
              <span>{{ alarmInfo.eventType | eventType }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">总损耗:</td>
            <td class="width21">
              <span>{{ alarmInfo.allloss }}</span>
            </td>
            <td class="blackMark">总反射损耗:</td>
            <td class="width21">
              <span>{{ alarmInfo.allrefloss }}</span>
            </td>
            <td class="blackMark">振动类型:</td>
            <td class="width21">
              <span>{{ alarmInfo.vibType }}</span>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--新增编辑页面 -->
    <el-dialog title="处理告警" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        ref="solutionEdit"
        :rules="rules"
        :model="solutionEdit"
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
                    v-model="solutionEdit.solution"
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
          v-show="solutionEdit.id"
          type="primary"
          @click="createData('solutionEdit')"
        >确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllList, getInfo, handle } from '@/api/alarm/alarmInfo'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'SysUser',
  directives: {
    waves
  },
  filters: {
    solution: function(val) {
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
    eventType: function(val) {
      switch (val) {
        case 0:
          return '非反射事件'
        case 1:
          return '反射事件'
        case 2:
          return '光纤始端'
        case 3:
          return '光纤始端'
        case 4:
          return '光纤末端'
        case 5:
          return '其它事件'
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
      date: '',
      dialogDetVisible: false,
      alarmInfo: {},
      solutionEdit: {},
      soluTypelList: [{ id: 0, value: '未处理' }, { id: 1, value: '已处理' }],
      dialogFormVisible: false,
      rules: {
        solution: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      ids: []
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
        this.$refs['solutionEdit'].resetFields()
        this.solutionEdit = {}
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
      if (this.date && this.date.length > 0) {
        this.listQuery.beginTime = this.date[0]
        this.listQuery.alarmTime = this.date[1]
      } else {
        this.listQuery.beginTime = undefined
        this.listQuery.alarmTime = undefined
      }
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(row) {
      this.dialogDetVisible = true
      getInfo({ id: row.id }).then(response => {
        this.alarmInfo = response.data
      })
    },
    // 新增
    handleSolu(row) {
      this.solutionEdit.id = row.id
      this.ids = []
      this.ids.push(row.id)
      this.$confirm('是否确认该条告警已处理？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        handle({ ids: this.ids }).then((response) => {
          if (response.data) {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error('操作失败')
          }
        })
      })
    },
    // 新增提交
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          handle(this.solutionEdit).then((response) => {
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
    }
  }
}
</script>
