<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">
      <el-date-picker
        v-model="date"
        style="width: 320px;margin-bottom: 10px;vertical-align: middle;"
        type="datetimerange"
        :start-placeholder="$t('alarmInfo.kaishishijian')"
        :end-placeholder="$t('alarmInfo.gaojingshijian')"
        value-format="yyyy-MM-dd HH:mm:ss"
        clearable
      />
      <el-select
        v-model="listQuery.type"
        :placeholder="$t('alarmInfo.qingxuanzechulileixing')"
        style="width: 250px;"
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
      <el-input
        v-model="listQuery.vibType"
        :placeholder="$t('alarmInfo.qingshuruzhendongleixing')"
        style="width: 260px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />

      <FilenameOption v-model="filename" class="filter-item" />
      <el-button type="primary" icon="document" class="filter-item" @click="handleDownload">{{ $t('alarmInfo.daochu') }}</el-button>
    </div>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :header-cell-style="{background: 'rgb(22, 144, 255)', textAlign: 'center', color: 'white'}"
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
      <el-table-column :label="$t('alarmInfo.yinpin')" width="320">
        <template slot-scope="scope">
          <audio v-if="scope.row.oggPath && scope.row.audioPath" :id="scope.row.id" controls="controls" :src="'http://192.168.8.131/uploadAudio/' + scope.row.oggPath">
            <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
            <!-- <source :src="'http://192.168.8.131/uploadAudio/' + scope.row.oggPath" > -->
            <!-- eslint-disable-next-line vue/html-closing-bracket-spacing -->
            <!-- <source :src="scope.row.fileName" > -->
          </audio>
        </template>
      </el-table-column>
      <el-table-column :label="$t('alarmInfo.caozuo')" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['alarmHis/handle'])"
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

    <!--新增编辑页面 -->
    <el-dialog :title="$t('alarmInfo.chuligaojing')" :visible.sync="dialogFormVisible" width="30%">
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
                <el-form-item :label="$t('alarmInfo.chulicuoshi')" prop="solution">
                  <el-input
                    v-model="solutionEdit.solution"
                    type="textarea"
                    :rows="5"
                    size="small"
                    :placeholder="$t('alarmInfo.qingshuru')"
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
      soluTypelList: [{ id: 0, value: 'Untreated' }, { id: 1, value: 'Processed' }],
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
        this.$set(this, 'list', [])
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        response.data.list.forEach((item, index) => {
          this.$set(this.list[index], 'oggPath', item.oggPath)
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
      if (this.listQuery.vibType === '') {
        this.listQuery.vibType = undefined
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
      if (this.$i18n.locale === 'cn') {
        getNew().then(response => {
          this.$message.success('获取新历史报警记录' + response.data + '条')
          this.getList()
        })
      } else if (this.$i18n.locale === 'en') {
        getNew().then(response => {
          this.$message.success('Get' + response.data + 'new historical alarm records')
          this.getList()
        })
      }
    },
    // 处理
    handleSolu(row) {
      this.ids = []
      this.ids.push(row.id)
      if (this.$i18n.locale === 'cn') {
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
      } else if (this.$i18n.locale === 'en') {
        this.$confirm('Are you sure that the alarm has been processed?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          resolve({ ids: this.ids }).then((response) => {
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
    handleSeeSolu(row) {
      this.solutionEdit.solution = row.solution
      this.dialogFormVisible = true
    },
    // 新增提交
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.$i18n.locale === 'cn') {
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
        } else if (this.$i18n.locale === 'en') {
          if (valid) {
            resolve(this.solutionEdit).then((response) => {
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
    },
    handleDownload() {
      getAllList({ page: 1, limit: this.total }).then(response => {
        const list = response.data.list
        if (this.$i18n.locale === 'cn') {
          list.forEach((item) => {
            if (item.type === 0) {
              item.type = '未处理'
            } else if (item.type === 1) {
              item.type = '已处理'
            }
          })
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['基站', '开始点', '中心点', '结束点', '识别类型', '开始时间', '告警时间', '振动次数', '是否处理', '处理方式', '']
            const filterVal = ['standName', 'startCol', 'centerCol', 'endCol', 'typeId', 'beginTime', 'endTime', 'freq', 'type', 'solution']
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename
            })
          })
        } else if (this.$i18n.locale === 'en') {
          list.forEach((item) => {
            if (item.type === 0) {
              item.type = 'Untreated'
            } else if (item.type === 1) {
              item.type = 'Processed'
            }
          })
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Base station', 'Starting point', 'Center point', 'End point', 'Identification type', 'Starting time', 'Alarm time', 'Number of vibrations', 'Whether to deal with', 'Processing method', '']
            const filterVal = ['standName', 'startCol', 'centerCol', 'endCol', 'typeId', 'beginTime', 'endTime', 'freq', 'type', 'solution']
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename
            })
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

