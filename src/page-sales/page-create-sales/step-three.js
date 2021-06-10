import {useForm, useState, useEffect} from 'react'
import {Drawer, Form, Button, Col, Space, Input, Select, Collapse, Switch} from 'antd'
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

data.forEach(item => {
  item.objIdTagId = item.objIdTagId.split('.')[1]
  item.objNameTagName = item.objNameTagName.split('.')[1]
})

const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 9,
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
  showWeService = {}, // 显示
  weServiceDrawer = {}, // 控制显示
  weSFormData = {}, // 用于编辑回显
  setWeSFormData = {}, // 收集表单
  runFormData = {}, // 开始的数据，需要获取客群 id
  groupList = [],
  current,
  prevStep,
}) => {
  const [templateList, setTemplateList] = useState(templateListMock)
  const [templateKeyList, setTemplateKeyList] = useState([])
  const [touchWay, setTouchWay] = useState('now')
  const [myForm] = Form.useForm()
  const [formInitValue, setFormInitValue] = useState({
    setRestrict: 1,
    channelCode: 'WECHAT_OFFICIAL_ACCOUNTS',
  })
  const [tagList, setTagList] = useState([])
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

  const changTouchWay = v => {
    setTouchWay(v)
    myForm.setFields([{
      triggerGap: '',
      triggerUnit: '',
    }])
  }

  // 根据触达方式生成对应dom
  const setTouchType = () => {
    return (
      <Input.Group compact>
        <Item 
          noStyle 
          name="way" 
          initialValue={touchWay} 
          rules={[{required: true, message: '请选择触达方式'}]}
        >
          <Select 
            style={{width: touchWay === 'now' ? '100%' : '30%'}} 
            onChange={changTouchWay}
          >
            <Option value="now">立即</Option>
            <Option value="delay">延迟</Option>
          </Select>
        </Item>
        {
          touchWay !== 'now' && (
            <Item 
              noStyle 
              name="triggerGap" 
              rules={[{required: true, message: '请输入时间'}]}
            >
              <Input style={{width: '40%'}} type="number" placeholder="请输入" />
            </Item>
          )
        }
        {
          touchWay !== 'now' && (
            <Item 
              noStyle 
              name="triggerUnit" 
              initialValue="MINUTE"
              rules={[{required: true, message: '请选择单位'}]}
            >
              <Select style={{width: '30%'}}>
                <Option value="MINUTE">分钟</Option>
                <Option value="HOUR">小时</Option>
                <Option value="DAY">天</Option>
              </Select>
            </Item>
          )
        }
      </Input.Group>
    )
  }

  const [vis, setVis] = useState(false)

  const templateChange = e => {
    // 目标模板数据
    const target = _.find(templateList, item => item.template_id === e)
    const req = /{(\w+).DATA}/g
    const matchData = target.content.match(req)
    const matchKeys = _.map(matchData, item => item.replace('{', '').replace('.DATA}', ''))

    const keys = Object.keys(myForm.getFieldsValue())
    const originKeys = ['channelCode', 'setRestrict', 'templateId']
    const oldObj = {}

    keys.forEach(item => {
      if (!originKeys.includes(item)) {
        oldObj[item] = ''
      }
    })

    myForm.setFieldsValue(oldObj)

    setTemplateKeyList(matchKeys)
    setPreviewData(target.content)
    setVis(true)
  }

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

        itemValue = itemValue.replace(/<span[^>]+">/g, '${').replace(/<\/span>/g, '}').replace(/&nbsp;/g, '')

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

      if (weSFormData && weSFormData.action && weSFormData.action.id) {
        setWeSFormData({
          action: {
            detail,
            channelCode: value.channelCode,
            templateId: value.templateId,
            setRestrict: value.setRestrict,
            id: weSFormData.action.id,
          },
        })
      } else {
        setWeSFormData({
          action: {
            detail,
            channelCode: value.channelCode,
            templateId: value.templateId,
            setRestrict: value.setRestrict,
          },
        })
      }

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

      if (res && res.template_list) {
        setTemplateList(res.template_list)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTagList = async objId => {
    try {
      const res = await io.getTagList({objId: String(objId)})
      
      if (res && res.length > 0) {
        res.forEach(item => {
          item.objIdTagId = item.objIdTagId.split('.')[1]
          item.objNameTagName = item.objNameTagName.split('.')[1]
        })
        setTagList(res)
      } 
      // else {
      //   setTagList(data)
      // }  
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTemplate()
  }, [])

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
          valueTemp = valueTemp.replace(/}/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>')
          let id = 0
          while (valueTemp.indexOf('${') > -1) {
            id += 1
            valueTemp = valueTemp.replace('${', `<span class="tag-drop" contentEditable="false" id="${id}">&nbsp;&nbsp;`)
          }
        }

        templateObj[e.name] = valueTemp
      })
      
      myForm.setFieldsValue({
        ...formInitValue,
        ...templateObj,
        setRestrict: weSFormData.action.setRestrict,
        templateId: weSFormData.action.templateId,
        channelCode: weSFormData.action.channelCode,
      })
    }
  }, [tagList])

  useEffect(() => {
    if (showWeService) {      
      if (runFormData.clientGroupId) {
        const targetData = _.find(groupList, item => item.id === runFormData.clientGroupId)
        // 客群id
        if (targetData && targetData.objId) {
          getTagList(targetData.objId)
        }
      }

      if (weSFormData.action && weSFormData.action.templateId) {
        const target = _.find(templateList, item => item.template_id === weSFormData.action.templateId)

        if (target && target.content) {
          setPreviewData(target.content)
        }
        setVis(true)

        setTemplateKeyList(_.map(weSFormData.action.detail, 'name'))
      }
    }
  }, [showWeService])
  //   <Button className="mr8" onClick={cancelData}>
  //   取消
  // </Button>
  // <Button type="primary" onClick={saveData}>
  //   确定
  // </Button>

  return (
    <div 
      className="step-content step-three pr pl16 pr16"
      style={{display: current === 2 ? 'block' : 'none'}}
    >
      <Form
        {...layout}
        // name="wechatDrawer"
        form={myForm}
        initialValues={formInitValue}
        onFieldsChange={(c, a) => fieldsChange(c, a)}
      >
        <Item
          label="触达方式"
          name="touchType"
        >
          {setTouchType()}
        </Item>
        <Item
          label="触达通道"
          name="channelCode"
        >
          <Select defaultValue="WECHAT_OFFICIAL_ACCOUNTS">
            <Option value="WECHAT_OFFICIAL_ACCOUNTS">微信公众号</Option>
          </Select>
        </Item>
        <Item
          label="营销动作"
          name="actionTest"
        >
          <Select placeholder="请选择动作">
            <Option value="0">发送模版消息</Option>
          </Select>
        </Item>
        <Item
          label="内容模板"
          rules={[{required: true, message: '模板不能为空'}]}
        >
          <Select onChange={templateChange} placeholder="请选择模版">
            {
              templateList.map(item => <Option value={item.template_id}>{item.title}</Option>)
            }
          </Select>
        </Item>
        <Item
          label="内容设置"
          name="templateId"
        >
          <span className="c-primary">样式预览</span>
        </Item>
        
        {
          templateKeyList.map(item => (
            <Item
              name={item}
              label={item}
              rules={[{required: true, message: '输入不能为空'}]}
            >
              <Wechat id={item} tagList={tagList} />
            </Item>
          ))
        }
      </Form>
      {/* <Preview> */}
      <div 
        className={cls({
          'wechat-preview': true,
          FBH: true,
          FBJC: true,
          'wechat-active': vis,
        })}
      >
        <img src={Frame} alt="frame" style={{width: '245px'}} />
        <div 
          className="preview-box mt20" 
          dangerouslySetInnerHTML={{__html: previewData}} 
        />
      </div>
      {/* </Preview> */}
      <div className="steps-action">
        <Button className="mr8" onClick={prevStep}>
          上一步
        </Button>
        <Button type="primary" onClick={() => console.log(11)}>
          完成
        </Button>
      </div>
    </div>
  )
}
