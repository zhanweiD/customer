import {useEffect, useState} from 'react'
import {CycleSelect} from '@dtwave/uikit'
import {errorTip} from '../../common/util'
import io from './io'

const comparisionList = [
  {
    value: 'in',
    name: '等于',
  }, {
    value: 'not in',
    name: '不等于',
  },
]
const matchTime = v => {
  if (v === 'MINUTES') {
    return '分钟'
  }
  if (v === 'HOURS') {
    return '小时'
  }
  return '天'
}

export default ({list}) => {
  const [strategyList, setStrategyList] = useState([]) // 策略列表
  const [conditionList, setConditionList] = useState([]) // 触发条件事件
  const [strChannelList, setStrChannelList] = useState([]) // 未打平触达渠道列表
  const [allChannelActions, setAllChannelActions] = useState([]) // 所有策略营销动作列表
  const [templateList, setTemplateList] = useState([]) // 内容模版列表
  const [tagList, setTagList] = useState([]) // 标签列表
  const [originEventList, setOriginEventList] = useState([]) // 行为筛选事件打平
  const [groupList, setGroupList] = useState([]) // 群体
  const [groupId, setGroupId] = useState(null) // 群体id

  // 获取行为事件
  const getFilterChannelList = async () => {
    try {
      const res = await io.getFilterChannelList()
      setOriginEventList(res || [])
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 标签列表
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

  // 营销动作列表
  const getChannelActions = async channelId => {
    try {
      const res = await io.getChannelActions({channelId})
      setAllChannelActions([...allChannelActions, ...res])
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 触发条件事件
  const getConditionChannelList = async () => {
    try {
      const res = await io.getConditionChannelList()
      setConditionList(res)
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 触达渠道
  const getStrChannelList = async () => {
    try {
      const res = await io.getStrChannelList()
      setStrChannelList(res)
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 模版列表
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

  useEffect(() => {
    console.log(list)
    if (list.length) {
      setGroupId(list[0].clientGroupId)
    }
    setStrategyList(list)
    getGroupList()
    getFilterChannelList()
    list.forEach(item => {
      const {channel} = item.sendOutContent
      getChannelActions(channel.channelId)
    })
  }, [list])
  useEffect(() => {
    const obj = groupList.filter(item => item.id === groupId)
    if (obj.length) {
      getTagList(obj[0].objId)
    }
  }, [groupList])

  useEffect(() => {
    getConditionChannelList()
    getTemplate()
    getStrChannelList()
  }, [])

  // // 设置策略dom
  // const setLeftItem = () => {
  //   if (!conditionList.length || !strChannelList.length || !allChannelActions.length || !templateList.length) return ''
  //   const matchTime = v => {
  //     if (v === 'MINUTES') {
  //       return '分钟'
  //     }
  //     if (v === 'HOURS') {
  //       return '小时'
  //     }
  //     return '天'
  //   }
  //   const setEventDom = event => {
  //     const channelName = conditionList.filter(item => item.id === event.channelId)[0].name
  //     const accountName = conditionList.filter(item => item.id === event.accountId)[0].name
  //     const eventName = conditionList.filter(item => item.id === event.eventId)[0].name
  //     return `${channelName}-${accountName}-${eventName}`
  //   }
  //   const setChannelDom = sendOutContent => {
  //     const {channel, actionId, templateId} = sendOutContent
  //     const channelName = strChannelList.filter(item => channel.channelId === item.id)[0].name
  //     const accountName = strChannelList.filter(item => channel.accountId === item.id)[0].name
  //     const {actionName} = allChannelActions.filter(item => actionId === item.actionId)[0] || {}
  //     // const templateName = templateList.filter(item => templateId === item.template_id)[0].title
  //     // return `${channelName}-${accountName} ${actionName}(${templateName})`
  //     return `${channelName}-${accountName} ${actionName}`
  //   }
  //   const itemList = strategyList.map((item, i) => {
  //     const {
  //       strategyName, strategyConditionType, strategyEventConditionContent = {}, sendOutContent = {},
  //     } = item
  //     const {
  //       doneLogic, doneEvents, notDoneLogic, notDoneEvents, timeGap, timeUnit, startTime, endTime,
  //     } = strategyEventConditionContent // 触发条件
      
  //     const {
  //       isDelay, channel, actionId, templateId,
  //     } = sendOutContent // 触发设置
  //     return (
  //       <div className="strategy-list">
  //         <div className="left-item-select mb12 mr12" style={{minHeight: 72}}>
  //           <div className="left-item-header-select pl16 pt8 pb8 fs14 FBH FBJB">
  //             <span>{strategyName}</span>
  //           </div>
  //           <div className="mt8 mb8 ml16 mr16 c45">
  //             <div>
  //               <div className="c85">用户筛选</div>
  //               <div className="c45">未添加筛选条件</div>
  //             </div>
  //             <div>
  //               <div className="c85">触发条件</div>
  //               <div className="c45">
  //                 <div>{strategyConditionType ? '事件触发' : '定时触发'}</div>
  //                 <div>{`完成 ${doneLogic ? '全部' : '任意'} 事件`}</div>
  //                 {
  //                   doneEvents && doneEvents.map(event => (
  //                     <div>{setEventDom(event)}</div>
  //                   ))
  //                 }
  //                 <div>{`且 ${timeGap}${matchTime(timeUnit)} 未完成 ${notDoneLogic ? '全部' : '任意'} 事件`}</div>
  //                 {
  //                   notDoneEvents && notDoneEvents.map(event => (
  //                     <div>{setEventDom(event)}</div>
  //                   ))
  //                 }
  //                 <div>{`起止时间：${startTime}~${endTime}`}</div>
  //               </div>
  //             </div>
  //             <div>
  //               <div className="c85">触发设置</div>
  //               <div className="c45">
  //                 <div>
  //                   {isDelay ? `延迟 ${sendOutContent.timeGap} ${matchTime(sendOutContent.timeUnit)} 触达` : '立即 触达'}
  //                 </div>
  //                 <div>
  //                   {setChannelDom(sendOutContent)}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )
  //   })
  //   return itemList
  // }

  const setEventDom = event => {
    const channel = conditionList.filter(item => item.id === event.channelId)[0] || {}
    const account = conditionList.filter(item => item.id === event.accountId)[0] || {}
    const even = conditionList.filter(item => item.id === event.eventId)[0] || {}
    return `${channel.name}-${account.name}-${even.name}`
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
    const event = originEventList.filter(item => item.id === user.eventId)[0] || {}
    return `${channel.name} ${account.name} ${event.name}`
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
            className="left-item-select mb16"
            // style={{minHeight: 72}}
          >
            <div 
              className="left-item-header-select pl16 pt8 pb8 fs14 FBH FBJB"
            >
              <span>{`策略${i + 1}-${strategyName}`}</span>
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
      return ''
    })
    return itemList
  }

  return <div className="sales-detail-two">{setLeftItem()}</div>
}
