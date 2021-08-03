import {useEffect, useState} from 'react'
import {Popconfirm} from 'antd'
import {DeleteOutlined} from '@ant-design/icons'
import {CycleSelect} from '@dtwave/uikit'
import {errorTip} from '@util'
import io from './io'

export default ({
  conditionList = [],
  strChannelList = [],
  tagList = [],
  templateList = [],
  strategyList = [],
  selectItem,
  selectItemId,
  deleteStrategy,
  matchTime,
  comparisionList = [],
  originEventList = [],
}) => {
  const [wechartActions, setWechartActions] = useState([])
  const [smsActions, setSmsActions] = useState([])
  const [weAppletActions, setWeAppletActions] = useState([])
  // 营销动作列表
  const getChannelActions = async channelCode => {
    try {
      const res = await io.getChannelActions({channelCode})
      if (channelCode === 'WECHAT_OFFICIAL_ACCOUNTS') {
        setWechartActions(res)
      }
      if (channelCode === 'ALIYUN_SMS') {
        setSmsActions(res)
      }
      if (channelCode === 'WECHAT_APPLET') {
        setWeAppletActions(res)
      }
    } catch (error) {
      errorTip(error.message)
    }
  }
  
  useEffect(() => {
    getChannelActions('WECHAT_OFFICIAL_ACCOUNTS')
    getChannelActions('ALIYUN_SMS')
    getChannelActions('WECHAT_APPLET')
  }, [])

  // 返回事件详情
  const setEventDom = event => {
    const channel = conditionList.filter(item => item.code === event.channelCode)[0] || {}
    const account = conditionList.filter(item => item.code === event.accountCode)[0] || {}
    const even = conditionList.filter(item => item.code === event.eventCode)[0] || {}
    return `${channel.name || '渠道不可用'}-${account.name || '账号不可用'}-${even.name || '事件不可用'}`
  }

  // 返回时间详情
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
    } else {
      time = {time: cron}
    }
    return `重复 ${cycle} ${time.time}`
  }

  // 返回用户筛选详情
  const setUserDom = user => {
    const tag = tagList.filter(item => item.objIdTagId === user.leftTagId)[0] || {}
    const comparision = comparisionList.filter(item => item.value === user.comparision)[0] || {}
    const valueName = user.rightParams.reduce((prev, cur) => prev + cur, '')
    return `${tag.objNameTagName} ${comparision.name} ${valueName}`
  }

  // 返回动作详情
  const setActionUserDom = user => {
    const channel = originEventList.filter(item => item.code === user.channelCode)[0] || {}
    const account = originEventList.filter(item => item.code === user.accountCode)[0] || {}
    const even = originEventList.filter(item => item.code === user.eventCode)[0] || {}
    return `${channel.name || '渠道不可用'}-${account.name || '账号不可用'}-${even.name || '事件不可用'}`
  }

  // 返回渠道详情
  const setChannelDom = sendOutContent => {
    const {channel, actionId, actionParams} = sendOutContent
    const actionParamsObj = JSON.parse(actionParams)
    let template = {}
    let action = {}
    if (actionId === 2001) {
      const {templateId} = actionParamsObj
      template = templateList.filter(item => templateId === item.templateId)[0] || {}
      action = wechartActions.filter(item => actionId === item.actionId)[0] || {}
    }
    if (actionId === 2002) {
      template = actionParamsObj.mediaData || {}
      action = wechartActions.filter(item => actionId === item.actionId)[0] || {}
    }
    if (actionId === 2101) {
      const {templateCode} = actionParamsObj
      action = smsActions.filter(item => actionId === item.actionId)[0] || {}
      template = templateCode
    }

    if (actionId === 2201) {
      // const {templateCode} = actionParamsObj
      action = weAppletActions.filter(item => actionId === item.actionId)[0] || {}
      template = '图片弹窗'
    }

    const obj = strChannelList.filter(item => channel.channelCode === item.code)[0] || {}
    const account = strChannelList.filter(item => channel.accountCode === item.code)[0] || {}
    return `${obj.name}-${account.name} ${action.actionName}(${template.title || template})`
  }

  // 设置策略dom
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
    const {isDelay} = sendOutContent // 触发设置
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
                  onConfirm={e => {
                    // e.stopPropagation()
                    deleteStrategy(item.id)
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
            <div className="mb8">
              <div className="c85">用户筛选</div>
              <div className="c45 ml16">
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
            <div className="mb8">
              <div className="c85">触发条件</div>
              <div className="c45 ml16">
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
              <div className="c45 ml16">
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
                onClick={e => {
                  // e.stopPropagation()
                  deleteStrategy(item.id)
                }}
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
