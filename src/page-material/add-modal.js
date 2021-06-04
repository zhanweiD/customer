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

export default ({
  visible,
  setVisible,
}) => {
  const [loading, setLoading] = useState(false)
  const [materialType, setMaterialType] = useState(1)
  const [uploadData, setUploadData] = useState(null)
  const [uploadExtra, setUploadExtra] = useState(extraText.picture)
  const [uploadForm] = Form.useForm()

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  const beforeUpload = file => {
    const {type} = file
    if (materialType === 1 || materialType === 2) {
      const isFormat = type === 'image/jpeg' || type === 'image/png'
      if (isFormat) message.error('格式错误，仅支持PNG和JPG')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (isLt2M) message.error('大小不超过2M')
    }
    // switch (materialType) {
    //   case 1:
    //     isFormat = type === 'image/jpeg' || type === 'image/png'
    //     if (isFormat) message.error('格式错误，仅支持PNG和JPG')
    //     break
    //   case 2:
    //     isFormat = type === 'image/jpeg' || type === 'image/png'
    //     if (isFormat) message.error('格式错误，仅支持PNG和JPG')
    //     break
    //   case 3:
    //     isFormat = type === 'audio/mpeg' || type === 'audio/mp3'
    //     if (isFormat) message.error('格式错误，仅支持mp3')
    //     break
    //   default:
    //     isFormat = type === 'video/mp4'
    //     if (isFormat) message.error('格式错误，仅支持mp4')
    //     break
    // }
    if (materialType === 3) {
      const video = document.createElement('video')
      video.src = URL.createObjectURL(file)
      video.onloadedmetadata = () => {
        if (video.duration > 60) message.error('播放长度不超过60s')
      }
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
  
  // 上传状态
  const uploadChange = info => {
    console.log(info.file)
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'error') {
      setLoading(false)
      message.error('上传失败')
      setUploadData(info.file.uid)
      return
    }
    if (info.file.status === 'done') {
      setUploadData(info.file.uid)
      setLoading(false)
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, imageUrl =>
      // );
    }
  }

  const handleCancel = () => {
    setVisible(false)
  }
  const handleOk = () => {
    uploadForm.validateFields().then(value => {
      console.log(value)
      handleCancel()
    }).catch(err => console.log(err))
  }

  const changeRadio = v => {
    const {value} = v.target
    const {audio, video, picture} = extraText
    if (value === 1 || value === 2) setUploadExtra(picture)
    if (value === 3) setUploadExtra(audio)
    if (value === 4) setUploadExtra(video)
    setMaterialType(v)
  }

  // 自定义验证上传
  const validateUpload = (rule, value, callback) => {
    if (!uploadData) {
      callback('请上传文件')
    }
    callback()
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  )

  return (
    <Modal
      title="上传素材"
      visible={visible}
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
          rules={[{validator: validateUpload}]}
        >
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="/upload.do" 
            beforeUpload={beforeUpload}
            onChange={uploadChange}
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
