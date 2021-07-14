import {Button} from 'antd'
import {useEffect, useState} from 'react'

export default props => {
  useEffect(() => {
    const params = window.location.hash.split('?')[1].split('&')
    if (!params) return
    const authCode = params[0].split('=')[1]
    const expiresIn = params[1].split('=')[1]
    const req = new XMLHttpRequest()
    req.open('get', `http://zdhyx.dc.dtwave.com/wechat/authorized?auth_code=${authCode}&expires_in=${expiresIn}&userAccount=${localStorage.getItem('userAccount')}`, true)
    req.setRequestHeader('Content-Type', 'application/json')
    req.onload = () => {
      window.location.href = localStorage.getItem('hostUrl')
      // window.location.href = 'http://192.168.90.135/customer/index.html#/channel-manage'
    }
    req.send()
  }, [])
  return <div />
}