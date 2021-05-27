import {useForm, useState} from 'react'
import {Drawer, Form, Button, Col, Space, Input, Select, Collapse, Switch} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import cls from 'classnames'
import Wechat from './wechat/wechat'
import Preview from './wechat/preview'

const {Option} = Select
const {Item} = Form
const {Panel} = Collapse

const layout1 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 10,
  },
}
const layout2 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

export default () => {
  const [myForm] = Form.useForm()

  const [switchText, setSwitchText] = useState('仅显示当前计划中使用的通道的限制，如需修改请前往渠道管理中设置')
  const switchChange = e => {
    console.log(e)
    if (e) {
      setSwitchText('仅显示当前计划中使用的通道的限制，如需修改请前往渠道管理中设置')
    } else {
      setSwitchText('不使用触达限制，可能会对用户造成过度干扰')
    }
  }

  const fieldsChange = (c, a) => {
    console.log(c)
    console.log(a)
  }

  const [vis, setVis] = useState(false)
  const show = () => {
    setVis(!vis)
    console.log(vis)
  }

  return (
    <Drawer
      title="微信服务号"
      width={560}
      className="run-drawer"
      visible
      bodyStyle={{paddingBottom: 80}}
      footer={(
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button>
            取消
          </Button>
          <Button type="primary">
            保存
          </Button>
        </div>
      )}
    >
      <Form
        {...layout1}
        name="wechatDrawer"
        form={myForm}
        initialValues={{
          astrict: true,
          myInput: 'aaaaa',
        }}
        onFieldsChange={(c, a) => fieldsChange(c, a)}
      >
        <Item
          label="触达通道"
          name="path"
          className="user-pb8"
          style={{
            margin: '0 24px 16px',
          }}
        >
          <Select defaultValue="">
            <Option value="">微信</Option>
          </Select>
        </Item>
        <Collapse size="small" defaultActiveKey={['1', '2']}>
          <Panel header="触达内容" key="1">
            <Item
              label="内容模板"
              name="template"
            >
              <Select />
            </Item>
            <div 
              style={{
                fontSize: '12px', 
                marginLeft: '20px', 
                color: 'rgba(0,0,0,0.65)',
                marginBottom: '12px',
              }}
            >
              内容设置
            </div>
            {
              ['first', 'add', 'eee'].map(item => (
                <Item
                  {...layout2}
                  name={item}
                  label={item}
                >
                  <Wechat id={item} />
                </Item>
              ))
            }
          </Panel>
          <Panel header="触达设置" key="2">
            <Item
              {...layout2}
              label="触达限制"
              name="astrict"
              extra={switchText}
              valuePropName="checked"
            >
              <Switch onChange={switchChange} />
            </Item>
          </Panel>
        </Collapse>
      </Form>
      <Button onClick={() => show()}>
        点击
      </Button>
      <Preview>
        <div 
          className={cls({
            'wechat-preview': true,
            FBH: true,
            FBJC: true,
            'wechat-active': vis,
          })}
        >
          <div className="preview-box mt20">
            测试测试
          </div>
        </div>
      </Preview>
    </Drawer>
  )
}
