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
      <Form
        form={form}
        name="scene"
        {...formItemLayout}
        initialValues={store.formInitValue}
      >
        <Form.Item
          label="业态名称"
          name="bizName"
          rules={[{required: true, message: '请输入业态名称'}]}
        >
          <Input placeHolder="请输入业态名称" />
        </Form.Item>
        <Form.Item
          label="业态Code"
          name="bizCode"
          rules={[{required: true, message: '请输入业态Code'}]}
        >
          <Input placeHolder="请输入业态Code" />
        </Form.Item>
        <Form.Item
          label="业态描述"
          name="descr"
        >
          <Input.TextArea placeHolder="业态描述" rows={4} />
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
