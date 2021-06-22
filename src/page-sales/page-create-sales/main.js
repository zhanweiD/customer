import {useEffect, useState} from 'react'
import {Input, Steps, Button, message, Popconfirm, Spin} from 'antd'
import {PlusOutlined, CheckCircleFilled, DeleteOutlined} from '@ant-design/icons'
import {CycleSelect} from '@dtwave/uikit'
import {authView, DetailHeader, Loading, Tag} from '../../component'
import {errorTip, successTip, debounce} from '../../common/util'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'
import io from './io'
import cate from '../icon/cate.svg'
import userScreening from '../icon/user-screening.svg'
import effTime from '../icon/time.svg'
import clinch from '../icon/clinch.svg'

const {Step} = Steps

const listToTree = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === -1)
}

// 0 未生效、1 已生效、2 已暂停 、3 已结束
const tagMap = {
  0: <Tag status="default" text="未生效" />,
  1: <Tag status="green" text="已生效" />,
  2: <Tag status="orange" text="已暂停" />,
  3: <Tag status="blue" text="已结束" />,
}

const matchTime = v => {
  if (v === 'MINUTES') {
    return '分钟'
  }
  if (v === 'HOURS') {
    return '小时'
  }
  return '天'
}

const comparisionList = [
  {
    value: 'in',
    name: '等于',
  }, {
    value: 'not in',
    name: '不等于',
  },
]

