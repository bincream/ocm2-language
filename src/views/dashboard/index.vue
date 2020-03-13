<template>
  <div class="app-container">
    <div class="block">
      <el-slider
        v-model="value"
        range
        :marks="marks"
        max="36000"
        @change="slider"
      />
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
      <el-table-column label="基站名称" prop="alarmType" />
      <el-table-column label="告警名称" prop="alarmType" />
      <el-table-column label="能量值" prop="amplitude" />
      <el-table-column label="开始点" prop="beginCol" />
      <el-table-column label="中心点" prop="centerCol" />
      <el-table-column label="结束点" prop="endCol" />
      <el-table-column label="开始时间" prop="beginTime" />
      <el-table-column label="结束时间" prop="endTime" />
      <el-table-column label="是否报警" prop="isAlarm">
        <template slot-scope="scope">{{ scope.row.isAlarm | isAlarm }}</template>
      </el-table-column>
      <el-table-column label="震动次数" prop="freq" />
      <el-table-column label="是否处理">
        <template slot-scope="scope">
          <span>{{ scope.row.type | type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('form.actions')" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['alarmInfo/info'])"
            type="primary"
            size="small"
            @click.stop="handleDetail(scope.row)"
          >{{ $t('form.detail') }}</el-button>
          <el-button
            v-show="scope.row.type == 0"
            v-if="checkPermission(['alarmInfo/resolve'])"
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
            <td class="blackMark">能量值:</td>
            <td class="width21">
              <span>{{ alarmInfo.amplitude }}</span>
            </td>
            <td class="blackMark">开始时间:</td>
            <td class="width21">
              <span v-text="alarmInfo.beginTime" />
            </td>
            <td class="blackMark">结束时间:</td>
            <td class="width21">
              <span>{{ alarmInfo.endTime }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">报警等级:</td>
            <td class="width21">
              <span>{{ alarmInfo.dangerLevel }}</span>
            </td>
            <td class="blackMark">振动次数:</td>
            <td class="width21">
              <span>{{ alarmInfo.freq }}</span>
            </td>
            <td class="blackMark">相似度:</td>
            <td class="width21">
              <span>{{ alarmInfo.similarity }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">报警类型:</td>
            <td class="width21">
              <span>{{ alarmInfo.isAlarm | isAlarm }}</span>
            </td>
            <td class="blackMark">是否处理:</td>
            <td class="width21">
              <span>{{ alarmInfo.type | type }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">处理措施:</td>
            <td class="width21" colspan="2">
              <span>{{ alarmInfo.solution }}</span>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetVisible = false">{{ $t('form.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getAllList, getInfo, resolve } from '@/api/alarm/alarmInfo'
// export default {
//   name: 'Dashboard',
//   filters: {
//     type: function(val) {
//       switch (val) {
//         case 0:
//           return '未处理'
//         case 1:
//           return '已处理'
//         default:
//           break
//       }
//     },
//     dangerLevel: function(val) {
//       switch (val) {
//         case 0:
//           return '断纤'
//         case 1:
//           return 1
//         case 2:
//           return 2
//         case 3:
//           return 3
//         default:
//           break
//       }
//     },
//     isAlarm: function(val) {
//       switch (val) {
//         case 0:
//           return '提醒'
//         case 1:
//           return '报警'
//         default:
//           break
//       }
//     },
//     white: function(val) {
//       switch (val) {
//         case 0:
//           return '不是白名单类型'
//         case 1:
//           return '是白名单类型'
//         default:
//           break
//       }
//     }
//   },
//   data() {
//     return {
//       currentRole: 'adminDashboard',
//       list: [],
//       total: null,
//       listLoading: true,
//       listQuery: {
//         page: 1,
//         limit: 20
//       },
//       dialogDetVisible: false,
//       alarmInfo: {},
//       solutionEdit: {},
//       soluTypelList: [{ id: 0, value: '未处理' }, { id: 1, value: '已处理' }],
//       dialogFormVisible: false,
//       marks: {
//         3000: '3000',
//         6000: '6000',
//         9000: '9000',
//         12000: '12000',
//         15000: '15000',
//         18000: '18000',
//         21000: '21000',
//         24000: '24000',
//         27000: '27000',
//         30000: '30000',
//         33000: '33000',
//         36000: '36000以上'
//       }
//     }
//   },
//   watch: {
//     dialogDetVisible(val) {
//       !val && setTimeout(() => {
//         this.alarmInfo = {}
//       }, 100)
//     },
//     dialogFormVisible(val) {
//       !val && setTimeout(() => {
//         this.$refs['solutionEdit'].resetFields()
//         this.solutionEdit = {}
//       }, 100)
//     }
//   },
//   created() { },
//   mounted() {
//     this.getList()
//   },

//   methods: {

//     getList() {
//       this.listLoading = true
//       getAllList(this.listQuery).then(response => {
//         this.list = response.data.list
//         this.total = response.data.total
//         this.listLoading = false
//       })
//     },
//     handleSizeChange(val) {
//       this.listQuery.limit = val
//       this.getList()
//     },
//     handleCurrentChange(val) {
//       this.listQuery.page = val
//       this.getList()
//     },
//     handleFilter() {
//       if (this.listQuery.keywords === '') {
//         this.listQuery.keywords = undefined
//       }
//       this.listQuery.page = 1
//       this.getList()
//     },
//     handleDetail(row) {
//       this.dialogDetVisible = true
//       getInfo({ id: row.id }).then(response => {
//         this.alarmInfo = response.data
//       })
//     },
//     // 新增
//     handleSolu(row) {
//       this.solutionEdit.id = row.id
//       this.solutionEdit.type = 1
//       this.dialogFormVisible = true
//     },
//     handleSeeSolu(row) {
//       this.solutionEdit.solution = row.solution
//       this.dialogFormVisible = true
//     },
//     // 新增提交
//     createData(formName) {
//       this.$refs[formName].validate((valid) => {
//         if (valid) {
//           resolve(this.solutionEdit).then((response) => {
//             if (response.data) {
//               this.$message.success('操作成功')
//               this.dialogFormVisible = false
//               this.getList()
//             } else {
//               this.$message.error('操作失败')
//             }
//           })
//         }
//       })
//     },
//     slider() {
//       this.getList()
//     }
//   }
// }
</script>
