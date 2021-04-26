import intl from 'react-intl-universal'

/**
 * @description 查看页面权限判断
 */

import {useState} from 'react'
import NoData from '../no-data'

export default PageComponent => {
  function AuthView(props) {
    const [auth, changeAuth] = useState(true)
    if (!auth) {
      return <NoData text="暂无访问权限，请联系管理员开通权限" />
    }
    return <PageComponent {...props} />
  }
  return AuthView
}
