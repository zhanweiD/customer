import {useState, useEffect} from 'react'
import {Form, Button, Input, Select, Cascader, message} from 'antd'
import _ from 'lodash'
import cls from 'classnames'
import {errorTip} from '../../common/util'
import Wechat from './wechat/wechat'
import Frame from '../icon/wechat-frame.svg'
import io from './io'
import data from './wechat/data'

const {Option} = Select
const {Item} = Form

data.forEach(item => {
  item.objIdTagId = item.objIdTagId.split('.')[1] || null
  item.objNameTagName = item.objNameTagName.split('.')[1] || null
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
  strategyDetail = {}, // 用于编辑回显
  treeStrChannelList, // 触达渠道列表
  strChannelList, // 触达渠道
  planInfo,
  current,
  prevStep,
  nextStep,
  tagList,
  addStrategy,
  editStrategy,
  setThreeFormData,
  oneFormData,
  twoFormData,
  threeFormData,
  strName,
}) => {
  // const [templateList, setTemplateList] = useState(templateListMock)
  const [templateList, setTemplateList] = useState([])
  const [templateKeyList, setTemplateKeyList] = useState([])
  const [channelActionList, setChannelActionList] = useState([])
  const [touchWay, setTouchWay] = useState(0)
  const [loading, setLoading] = useState(false)
  const [accountId, setAccountId] = useState(null)
  const [myForm] = Form.useForm()
  
  const [previewData, setPreviewData] = useState('')

  // 营销动作列表
  const getChannelActions = async channelId => {
    try {
      const res = await io.getChannelActions({channelId})
      setChannelActionList(res || [])
    } catch (error) {
      errorTip(error.message)
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
          name="isDelay" 
          initialValue={touchWay} 
          rules={[{required: true, message: '请选择触达方式'}]}
        >
          <Select 
            style={{width: touchWay === 0 ? '100%' : '30%'}} 
            onChange={changTouchWay}
          >
            <Option value={0}>立即</Option>
            <Option value={1}>延迟</Option>
          </Select>
        </Item>
        {
          touchWay !== 0 && (
            <Item 
              noStyle 
              name="timeGap" 
              rules={[{required: true, message: '请输入时间'}]}
            >
              <Input style={{width: '40%'}} type="number" placeholder="请输入" />
            </Item>
          )
        }
        {
          touchWay !== 0 && (
            <Item 
              noStyle 
              name="timeUnit" 
              initialValue="MINUTES"
              rules={[{required: true, message: '请选择单位'}]}
            >
              <Select style={{width: '30%'}}>
                <Option value="MINUTES">分钟</Option>
                <Option value="HOURS">小时</Option>
                <Option value="DAYS">天</Option>
              </Select>
            </Item>
          )
        }
      </Input.Group>
    )
  }

  const [vis, setVis] = useState(false)

  const templateChange = e => {
    console.log(templateList)
    console.log(e)
    // 目标模板数据
    const target = _.find(templateList, item => item.template_id === e)
    const req = /{(\w+).DATA}/g
    const matchData = target.content.match(req)
    const matchKeys = _.map(matchData, item => item.replace('{', '').replace('.DATA}', ''))

    const keys = Object.keys(myForm.getFieldsValue())
    const originKeys = ['isDelay', 'timeGap', 'timeUnit', 'channelCode', 'actionId', 'templateId']
    const oldObj = {}

    keys.forEach(item => {
      if (!originKeys.includes(item)) {
        oldObj[item] = ''
      }
    })
    console.log(oldObj)

    myForm.setFieldsValue(oldObj)

    setTemplateKeyList(matchKeys)
    setPreviewData(target.content)
    setVis(true)
  }

  const matchChannel = ids => {
    const channel = strChannelList.filter(item => item.id === ids[0])[0] || {}
    const account = strChannelList.filter(item => item.id === ids[1])[0] || {}
    return {
      channelId: channel.id,
      channelCode: channel.code,
      accountId: account.id,
      accountCode: account.code,
    }
  }

  const saveData = () => {
    const tagMap = {}
    tagList.forEach(item => {
      tagMap[item.objNameTagName] = item.objIdTagId
    })

    myForm.validateFields().then(value => {
      // const channel = 
      // TODO:
      // 把数据存起来
      const templateJson = []
      templateKeyList.forEach(item => {
        let itemValue = value[item]

        itemValue = itemValue.replace(/<span[^>]+">/g, '${').replace(/<\/span>/g, '}').replace(/&nbsp;/g, '')

        tagList.forEach(e => {
          if (itemValue.indexOf(e.objNameTagName) > -1) {
            itemValue = itemValue.replace(new RegExp(e.objNameTagName, 'g'), e.objIdTagId)
          }
        })

        templateJson.push({
          name: item,
          value: itemValue,
        })
      })

      const params = strategyDetail.id ? {
        ...strategyDetail,
        ...oneFormData,
        ...twoFormData,
        planId: planInfo.id,
        clientGroupId: planInfo.clientGroupId,
        strategyName: strName,
        sendOutContent: {
          ...value,
          channel: matchChannel(value.channelCode),
          id: strategyDetail.id,
          templateJson: JSON.stringify(templateJson),
        },
      } : {
        ...strategyDetail,
        ...oneFormData,
        ...twoFormData,
        planId: planInfo.id,
        clientGroupId: planInfo.clientGroupId,
        strategyName: strName,
        sendOutContent: {
          ...value,
          channel: matchChannel(value.channelCode),
          templateJson: JSON.stringify(templateJson),
        },
      }
      if (params.strategyConditionType) {
        delete params.strategyFixConditionContent
      } else {
        delete params.strategyEventConditionContent
      }
      if (params.clientGroupFilterType) {
        delete params.clientGroupTagFilterContent
      } else {
        delete params.clientGroupUserActionFilterContent
      }
      setThreeFormData(params)

      if (strName) {
        setLoading(true)
        if (strategyDetail.id) {
          editStrategy(params, () => {
            setVis(false)
            setLoading(false)
            nextStep()
          })
        } else {
          addStrategy(params, () => {
            setVis(false)
            setLoading(false)
            nextStep()
          })
        }
      } else {
        message.warning('请完善策略名称')
      }
    }).catch(err => console.log(err))
  }

  // TODO:
  const getTemplate = async (v, cb) => {
    try {
      const res = await io.getTemplate({
        accountId: v || accountId,
      })
      if (res && res.template_list) {
        setTemplateList(res.template_list)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const changeAction = v => {
    getTemplate()
  }
  const changeCode = (v, item) => {
    getChannelActions(v[0])
    setAccountId(item[1].code)
  }

  useEffect(() => {
    if (!tagList.length || !strategyDetail.id || !templateList.length) return
    const {
      templateJson, actionId, isDelay, templateId, timeGap, timeUnit, channel,
    } = strategyDetail.sendOutContent

    getChannelActions(channel.channelId)

    const channelCode = [channel.channelId, channel.accountId]
    const templateData = JSON.parse(templateJson)
    // 有模板数据
    const templateObj = {}
    // 要处理数据
    templateData.forEach(e => {
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

    const target = _.find(templateList, item => item.template_id === templateId)

    if (target && target.content) {
      setPreviewData(target.content)
    }
    setTouchWay(isDelay)
    setTemplateKeyList(_.map(templateData, 'name'))
    
    myForm.setFieldsValue({
      isDelay,
      actionId,
      templateId,
      timeGap,
      timeUnit,
      channelCode,
      ...templateObj,
    })
    setVis(true)
  }, [tagList, strategyDetail, templateList])
  useEffect(() => {
    if (!strategyDetail.id) {
      setChannelActionList([])
      setTemplateList([])
      setTemplateKeyList([])
      setTouchWay(0)
      setPreviewData('')
      setVis(false)
      myForm.resetFields()
      myForm.setFieldsValue({isDelay: 0})
    } else {
      const {channel = {}} = strategyDetail.sendOutContent
      getTemplate(channel.accountCode)
    }
  }, [strategyDetail])

  return (
    <div 
      className="step-content step-three pr pl16 pr16"
      style={{display: current === 2 ? 'block' : 'none'}}
    >
      <Form
        {...layout}
        style={{marginBottom: '192px'}}
        // name="wechatDrawer"
        form={myForm}
        onFieldsChange={(c, a) => fieldsChange(c, a)}
      >
        <Item
          label="触达方式"
          // name="touchType"
        >
          {setTouchType()}
        </Item>
        <Item
          label="触达通道"
          name="channelCode"
          rules={[{required: true, message: '请选择触达渠道'}]}
        >
          <Cascader
            placeholder="请选择触达通道"
            options={treeStrChannelList}
            expandTrigger="hover"
            onChange={changeCode}
            // onChange={v => getChannelActions(v[0])}
            fieldNames={{
              label: 'name',
              value: 'id',
              children: 'children',
            }}
          />
        </Item>
        <Item
          label="营销动作"
          name="actionId"
          rules={[{required: true, message: '请选择营销动作'}]}
        >
          <Select placeholder="请选择动作" onChange={changeAction}>
            {
              channelActionList.map(item => <Option value={item.actionId}>{item.actionName}</Option>)
            }
          </Select>
        </Item>
        <Item
          label="内容模板"
          name="templateId"
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
          name="templateJson"
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
        <Button loading={loading} type="primary" onClick={saveData}>
          完成
        </Button>
      </div>
    </div>
  )
}
