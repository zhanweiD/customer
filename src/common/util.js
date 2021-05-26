/* eslint-disable */
import {Component} from 'react'
import { message } from 'antd';
import {ErrorEater} from '@dtwave/uikit'
import md5 from 'md5'
// import io from '../frame/io'

//*--------------- 方法类 (返回方法) ---------------*//
/**
 * @description 接口路径处理
 */
const {pathPrefix} = window.__keeper

/**
 *
 * 前端路由统一的添加一个前缀
 */
export const addPathPrefix = path => {
  // eslint-disable-next-line no-underscore-dangle
  const {pathPrefix = ''} = window.__keeper
  return pathPrefix + path
}

export const baseApi = `${pathPrefix}hub_api` // 客户中台
export const marketingApi = `${pathPrefix}marketing_api` // 营销模块
export const sceneApi = `${pathPrefix}hub_api/occasion` // 场景
export const baseSyncApi = `${pathPrefix}hub_api/objTransmission` // 标签中心
export const baseUserApi = `${pathPrefix}hub_api` // 用户中心
export const baseUser = `${pathPrefix}hub_user_api/user` // 用户
export const baseZtOrg = `${pathPrefix}hub_user_api/ztOrg` // 部门
export const baseRole = `${pathPrefix}hub_user_api/role` // 角色
export const basePerm = `${pathPrefix}hub_user_api/perm` // 权限
export const groupApi = `${pathPrefix}hub_api/group` // 客群管理
export const derivativeApi = `${pathPrefix}hub_api/derivation` // 可视化加工

// 接口前缀

export const relGroupApi = `${pathPrefix}/relGroup` // 客群配置
export const groupConfigApi = `${pathPrefix}/relGroup` // 客群配置

export const groupDetailsApi = `${pathPrefix}/groupDetails` // 客群详情
export const groupAnalysis = `${pathPrefix}/groupAnalysis` // 客群分析

export const overviewApi = `${pathPrefix}/overview`// 总览
export const projectApi = `/api/tagmodel/1_0_0/project` // 项目列表
export const approvalApi = `${pathPrefix}/apply` // 审批管理

const createRequestFn = method => (url, config) => ({
  url,
  method,
  ...config,
})

export const nameTypeMap = {
  name: 1,
  enName: 2,
  objPk: 3,
  tagName: 1,
  tagEnName: 2,
}

// 生成get请求方法的配置对象
export const get = createRequestFn('GET')

// 生成post请求方法的配置对象
export const post = createRequestFn('POST')
export const put = createRequestFn('PUT')
export const del = createRequestFn('DELETE')

// 从__keeper获取部分信息
export function getKeeper(key) {
  const keeper = window.keeper || {}
  return keeper[key]
}

export const base64Decode = input => new Buffer(input, 'base64').toString()
export const base64Encode = input => new Buffer(input).toString('base64')

// 加密方式（非私有化则固定是md5加密，私有化则看配置，默认也是md5）
export function encryptPassword(password) {
  const encryptType = getKeeper('encryptType') || 'md5'
  return encryptType === 'md5' ? md5(password) : base64Encode(password)
}

/**
 * @description 转化成@antd Select-Options格式
 * @param0 list 
 * @param1 labelName 返回数据label 字段名
 * @param2 valueName 返回数据value 字段名
 */
export const changeToOptions = (list=[]) => (labelName, valueName) => list.map((obj={}) => ({ name: obj && obj[labelName], value: obj && obj[valueName] }))
export const changeToOptionsWithDisabled = (list=[]) => (labelName, valueName, disabledKey) => list.map((obj={}) => ({ name: obj && obj[labelName], value: obj && obj[valueName], disabled: obj && Number(obj[disabledKey])}))
/**
 * @description 遍历数组根据"id"值查找对应的"name"
 * @param {*} list 数组
 * @param {*} id 
 * @param {*} idName 数组对象中对应键值对中的key命名；默认name
 * @param {*} labelName 数组对象中对应键值对中的value命名;默认value
 */
export const keyToName = (list, id, idName = 'value', labelName = 'name') => {
  if(!list.length) return null
  const r = _.filter(list, (obj) => obj[idName] === id)[0] || {}
  return r[labelName]
}

/**
 * @description 深拷贝
 * @param {*} obj 
 */
export const deepCopy = obj => {
  if (typeof obj !== 'object') return obj
  const objClone = Array.isArray(obj) ? [] : {}
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(obj)) {
    // 判断ojb子元素是否为对象，如果是，递归复制
    if (obj[key] && typeof obj[key] === 'object') {
      objClone[key] = deepCopy(obj[key])
    } else {
      // 如果不是，简单复制
      objClone[key] = obj[key]
    }
  }
  return objClone
}

/**
 * @description 一纬数组合并去重
 * @param {*} arr1, arr2 
 */
export const combineArray = (arr1, arr2) => {
  let arr = arr1.concat(arr2)
  return Array.from(new Set(arr))
}

/**
 * @description 统一成功提示
 * @param content
 */
export function successTip(content) {
  message.success(content)
}

/**
 * @description 操作失败提示
 * @param content
 */
export function failureTip (content) {
  message.error(content)
}
/**
 * @description 接口异常提示
 * @param title
 */
export function errorTip(title) {
  ErrorEater(
    'default',
    title,
    e => console.log(e),
  )
}

/**
 * @description 将对象中的value值进行trim()转换
 * @param {*} values @typedef object
 */
