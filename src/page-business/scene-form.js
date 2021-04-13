import {Form, Select, Input, Button} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
  colon: false,
}

export default inject('store')(({store}) => {
  const [form] = Form.useForm()

  return useObserver(() => (
    <div>
      <Form form={form} name="scene" {...formItemLayout}>
        <Form.Item
          label="场景名称"
          name="bizName"
          rules={[{required: true, message: '请输入场景名称'}]}
        >
          <Input placeHolder="请输入场景名称" />
        </Form.Item>
        <Form.Item
          label="场景Code"
          name="bizCode"
          rules={[{required: true, message: '请输入场景Code'}]}
        >
          <Input placeHolder="请输入场景Code" />
        </Form.Item>
        <Form.Item
          label="所属业态"
          name="grandpaCode"
          rules={[{required: true, message: '请选择所属业态'}]}
        >
          <Select placeHolder="请选择所属业态" />
        </Form.Item>
        <Form.Item
          label="所属业务域"
          name="parentCode"
          rules={[{required: true, message: '请选择所属业务域'}]}
        >
          <Select placeHolder="请选择所属业务域" />
        </Form.Item>
        <Form.Item
          label="场景描述"
          name="descr"
        >
          <Input.TextArea placeHolder="请输入场景描述" rows={4} />
        </Form.Item>
      </Form>
      <div className="bottom-button">
        <Button
          className="mr8"
          onClick={() => {
            store.drawerVis = false
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            console.log(form.getFieldsValue())
          }}
        >
          确定
        </Button>
      </div>
    </div>
  ))
})
