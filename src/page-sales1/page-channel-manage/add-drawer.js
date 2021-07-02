import {useState, useEffect} from 'react'
import {Drawer, Button, Form, Input, Select} from 'antd'
import {debounce, successTip} from '@util'
import io from './io'

const {Item} = Form
const {Option} = Select

const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
}

export default ({
  drawerVisible,
  closeDrawer,
  record = {id: null},
  getList,
}) => {
  const [loading, setLoading] = useState(false)
  const [addForm] = Form.useForm()

  const addBasChannel = async params => {
    setLoading(true)
    try {
      await io.addBasChannel({
        channelCode: 'ALIYUN_SMS',
        ...params,
      })
      successTip('授权成功')
      closeDrawer()
      getList({currentPage: 1})
    } catch (error) {
      setLoading(false)
      console.log(error.message)
    }
  }

  const editBasChannel = async params => {
    setLoading(true)
    try {
      await io.editBasChannel({
        channelCode: 'ALIYUN_SMS',
        id: record.id,
        ...params,
      })
      successTip('编辑成功')
      closeDrawer()
      getList({currentPage: 1})
    } catch (error) {
      setLoading(false)
      console.log(error.message)
    }
  }

  const checkName = async (accountName, callback) => {
    try {
      const res = await io.checkName({
        channelCode: 'ALIYUN_SMS',
        accountName,
        id: record.id,
      })
      if (res.isExist) {
        callback('短信名称重复，请重新输入')
      } else {
        callback()
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const onFinish = () => {
    addForm.validateFields().then(value => {
      if (record.id) {
        editBasChannel(value)
      } else {
        addBasChannel(value)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  const validator = (rule, value, callback) => {
    console.log(value)
    if (!value) {
      return callback()
    }
    debounce(() => checkName(value, callback), 500)
  }

  useEffect(() => {
    addForm.resetFields()
  }, [record])

  return (
    <Drawer
      title="授权账号"
      width={525}
      className="add-drawer"
      visible={drawerVisible}
      onClose={closeDrawer}
      destroyOnClose
      maskClosable={false}
      footer={(
        <div className="far">
          <Button onClick={closeDrawer} style={{marginRight: 8}}>
            取消
          </Button>
          <Button loading={loading} onClick={onFinish} type="primary">
            保存
          </Button>
        </div>
      )}
    >
      <Form 
        form={addForm}
        {...layout}
        name="addDrawer"
      >
        <Item
          name="accountName"
          label="短信名称"
          initialValue={record.accountName}
          rules={[
            {required: true, message: '请输入短信名称'},
            {validator},
          ]}
        >
          <Input placeHolder="请输入短信名称" />
        </Item>
        <Item
          name="accountCode"
          label="AccessKey"
          initialValue={record.accountCode}
          rules={[{required: true, message: '请输入AccessKey'}]}
        >
          <Input placeHolder="请输入" />
        </Item>
        <Item
          name="secretKey"
          label="AccessKeySecret"
          initialValue={record.secretKey}
          rules={[{required: true, message: '请输入AccessKeySecret'}]}
        >
          <Input placeHolder="请输入" />
        </Item>
      </Form>
      <div className="c45 actionTip">
        <div className="fac">- 操作指南 -</div>
        <p>
          1 登录阿里云帐号，在顶部菜单中找到“企业”下拉选项中选择 “人员权限管理”。
          也可直接进入：
          <a target="_blank" rel="noreferrer" href="https://ram.console.aliyun.com/users">https://ram.console.aliyun.com/users</a>
        </p>
        <p>
          2 在“人员权限管理”界面选择已有用户或者创建一个新用户，并选择添加权限。
        </p>
        <p>
          3 添加短信管理全部权限到此用户，在选择权限搜索栏，搜索sms或者短信，选择“管理短信服务（SMS)权限”。
        </p>
        <p>
          4 在此用户下创建一个AccessKey，请保存此信息。
        </p>
        <p>
          5 将此AccessKey信息添加到慧营客完成授权。
        </p>
      </div>
    </Drawer>
  )
}
