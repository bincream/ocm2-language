
<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">

      <el-input
        v-model="listQuery.centerCol"
        :placeholder="$t('alarmInfo.qingshuruzhongxindian')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleTypeFilter"
      />
      <el-date-picker
        v-model="date"
        style="width: 380px;margin-bottom: 10px;vertical-align: middle;"
        type="datetimerange"
        :start-placeholder="$t('alarmInfo.kaishishijian')"
        :end-placeholder="$t('alarmInfo.gaojingshijian')"
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
      <el-table-column :label="$t('alarmInfo.baojingleixing')" prop="alarmType" />
      <el-table-column :label="$t('alarmInfo.tongdaohao')" prop="lineInfoChannel" />
      <el-table-column :label="$t('alarmInfo.juli')" prop="distance" />
      <el-table-column :label="$t('alarmInfo.kaishidian')" prop="beginCol" />
      <el-table-column :label="$t('alarmInfo.zhongxindian')" prop="centerCol" />
      <el-table-column :label="$t('alarmInfo.jieshudian')" prop="endCol" />
      <el-table-column :label="$t('alarmInfo.kaishishijian')" prop="beginTime" />
      <el-table-column :label="$t('alarmInfo.gaojingshijian')" prop="alarmTime" />
      <el-table-column :label="$t('alarmInfo.zhendongcishu')" prop="freq" />
      <el-table-column :label="$t('alarmInfo.qiangdu')" prop="amplitude" />
      <el-table-column :label="$t('alarmInfo.dengji')" prop="level" />
      <el-table-column :label="$t('alarmInfo.zhendongleixing')" prop="vibType" />
      <el-table-column :label="$t('alarmInfo.chulizhuangtai')" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.solution | solution }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('alarmInfo.caozuo')" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['alarmInfo/info'])"
            type="primary"
            size="small"
            @click.stop="handleDetail(scope.row)"
          >{{ $t('xiangqing') }}</el-button>
          <el-button
            v-if="checkPermission(['alarmInfo/handle'])"
            v-show="scope.row.solution == 0"
            type="warning"
            size="small"
            @click.stop="handleSolu(scope.row)"
          >{{ $t('alarmInfo.chuligaojing') }}</el-button>
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
    <el-dialog :visible.sync="dialogDetVisible" :title="$t('alarmInfo.gaojingxiangqing')" width="100%">
      <div class="basic">
        <div class="title">{{ $t('alarmInfo.guanglanxinxi') }}</div>
        <table>
          <tr>
            <td class="blackMark">{{ $t('alarmInfo.baojingleixing:') }}</td>
            <td class="width21">
              <span v-text="alarmInfo.alarmType" />
            </td>
            <td class="blackMark">{{ $t('alarmInfo.tongdaohao:') }}</td>
            <td class="width21">
              <span v-text="alarmInfo.lineInfoChannel" />
            </td>
            <td class="blackMark">{{ $t('alarmInfo.juli:') }}</td>
            <td class="width21">
              <span v-text="alarmInfo.distance" />
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('alarmInfo.kaishidian:') }}</td>
            <td class="width21">
              <span v-text="alarmInfo.beginCol" />
            </td>
            <td class="blackMark">{{ $t('alarmInfo.zhongxindian:') }}</td>
            <td class="width21">
              <span v-text="alarmInfo.centerCol" />
            </td>
            <td class="blackMark">{{ $t('alarmInfo.jieshudian:') }}</td>
            <td class="width21">
              <span v-text="alarmInfo.endCol" />
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('alarmInfo.qiangdu:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.amplitude }}</span>
            </td>
            <td class="blackMark">{{ $t('alarmInfo.kaishishijian:') }}</td>
            <td class="width21">
              <span v-text="alarmInfo.beginTime" />
            </td>
            <td class="blackMark">{{ $t('alarmInfo.gaojingshijian:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.alarmTime }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('alarmInfo.dengji:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.level }}</span>
            </td>
            <td class="blackMark">{{ $t('alarmInfo.zhendongcishu:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.freq }}</span>
            </td>
            <td class="blackMark">{{ $t('alarmInfo.sunhao:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.loss }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('alarmInfo.fanshesunhao:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.refloss }}</span>
            </td>
            <td class="blackMark">{{ $t('alarmInfo.leijisunhao:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.cumloss }}</span>
            </td>
            <td class="blackMark">{{ $t('alarmInfo.shijianleixing:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.eventType | eventType }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('alarmInfo.zongsunhao:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.allloss }}</span>
            </td>
            <td class="blackMark">{{ $t('alarmInfo.zongfanshesunhao:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.allrefloss }}</span>
            </td>
            <td class="blackMark">{{ $t('alarmInfo.zhendongleixing:') }}</td>
            <td class="width21">
              <span>{{ alarmInfo.vibType }}</span>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetVisible = false">{{ $t('quxiao') }}</el-button>
      </div>
    </el-dialog>

    <!--新增编辑页面 -->
    <el-dialog :title="处理告警" :visible.sync="dialogFormVisible" width="30%">
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
        >{{ $t('queren') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('quxiao') }}</el-button>
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
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '未处理'
          case 1:
            return '已处理'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Untreated'
          case 1:
            return 'Processed'
          default:
            break
        }
      }
    },
    isAlarm: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '提醒'
          case 1:
            return '报警'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Remind'
          case 1:
            return 'Alarm'
          default:
            break
        }
      }
    },
    eventType: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '非反射事件'
          case 1:
            return '反射事件'
          case 2:
            return '光纤始端'
          case 3:
            return '光纤末端'
          case 4:
            return '其它事件'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Non-reflective event'
          case 1:
            return 'Reflection event'
          case 2:
            return 'Fiber beginning'
          case 3:
            return 'Fiber end'
          case 4:
            return 'Other events'
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
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      date: '',
      dialogDetVisible: false,
      alarmInfo: {},
      solutionEdit: {},
      soluTypelList: [{ id: 0, value: 'Untreated' }, { id: 1, value: 'Processed' }],
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
      if (this.$i18n.locale === 'cn') {
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
      } else if (this.$i18n.locale === 'en') {
        this.$confirm('Are you sure that the alarm has been processed?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          handle({ ids: this.ids }).then((response) => {
            if (response.data) {
              this.$message.success('Successful operation')
              this.getList()
            } else {
              this.$message.error('Operation failed')
            }
          })
        })
      }
    },
    // 新增提交
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.$i18n.locale === 'cn') {
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
        } else if (this.$i18n.locale === 'en') {
          if (valid) {
            handle(this.solutionEdit).then((response) => {
              if (response.data) {
                this.$message.success('Successful operation')
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('Operation failed')
              }
            })
          }
        }
      })
    }
  }
}
</script>
