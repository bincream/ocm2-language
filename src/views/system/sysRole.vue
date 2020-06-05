<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :span="11">
        <div class="filter-container" style="position:relative">
          <el-input
            v-model="listQuery.keywords"
            placeholder="输入系统角色名称"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />
          <el-button
            v-if="checkPermission(['sysPer/save'])"
            class="filter-item"
            style="position:absolute;right:0px"
            type="primary"
            @click="handleCreate"
          >新增</el-button>
        </div>

        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :header-cell-style="{background: 'rgb(22, 159, 231)', textAlign: 'center', color: 'white'}"
          :data="list"
          stripe
          highlight-current-row
          height="500"
          @row-click="handleDetail"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <el-table-column label="角色名称" align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.dialogStatus == 'info'">{{ scope.row.roleName }}</span>
              <el-input
                v-show="scope.row.dialogStatus == 'create' || scope.row.dialogStatus == 'update'"
                v-model="scope.row.roleName"
                style="width: 80%;"
                placeholder="请输入"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                v-if="checkPermission(['sysPer/update'])"
                v-show="scope.row.dialogStatus == 'create' || scope.row.dialogStatus == 'update'"
                type="primary"
                size="small"
                @click.stop="handleSave(scope.row)"
              >确认</el-button>
              <el-button
                v-if="checkPermission(['sysPer/update'])"
                v-show="scope.row.dialogStatus == 'info' && scope.row.id > 4"
                type="primary"
                size="small"
                @click.stop="handleUpdate(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="checkPermission(['sysPer/delete'])"
                v-show="scope.row.id > 4"
                type="danger"
                size="small"
                @click.stop="handleDelete(scope.row)"
              >删除</el-button>
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
      </el-col>
      <el-col :span="10" :offset="1" class="el-col-right">
        <div class="filter-container" style="position:relative">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            style="width: 200px;"
            class="filter-item"
          />
          <el-button v-waves class="filter-item" icon="el-icon-search" @click="filter" />
          <el-button
            class="filter-item"
            style="position:absolute;right:0px"
            type="primary"
            @click="assignPermissions"
          >分配权限</el-button>
        </div>
        <div class="scroll" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
          <el-tree
            ref="tree"
            :data="data"
            show-checkbox
            :filter-node-method="filterNode"
            node-key="id"
            :highlight-current="true"
            :expand-on-click-node="true"
            :check-on-click-node="true"
            :default-expanded-keys="expandKey"
            :props="defaultProps"
            :check-strictly="checkStrict"
            @check="handCheck"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAllList, getPerTree, deleteData, getPerInfo, save, update, assPer } from '@/api/system/sysRole'
import checkPermission from '@/utils/permission' // 权限判断函数
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'PerRole',
  directives: {
    waves
  },
  filters: {},
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      list: [],
      total: null,
      listLoading: true,
      dialogDetVisible: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      ids: [],
      filterText: '',
      data: [],
      expandKey: [],
      treeCheckIds: [],
      checkStrict: true
    }
  },
  watch: {},
  created() { },
  mounted() {
    this.getList()
    this.getTreeData()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      getAllList(this.listQuery).then(response => {
        response.data.list.forEach((item) => {
          item.dialogStatus = 'info'
        })
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
    // 新增
    handleCreate() {
      this.list.push({ dialogStatus: 'create' })
    },
    // 新增提交
    handleSave(row) {
      if (row.id) {
        if (!row.roleName) {
          this.$message.error('角色名称不能为空')
          return false
        }
        update(row).then((response) => {
          if (response.data) {
            this.$message.success('修改成功')
            this.dialogFormVisible = false
            this.getList()
          } else {
            this.$message.error(('修改失败'))
          }
        })
      } else {
        if (!row.roleName) {
          this.$message.error('角色名称不能为空')
          return false
        }
        save(row).then((response) => {
          if (response.data) {
            this.$message.success('新增成功')
            this.dialogFormVisible = false
            this.getList()
          } else {
            this.$message.error('新增失败')
          }
        })
      }
    },
    // 修改
    handleUpdate(row) {
      row.dialogStatus = 'update'
    },
    handleDelete(row) {
      if (row.id) {
        this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      }
    },
    handleSelectionChange(val) {
      this.ids = []
      val.forEach((item, index) => {
        this.ids.push(item.id)
      })
    },
    // 详情页面
    handleDetail(row) {
      if (!checkPermission(['sysPer/getPmList'])) {
        this.$message.error('没有详情权限!')
        return false
      }
      this.checkStrict = true
      this.$refs.multipleTable.clearSelection()
      this.$refs.multipleTable.toggleRowSelection(row)
      this.$refs.tree.setCheckedKeys([])
      getPerInfo({ id: row.id }).then(response => {
        this.expandKey = response.data
        this.$refs.tree.setCheckedKeys(response.data)
        this.treeCheckIds = response.data
      })
    },
    filter() {
      if (this.filterText === '') {
        this.getTreeData()
      } else {
        this.$refs.tree.filter(this.filterText)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTreeData() {
      getPerTree().then(response => {
        this.data = response.data
      })
    },

    // 合并去重
    uq(array, array1) {
      // 将array数组转换成set对象
      const setObj = new Set(array)
      // 循环数组array1，并将值通过add插入set对象中,此时重复数据并不会插入其中
      for (let i = 0; i < array1.length; i++) {
        setObj.add(array1[i])
      }
      // 使用Array.from()方法将set对象转换成数组，并使用sort()方法排序
      return Array.from(setObj).sort()
    },
    mouseEnter() {
      this.checkStrict = false
      console.log('鼠标滑入')
    },
    mouseLeave() {
      this.checkStrict = true
      console.log('鼠标滑出')
    },
    handCheck(data) {
      if (this.ids.length === 0) {
        this.$message.error('请选择一个角色进行分配权限')
        this.$refs.tree.setCheckedKeys([])
        return false
      }
      this.treeCheckIds = this.uq(this.$refs.tree.getCheckedKeys(), this.$refs.tree.getHalfCheckedKeys())
    },
    assignPermissions() {
      if (this.ids.length === 0) {
        this.$message.error('请选择一个角色进行分配权限')
        this.$refs.tree.setCheckedKeys([])
        return false
      } else if (this.ids.length > 1) {
        this.$message.error('角色分配权限时不可多选')
        return false
      }
      assPer({ id: this.ids[0], pmList: this.treeCheckIds }).then(response => {
        if (response.data) {
          this.$message.success('权限分配成功')
          this.$refs.tree.setCheckedKeys([])
          this.getList()
        } else {
          this.$message.error('权限分配失败')
        }
      })
    }
  }
}
</script>
<style>
.scroll {
  height: 500px;
  overflow: auto;
}
</style>
