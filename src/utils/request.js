import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken,
  getUserId
  // getSalesid
} from '@/utils/auth'
import {
  Base64
} from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers.Authorization = 'Bearer ' + getToken()
      config.headers.userId = getUserId()
      // config.headers.salesId = getSalesid()
    } else {
      config.headers.Authorization = 'Basic ' + new Base64().encode('web' + ':' + '123456')
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
    if (res.access_token && res.token_type && res.refresh_token && res.expires_in && res.scope) {
      return response
    }
    if (lang === 'cn') {
      if (res.authenticated) {
        if (!res.principal.accountNonExpired) {
          Message.error('账号已过期')
          return Promise.reject('error')
        } else if (!res.principal.accountNonLocked) {
          Message.error('账号被锁定')
          return Promise.reject('error')
        } else {
          return response
        }
      }
    } else if (lang === 'en') {
      if (res.authenticated) {
        if (!res.principal.accountNonExpired) {
          Message.error('Account has expired')
          return Promise.reject('error')
        } else if (!res.principal.accountNonLocked) {
          Message.error('Account is locked')
          return Promise.reject('error')
        } else {
          return response
        }
      }
    }
    res.code = res.code - 0
    if (!res.code) {
      res.code = 0
    }

    // if the custom code is not 20000, it is judged as an error.
    if (lang === 'cn') {
      if (res.code !== 200) {
        if (res.error_description === 'Bad credentials') {
          Message({
            message: '密码错误',
            type: 'error',
            duration: 5000
          })
        } else if (res.error === 'unauthorized' || res.error === 'Unauthorized') {
          Message({
            message: res.error_description,
            type: 'error',
            duration: 5000
          })
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5000
          })
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    } else if (lang === 'en') {
      if (res.code !== 200) {
        if (res.error_description === 'Bad credentials') {
          Message({
            message: 'Wrong password',
            type: 'error',
            duration: 5000
          })
        } else if (res.error === 'unauthorized' || res.error === 'Unauthorized') {
          Message({
            message: res.error_description,
            type: 'error',
            duration: 5000
          })
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5000
          })
        }
        return Promise.reject(new Error(res.message || 'Error'))
      } else {
        return res
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
    if (lang === 'cn') {
      if (error.message.includes('code 401')) {
        Message({
          message: '登录失效，请重新登录',
          type: 'error',
          duration: 5000
        })
      } else if (error.message.includes('code 403')) {
        Message({
          message: '您没有该权限',
          type: 'error',
          duration: 5000
        })
      } else {
        Message({
          message: '发生错误，联系相关人员',
          type: 'error',
          duration: 5000
        })
      }
      return Promise.reject(error)
    } else if (lang === 'en') {
      if (error.message.includes('code 401')) {
        Message({
          message: 'Login invalid, please log in again',
          type: 'error',
          duration: 5000
        })
      } else if (error.message.includes('code 403')) {
        Message({
          message: 'You do not have the permission',
          type: 'error',
          duration: 5000
        })
      } else {
        Message({
          message: 'An error occurred, contact the relevant person',
          type: 'error',
          duration: 5000
        })
      }
      return Promise.reject(error)
    }
  }
)

export default service
