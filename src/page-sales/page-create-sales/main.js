import {useEffect, useState} from 'react'
import {Input, Steps, Button, message, Popconfirm} from 'antd'
import {PlusOutlined, CheckCircleFilled, DeleteOutlined} from '@ant-design/icons'
import {DetailHeader, Tag} from '../../component'
import {errorTip, successTip} from '../../common/util'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'
import io from './io'

const {Step} = Steps

const listToTree = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === -1)
}

export default props => {
  const [strategyList, setStrategyList] = useState([]) // 策略列表
  const [current, setCurrent] = useState(0)
  const [planId, setPlanId] = useState(null) // 计划id
  const [planInfo, setPlanInfo] = useState({}) // 计划详情
  const [selectItemId, setSelectItemId] = useState(null) // 选中策略id
  const [conditionList, setConditionList] = useState([]) // 触发条件事件
  const [treeConditionList, setTreeConditionList] = useState([]) // 触发条件事件
  const [tagList, setTagList] = useState([]) // 标签列表
  const [objTagList, setObjTagList] = useState([]) // 对象标签列表
  const [groupList, setGroupList] = useState([]) // 人群列表
  const [treeStrChannelList, setTreeStrChannelList] = useState([]) // 触达渠道列表
  const [strChannelList, setStrChannelList] = useState([]) // 未打平触达渠道列表
  const [channelActions, setChannelActions] = useState([]) // 营销动作列表
  const [allChannelActions, setAllChannelActions] = useState([]) // 所有策略营销动作列表
  const [templateList, setTemplateList] = useState([]) // 内容模版列表
  // formData
  const [oneFormData, setOneFormData] = useState({})
  const [twoFormData, setTwoFormData] = useState({})
  const [threeFormData, setThreeFormData] = useState({})
  const [strategyDetail, setStrategyDetail] = useState({})
  const baseInfo = [
    {
      title: '分组',
      value: '测试',
    },
    {
      title: '用户',
      value: '实时群体',
    },
    {
      title: '有效时间',
      value: 'ID集合创建',
    },
    {
      title: '主要目标',
      value: '111',
    },
  ]
  // 0 未生效、1 已生效、2 已暂停 、3 已结束
  const tagMap = {
    0: <Tag status="default" text="未生效" />,
    1: <Tag status="green" text="已生效" />,
    2: <Tag status="orange" text="暂停" />,
    3: <Tag status="blue" text="已结束" />,
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

  // 列表
  const getList = async params => {
    try {
      const res = await io.getList(params)
      setStrategyList(res)
      res.forEach(item => {
        const {channel} = item.sendOutContent
        getChannelActions(channel.channelId)
      })
      if (!selectItemId) {
        setSelectItemId(res[0].id)
      }
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
  // 计划详情
  const detailPlan = async id => {
    try {
      const res = await io.detailPlan({
        id,
      })
      setPlanInfo(res) 
    } catch (error) {
      errorTip(error.message)
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

  const changeName = v => {
    setStrategyDetail({...strategyDetail, strategyName: v.target.value})
  }

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

  const selectItem = v => {
    setSelectItemId(v)
  }

  // 设置策略dom
  const setLeftItem = () => {
    if (!conditionList.length || !strChannelList.length || !allChannelActions.length || !templateList.length) return ''
    const matchTime = v => {
      if (v === 'MINUTES') {
        return '分钟'
      }
      if (v === 'HOURS') {
        return '小时'
      }
      return '天'
    }
    const setEventDom = event => {
      const channelName = conditionList.filter(item => item.id === event.channelId)[0].name
      const accountName = conditionList.filter(item => item.id === event.accountId)[0].name
      const eventName = conditionList.filter(item => item.id === event.eventId)[0].name
      return `${channelName}-${accountName}-${eventName}`
    }
    const setChannelDom = sendOutContent => {
      const {channel, actionId, templateId} = sendOutContent
      const channelName = strChannelList.filter(item => channel.channelId === item.id)[0].name
      const accountName = strChannelList.filter(item => channel.accountId === item.id)[0].name
      const {actionName} = allChannelActions.filter(item => actionId === item.actionId)[0] || {}
      // const templateName = templateList.filter(item => templateId === item.template_id)[0].title
      // return `${channelName}-${accountName} ${actionName}(${templateName})`
      return `${channelName}-${accountName} ${actionName}`
    }
    const itemList = strategyList.map((item, i) => {
      const {
        strategyName, strategyConditionType, strategyEventConditionContent = {}, sendOutContent = {},
      } = item
      const {
        doneLogic, doneEvents, notDoneLogic, notDoneEvents, timeGap, timeUnit, startTime, endTime,
      } = strategyEventConditionContent // 触发条件
      const {
        isDelay, channel, actionId, templateId,
      } = sendOutContent // 触发设置
      if (strategyName) {
        return (
          <div 
            onClick={() => selectItem(item.id)} 
            className={`${selectItemId === item.id ? 'left-item-select' : 'left-item'} mb16`} 
            style={{minHeight: 72}}
          >
            <div 
              className={`${selectItemId === item.id ? 'left-item-header-select' : 'left-item-header'} pl16 pt8 pb8 fs14 FBH FBJB`} 
            >
              {/* <span>{`策略${i + 1}`}</span> */}
              <span>{strategyName}</span>
              <Popconfirm
                title={`你确定删除策略${item.strategyName}吗?`}
                onConfirm={() => deleteStrategy(item.id)}
                onCancel={() => console.log(11)}
                okText="确定"
                cancelText="取消"
              >
                <span 
                  className="hand mr12" 
                >
                  <DeleteOutlined />
                </span>
              </Popconfirm>
            </div>
            {/* <div className="mt8 mb8 ml16 mr16 c45">配置受众用户、触达条件及触达渠道</div> */}
            <div className="mt8 mb8 ml16 mr16 c45">
              <div>
                <div className="c85">用户筛选</div>
                <div className="c45">未添加筛选条件</div>
              </div>
              <div>
                <div className="c85">触发条件</div>
                <div className="c45">
                  <div>{strategyConditionType ? '事件触发' : '定时触发'}</div>
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
                  <div>{`起止时间：${startTime}~${endTime}`}</div>
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
            <span 
              onClick={() => deleteStrategy(item.id)}
              className="hand mr12" 
            >
              <DeleteOutlined />
            </span>
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
    getGroupList()
    getConditionChannelList()
    detailPlan(params.planId)
    getStrChannelList()
    getTemplate()
  }, [])
  useEffect(() => {
    const obj = groupList.filter(item => item.id === planInfo.clientGroupId)
    setStrategyDetail({...strategyDetail, planId: planInfo.id, clientGroupId: planInfo.clientGroupId})
    if (obj.length) {
      getTagList(obj[0].objId)
    }
  }, [groupList, planInfo])

  return (
    <div className="create-sales">
      <DetailHeader
        name="测试"
        descr="描述"
        // btnMinWidth={230}
        baseInfo={baseInfo}
        tag={tagMap[0]}
      />
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
            <Input 
              style={{width: 160}} 
              placeholder="请输入策略名称" 
              onChange={changeName}
            />
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
          <StepOne 
            nextStep={nextStep} 
            current={current} 
            tagList={tagList}
            objTagList={objTagList}
            // oneFormData={oneFormData}
            // setOneFormData={setOneFormData}
            strategyDetail={strategyDetail}
            setStrategyDetail={changeStrategyDetail}
          />
          <StepTwo 
            nextStep={nextStep} 
            prevStep={prevStep}
            current={current}
            planInfo={planInfo}
            treeConditionList={treeConditionList}
            conditionList={conditionList}
            // twoFormData={twoFormData}
            // setTwoFormData={setTwoFormData}
            strategyDetail={strategyDetail}
            setStrategyDetail={changeStrategyDetail}
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
            // threeFormData={threeFormData}
            // setThreeFormData={setThreeFormData}
            strategyDetail={strategyDetail}
            setStrategyDetail={changeStrategyDetail}
            tagList={tagList}
            addStrategy={addStrategy}
            editStrategy={editStrategy}
          />
        </div>
      </div>
    </div>
  )
}
