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
        name="runDrawer"
        form={runForm}
      >
        <Item
          label="受众用户"
          name="username"
          extra="营销活动需要触达的人群"
        >
          <Select defaultValue="">
            <Option value="">全部</Option>
          </Select>
        </Item>
        {/* <Space direction="vertical" size={24}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="营销动作" key="1">
              <div>
                111
              </div>
            </Panel>
          </Collapse>
        </Space> */}
      </Form>
    </Drawer>
  )
}
