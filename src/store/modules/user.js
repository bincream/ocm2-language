import { login, logout, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken, getUsername, setUsername, removeUsername, setUserId, removeUserId, getUserId } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  userId: getUserId(),
  platformId: '',
  carrierId: '',
  token: getToken(),
  name: '',
  platformName: '',
  avatar: '',
  carrierName: '',
  introduction: '',
  roles: [],
  username: getUsername()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_CARRIERNAME: (state, carrierName) => {
    state.carrierName = carrierName
  },
  SET_PLATFORMNAME: (state, platformName) => {
    state.platformName = platformName
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_PLATFORMID: (state, platformId) => {
    state.platformId = platformId
  },
  SET_CARRIERID: (state, carrierId) => {
    state.carrierId = carrierId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.access_token)
          commit('SET_USERNAME', username)
          setToken(response.data.access_token)
          setUsername(username)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.username)
        .then(response => {
          const data = response.data

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          // roles must be a non-empty array
          commit('SET_ROLES', ['admin'])
          commit('SET_NAME', data.name)
          commit('SET_PLATFORMNAME', data.platformName)
          commit('SET_CARRIERNAME', data.carrierName)
          commit('SET_AVATAR', '')
          commit('SET_INTRODUCTION', data.introduction)
          commit('SET_USERID', data.id)
          commit('SET_PLATFORMID', data.platformId)
          commit('SET_CARRIERID', data.carrierId)
          setUserId(data.id)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout({ access_token: state.token })
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()
          commit('SET_USERNAME', '')
          commit('SET_USERID', '')
          commit('SET_PLATFORMID', '')
          commit('SET_CARRIERID', '')
          removeUsername()
          removeUserId()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch(error => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USERNAME', '')
          removeUsername()
          removeToken()
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_USERNAME', '')
      removeUsername()
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
