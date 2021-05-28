import {useState} from 'react'
import {Modal, Form, Select, Input} from 'antd'

import {getNamePattern} from '../../common/util'
import io from './io'

const {Option} = Select
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

export default ({
  visible, 
  saveModal, 
  planData,
}) => {
  const [saveForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const {name, groupId} = planData

  const addPlan = async params => {
    setConfirmLoading(true)
    try {
      io.addPlan({
        ...params,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    saveForm.resetFields()
    saveModal(false)
  }

  const handleOk = () => {
    console.log(planData)
    saveForm.validateFields().then(value => {
      console.log(value)
      addPlan(value)
      handleCancel()
    }).catch(err => console.log(err))
  }
  
  return (
    <Modal
      title="保存计划"
      visible={visible}
      destroyOnClose
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form
        {...layout}
        name="savePlan"
        form={saveForm}
      >
        <Form.Item
          label="计划名称"
          name="name"
          rules={getNamePattern()}
          initialValue={name}
        >
          <Input placeholder="请输入计划名称" />
        </Form.Item>
        <Form.Item
          label="计划分组"
          name="groupId"
          rules={[
            {
              required: true,
              message: '请选择计划分组',
            },
          ]}
          initialValue={groupId}
        >
          <Select placeholder="请选择计划分组">
            <Option value="f1">分组1</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
