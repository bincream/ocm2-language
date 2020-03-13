import Cookies from 'js-cookie'

const TokenKey = 'shanghai-token'
const Username = 'shanghai-username'
const Userid = 'shanghai-Userid'
// const Salesid = 'shanghai-Salesid'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUsername() {
  return Cookies.get(Username)
}

export function setUsername(username) {
  return Cookies.set(Username, username)
}

export function removeUsername() {
  return Cookies.remove(Username)
}
export function getUserId() {
  return Cookies.get(Userid)
}

export function setUserId(userid) {
  return Cookies.set(Userid, userid)
}

export function removeUserId() {
  return Cookies.remove(Userid)
}
// export function getSalesid() {
//   return Cookies.get(Salesid)
// }

// export function setSalesid(salesid) {
//   return Cookies.set(Salesid, salesid)
// }

// export function removeSalesid() {
//   return Cookies.remove(Salesid)
// }
