import React, {useState} from 'react'
import {Button, Upload, message, Modal, Form, Input} from 'antd'
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons'

export default () => {
  const [loading, setLoading] = useState(false)
  const [uploadForm] = Form.useForm()

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
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

  const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
  }

  const handleOk = () => {
    console.log('ok')
  }
  const handleCancel = () => {
    console.log('cancel')
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
          label="素材名称"
          name="username"
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="上传素材"
          name="material"
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
          name="username"
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="素材名称"
          name="username"
          rules={[{required: true, message: 'Please input your username!'}]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
