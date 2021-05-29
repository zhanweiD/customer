import {useState} from 'react'
import {Modal, Form, Select, Input} from 'antd'

import {errorTip, getNamePattern, successTip} from '../../common/util'
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
  planInfo,
  planId,
  instance,
}) => {
  const [saveForm] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [status, setStatus] = useState(0)
  const {name, groupId} = planInfo

  const handleCancel = () => {
    saveForm.resetFields()
    saveModal(false)
  }

  const addPlan = async params => {
    setConfirmLoading(true)
    console.log(planData)
    try {
      await io.addPlan({
        ...params,
        ...planData,
        setEnd: status,
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
        ...params,
        ...planData,
        id: planId,
        setEnd: status,
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
    console.log(planData)
    console.log(instance.getNodes())
    if (instance.getNodes().length >= 3) {
      if (instance.getLinks >= 2) {
        setStatus(1)
      } else {
        setStatus(0)
      }
    } else {
      setStatus(0)
    }
    saveForm.validateFields().then(value => {
      console.log(value)
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
