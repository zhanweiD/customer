import {useForm} from 'react'
import {Drawer, Form, Button, Col, Space, Input, Select, Collapse} from 'antd'
import {PlusOutlined} from '@ant-design/icons'

const {Option} = Select
const {Item} = Form
const {Panel} = Collapse

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

export default ({showRun, runDrawer}) => {
  const [runForm] = Form.useForm()
  const onFinish = () => {
    runForm.validateFields().then(value => {
      console.log(value)
      // runDrawer(false)
    })
  }
  return (
    <Drawer
      title="开始控件"
      width={560}
      className="run-drawer"
      onClose={() => runDrawer(false)}
      visible={showRun}
      bodyStyle={{paddingBottom: 80}}
      footer={(
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={() => runDrawer(false)} style={{marginRight: 8}}>
            取消
          </Button>
          <Button onClick={onFinish} type="primary">
            保存
          </Button>
        </div>
      )}
    >
      <Form 
        {...layout}
        className="run-form"
        name="runDrawer"
        form={runForm}
      >
        <Item
          label="受众用户"
          name="username"
          className="user-pb8"
          extra="营销活动需要触达的人群"
        >
          <Select defaultValue="">
            <Option value="">全部</Option>
          </Select>
        </Item>
        <Space 
          className="form-panel" 
          style={{width: 'calc(100% + 48px)', marginLeft: '-24px'}} 
          direction="vertical" 
          size={24}
        >
          <Collapse size="small" defaultActiveKey={['1']}>
            <Panel style={{width: '100%'}} header="触发条件" key="1">
              <Item
                label="计划类型"
                name="planType"
              >
                <Select defaultValue="">
                  <Option value="">全部</Option>
                </Select>
              </Item>
              <Item
                label="重复"
                name="align"
              >
                <Select defaultValue="">
                  <Option value="">永不</Option>
                </Select>
              </Item>
              <Item
                label="触发时间"
                name="time"
              >
                <Select defaultValue="">
                  <Option value="">永不</Option>
                </Select>
              </Item>
            </Panel>
          </Collapse>
        </Space>
      </Form>
    </Drawer>
  )
}
