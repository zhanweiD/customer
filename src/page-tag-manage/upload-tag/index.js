import {Card} from 'antd'
import './index.styl'

const UploadTag = () => {
  return (
    <div className="FBJC FBAC FBH upload-tag" style={{height: 'calc(100vh)'}}>
      <Card title="上传文件" extra={<a href="/hub_api/sync/excelTemplate">下载模版</a>} style={{width: 300}}>
        <form action="/hub_api/sync/excelImport" method="post" encType="multipart/form-data">
          <input type="file" name="file" className="mb16" />
          <br />
          <button type="submit">提交</button>
        </form>
      </Card>
    </div>
  )
}

export default UploadTag
