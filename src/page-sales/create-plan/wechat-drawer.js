import {useForm, useState, useEffect} from 'react'
import {Drawer, Form, Button, Col, Space, Input, Select, Collapse, Switch} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import _ from 'lodash'
import cls from 'classnames'
import Wechat from './wechat/wechat'
import Preview from './wechat/preview'
import io from './io'

const {Option} = Select
const {Item} = Form
const {Panel} = Collapse

const layout1 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 10,
  },
}
const layout2 = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}

const templateListMock = [
  {
    template_id: 'iPk5sOIt5X_flOVKn5GrTFpncEYTojx6ddbt8WYoV5s',
    title: '领取奖金提醒',
    primary_industry: 'IT科技',
    deputy_industry: '互联网|电子商务',
    content: '{ {result.DATA} }\n\n领奖金额:{ {withdrawMoney.DATA} }\n领奖  时间:    { {withdrawTime.DATA} }\n银行信息:{ {cardInfo.DATA} }\n到账时间:  { {arrivedTime.DATA} }\n{ {remark.DATA} }',
    example: '您已提交领奖申请\n\n领奖金额：xxxx元\n领奖时间：2013-10-10 12:22:22\n银行信息：xx银行(尾号xxxx)\n到账时间：预计xxxxxxx\n\n预计将于xxxx到达您的银行卡',
  },
]

export default () => {
  const [templateList, setTemplateList] = useState(templateListMock)
  const [templateKeyList, setTemplateKeyList] = useState([])
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

  const templateChange = e => {
    // 目标模板数据
    const target = _.find(templateList, item => item.title === e)
    const req = /{(\w+).DATA}/g
    const matchData = target.content.match(req)
    const matchKeys = _.map(matchData, item => item.replace('{', '').replace('.DATA}', ''))

    setTemplateKeyList(matchKeys)
  }

  /*
  "actionReq": {
    "id": 1,
    "channelCode": "渠道code",
    "templateId": 1,
    "detail": [
      {
        "name": "first",
        "value": "XXX"
      }
    ],
    "openDetail": [
      {
        "name": "first",
        "value": "XXX"
      }
    ],
    "openType": 1
  }
  */
  const saveData = () => {
    console.log(myForm.getFieldsValue())
    const detail = []

    const values = myForm.getFieldsValue()

    // TODO: 字段的数据
    templateKeyList.forEach(item => {
      detail.push({
        name: item,
        value: values[item],
      })
    })
  }

  // TODO:
  const getTemplate = async () => {
    try {
      const res = await io.getTemplate({
        accountId: 'wxe2b3f176ba1a4f33',
      })
      // setGroupList(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTemplate()
  }, [])

  return (
    <Drawer
      title="微信服务号"
      width={560}
      className="run-drawer"
      visible={false}
      bodyStyle={{paddingBottom: 80}}
      footer={(
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button className="mr8">
            取消
          </Button>
          <Button type="primary" onClick={saveData}>
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
              <Select onChange={templateChange}>
                {
                  templateList.map(item => <Option value={item.title}>{item.title}</Option>)
                }
              </Select>
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
              templateKeyList.map(item => (
                <Item
                  {...layout2}
                  name={item}
                  label={item}
                >
                  <Wechat id={item} />
                </Item>
              ))
            }
            {/* {
              ['first', 'add', 'eee'].map(item => (
                <Item
                  {...layout2}
                  name={item}
                  label={item}
                >
                  <Wechat id={item} />
                </Item>
              ))
            } */}
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
