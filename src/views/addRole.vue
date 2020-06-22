<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10">
        <!--新增部门信息 -->
        <el-form
          inline
          status-icon
          label-width="120px"
        >
          <table class="width33">
            <tr>
              <td>
                <el-form-item label="上级id" prop="pId">
                  <el-input
                    v-model="pmEdit.pId"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="上级名称" prop="pName">
                  <el-input
                    v-model="pmEdit.pName"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="名称" prop="pmName">
                  <el-input
                    v-model="pmEdit.pmName"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="url" prop="pmUrl">
                  <el-input
                    style="width: 400px"
                    v-model="pmEdit.pmUrl"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="type" prop="pmType">
                  <el-input
                    v-model="pmEdit.pmType"
                    placeholder="请输入"
                    clearable
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-button
                  type="primary"
                  @click="save"
                >保存</el-button>
              </td>
            </tr>
          </table>
        </el-form>

      </el-col>
      <el-col :span="10">
        <div>
          <div class="flex3">
            <el-tree
              ref="tree"
              :data="treeData"
              node-key="id"
              accordion
              :highlight-current="true"
              :check-strictly="true"
              :check-on-click-node="true"
              :props="defaultProps"
              :expand-on-click-node="false"
              :default-expand-all="true"
              @node-click="checkChange"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import { getPerTree, savePm } from '@/api/system/sysRole'
export default {
  data() {
    return {
      treeData: [],
      pmEdit: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    this.getRoleList()
    this.pmEdit.pmType = 0
    this.$set(this.pmEdit, 'pmUrl', '/api-web/')
  },
  methods: {
    getRoleList() {
      getPerTree().then(response => {
        this.treeData = response.data
      })
    },

    checkChange(data) {
      this.pmEdit.pId = data.id
      this.pmEdit.pName = data.label
      this.$set(this.pmEdit, 'pmName', data.label)
    },
    save() {
      savePm(this.pmEdit).then(response => {
        if (response.data) {
          this.$message.success('添加成功')
          this.getRoleList()
        } else {
          this.$message.error('添加失败')
        }
      })
    }
  }
}
</script>
