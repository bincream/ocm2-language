<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">
      <el-input
        v-model="listQuery.keywords"
        :placeholder="$t('systemUser.qingshuruyonghuming')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />
      <FilenameOption v-model="filename" class="filter-item" />
      <el-button type="primary" icon="document" class="filter-item" @click="handleDownload">{{ $t('systemUser.daochuExcel') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :header-cell-style="{background: 'rgb(22, 144, 255)', textAlign: 'center', color: 'white'}"
      :data="list"
      stripe
      :row-style="{textAlign: 'center'}"
      highlight-current-row
      height="500"
    >
      <el-table-column :label="$t('systemUser.yonghuming')" prop="username" />
      <el-table-column :label="$t('systemUser.yonghucaozuo')" prop="operation" />
      <el-table-column :label="$t('systemUser.IPdizhi')" prop="ip" />
      <el-table-column :label="$t('systemUser.chuangjianshijian')" prop="createDate" />
      <el-table-column :label="$t('systemUser.caozuojieguo')">
        <template slot-scope="scope">
          <span>{{ scope.row.response | response }}</span>
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
  </div>
</template>

<script>
import { getAllList } from '@/api/system/log'
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
    status: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '正常'
          case 1:
            return '锁定'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Normal'
          case 1:
            return 'Locking'
          default:
            break
        }
      }
    },
    response: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 'true':
            return '操作成功'
          case 'false':
            return '操作失败'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 'true':
            return 'Successful operation'
          case 'false':
            return 'Operation failed'
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
      filename: ''
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
    handleDownload() {
      getAllList({ page: 1, limit: this.total }).then(response => {
        if (this.$i18n.locale === 'cn') {
          response.data.list.forEach((item) => {
            if (item.response === 'true') {
              item.response = '操作成功'
            } else if (item.response === 'false') {
              item.response = '操作失败'
            }
          })
          const list = response.data.list
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['用户名', '用户操作', 'IP地址', '创建时间', '操作结果']
            const filterVal = ['username', 'operation', 'ip', 'createDate', 'response']
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename
            })
          })
        } else if (this.$i18n.locale === 'en') {
          response.data.list.forEach((item) => {
            if (item.response === 'true') {
              item.response = 'Successful operation'
            } else if (item.response === 'false') {
              item.response = 'Operation failed'
            }
          })
          const list = response.data.list
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Username', 'User action', 'IP address', 'Creation time', 'Operation result']
            const filterVal = ['username', 'operation', 'ip', 'createDate', 'response']
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
