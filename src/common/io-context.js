import * as nattyFetch from 'natty-fetch'
import React from 'react'
import {Modal} from 'antd'

// const {pathPrefix} = window.__onerConfig
const context = nattyFetch.context({
  urlPrefix: window.__keeper.apiPrefix,
  data: {
    productId: window.__keeper.productId,
    userAccount: localStorage.getItem('userAccount'),
    // ...window.defaultParams,
  },
  mock: false,
  rest: true,
  header: {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `${localStorage.getItem('token')}`,
  },
  // 目前还没有做鉴权, 下面的设置为 false, 和服务端的*相对应
  // 如果设为 true, 需要服务端设置响应头 Access-Control-Allow-Origin 为具体的白名单
  withCredentials: false,
  mockUrlPrefix: '/mock/',
  // 添加额外参数后端会报错, 如: _api, 略坑
  urlMark: false, 
  // 添加额外参数后端会报错, 如: _stamp, 略坑
  urlStamp: false, 
  fit(response) {
    if (response) {
      if (response.code === '300001005' || response.code === '300001006' || response.code === 9000001 || response.status === 403) {
        const errorMsg = response.message || response.errorMsg || '登录超时，请重新登录'
        if (!document.getElementById('login_timeout')) {
          Modal.confirm({
            title: <span id="login_timeout">{errorMsg}</span>,
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              localStorage.setItem('url', window.location.hash)
              window.location.href = `${window.__keeper.pathHrefPrefix}/login`
              // window.location.replace(`${window.__keeper.pathHrefPrefix}/login`)
            },
          })
        }
        throw new Error(errorMsg)
      }
      return {
        success: response.success,
        content: response.content,
        error: {
          message: response.message || response.errorMsg,
          code: response.code || response.errorCode,
        },
      }
    }
    return {
      success: false,
      content: {},
      error: {
        message: '网络异常，请刷新页面重试！',
        code: '',
      },
    }
  },
})

export default context
