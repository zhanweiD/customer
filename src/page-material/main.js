import React, {useState} from 'react'
import {Button, Upload, message, Modal, Form, Input, Radio} from 'antd'
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons'

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}
const extraText = {
  picture: '支持jpg/png格式，大小1MB以内',
  audio: '支持mp3/wma/wav/amr格式，播放长度不超过60s，大小2MB以内',
  video: '支持mp4格式，大小10MB以内',
}
function beforeUpload(file) {
  console.log(file)
  const video = document.createElement('video')
  video.src = URL.createObjectURL(file)
  video.onloadedmetadata = function () {
    console.log('长度', video)
  }
  const isJpgOrPng = file.type === 'audio/mpeg'
  // if (!isJpgOrPng) {
  //   message.error('You can only upload JPG/PNG file!')
  // }
  const isLt2M = file.size / 1024 / 1024 < 6
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export default () => {
  const [loading, setLoading] = useState(false)
  const [materialType, setMaterialType] = useState(1)
  const [uploadExtra, setUploadExtra] = useState(extraText.picture)
  const [uploadForm] = Form.useForm()

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  
  
  const handleChange = info => {
    console.log(info)
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, imageUrl =>
      // );
    }
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  )

  const handleOk = () => {
    console.log('ok')
  }
  const handleCancel = () => {
    console.log('cancel')
  }
  const changeRadio = v => {
    const {value} = v.target
    const {audio, video, picture} = extraText
    console.log(v.target.value)
    if (value === 1 || value === 2) setUploadExtra(picture)
    if (value === 3) setUploadExtra(audio)
    if (value === 4) setUploadExtra(video)
    setMaterialType(v)
  }

  return (
    <Modal
      title="上传素材"
      visible
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        {...layout}
        name="basic"
        form={uploadForm}
      >
        <Form.Item
          label="素材类型"
          name="materialType"
          initialValue={materialType}
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Radio.Group onChange={changeRadio}>
            <Radio value={1}>图片</Radio>
            <Radio value={2}>二维码</Radio>
            <Radio value={3}>音频</Radio>
            <Radio value={4}>视频</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="上传素材"
          name="material"
          extra={uploadExtra}
          // rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
            {uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          label="素材名称"
          name="name"
          rules={[{required: true, message: '请输入名称'}]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="descr"
        >
          <Input placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
