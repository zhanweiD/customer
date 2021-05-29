import {useForm, useState, useEffect} from 'react'
import {Drawer, Form, Button, Col, Space, Input, Select, Collapse, Switch} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import _ from 'lodash'
import cls from 'classnames'
import Wechat from './wechat/wechat'
import Preview from './wechat/preview'
import Frame from '../icon/wechat-frame.svg'
import io from './io'
import data from './wechat/data'

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
  [
    {
      template_id: 'qdJWd_NP89dVXoZm16OnMbVpmHAKeEYJhiuXQI-u9wM',
      title: '异地登录提醒',
      primary_industry: 'IT科技',
      deputy_industry: 'IT软件与服务',
      content: '{{first.DATA}}\n\n您的企业邮帐号{{account.DATA}}于{{time.DATA}}在{{city.DATA}}登录。地址信息有误差，如有疑问请在电脑登录并查看“自助查询”。\n{{remark.DATA}}',
      example: '你好，samueldeng\n\n你的企业邮帐号samueldeng@gzmailteam.com于今天11:22在北京登录。地址信息有误差，如有疑问请在电脑登录并查看自助查询。',
    },
    {
      template_id: '5ZQaDUG6m_nzKlgrAJznbawATtN1XqHzJ6Bbrn_FDaI',
      title: '服务器恢复通知',
      primary_industry: 'IT科技',
      deputy_industry: 'IT软件与服务',
      content: '{{first.DATA}}\n\n故障停止时间：{{time.DATA}}\n故障持续时间：{{last.DATA}}\n{{reason.DATA}}',
      example: '您好，您的网站 abc.com 恢复访问\n\n故障停止时间：2013-11-21 11:11:11\n故障持续时间：3小时\n故障原因：无法连接服务器',
    },
  ],
]

