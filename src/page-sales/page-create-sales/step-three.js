import {useState, useEffect} from 'react'
import {Form, Button, Input, Select, Cascader, message} from 'antd'
import _ from 'lodash'
import cls from 'classnames'
import {errorTip} from '../../common/util'
import Frame from '../icon/wechat-frame.svg'
import io from './io'
import data from './wechat/data'
import {setTemplate} from './unit'
import ContentDrawer from './content-drawer'

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

export default ({
  strategyDetail = {}, // 用于编辑回显
  treeStrChannelList, // 触达渠道列表
  strChannelList, // 触达渠道
  planInfo, // 计划信息
  current, 
  prevStep,
  nextStep,
  tagList,
  addStrategy, // 添加策略
  editStrategy,

  setThreeFormData, // 表单数据
  oneFormData,
  twoFormData,
  threeFormData,
  strName, // 策略名称
}) => {
  const [templateList, setTemplateList] = useState([])
  const [templateKeyList, setTemplateKeyList] = useState([])
  const [channelActionList, setChannelActionList] = useState([]) // 动作列表
  const [thumbMediaList, setThumbMediaList] = useState([]) // 图文列表
  const [touchWay, setTouchWay] = useState(0)
  const [loading, setLoading] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false) // 选择消息
  const [vis, setVis] = useState(false) // 手机预览
  const [accountId, setAccountId] = useState(null) // 用于判断动作类型
  const [accountCode, setAccountCode] = useState(null) // 用于获取模版信息
  const [myForm] = Form.useForm()
  
  const [previewData, setPreviewData] = useState('')
  const [selectMedia, setSelectMedia] = useState({}) // 选择群发消息

  // 营销动作列表
  const getChannelActions = async channelId => {
    try {
      const res = await io.getChannelActions({channelId})
      setChannelActionList(res || [])
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 图文消息列表
  const getThumbMediaList = async v => {
    try {
      const res = await io.getThumbMediaList({
        accountCode: v || accountCode,
        currentPage: 1,
        pageSize: 10, 
      })
      setThumbMediaList(res.data || [])
    } catch (error) {
      errorTip(error.message)
    }
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

  // 选择模版
  const templateChange = e => {
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

    myForm.setFieldsValue(oldObj)

    setTemplateKeyList(matchKeys)
    setPreviewData(target.content)
    setVis(true)
  }

  // 返回渠道信息（code id）
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

  // 保存策略
  const saveData = () => {
    const tagMap = {}
    tagList.forEach(item => {
      tagMap[item.objNameTagName] = item.objIdTagId
    })

    myForm.validateFields().then(value => {
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

      const setActionParams = () => {
        if (value.actionId === 2002) {
          return selectMedia
        }
        return {
          templateJson,
          templateId: value.templateId,
        }
      }

      const params = {
        ...strategyDetail,
        ...oneFormData,
        ...twoFormData,
        planId: planInfo.id,
        clientGroupId: planInfo.clientGroupId,
        strategyName: strName,
        sendOutContent: {
          ...value,
          channel: matchChannel(value.channelCode),
          actionParams: JSON.stringify(setActionParams()),
          // templateJson: JSON.stringify(templateJson),
        },
      }
      
      // 删除编辑前部分无用属性
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
  const getTemplate = async v => {
    try {
      const res = await io.getTemplate({
        accountId: v || accountCode,
      })
      if (res && res.template_list) {
        setTemplateList(res.template_list)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 触达通道
  const changeCode = (v, item) => {
    getChannelActions(v[0])
    setAccountCode(item[1].code)
  }

  // 
  const changeAction = v => {
    console.log(v)
    setAccountId(v)
    if (v === 2002) {
      getThumbMediaList()
    } else {
      getTemplate()
    }
  }

  useEffect(() => {
    if (!strategyDetail.id) return 
    const {
      actionId, isDelay, timeGap, timeUnit, channel, actionParams,
    } = strategyDetail.sendOutContent
    const channelCode = [channel.channelId, channel.accountId]

    if (actionId === 2002) {
      console.log(JSON.parse(actionParams))
      setSelectMedia(JSON.parse(actionParams))
    }
    if (actionId === 2001) {
      if (!templateList.length || !tagList.length) return
      const templateData = JSON.parse(actionParams).templateJson
      const {templateId} = JSON.parse(actionParams)
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
        templateId,
        ...templateObj,
      })
      setVis(true)
    }
    myForm.setFieldsValue({
      isDelay,
      actionId,
      timeGap,
      timeUnit,
      channelCode,
    })
  }, [tagList, strategyDetail, templateList])

  useEffect(() => {
    if (!strategyDetail.id) {
      setAccountId(null)
      setChannelActionList([])
      setTemplateList([])
      setTemplateKeyList([])
      setTouchWay(0)
      setPreviewData('')
      setVis(false)
      myForm.resetFields()
      myForm.setFieldsValue({isDelay: 0})
    } else {
      const {sendOutContent} = strategyDetail
      const {channel = {}} = sendOutContent
      setAccountId(sendOutContent.actionId)
      getChannelActions(channel.channelId)

      // 微信群发消息
      if (sendOutContent.actionId === 2002) {
        getThumbMediaList(channel.accountCode)
      } else {
        // 微信模版
        getTemplate(channel.accountCode)
      }
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
        form={myForm}
      >
        <Item label="触达方式">
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
        {
          setTemplate({
            templateChange,
            templateList,
            templateKeyList,
            tagList,
            accountId,
            thumbMediaList,
            showDrawer: () => setDrawerVisible(true),
            selectMedia,
          })
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
      <ContentDrawer 
        drawerVisible={drawerVisible}
        closeDrawer={() => setDrawerVisible(false)}
        thumbMediaList={thumbMediaList}
        selectMedia={selectMedia}
        setSelectMedia={v => setSelectMedia(v)}
        accountCode={accountCode}
      />
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
