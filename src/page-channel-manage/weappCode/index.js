import {Button} from 'antd'
import {useEffect, useState} from 'react'

export default () => {
  // const [url, setUrl] = useState('')
  const {pathPrefix = ''} = window.__keeper
  useEffect(() => {
    const req = new XMLHttpRequest()
    req.open('get', `${pathPrefix}marketing_api/wechat/pc_auth`, true)
    req.setRequestHeader('Content-Type', 'text/html')
    req.onload = () => {
      window.location.href = req.response
    }
    req.send()
  }, [])
  return <div />
  // return (
  //   <Button
  //     style={{marginTop: '30%', left: '50%'}}
  //     onClick={() => {
  //       window.open(url)
  //     }}
  //     type="primary"
  //   >
  //     绑定
  //   </Button>
  // )
}
