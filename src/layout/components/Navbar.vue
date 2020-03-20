<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span class="name" v-text="gettersName" />
          <span class="name">[{{ gettersUserName }}]</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>回到首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click.stop="changePassowrd">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%" :modal="false">
      <el-form
        ref="sendInfo"
        :rules="rules"
        :model="sendInfo"
        inline
        :show-message="false"
        status-icon
      >
        <div class="box">
          <div class="basic">
            <table>
              <tr height="40px">
                <td>
                  <el-form-item label="老密码" prop="oldOne">
                    <el-input v-model="sendInfo.oldOne" size="small" placeholder="请输入老密码" />
                  </el-form-item>
                </td>
              </tr>
              <tr height="40px">
                <td width="33%">
                  <el-form-item label="新密码" prop="newOne">
                    <el-input v-model="sendInfo.newOne" size="small" placeholder="请输入新密码" />
                  </el-form-item>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="makeSure('sendInfo')">确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { newPassword } from '@/api/user'

import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull
    // SizeSelect,
    // Search
  },
  data() {
    return {
      gettersName: '',
      gettersUserName: '',
      sendInfo: {},
      rules: {
        oldOne: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        newOne: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  mounted() {
    this.gettersName = this.$store.getters.name
    this.gettersUserName = this.$store.getters.username
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changePassowrd() {
      this.dialogFormVisible = true
    },
    makeSure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          newPassword(this.sendInfo).then((response) => {
            if (response.data) {
              this.$message.success('修改成功，请退出重新登录')
              this.dialogFormVisible = false
              this.logout()
            } else {
              this.$message.error('修改失败')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 10px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
       height: 50px;
      margin-right: 10px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .name {
          font-size: 14px;
          margin-left: 5px;
          margin-right: 5px;
          cursor: pointer;
        }
        .name:hover {
          color: rgb(64, 158, 255);
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
