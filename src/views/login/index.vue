<template>
  <div class="login-container">
    <div class="loginArea">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
        :show-message="false"
        status-icon
      >
        <div class="title-container">
          <!-- <div class="title-left">
            <img src="@/assets/login_image/logo.png" alt>
          </div> -->
          <div class="title-right">
            <div class="title">{{ $t('login.pingtai') }}</div>
          </div>
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('login.zhanghao')"
            name="username"
            type="text"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item prop="password" style="margin: 31px 0;">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginForm.password"
            show-password
            type="password"
            :placeholder="$t('login.mima')"
            name="password"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-top: 20px;"
          @click.native.prevent="handleLogin"
        >{{ $t('login.denglu') }}</el-button>
      </el-form>
    </div>

    <div class="version">v-1.0.0</div>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
// import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('The password can not be less than 6 digits'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    localStorage.setItem('lang', localStorage.lang || 'en')
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: rgb(17, 25, 51);
$light_gray: #283443;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;
    text-align: center;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      // padding: 8px 5px 8px 15px;
      color: $light_gray;
      height: 38px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        background-color: transparent;
        background-image: none;
        transition: background-color 50000s ease-in-out 0s;
      }
    }
  }
  .el-form-item {
    color: #454545;
    height: 40px;
    width: 100%;
    display: inline-block;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: rgba(1, 42, 79, 1);
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  background-image: url("../../assets/login_image/bg.png");
  background-repeat: repeat;
  background-size: 100% 100%;
  background-position: center;
  background-attachment: fixed;
  .loginArea {
    width: 540px;
    height: 500px;
    background: rgba(250, 250, 250, 1);
    border-radius: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    .login-form {
      width: 540px;
      padding: 49px 83px;
      text-align: center;
      .svg-container {
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
        margin-top: 2px;
      }
      .title-container {
        display: flex;
        width: 100%;
        margin: 0 auto 49px;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        .title-left {
          img {
            width: 64px;
            vertical-align: text-top;
          }
        }
        .title-right {
          margin-top: 19px;
          .title {
            font-size: 22px;
            font-weight: 500;
            color: rgba(5, 109, 239, 1);
            text-align: center;
          }
        }
      }
      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
      }
      .search_button_area {
        width: 69%;
        display: flex;
        justify-content: space-between;
        margin: 15px auto;
      }
    }
  }
}
.version {
  color: white;
  position: absolute;
  right: 20px;
  bottom: 20px;
  font-size: 20px;
}
</style>
