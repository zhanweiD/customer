import {Button} from 'antd'
import {useEffect, useState} from 'react'

export default () => {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const req = new XMLHttpRequest()
    req.open('get', 'http://zdhyx.dc.dtwave.com/wechat/pc_auth', true)
    req.setRequestHeader('Content-Type', 'text/html')
    req.onload = () => {
      console.log(req.response)
      setUrl(req.response)
    }
    req.send()
  }, [])
  return (
    <Button
      style={{marginTop: '30%', left: '50%'}}
      onClick={() => {
        window.open(url)
      }}
      type="primary"
    >
      绑定
    </Button>
  )
}
