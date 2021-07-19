import {useState, useEffect, Fragment} from 'react'
import {Form, Button, Input, Select, Cascader, message} from 'antd'
import _ from 'lodash'
import cls from 'classnames'
import {errorTip} from '../../../common/util'
import Frame from '../icon/wechat-frame.svg'
import FrameSMS from '../icon/wechat-sms.svg'
import io from './io'
import data from './wechat/data'
import {setTemplate} from './unit'
import ContentDrawer from './content-drawer'
import formSms from './form-sms'
import dropdown from '../../../icon/dropdown.svg'

const {Option} = Select
const {Item} = Form

data.forEach(item => {
  item.objIdTagId = item.objIdTagId.split('.')[1] || null
  item.objNameTagName = item.objNameTagName.split('.')[1] || null
})

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 9,
  },
}

export default ({
  strategyDetail = {}, // 用于编辑回显
  treeStrChannelList, // 触达渠道列表
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
  strName, // 策略名称
}) => {
  const [templateList, setTemplateList] = useState([])
  const [templateKeyList, setTemplateKeyList] = useState([])
  const [channelActionList, setChannelActionList] = useState([]) // 动作列表
  const [thumbMediaList, setThumbMediaList] = useState([]) // 图文列表
  const [thumbMediaPage, setThumbMediaPage] = useState(0) // 图文消息总数
  const [touchWay, setTouchWay] = useState(0)
  const [loading, setLoading] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false) // 选择消息
  const [mesLoading, setMesLoading] = useState(false) // 消息列表loading
  const [vis, setVis] = useState(false) // 手机预览
  const [actionId, setActionId] = useState(null) // 用于判断动作类型
  const [accountCode, setAccountCode] = useState(null) // 用于获取模版信息
  const [myForm] = Form.useForm()

  const [smsForm] = Form.useForm()
  const [isSms, setIsSms] = useState(false)
  const [smsDefaultValues, setSmsDefaultValues] = useState({})
  const [smsTplKeyList, setSmsTplKeyList] = useState([])
  const [smsSignList, setSmsSignList] = useState([])
  const [smsTplList, setSmsTplList] = useState([])
  const [smsTplId, setSmsTplId] = useState(null)

  const [previewData, setPreviewData] = useState('')
  const [selectMedia, setSelectMedia] = useState({}) // 选择群发消息

  // 营销动作列表
  const getChannelActions = async channelCode => {
    try {
      const res = await io.getChannelActions({channelCode})
      // strategyConditionType
      let newData = []
      if (twoFormData.strategyConditionType) {
        newData = res.filter(item => item.actionId !== 2002)
      } else {
        newData = res || []
      }
      setChannelActionList(newData)
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 图文消息列表
  const getThumbMediaList = async page => {
    setMesLoading(true)
    try {
      const res = await io.getThumbMediaList({
        accountCode,
        currentPage: page || 1,
        pageSize: 10, 
      })
      setThumbMediaList(res.data || [])
      setThumbMediaPage({
        currentPage: res.pages,
        count: res.totalCount,
      })
    } catch (error) {
      errorTip(error.message)
    } finally {
      setMesLoading(false)
    }
  }

  // 切换触发方式立即/延迟
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
            suffixIcon={<img src={dropdown} alt="dropdown" />}
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
              <Select 
                style={{width: '30%'}}
                suffixIcon={<img src={dropdown} alt="dropdown" />}
              >
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
    const target = _.find(templateList, item => item.templateId === e)
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

  const matchAction = id => {
    const actionObj = channelActionList.filter(item => item.actionId === id)[0] || {}
    return actionObj
  }

  // 保存策略
  const saveData = () => {
    if (isSms) {
      // 短信模块
      smsForm.validateFields().then(value => {
        const {signName, templateCode} = value
        const alldefaultValues = _.compact(_.flatten(_.values(smsDefaultValues)))

        // 模板字符串
        const templateJson = []
        const templateParams = []

        smsTplKeyList.forEach(item => {
          let itemValue = value[item]
          itemValue = itemValue.replace(/&nbsp;/g, '')
          // 新的替换，
          // 例子：${888888!你好}，${标签id!默认值}
          alldefaultValues.forEach(item => {
            const targetTag = _.find(tagList, e => e.objNameTagName === item.name)
            const targetTagId = targetTag.objIdTagId

            const regExp = new RegExp(`<span[^>]+id=\"${item.id}\">([^>]+)<\/span>`)
            if (item.value) {
              itemValue = itemValue.replace(regExp, `\${${targetTagId}!${item.value}}`)
            } else {
              itemValue = itemValue.replace(regExp, `\${${targetTagId}}`)
            }
          })

          templateJson.push({
            name: item,
            value: itemValue,
          })
        })

        // 短信的 actionParams 的最终传值
        const actionParams = {
          signName,
          templateCode,
          templateJson: JSON.stringify(templateJson),
        }

        const myFormValues = myForm.getFieldsValue()
        const params = {
          ...strategyDetail,
          ...oneFormData,
          ...twoFormData,
          planId: planInfo.id,
          clientGroupId: planInfo.clientGroupId,
          strategyName: strName,
          sendOutContent: {
            ...myFormValues,
            ...matchAction(myFormValues.actionId),
            // channel: matchChannel(myFormValues.channelCode),
            channel: {
              channelCode: myFormValues.channelCode[0],
              accountCode: myFormValues.channelCode[1],
            },
            actionParams: JSON.stringify(actionParams),
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
    } else {
      const tagMap = {}
      tagList.forEach(item => {
        tagMap[item.objNameTagName] = item.objIdTagId
      })

      myForm.validateFields().then(value => {
        // 如果是微信模版把数据存起来
        const templateJson = []
        if (value.actionId === 2001) {
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
        }
        
        // 动作参数处理
        const setActionParams = () => {
          // 微信群发消息
          if (value.actionId === 2002) {
            return selectMedia
          } 
          // 微信模版消息
          if (value.actionId === 2001) {
            return {
              templateJson,
              templateId: value.templateId,
            } 
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
            ...matchAction(value.actionId),
            channel: {
              channelCode: value.channelCode[0],
              accountCode: value.channelCode[1],
            },
            actionParams: JSON.stringify(setActionParams()),
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
  }

  // TODO:
  const getTemplate = async code => {
    try {
      const res = await io.getTemplate({
        accountCode: code || accountCode,
      })
      if (res && res.templateList) {
        setTemplateList(res.templateList)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  // 短信签名列表
  const getAllSign = async (code, cb = () => {}) => {
    try {
      const res = await io.getAllSign({
        accountCode: code || accountCode,
      })

      setSmsSignList(res)
      cb()
    } catch (error) {
      console.log(error.message)
    }
  }

  // 短信模版列表
  const getAllTpl = async (code, cb = () => {}) => {
    try {
      const res = await io.getAllTpl({
        accountCode: code || accountCode,
      })

      setSmsTplList(res)
      cb()
    } catch (error) {
      console.log(error.message)
    }
  }

  // 触达通道
  const changeCode = v => {
    getChannelActions(v[0])
    setAccountCode(v[1])
    setActionId(undefined)
    myForm.setFieldsValue({actionId: undefined})
    setIsSms(false)
    setVis(false)
  }

  // 改变动作
  const changeAction = v => {
    setActionId(v)
  }

  // 关于属性的默认值
  const onDefaultValChange = (val, index) => {
    setSmsDefaultValues({
      ...smsDefaultValues,
      [index]: val,
    })
  }

  useEffect(() => {
    if (!strategyDetail.id) return 

    const {sendOutContent} = strategyDetail
    const {
      isDelay, timeGap, timeUnit, channel, actionParams,
    } = sendOutContent
    const channelCode = [channel.channelCode, channel.accountCode]

    // 群发消息处理
    if (sendOutContent.actionId === 2002) {
      setSelectMedia(JSON.parse(actionParams))
    }
    // 模版消息处理
    if (sendOutContent.actionId === 2001) {
      getTemplate(channel.accountCode)
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
      const target = _.find(templateList, item => item.templateId === templateId)
  
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
    // 短信消息处理
    if (sendOutContent.actionId === 2101 && tagList.length > 0) {
      // 短信 -------------预处理-------------
      const parseActionParams = JSON.parse(actionParams)
      const {signName, templateCode, templateJson, templateParams} = parseActionParams
      const parseTemplateJson = JSON.parse(templateJson)

      // 关键字列表
      setSmsTplKeyList(_.map(parseTemplateJson, 'name'))

      const defaultValues = {} // 属性的默认值
      parseTemplateJson.forEach((item, index) => {
        const {value} = item

        if (value.indexOf('${') > -1) {
          // ${属性id!默认值}
          const valueMatch = value.match(/\${[^}]+}/g) || []
          let id = 0          
          valueMatch.forEach((e, k) => {
            const v = e.replace('\${', '').replace('}', '')
            const vSplit = v.split('!')
            const targetName = _.find(tagList, j => j.objIdTagId === vSplit[0]).objNameTagName
            
            if (!defaultValues[index]) defaultValues[index] = []
            if (vSplit.length > 1) {
              // 有默认值
              defaultValues[index].push({
                name: targetName,
                value: vSplit[1],
                id: String(++id),
              })
            } else {
              defaultValues[index].push({
                name: targetName,
                value: undefined,
                id: String(++id),
              })
            }
          })
        } else {
          defaultValues[index] = null
        }
      })

      setSmsDefaultValues(defaultValues)

      const templateObj = {}
      parseTemplateJson.forEach(e => {
        let valueTemp = e.value

        valueTemp = valueTemp.replace(/![^}]+}/g, '}')
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

      // 把签名和模版的数据准备好
      getAllSign(channel.accountCode)
      getAllTpl(channel.accountCode)

      setSmsTplId(templateCode)

      setIsSms(true)

      // 设置数据
      smsForm.setFieldsValue({
        signName,
        templateCode,
        ...templateObj,
      })
    } else {
      setIsSms(false)
    }

    myForm.setFieldsValue({
      isDelay,
      actionId: sendOutContent.actionId,
      timeGap,
      timeUnit,
      channelCode,
    })
  }, [tagList, strategyDetail])

  useEffect(() => {
    if (!strategyDetail.id) {
      setActionId(null)
      setChannelActionList([])
      setTemplateList([])
      setTemplateKeyList([])
      setTouchWay(0)
      setPreviewData('')
      setSelectMedia({})
      setVis(false)
      myForm.resetFields()
      myForm.setFieldsValue({isDelay: 0})
      
      setIsSms(false)
      smsForm.resetFields()
    } else {
      const {sendOutContent} = strategyDetail
      const {channel = {}} = sendOutContent
      setActionId(sendOutContent.actionId)
      setAccountCode(channel.accountCode)
      getChannelActions(channel.channelCode)
    }
  }, [strategyDetail])

  useEffect(() => {
    if (accountCode && actionId) {
      if (actionId === 2101) {
        if (accountCode) {
          // 发送短信
          getAllSign(accountCode)
          getAllTpl(accountCode)
          setIsSms(true)
        }
      } else if (actionId === 2002) {
        // 微信群发消息
        getThumbMediaList()
      } else if (actionId === 2001) {
        // 微信模版消息
        getTemplate()
        setVis(true)
        setIsSms(false)
      }
    }
  }, [accountCode, actionId])

  return (
    <Fragment>
      <div 
        className="step-content step-three pr pl16 pr16"
        style={{display: current === 2 ? 'block' : 'none'}}
      >
        <Form
          {...layout}
          style={{marginTop: '1px'}}
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
              suffixIcon={<img src={dropdown} alt="dropdown" />}
              fieldNames={{
                label: 'name',
                value: 'code',
                children: 'children',
              }}
            />
          </Item>
          <Item
            label="营销动作"
            name="actionId"
            rules={[{required: true, message: '请选择营销动作'}]}
          >
            <Select 
              placeholder="请选择动作" 
              onChange={changeAction}
              suffixIcon={<img src={dropdown} alt="dropdown" />}
            >
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
              actionId,
              thumbMediaList,
              showDrawer: () => setDrawerVisible(true),
              selectMedia,
              setPreviewData,
              strategyDetail,
            })
          }
        </Form>
        {
          <div
            style={{
              display: isSms ? 'block' : 'none',
            }}
          >
            <Form
              form={smsForm}
              {...layout}
            >
              {
                formSms({
                  smsSignList,
                  smsTplId,
                  smsTplList,
                  accountCode,
                  getAllSign,
                  getAllTpl,
                  tagList,
                  smsDefaultValues,
                  onDefaultValChange,
                  smsTplKeyList,
                  setSmsTplKeyList,
                  setVis,
                  setPreviewData,
                  smsForm,
                })
              }
            </Form>
          </div>
        }
        {/* <Preview> */}
        <div 
          className={cls({
            'wechat-preview': true,
            FBH: true,
            FBJC: true,
            'wechat-active': vis,
            mt10: true,
          })}
        >
          <img src={isSms ? FrameSMS : Frame} alt="frame" style={{width: '245px'}} />
          <div 
            className="preview-box mt20" 
            dangerouslySetInnerHTML={{__html: previewData}} 
          />
        </div>
        <ContentDrawer 
          drawerVisible={drawerVisible}
          closeDrawer={() => setDrawerVisible(false)}
          thumbMediaList={thumbMediaList}
          thumbMediaPage={thumbMediaPage}
          selectMedia={selectMedia}
          setSelectMedia={v => setSelectMedia(v)}
          accountCode={accountCode}
          mesLoading={mesLoading}
          getThumbMediaList={getThumbMediaList}
        />
      </div>
      <div className="steps-action" style={{display: current === 2 ? 'block' : 'none'}}>
        <Button className="mr8" onClick={prevStep}>
          上一步
        </Button>
        <Button loading={loading} type="primary" onClick={saveData}>
          完成
        </Button>
      </div>
    </Fragment>
  )
}
