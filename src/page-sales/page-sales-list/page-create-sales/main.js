import {useEffect, useState} from 'react'
import {Input, Steps, Button, message, Spin} from 'antd'
import {PlusOutlined, CheckCircleFilled} from '@ant-design/icons'
import {authView, Tag} from '../../../component'
import {errorTip, successTip, debounce} from '../../../common/util'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'
import StrategyItem from './strategy-item'
import {comparisionList, listToTree, matchTime} from './unit'
import io from './io'
import cate from '../icon/cate.svg'
import group from '../icon/group.svg'
import effTime from '../icon/time.svg'
import clinch from '../icon/clinch.svg'

const {Step} = Steps

// 0 未生效、1 已生效、2 已暂停 、3 已结束
const tagMap = {
  0: <Tag status="default" text="未生效" />,
  1: <Tag status="green" text="已生效" />,
  2: <Tag status="orange" text="已暂停" />,
  3: <Tag status="blue" text="已结束" />,
}

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
  const [resetThreeForm, setResetThreeForm] = useState(null)
  // 添加策略校验
  const addStrategyCheck = () => {
    const index = strategyList.findIndex(item => !item.id)
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
      setChannelActions(res)
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 微信模版
  const getTemplate = async () => {
    try {
      const res = await io.getTemplate({
        accountCode: 'wxe2b3f176ba1a4f33',
      })

      if (res && res.templateList) {
        setTemplateList(res.templateList)
      }
    } catch (error) {
      console.log(error.message)
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
      const res = await io.getStrategyDetail({id}) || {}
      setStrName(res.strategyName)
      setStrategyDetail(res)
      setLoading(false)
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
    if (id === selectItemId) {
      setSelectItemId(undefined)
    }
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
      console.log(error.message)
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

  // 编辑改变详情
  const changeStrategyDetail = v => {
    setStrategyDetail(v)
  }

  // 启动计划
  const startPlan = async () => {
    setListLoading(true)
    try {
      await io.startPlan({
        id: planId,
      })
      successTip('启动成功')
      window.location.href = `${window.__keeper.pathHrefPrefix}/sales/list`
    } catch (error) {
      errorTip(error.message)
    } finally {
      setListLoading(false)
    }
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
    }, 500)
  }

  // 选中策略
  const selectItem = v => {
    setStrName('')
    setCurrent(0)
    setSelectItemId(v)
    getStrategyDetail(v)
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
    const {firstTargetContent = {}, clientGroupId, startTime, endTime, front} = planInfo
    const {timeGap, timeUnit, event = {}} = firstTargetContent
    const names = JSON.parse(front)
   
    const list = [
      {
        title: '分组',
        // value: '默认分组',
        value: `${names.planGroupName}`,
        icon: <img style={{marginBottom: 1}} src={cate} alt="分组" />,
      },
      {
        title: '用户',
        value: `${names.clientGroupName}`,
        icon: <img style={{marginBottom: 1}} src={group} alt="用户" />,
      },
      {
        title: '有效时间',
        value: `${startTime}-${endTime}`,
        icon: <img style={{marginBottom: 1}} src={effTime} alt="有效时间" />,
      },
      {
        title: '主要目标',
        value: `${timeGap} ${matchTime(timeUnit)} 完成 ${event.eventName || ''}`,
        icon: <img style={{marginBottom: 1}} src={clinch} alt="主要目标" />,
      },
    ]
    setBaseInfo(list)
  }, [groupList, targetChannelList])

  if (listLoading) {
    return <div style={{textAlign: 'center', marginTop: '20%'}}><Spin /></div>
  }

  return (
    <div className="create-sales FBV">
      <div className="m16">
        <div className="pb8 FBH FBJB">
          <div>
            <span className="fs18 mr8">{planInfo.planName}</span>
            <span>{tagMap[planInfo.planStatus]}</span>
          </div>
          <div>
            <Button type="primary" onClick={startPlan}>启动计划</Button>
          </div>
        </div>
        <div className="FBH">
          {
            baseInfo.map(item => (
              <span className="mr48">
                <span className="mr8">{item.icon}</span>
                <span className="c85">{item.value}</span>
              </span>
            ))
          }
        </div>
      </div>
      <div className="create-content FB1 FBH">
        <div className="content-left bgf mr16 p16 custom-border">
          <div className="left-header mb12">策略配置</div>
          <StrategyItem
            conditionList={conditionList}
            strChannelList={strChannelList}
            tagList={tagList}
            templateList={templateList}
            strategyList={strategyList}
            selectItem={selectItem}
            selectItemId={selectItemId}
            deleteStrategy={deleteStrategy}
            matchTime={matchTime}
            comparisionList={comparisionList}
            originEventList={originEventList}
          />
          <Button 
            type="dashed" 
            onClick={addStrategyCheck} 
            block 
            icon={<PlusOutlined />}
          >
            添加
          </Button>
        </div>
        <div className="content-right bgf custom-border FB1 FBV">
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
            resetThreeForm={resetThreeForm}
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
            setResetThreeForm={form => setResetThreeForm(form)}
          />
        </div>
      </div>
    </div>
  )
}
export default authView(CreateSales)