export default ({
  showWeService, // 显示
  weServiceDrawer, // 控制显示
  weSFormData, // 用于编辑回显
  setWeSFormData, // 收集表单
  runFormData, // 开始的数据，需要获取客群 id
  groupList,
}) => {
  const [templateList, setTemplateList] = useState(templateListMock)
  const [templateKeyList, setTemplateKeyList] = useState([])
  const [myForm] = Form.useForm()
  const [formInitValue, setFormInitValue] = useState({
    setRestrict: 1,
    channelCode: '微信',
  })
  const [tagList, setTagList] = useState(data)
  const [previewData, setPreviewData] = useState('')

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
    // console.log(c)
    // console.log(a)
  }

  const saveDrawer = () => {
    myForm.validateFields().then(values => {
      console.log(values)
      setWeSFormData(values)
      weServiceDrawer(false)
    }).catch(err => {
      console.log(err)
    })
  }

  const [vis, setVis] = useState(false)
  const show = () => {
    setVis(!vis)
    console.log(vis)
  }

  const templateChange = e => {
    // 目标模板数据
    const target = _.find(templateList, item => item.template_id === e)
    const req = /{(\w+).DATA}/g
    const matchData = target.content.match(req)
    const matchKeys = _.map(matchData, item => item.replace('{', '').replace('.DATA}', ''))

    setTemplateKeyList(matchKeys)
    setPreviewData(target.content)
    setVis(true)
  }

  /*
  "action": {
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
    const tagMap = {}
    tagList.forEach(item => {
      tagMap[item.objNameTagName] = item.objIdTagId
    })

    myForm.validateFields().then(value => {
      // TODO:
      // 把数据存起来
      const detail = []
      templateKeyList.forEach(item => {
        let itemValue = value[item]

        itemValue = itemValue.replace(/<span[^>]+">/g, '${').replace(/<\/span>/g, '}')

        tagList.forEach(e => {
          if (itemValue.indexOf(e.objNameTagName) > -1) {
            itemValue = itemValue.replace(new RegExp(e.objNameTagName, 'g'), e.objIdTagId)
          }
        })

        detail.push({
          name: item,
          value: itemValue,
        })
      })

      setWeSFormData({
        action: {
          detail,
          channelCode: value.channelCode,
          templateId: value.templateId,
          setRestrict: value.setRestrict,
        },
      })

      console.log({
        action: {
          detail,
          channelCode: value.channelCode,
          templateId: value.templateId,
          setRestrict: value.setRestrict,
        },
      })

      weServiceDrawer(false)
      setVis(false)
    }).catch(err => console.log(err))
  }

  const cancelData = () => {    
    weServiceDrawer(false)
    setVis(false)
    const templateObj = {}

    if (weSFormData.action && weSFormData.action.detail) {
      // 说明有数据
      weSFormData.action.detail.forEach(e => {
        let valueTemp = e.value
        tagList.forEach(item => {
          if (valueTemp.indexOf(item.objIdTagId) > -1) {
            valueTemp = valueTemp.replace(new RegExp(item.objIdTagId, 'g'), item.objNameTagName)
          }
        })

        // 对 span 的处理
        if (valueTemp.indexOf('${') > -1) {
          valueTemp = valueTemp.replace(/}/g, '</span>')
          let id = 0
          while (valueTemp.indexOf('${') > -1) {
            id += 1
            valueTemp = valueTemp.replace('${', `<span class="tag-drop" contentEditable="false" id="${id}">`)
          }
        }

        templateObj[e.name] = valueTemp
      })
      myForm.setFieldsValue(templateObj)
    } else {
      // 没数据
      setTemplateKeyList([])
      myForm.resetFields()
    }
  }

  // TODO:
  const getTemplate = async () => {
    try {
      const res = await io.getTemplate({
        accountId: 'wxe2b3f176ba1a4f33',
      })

      setTemplateList(res.template_list || [])
    } catch (error) {
      console.log(error)
    }
  }

  const getTagList = async objId => {
    try {
      const res = await io.getTagList({objId: String(objId)})
      
      if (res && res.length > 0) {
        setTagList(res)
      } else {
        setTagList(data)
      }  
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTemplate()

    // if (weSFormData.detail && weSFormData.detail.length > 0) {
    //   // 有模板数据
    //   const templateObj = {}

    //   weSFormData.detail.forEach(e => {
    //     templateObj[e.name] = e.value
    //   })

    //   setTemplateKeyList(_.map(weSFormData.detail, 'name'))
    //   setFormInitValue({
    //     ...formInitValue,
    //     ...templateObj,
    //   })
    // }
  }, [])

  useEffect(() => {
    if (runFormData.clientGroupId) {
      const target = _.find(groupList, item => item.id === runFormData.clientGroupId)
      // 客群id
      getTagList(target.objId)
    }
  }, [groupList])

  useEffect(() => {
    if (weSFormData.action && weSFormData.action.detail && weSFormData.action.detail.length > 0) {
      // 有模板数据
      const templateObj = {}

      // 要处理数据
      weSFormData.action.detail.forEach(e => {
        let valueTemp = e.value
        tagList.forEach(item => {
          if (valueTemp.indexOf(item.objIdTagId) > -1) {
            valueTemp = valueTemp.replace(new RegExp(item.objIdTagId, 'g'), item.objNameTagName)
          }
        })

        // 对 span 的处理
        if (valueTemp.indexOf('${') > -1) {
          valueTemp = valueTemp.replace(/}/g, '</span>')
          let id = 0
          while (valueTemp.indexOf('${') > -1) {
            id += 1
            valueTemp = valueTemp.replace('${', `<span class="tag-drop" contentEditable="false" id="${id}">`)
          }
        }

        templateObj[e.name] = valueTemp
      })

      const target = _.find(templateList, item => item.template_id === weSFormData.action.templateId)
      setPreviewData(target.content)
      setTemplateKeyList(_.map(weSFormData.action.detail, 'name'))
      setFormInitValue({
        ...formInitValue,
        ...templateObj,
        setRestrict: weSFormData.action.setRestrict,
        templateId: weSFormData.action.templateId,
        channelCode: weSFormData.action.channelCode,
      })
    }
  }, [weSFormData])

  useEffect(() => {
    if (showWeService) {
      if (weSFormData.action && weSFormData.action.templateId) {
        setVis(true)
      }
    }
  }, [showWeService])

  return (
    <Drawer
      title="微信服务号"
      width={560}
      className="run-drawer"
      visible={showWeService}
      onClose={cancelData}
      bodyStyle={{paddingBottom: 80}}
      footer={(
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button className="mr8" onClick={cancelData}>
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
        initialValues={formInitValue}
        onFieldsChange={(c, a) => fieldsChange(c, a)}
      >
        <Item
          label="触达通道"
          name="channelCode"
          className="user-pb8"
          style={{
            margin: '0 24px 16px',
          }}
        >
          <Select defaultValue="微信">
            <Option value="微信">微信</Option>
          </Select>
        </Item>
        <Collapse size="small" defaultActiveKey={['1', '2']}>
          <Panel header="触达内容" key="1">
            <Item
              label="内容模板"
              name="templateId"
              rules={[{required: true, message: '模板不能为空'}]}
            >
              <Select onChange={templateChange}>
                {
                  templateList.map(item => <Option value={item.template_id}>{item.title}</Option>)
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
                  rules={[{required: true, message: '输入不能为空'}]}
                >
                  <Wechat id={item} tagList={tagList} />
                </Item>
              ))
            }
          </Panel>
          <Panel header="触达设置" key="2">
            <Item
              {...layout2}
              label="触达限制"
              name="setRestrict"
              extra={switchText}
              valuePropName="checked"
            >
              <Switch onChange={switchChange} />
            </Item>
          </Panel>
        </Collapse>
      </Form>
      {/* <Button onClick={() => show()}>
        点击
      </Button> */}
      <Preview>
        <div 
          className={cls({
            'wechat-preview': true,
            FBH: true,
            FBJC: true,
            'wechat-active': vis,
          })}
        >
          <img src={Frame} alt="frame" style={{width: '300px'}} />
          <div 
            className="preview-box mt20" 
            dangerouslySetInnerHTML={{__html: previewData}} 
          />
        </div>
      </Preview>
    </Drawer>
  )
}
