import {Button} from 'antd'

export default () => {
  return (
    <Button
      style={{marginTop: '30%', left: '50%'}}
      onClick={() => {
        window.open('https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=wxe152e4b4304727d8&pre_auth_code=preauthcode@@@1B9B57fBuXB-iug8e2QgaZh1Z0z9yUzyn1fb93ds5lhTJjkXQC2mIj7KjoKDGZpP8GDfVvwsk4JqSvwmWhyoig&redirect_uri=http://127.0.0.1:8787/wechat/auth_success&auth_type=1')
      }}
      type="primary"
    >
      绑定

    </Button>
  )
}
