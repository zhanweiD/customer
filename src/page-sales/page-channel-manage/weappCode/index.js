import {useEffect} from 'react'
import {errorTip} from '../../../common/util'
import io from '../io'

export default props => {
  // 授权跳转
  const authoriza = async () => {
    const {params = {}} = props.match
    const url = `http://${params.host}/customer/index.html#/channel-manage`

    localStorage.setItem('hostUrl', url)
    localStorage.setItem('userAccount', params.userAccount)
    localStorage.setItem('authType', params.authType)
    try {
      const res = await io.authoriza({
        authType: params.authType, 
      })
      if (res) {
        window.location.href = `${res}https%3A%2F%2Fzdhyx.dtwave.com%2Fcustomer%2Findex.html%23%2FtoCustomer`
      }
    } catch (error) {
      errorTip(error.message)
    }
  }
  useEffect(() => {
    authoriza()
  }, [])
  return <div />
}
