/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

function isvalidPhone(str) {
  const reg = /^1\d{10}$/
  return reg.test(str)
}

export function validPhone(rule, value, callback) {
  if (!isvalidPhone(value)) {
    return callback('请输入正确的11位手机号码')
  } else {
    return callback()
  }
}

function isvalidIdCardNo(str) {
  const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  return reg.test(str)
}
export function validIdCardNO(rule, value, callback) {
  if (!isvalidIdCardNo(value)) {
    return callback('请输入正确长度的身份证号')
  } else {
    return callback()
  }
}

function acount(str) {
  const reg = /^(\d(?!\d*$)|[A-z])[A-z0-9]*$/
  return reg.test(str)
}
export function validAcount(rule, value, callback) {
  if (!acount(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

function contact(str) {
  const reg = /^[\u4e00-\u9fa5]+$/
  return reg.test(str)
}
export function validCN(rule, value, callback) {
  if (!contact(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

// 整数
function number(str) {
  const reg = /^\d+$/
  return reg.test(str)
}
export function validNumber(rule, value, callback) {
  if (!number(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

// 整数和小数
function int(str) {
  const reg = /^\d+(\.\d+)?$/
  return reg.test(str)
}
export function validFloat(rule, value, callback) {
  if (!int(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

// 6位整数
function number6(str) {
  const reg = /^\d{6}$/
  return reg.test(str)
}
export function validNumber6(rule, value, callback) {
  if (!number6(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}
