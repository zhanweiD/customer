import {useState} from 'react'
import {Modal, Form, Select, Input} from 'antd'

import {errorTip, getNamePattern, successTip} from '../../../common/util'
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
  // runFormData,
  // weSFormData,
  // channelCode,
  planInfo,
  planId,
  instance,
}) => {
  const [saveForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const {name, groupId} = planInfo

  const handleCancel = () => {
    saveForm.resetFields()
    saveModal(false)
  }

  const addPlan = async params => {
    setConfirmLoading(true)
    try {
      await io.addPlan({
        // channelCode,
        // ...runFormData,
        // ...weSFormData,
        ...planData,
        ...params,
      })
      successTip('保存成功')
      handleCancel()
      window.location.href = `${window.__keeper.pathHrefPrefix}/sales/list`
    } catch (error) {
      errorTip(error.message)
    } finally {
      setConfirmLoading(false)
    }
  }

  const updatePlan = async params => {
    setConfirmLoading(true)
    try {
      await io.updatePlan({
        // channelCode,
        // ...runFormData,
        // ...weSFormData,
        ...planData,
        id: planId,
        ...params,
      })
      successTip('保存成功')
      handleCancel()
      window.location.href = `${window.__keeper.pathHrefPrefix}/sales/list`
    } catch (error) {
      errorTip(error.message)
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleOk = () => {
    let setEnd = 0
    if (instance.getNodes().length > 2) {
      if (instance.getLinks().length > 1) {
        setEnd = 1
      } else {
        setEnd = 0
      }
    } else {
      setEnd = 0
    }
    saveForm.validateFields().then(value => {
      value.setEnd = setEnd
      if (planId) {
        updatePlan(value)
      } else {
        addPlan(value)
      }
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