const CreateSales = props => {
  const [strategyList, setStrategyList] = useState([{}]) // 策略列表
  const [current, setCurrent] = useState(0)
  const [planId, setPlanId] = useState(null) // 计划id
  const [planInfo, setPlanInfo] = useState({}) // 计划详情
  const [selectItemId, setSelectItemId] = useState(null) // 选中策略id
  const [conditionList, setConditionList] = useState([]) // 触发条件事件
  const [treeConditionList, setTreeConditionList] = useState([]) // 触发条件事件
  const [targetChannelList, setTargetChannelList] = useState([]) // 目标事件
  const [tagList, setTagList] = useState([]) // 标签列表
  const [objTagList, setObjTagList] = useState([]) // 对象标签列表
  const [groupList, setGroupList] = useState([]) // 人群列表
  const [treeStrChannelList, setTreeStrChannelList] = useState([]) // 触达渠道列表
  const [strChannelList, setStrChannelList] = useState([]) // 未打平触达渠道列表
  const [channelActions, setChannelActions] = useState([]) // 营销动作列表
  const [allChannelActions, setAllChannelActions] = useState([]) // 所有策略营销动作列表
  const [templateList, setTemplateList] = useState([]) // 内容模版列表
  const [checkNameTip, setCheckNameTip] = useState('') // 名称重复提示
  const [strName, setStrName] = useState('') // 名称
  const [baseInfo, setBaseInfo] = useState([]) // 详情头
  const [loading, setLoading] = useState(false) // loading
  const [listLoading, setListLoading] = useState(false) // loading
  const [filterChannelList, setFilterChannelList] = useState([]) // 行为筛选事件
  const [originEventList, setOriginEventList] = useState([]) // 行为筛选事件打平
  // formData
  const [strategyDetail, setStrategyDetail] = useState({})
  const [oneFormData, setOneFormData] = useState({})
  const [twoFormData, setTwoFormData] = useState({})
  const [threeFormData, setThreeFormData] = useState({})

  // 添加策略校验
  const addStrategyCheck = () => {
    const index = strategyList.findIndex(item => !item.id)
    console.log(index)
    if (index === -1) {
      setStrategyList([...strategyList, {}])
    } else {
      message.warning(`请完善策略${index + 1}的配置`)
    }
  }

  // 获取行为事件
  const getFilterChannelList = async () => {
    try {
      const res = await io.getFilterChannelList()
      setOriginEventList(res || [])
      setFilterChannelList(listToTree(res || []))
    } catch (error) {
      errorTip(error.message)
    }
  }
    
  // 获取目标事件
  const getTargetChannelList = async () => {
    try {
      const res = await io.getTargetChannelList()
      setTargetChannelList(res)
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 营销动作列表
  const getChannelActions = async channelId => {
    try {
      const res = await io.getChannelActions({channelId})
      setAllChannelActions([...allChannelActions, ...res])
      setChannelActions(res)
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 配置详情
  const getStrategyDetail = async id => {
    setStrategyDetail({})
    setLoading(true)
    if (!id) {
      setTimeout(() => {
        setLoading(false)
      }, 100)
      return
    }
    try {
      const res = await io.getStrategyDetail({id})
      setStrName(res.strategyName)
      setStrategyDetail(res)
      setLoading(false)
      // setListLoading(false)
    } catch (error) {
      errorTip(error.message)
    } 
  }
  // 列表
  const getList = async params => {
    setListLoading(true)
    try {
      const res = await io.getList(params)
      setStrategyList(res)
      if (!res.length) {
        setListLoading(false)
        setStrategyList([{}])
        setSelectItemId(undefined)
      } else if (!selectItemId) {
        getStrategyDetail(res[0].id)
        setSelectItemId(res[0].id)
      } else {
        getStrategyDetail(selectItemId)
      }
      res.forEach(item => {
        const {channel} = item.sendOutContent
        getChannelActions(channel.channelId)
      })
      setTimeout(() => {
        setListLoading(false)
      }, 200)
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 配置新增
  const addStrategy = async (params, cb) => {
    try {
      await io.addStrategy(params)
      successTip('添加成功')
      getList({planId})
      if (cb) cb()
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 配置编辑
  const editStrategy = async (params, cb) => {
    try {
      await io.editStrategy(params)
      successTip('编辑成功')
      getList({planId})
      if (cb) cb()
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 配置删除
  const deleteStrategy = async id => {
    try {
      await io.deleteStrategy({id})
      successTip('删除成功')
      getList({planId})
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 策略名校验
  const strCheckName = async params => {
    try {
      const res = await io.checkName(params)
      if (res.isExist) setCheckNameTip('策略名称重复')
      else setCheckNameTip('')
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 标签列表
  const getTagList = async objId => {
    try {
      const res = await io.getTagList({objId: String(objId)})
      const data = res.map(item => {
        item.name = item.objNameTagName.split('.')[1]
        item.id = item.objIdTagId
        return item
      })
      setObjTagList(data)
      if (res && res.length > 0) {
        res.forEach(item => {
          item.objIdTagId = item.objIdTagId.split('.')[1]
          item.objNameTagName = item.objNameTagName.split('.')[1]
        })
        setTagList(res)
      } 
    } catch (error) {
      console.log(error)
    }
  }
  // 获取人群
  const getGroupList = async () => {
    try {
      const res = await io.getGroupList()
      setGroupList(res)
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 计划详情
  const detailPlan = async id => {
    try {
      const res = await io.detailPlan({
        id,
      })
      setPlanInfo(res) 
      getGroupList()
      getTargetChannelList()
      getFilterChannelList()
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 触发条件事件
  const getConditionChannelList = async () => {
    try {
      const res = await io.getConditionChannelList()
      setConditionList(res)
      setTreeConditionList(listToTree(res || []))
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 触达渠道
  const getStrChannelList = async () => {
    try {
      const res = await io.getStrChannelList()
      setTreeStrChannelList(listToTree(res || []))
      setStrChannelList(res)
    } catch (error) {
      errorTip(error.message)
    }
  }
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

  const changeStrategyDetail = v => {
    setStrategyDetail(v)
  }

  const nextStep = () => {
    setCurrent(current + 1)
  }

  const prevStep = () => {
    setCurrent(current - 1)
  }

  // 策略重名
  const changeName = v => {
    const strategyName = v.target.value
    const param = {
      strategyName,
      id: strategyDetail.id || null,
      planId,
    }
    debounce(() => {
      strCheckName(param)
      setStrName(strategyName)
      // setStrategyDetail({...strategyDetail, strategyName})
    }, 500)
  }

  // 选中策略
  const selectItem = v => {
    setStrName('')
    setCurrent(0)
    setSelectItemId(v)
    getStrategyDetail(v)
  }

  const setEventDom = event => {
    const channel = conditionList.filter(item => item.id === event.channelId)[0] || {}
    const account = conditionList.filter(item => item.id === event.accountId)[0] || {}
    const even = conditionList.filter(item => item.id === event.eventId)[0] || {}
    return `${channel.name || '渠道不可用'}-${account.name || '账号不可用'}-${even.name || '事件不可用'}`
  }
  const setCornDom = (cron, frequency) => {
    let cycle = null
    let time = {}
    switch (frequency) {
      case '1':
        cycle = '每天'
        break
      case '2':
        cycle = '每周'
        break
      case '3':
        cycle = '每月'
        break
      default:
        cycle = '单次'
        break
    }
    if (frequency !== '0') {
      time = CycleSelect.cronSrialize(cron)
      console.log(time)
    } else {
      time = {time: cron}
    }
    return `重复 ${cycle} ${time.time}`
  }

  const setUserDom = user => {
    const tag = tagList.filter(item => item.objIdTagId === user.leftTagId)[0] || {}
    const comparision = comparisionList.filter(item => item.value === user.comparision)[0] || {}
    const valueName = user.rightParams.reduce((prev, cur) => prev + cur, '')
    return `${tag.objNameTagName} ${comparision.name} ${valueName}`
  }

  const setActionUserDom = user => {
    const channel = originEventList.filter(item => item.id === user.channelId)[0] || {}
    const account = originEventList.filter(item => item.id === user.accountId)[0] || {}
    const even = originEventList.filter(item => item.id === user.eventId)[0] || {}
    return `${channel.name || '渠道不可用'}-${account.name || '账号不可用'}-${even.name || '事件不可用'}`
  }

  const setChannelDom = sendOutContent => {
    const {channel, actionId, templateId} = sendOutContent
    const obj = strChannelList.filter(item => channel.channelId === item.id)[0] || {}
    const account = strChannelList.filter(item => channel.accountId === item.id)[0] || {}
    const action = allChannelActions.filter(item => actionId === item.actionId)[0] || {}
    const template = templateList.filter(item => templateId === item.template_id)[0] || {}
    return `${obj.name}-${account.name} ${action.actionName}(${template.title})`
  }

  // 设置策略dom
  const setLeftItem = () => {
    if (!conditionList.length || !strChannelList.length || !tagList.length || !templateList.length) return ''
    const itemList = strategyList.map((item, i) => {
      const {
        strategyName, 
        clientGroupFilterType,
        clientGroupUserActionFilterContent,
        clientGroupTagFilterContent,
        strategyConditionType, 
        strategyEventConditionContent = {}, 
        strategyFixConditionContent = {},
        sendOutContent = {},
      } = item
      const {
        doneLogic, 
        doneEvents = [], 
        notDoneLogic, 
        notDoneEvents = [], 
        timeGap, timeUnit, 
        startTime = strategyFixConditionContent.startTime, 
        endTime = strategyFixConditionContent.endTime,
      } = strategyEventConditionContent // 触发条件
      const {cron, frequency} = strategyFixConditionContent
      const {
        isDelay, channel, actionId, templateId,
      } = sendOutContent // 触发设置
      if (strategyName) {
        let clientGroup = {}
        if (clientGroupFilterType) {
          clientGroup = clientGroupUserActionFilterContent.events
        } else {
          clientGroup = clientGroupTagFilterContent ? JSON.parse(clientGroupTagFilterContent) : []
        }
        return (
          <div 
            onClick={() => selectItem(item.id)} 
            className={`${selectItemId === item.id ? 'left-item-select' : 'left-item'} mb16`} 
            style={{minHeight: 72}}
          >
            <div 
              className={`${selectItemId === item.id ? 'left-item-header-select' : 'left-item-header'} pl16 pt8 pb8 fs14 FBH FBJB`} 
            >
              <span>{`策略${i + 1}-${strategyName}`}</span>
              {
                strategyList.length > 1 ? (
                  <Popconfirm
                    title={`你确定删除策略${i + 1}-${strategyName}吗?`}
                    onConfirm={() => {
                      deleteStrategy(item.id)
                      if (item.id === selectItemId) {
                        setSelectItemId(undefined)
                      }
                    }}
                    onCancel={() => {}}
                    okText="确定"
                    cancelText="取消"
                  >
                    <span 
                      onClick={e => e.stopPropagation()}
                      className="hand mr12" 
                    >
                      <DeleteOutlined />
                    </span>
                  </Popconfirm>
                ) : null
              }
            </div>
            <div className="mt8 mb8 ml16 mr16 c45">
              <div>
                <div className="c85">用户筛选</div>
                <div className="c45">
                  <div>{clientGroupFilterType ? '按用户行为筛选' : '按用户标签筛选'}</div>
                  {
                    clientGroupFilterType ? (
                      clientGroup.map(user => (<div>{setActionUserDom(user)}</div>))
                    ) : (
                      <div>
                        {clientGroup.logic ? <div>{`满足 ${clientGroup.logic === 'AND' ? '全部' : '任意'} 条件`}</div> : ''}
                        {
                          clientGroup.express ? clientGroup.express.map(user => (
                            <div>{setUserDom(user)}</div>
                          )) : <div>未添加筛选条件</div>
                        }
                      </div>
                    )
                  }
                </div>
              </div>
              <div>
                <div className="c85">触发条件</div>
                <div className="c45">
                  <div>{strategyConditionType ? '事件触发' : '定时触发'}</div>
                  <div>
                    {
                      strategyConditionType ? (
                        <div>
                          <div>{`完成 ${doneLogic ? '全部' : '任意'} 事件`}</div>
                          {
                            doneEvents.map(event => (
                              <div>{setEventDom(event)}</div>
                            ))
                          }
                          <div>{`且 ${timeGap}${matchTime(timeUnit)} 未完成 ${notDoneLogic ? '全部' : '任意'} 事件`}</div>
                          {
                            notDoneEvents.map(event => (
                              <div>{setEventDom(event)}</div>
                            ))
                          }
                        </div>
                      ) : (
                        <div>{setCornDom(cron, frequency)}</div>
                      )
                    }
                  </div>
                  
                  {startTime ? <div>{`起止日期：${startTime}~${endTime}`}</div> : null}
                </div>
              </div>
              <div>
                <div className="c85">触发设置</div>
                <div className="c45">
                  <div>
                    {isDelay ? `延迟 ${sendOutContent.timeGap} ${matchTime(sendOutContent.timeUnit)} 触达` : '立即 触达'}
                  </div>
                  <div>
                    {setChannelDom(sendOutContent)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      } 
      return (
        <div 
          onClick={() => selectItem(item.id)} 
          className={`${selectItemId === item.id ? 'left-item-select' : 'left-item'} mb16`} 
          style={{minHeight: 72}}
        >
          <div 
            className={`${selectItemId === item.id ? 'left-item-header-select' : 'left-item-header'} pl16 pt8 pb8 fs14 FBH FBJB`} 
          >
            <span>{`策略${i + 1}`}</span>
            {
              strategyList.length > 1 ? (
                <span 
                  onClick={() => deleteStrategy(item.id)}
                  className="hand mr12" 
                >
                  <DeleteOutlined />
                </span>
              ) : null
            }
            
          </div>
          <div className="mt8 mb8 ml16 mr16 c45">配置受众用户、触达条件及触达渠道</div>
        </div>
      )
    })
    return itemList
  }

  useEffect(() => {
    const {params = {}} = props.match
    setPlanId(params.planId)
    getList({planId: params.planId})
    getConditionChannelList()
    detailPlan(params.planId)
    getStrChannelList()
    getTemplate()
  }, [])
  useEffect(() => {
    const obj = groupList.filter(item => item.id === planInfo.clientGroupId)
    if (obj.length) {
      getTagList(obj[0].objId)
    }
  }, [groupList])

  useEffect(() => {
    if (!groupList.length || !targetChannelList.length) return
    const {firstTargetContent = {}, clientGroupId, startTime, endTime} = planInfo
    const {timeGap, timeUnit, event} = firstTargetContent
    const setEvent = v => {
      const obj = targetChannelList.filter(item => item.id === v.eventId)[0] || {}
      return obj.name
    }
    const list = [
      {
        title: '分组',
        value: '默认分组',
        icon: <img style={{marginBottom: 1}} src={cate} alt="分组" />,
        // <img style={{marginBottom: 1}} src={Attr} alt="属性" />
      },
      {
        title: '用户',
        value: groupList.filter(item => item.id === clientGroupId)[0].name,
        icon: <img style={{marginBottom: 1}} src={userScreening} alt="用户" />,
      },
      {
        title: '有效时间',
        value: `${startTime}-${endTime}`,
        icon: <img style={{marginBottom: 1}} src={effTime} alt="有效时间" />,
      },
      {
        title: '主要目标',
        value: `${timeGap} ${matchTime(timeUnit)} 完成 ${setEvent(event)}`,
        icon: <img style={{marginBottom: 1}} src={clinch} alt="主要目标" />,
      },
    ]
    setBaseInfo(list)
  }, [groupList, targetChannelList])

  if (listLoading) {
    return <div style={{textAlign: 'center', marginTop: '35%'}}><Spin /></div>
  }

  return (
    <div className="create-sales">
      {/* <DetailHeader
        name={planInfo.planName}
        descr={planInfo.descr}
        baseInfo={baseInfo}
        tag={tagMap[0]}
      /> */}
      <div className="m16">
        <div className="pb8 FBH FBAC">
          <span className="fs18 mr8">{planInfo.planName}</span>
          <span>{tagMap[planInfo.planStatus]}</span>
        </div>
        <div className="FBH FBJB">
          {
            baseInfo.map(item => (
              <span>
                <span className="mr8">{item.icon}</span>
                <span className="c85">{item.value}</span>
              </span>
            ))
          }
        </div>
      </div>
      <div className="m16 create-content">
        <div className="content-left bgf mr16 p16">
          <div className="left-header mb12">策略配置</div>
          {setLeftItem()}
          <Button 
            type="dashed" 
            onClick={addStrategyCheck} 
            block 
            icon={<PlusOutlined />}
          >
            添加
          </Button>
        </div>
        
        <div className="content-right bgf">
          <div className="pt12 pb12 pl16 right-header">
            {
              strategyDetail.strategyName ? (
                <span className="fs16">{strategyDetail.strategyName}</span>
              ) : (
                <Input 
                  style={{width: 160}} 
                  placeholder="请输入策略名称" 
                  onChange={changeName}
                />
              )
            }
            <span className="ml4" style={{color: '#ff4d4f'}}>{checkNameTip}</span>
          </div>
          <Steps style={{padding: '24px 60px'}} current={current}>
            <Step key={0} title="用户筛选" />
            <Step key={1} title="触发条件" />
            <Step key={2} title="触达设置" />
          </Steps>
          <div className="fac mt72" style={{display: current === 3 ? 'block' : 'none'}}>
            <CheckCircleFilled style={{color: '#52C41A', fontSize: 72}} />
            <div className="fs24 mt12 bold">完成策略配置</div>
          </div>
          {
            loading ? <div style={{textAlign: 'center', marginTop: '25%'}}><Spin /></div> : (
              <StepOne 
                nextStep={nextStep} 
                current={current} 
                tagList={tagList}
                objTagList={objTagList}
                strategyDetail={strategyDetail}
                setStrategyDetail={changeStrategyDetail}
                filterChannelList={filterChannelList}
                originEventList={originEventList}
                setOneFormData={setOneFormData}
              />
            )
          }
          <StepTwo 
            nextStep={nextStep} 
            prevStep={prevStep}
            current={current}
            planInfo={planInfo}
            treeConditionList={treeConditionList}
            conditionList={conditionList}
            strategyDetail={strategyDetail}
            setStrategyDetail={changeStrategyDetail}
            setTwoFormData={setTwoFormData}
          />
          <StepThree
            prevStep={prevStep}
            current={current}
            nextStep={nextStep}
            groupList={groupList}
            strChannelList={strChannelList}
            treeStrChannelList={treeStrChannelList}
            channelActions={channelActions}
            getChannelActions={getChannelActions}
            planInfo={planInfo}
            strategyDetail={strategyDetail}
            setStrategyDetail={changeStrategyDetail}
            tagList={tagList}
            addStrategy={addStrategy}
            editStrategy={editStrategy}
            setThreeFormData={setThreeFormData}
            oneFormData={oneFormData}
            twoFormData={twoFormData}
            threeFormData={threeFormData}
            strName={strName}
          />
        </div>
      </div>
    </div>
  )
}
export default authView(CreateSales)