export function trimFormValues(values) {
  Object.keys(values).map(k => {
    if (typeof values[k] === 'string') {
      values[k] = values[k].trim()
    }
  })
  return values
}

/**
 * @author 凡书
 * @description 限制select选择个数
 * @number 不能超过number个
 */
export function limitSelect(rule, values, callback, number) {
  // const {setFieldsValue} = this.form
  // let newArr
  if (values.length > number) {
    // newArr = [].concat(values.slice(0, number-1), values.slice(-1))
    // setFieldsValue({
    //   outputTags: newArr,
    // })
    callback(`最多可选择${number}个标签`)
  } 
  // else {
  //   newArr = value
  //   callback()
  // }
  callback()
}

export function isJsonFormat(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

/**
 * @description 将后端打平的数据结构处理成树组件需要的数据结构
 * @param {*} data 类目树数据
 */
export function listToTree(data) {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === 0)
}

/**
 * @description 根据数据类型code 返回 数据类型name; 常用数据类型 整数型/小数型/文本型/日期型
 * @param {*} code 
 */

export const getDataTypeName = (code) => {
  const dataType = window.njkData.dict.dataType || []
  const filterItem = dataType.filter(d => +d.key === +code)[0] || {}
  return filterItem.value
}

// export const codeInProduct = (code, isCommon) => {
//   const {userProductFunctionCode = [], projectFunctionCode = []} = window.frameInfo || {}
//   const functionCodes = isCommon ? userProductFunctionCode : projectFunctionCode

//   return functionCodes.indexOf(code) > -1
// }
//*------------------------------ 组件类 (返回组件) ------------------------------*//
/**
 * @description 异步加载组件
 * @param {*} getComponent 
 */
export function asyncComponent(getComponent) {
  return class AsyncComponent extends Component {
    static Component = null
    state = {Component: AsyncComponent.Component}

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component
          this.setState({Component})
        })
      }
    }

    render() {
      const {Component} = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return null
    }
  }
}

/**
 * @description 时间格式化
 * @param {*} timestamp 时间 
 */
export function Time({timestamp, placeholder}) {
  return (
    <span>
      {timestamp ? (moment(+timestamp).format('YYYY-MM-DD HH:mm:ss')) : (placeholder ? '--' : '')}
    </span>
  )
}

/**
 * @description 名称正则校验
 * @description 允许中文、英文、数字、下划线，不允许“数栖”或“下划线”开头，结尾不做限制
 * @author 麻花
 * @param max 名称长度最大值; 默认20
 */

export function getNamePattern(max = 32) {
  return [{
    transform: value => value && value.trim(),
  }, {
    max, 
    message: `不能超过${max}个字符`,
  }, {
    required: true,
    message: '名称不能为空'
  }, {
    pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]+$/, message: '格式不正确，允许输入中文/英文/数字/下划线/()',
  }, {
    pattern: /^(?!_)/, message: '不允许下划线开头',
  }, {
    pattern: /^(?!数栖)/, message: '不允许数栖开头',
  }];
}

export function getEnNamePattern(max = 32) {
  return [{
    transform: value => value && value.trim(),
  }, {
    max, 
    message: `不能超过${max}个字符`,
  }, {
    required: true,
    message: '名称不能为空'
  }, {
    pattern: /^[a-zA-Z][a-zA-Z0-9_]{0,}$/, message: '格式不正确，允许输入英文/数字/下划线，必须以英文开头',
  }];
}

// 标签、对象英文名校验正则
export const enNameReg = /^[a-zA-Z][a-zA-Z0-9_]{0,32}$/

export function calcSize(size, defaultUnit = 'B', isToFixed = true) {
  const map = {
    b: 1,
    kb: 2 ** 10,
    mb: 2 ** 20,
    gb: 2 ** 30,
    tb: 
    2 ** 40,
  }
}

/**
 * @description 重命名校验防抖
 * @author 凡书
 * @param fn 要防抖执行的函数 
 * @param delay 间隔时间
 */

let timer = null
export function debounce(fn, delay = 200) {
  clearTimeout(timer)
  timer = setTimeout(fn, delay)
}

export function downloadResult(params, url) {
  successTip('导出中，请稍等！')
  const req = new XMLHttpRequest()
  req.open('POST', `${baseApi}/${url}` , true)
  req.responseType = 'blob'
  req.setRequestHeader('Content-Type', 'application/json')
  req.setRequestHeader('Authorization', `${localStorage.getItem('token')}`)
  req.onload = () => {
    const data = req.response
    const blob = new Blob([data])
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = `导出列表.xls`
    a.href = blobUrl
    a.click()
  }

  req.send(JSON.stringify(params))
}

// 功能权限点
export const codeInProduct = (code) => {
  const {perms = []} = window.frameInfo || {}
  return perms.indexOf(code) > -1
}

/**
 * @description 审计日志（操作记录）
 * @param {*} permsName 具体操作 
 */
export function userLog(permsName) {
  const params = {
    userAccount: localStorage.getItem('userAccount'),
    permsName,
  }
  const req = new XMLHttpRequest()
  req.open('POST', `${baseUser}/log` , true)
  req.setRequestHeader('Content-Type', 'application/json')
  req.setRequestHeader('Authorization', localStorage.getItem('token'))

  req.send(JSON.stringify(params))
}

/**
 * 描述 数字千分位格式化
 * @date 2021-04-20
 * @param {any} number
 * @returns {string} number
 */
export function moneyNumFormat(number) {
  return number ? number.toLocaleString('en-US') : 0
}