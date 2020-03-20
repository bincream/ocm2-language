<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">
      <el-date-picker
        v-model="date"
        style="width: 380px;margin-bottom: 10px;vertical-align: middle;"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH-mm-ss"
        clearable
      />

      <el-select
        v-model="listQuery.type"
        placeholder="请选择处理类型"
        style="width: 150px;"
        class="filter-item"
        clearable
        filterable
      >
        <el-option
          v-for="item in soluTypelList"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        />
      </el-select>

      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />

      <el-button
        v-if="checkPermission(['alarmHis/getNew'])"
        type="primary"
        class="filter-item"
        @click.stop="handleRefresh"
      >请求最新告警</el-button>
      <FilenameOption v-model="filename" class="filter-item" />
      <el-button type="primary" icon="document" class="filter-item" @click="handleDownload">导出Excel</el-button>
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
            <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
            <source :src="scope.row.oggUrl" >
            <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
            <source :src="scope.row.fileName" >
          </audio>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['alarmHis/resolve'])"
            v-show="scope.row.type == 0"
            type="warning"
            size="small"
            @click.stop="handleSolu(scope.row)"
          >处理报警</el-button>
          <el-button
            v-if="checkPermission(['alarmHis/resolve'])"
            v-show="scope.row.type == 1"
            type="primary"
            size="small"
            @click.stop="handleSeeSolu(scope.row)"
          >查看处理措施</el-button>
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
import { getAllList, getNew, resolve } from '@/api/alarm/alarmHis'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
import FilenameOption from '@/views/components/FilenameOption'
export default {
  name: 'SysUser',
  components: { FilenameOption },
  directives: {
    waves
  },
  filters: {
    dangerLevel: function(val) {
      switch (val) {
        case 0:
          return 0
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
    type: function(val) {
      switch (val) {
        case 0:
          return '未处理'
        case 1:
          return '已处理'
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
      audioSrc: '',
      dangerLevelList: [{ id: 0, value: 0 }, { id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 }],
      date: '',
      audio: null,
      soundObject: null,
      dialogFormVisible: false,
      rules: {
        solution: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      solutionEdit: {},
      soluTypelList: [{ id: 0, value: '未处理' }, { id: 1, value: '已处理' }],
      filename: ''
    }
  },
  watch: {
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
        response.data.list.forEach((item, index) => {
          this.$set(this.list[index], 'oggUrl', item.oggUrl)
          this.$set(this.list[index], 'fileName', item.fileName)
        })
        this.$forceUpdate()
      })
    },
    fillAudioData(rate, src_str) {
      let blob = null
      var e = new XMLHttpRequest()
      e.open('GET', src_str, true)
      e.responseType = 'arraybuffer'
      e.setRequestHeader = ('Access-Control-Allow-Origin', '*')
      // e.responseType = "blob";
      e.onload = function() {
        var dt = new DataView(e.response)
        var sa_o = dt.getUint32(24, true)
        if (sa_o > rate) {
          blob = new Blob([e.response], { type: 'autio/wave' })
        } else {
          var dataLength_o = e.response.byteLength - 44
          // 将头部中采样率修改为8000
          var sampleRateRatio = Math.round(rate / sa_o)
          var re_by_Len = sampleRateRatio * dataLength_o
          var ori_arrauBuffer = new Uint8Array(e.response)
          var result = new ArrayBuffer(re_by_Len + 44)
          var result_int8 = new Uint8Array(result)
          var offsetResult = 44
          for (var j = 44; j < dataLength_o + 44; j = j + 2) {
            for (var i = 0; i < sampleRateRatio; i++) {
              result_int8[offsetResult] = ori_arrauBuffer[j]
              result_int8[offsetResult + 1] = ori_arrauBuffer[j + 1]
              offsetResult += 2
            }
          }
          // 头部赋值
          for (let i = 0; i < 44; i++) {
            result_int8[i] = ori_arrauBuffer[i]
          }
          var reDt = new DataView(result)
          reDt.setUint32(24, rate, true)// 将采样率设置为指定采样率
          reDt.setUint32(4, re_by_Len / 2 + 44, true)
          reDt.setUint32(40, re_by_Len, true)
          reDt.setUint32(28, rate * 1 * 2, true)
          blob = new Blob([result], { type: 'autio/wave' })
        }
        console.log(URL.createObjectURL(blob))
        return URL.createObjectURL(blob)
      }
      e.onerror = function(e) {
        console.log('AudioSampleLoader: XMLHttpRequest called onerror')
      }
      e.send()
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
        this.listQuery.endTime = this.date[1]
      } else {
        this.listQuery.beginTime = undefined
        this.listQuery.endTime = undefined
      }

      this.listQuery.page = 1
      this.getList()
    },
    handleStop(row) {
      this.$refs.wavFileId.pause()
      this.$refs.audio.src = ''
    },
    StopSound() {
      if (this.soundObject != null) {
        this.soundObject.setAttribute('src', '')
        this.soundObject = null
      }
    },
    handleRefresh() {
      getNew().then(response => {
        this.$message.success('获取新历史报警记录' + response.data + '条')
        this.getList()
      })
    },
    // 新增
    handleSolu(row) {
      this.solutionEdit.id = row.id
      this.solutionEdit.type = 1
      this.dialogFormVisible = true
    },
    handleSeeSolu(row) {
      this.solutionEdit.solution = row.solution
      this.dialogFormVisible = true
    },
    // 新增提交
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          resolve(this.solutionEdit).then((response) => {
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
    handleDownload() {
      getAllList({ page: 1, limit: this.total }).then(response => {
        const list = response.data.list
        list.forEach((item) => {
          if (item.type === 0) {
            item.type = '未处理'
          } else if (item.type === 1) {
            item.type = '已处理'
          }
        })
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['基站', '开始点', '中心点', '结束点', '识别类型', '开始时间', '结束时间', '震动次数', '是否处理', '处理方式', '']
          const filterVal = ['standName', 'startCol', 'centerCol', 'endCol', 'typeId', 'beginTime', 'endTime', 'freq', 'type', 'solution']
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

