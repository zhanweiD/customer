
/**
 * @description 查看页面权限判断
 */

import {useState, useEffect} from 'react'
import NoData from '../no-data'

export default PageComponent => {
  function AuthView(props) {
    const [auth, changeAuth] = useState(true)
    useEffect(() => {
      const data = window.frameInfo.perms || []
      // changeAuth(data.find(item => item === props.match.path))
    }, [])
    if (!auth) {
      return <NoData text="暂无访问权限，请联系管理员开通权限" />
    }
    return <PageComponent {...props} />
  }
  return AuthView
}
