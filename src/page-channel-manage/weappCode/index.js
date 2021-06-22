import {Button} from 'antd'
import {useEffect, useState} from 'react'
import {errorTip} from '../../common/util'
import io from '../io'

export default props => {
  // 授权跳转
  const authoriza = async () => {
    const {params = {}} = props.match
    console.log(params)
    const url = `http://${params.host}/customer/index.html#/channel-manage`

    localStorage.setItem('hostUrl', url)
    localStorage.setItem('userAccount', params.userAccount)
    try {
      const res = await io.authoriza()
      if (res) window.location.href = `${res}http%3A%2F%2Fzdhyx.dc.dtwave.com%2Fcustomer%2Findex.html%23%2FtoCustomer`
    } catch (error) {
      errorTip(error.message)
    }
  }
  useEffect(() => {
    authoriza()
  }, [])
  return <div />
}
