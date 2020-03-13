import Cookies from 'js-cookie'

const TokenKey = 'ocm2-token'
const Username = 'ocm2-username'
const UserId = 'ocm2-Userid'

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
  return Cookies.get(UserId)
}

export function setUserId(userid) {
  return Cookies.set(UserId, userid)
}

export function removeUserId() {
  return Cookies.remove(UserId)
}
