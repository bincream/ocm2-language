<template>
  <div class="app-container">
    <div class="optical">
      <span class="text">光纤长度</span>
    </div>
    <div class="block">
      <el-tooltip v-for="(item,index) in pointList" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
      <el-slider
        v-model="value"
        :marks="marks"
        :max="50000"
        disabled
      />
      <!-- <el-slider
        v-model="value"
        :marks="marks"
        :max="36000"
        @change="slider"
      /> -->

    </div>
    <div class="optical">
      <span class="text">实时报警列表</span>
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
          <span>{{ scope.row.solution |solution }}</span>
        </template>
      </el-table-column>
      <el-table-column label="音频" width="320">
        <template slot-scope="scope">
          <audio :id="scope.row.id" controls="controls">
            <source :src="'http://192.168.8.100/uploadAudio/' + scope.row.oggPath">
            <source :src="scope.row.fileName">
          </audio>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
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
          <!-- <tr>
            <td class="blackMark">音频:</td>
            <td class="width21">
              <audio :id="alarmInfo.id" controls="controls">
                <source :src="'http://192.168.8.100/uploadAudio/'+ alarmInfo.oggPath">
              </audio>
            </td>
          </tr> -->
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 新增编辑页面
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
    </el-dialog> -->
  </div>
</template>

<script>
import { getAllList, getInfo, resolve } from '@/api/index'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Dashboard',
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
      currentRole: 'adminDashboard',
      list: [],
      total: null,
      interval: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        beginCol: 0,
        endCol: 50000
      },
      dialogDetVisible: false,
      alarmInfo: {},
      solutionEdit: {},
      soluTypelList: [{ id: 0, value: '未处理' }, { id: 1, value: '已处理' }],
      dialogFormVisible: false,
      rules: {
        solution: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      ids: [],
      pointList: [],
      value: 50000,
      marks: {
        0: '0',
        5000: '5000',
        10000: '10000',
        15000: '15000',
        20000: '20000',
        25000: '25000',
        30000: '30000',
        35000: '35000',
        40000: '40000',
        45000: '45000',
        50000: '50000'
      },
      point: '5',
      left: null
    }
  },
  watch: {
    checkPermission,
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
  created() {
  },
  mounted() {
    this.getList()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.init()
    })
  },

  beforeRouteLeave(to, from, next) {
    this.out()
    next()
  },

  methods: {
    init() {
      const that = this
      this.interval = setInterval(function() {
        console.log('进入')
        that.getList()
      }, 5000)
    },
    out() {
      console.log(this.interval)
      if (this.interval) {
        clearInterval(this.interval) // 关闭
        this.interval = null
        console.log('离开')
      }
    },
    getList() {
      this.listLoading = true
      getAllList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        this.pointList = []
        this.list.forEach(item => {
          this.left = (item.centerCol / 500)
          this.pointList.push({ value: item.centerCol.toString(), left: this.left })
        })
        console.log(this.pointList)
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
        resolve({ ids: this.ids }).then((response) => {
          if (response.data) {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error('操作失败')
          }
        })
      })
    },
    handleSeeSolu(row) {
      this.solutionEdit.solution = row.solution
      this.dialogFormVisible = true
    },
    slider() {
      // console.log(this.value)
      this.listQuery.beginCol = this.value[0]
      this.listQuery.endCol = this.value[1]
      this.getList()
    }
  }
}
</script>
<style scoped>
.optical{
  height: 30px;
  text-align: center;
  margin-right: 45%;
  margin-left: 45%;
  background: #a5db8f;
  margin: 20px 45% 20px 45%;
}
.text{
  font-size: 22px;
  height: 12px;
  width: 66px;
  margin-top: 5px;
  }
.block{
  position: relative;
  margin: 10px;
  height: 55px;
  padding-bottom: 10px;
}

</style>

<style lang="css">
.el-slider__runway{
  background-color: #1890ff;
}
.el-slider__runway.disabled .el-slider__bar{
  background-color: #1890ff
}
.el-slider__runway.disabled .el-slider__button {
    opacity: 0.0;
}
.el-slider__button {
    opacity: 0.0;
}
.line{
  width: 99%;
  height: 2px;
  background-color: #1890ff;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  position: absolute;
}
.point{
    position: absolute;
    z-index: 999;
    height: 10px;
    width: 10px;
    border-radius: 100%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    background-color: red;
    top: 14px;
}
</style>
