import {Form, Select, Input, Button} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import _ from 'lodash'
import {debounce, getNamePattern} from '../common/util'

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
  colon: false,
}


export default inject('store')(({store}) => {
  const [form] = Form.useForm()

  const checkName = (rule, value, callback) => {
    if (value) {
      // debounce(() => {
      if (store.isEdit) {
        store.checkFormatName(
          {
            bizName: value,
            id: store.formInitValue.id,
          },
          callback
        )
      } else {
        store.checkFormatName({bizName: value}, callback)
      }
      // }, 500)
    } else {
      callback()
    }
  }

  const checkCode = (rule, value, callback) => {
    if (value) {
      // debounce(() => {
      if (store.isEdit) {
        store.checkFormatCode(
          {
            bizCode: value,
            id: store.formInitValue.id,
          }, 
          callback
        )
      } else {
        store.checkFormatCode({bizCode: value}, callback)
      }
      // }, 500)
    } else {
      callback()
    }
  }

  return useObserver(() => (
    <div>
      <Form
        form={form}
        name="format"
        {...formItemLayout}
        initialValues={store.formInitValue}
      >
        <Form.Item
          label="业态名称"
          name="bizName"
          rules={[
            ...getNamePattern(),
            // {required: true, message: '请输入业态名称'},
            {
              validator: (rule, value, callback) => checkName(rule, value, callback),
            },
          ]}
        >
          <Input placeHolder="请输入业态名称" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="业态Code"
          name="bizCode"
          rules={[
            {required: true, message: '请输入业态Code'},
            {
              validator: (rule, value, callback) => checkCode(rule, value, callback),
            },
          ]}
        >
          <Input placeHolder="请输入业态Code" autoComplete="off" />
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
          loading={store.confirmLoading}
          onClick={() => {
            form.validateFields().then(value => {
              if (store.isEdit) {
                store.editFormat(form.getFieldsValue())
              } else {
                store.addFormat(form.getFieldsValue())
              }
            }).catch(err => {
              console.log(err)
            })
          }}
        >
          确定
        </Button>
      </div>
    </div>
  ))
})
