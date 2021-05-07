import {Button, Upload, Card} from 'antd'
import {UploadOutlined} from '@ant-design/icons'
import {errorTip, failureTip} from '@util'
import './index.styl'

const UploadTag = () => {
  const download = () => {
    window.open('/hub_api/sync/excelTemplate')
  }

  // 上传状态发生变化
  // const uploadChange = ({file, fileList}) => {
  //   console.log(file)
  //   if (file.status === 'done') {
  //     const data = file.response
  //     // const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
  //     // console.log(blob)
  //     const blobUrl = window.URL.createObjectURL(data)
  //     const a = document.createElement('a')
  //     a.download = '导入结果.xlsx'
  //     a.href = blobUrl
  //     a.click()
  //   }
  // }

  // 文件大小限制
  const beforeUpload = file => {
    const isLt10M = file.size / 1024 / 1024 < 100
    if (!isLt10M) {
      errorTip('文件不能大于100MB!')
    }
    return isLt10M
  }

  // const props = {
  //   accept: '.xls, .xlsx',
  //   method: 'post',
  //   // headers: {
  //   //   authorization: 'authorization-text',
  //   // },
  //   // responseType: 'arraybuffer',
  //   action: '/hub_api/sync/excelImport',
  //   onChange: uploadChange,
  //   beforeUpload: file => beforeUpload(file),
  // }

  return (
    <div className="FBJC FBAC FBH upload-tag" style={{height: 'calc(100vh)'}}>
      <Card title="上传文件" extra={<a href="/hub_api/sync/excelTemplate">下载模版</a>} style={{width: 300}}>
        <form action="/hub_api/sync/excelImport" method="post" encType="multipart/form-data">
          <input type="file" name="file" className="mb16" />
          <br />
          <button type="submit">提交</button>
        </form>
      </Card>
      {/* <Upload {...props}>
        <Button type="primary">
          <UploadOutlined />
          上传文件
        </Button>
      </Upload> */}
    </div>
  )
}

export default UploadTag
