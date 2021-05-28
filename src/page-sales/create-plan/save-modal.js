import {useState} from 'react'
import {Modal, Form, Select, Input} from 'antd'

import {errorTip, getNamePattern} from '../../common/util'
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
  planId,
}) => {
  const [saveForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const {name, groupId} = planData

  const addPlan = async params => {
    setConfirmLoading(true)
    console.log(planData)
    try {
      io.addPlan({
        ...params,
        ...planData,
        setEnd: '1',
      })
    } catch (error) {
      errorTip(error)
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
      title={planId ? '修改计划' : '保存计划'}
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
          initialValue={groupId || 1}
        >
          <Select placeholder="请选择计划分组">
            <Option value={1}>默认分组</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
