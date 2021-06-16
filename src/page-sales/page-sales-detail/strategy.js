import {useEffect, useState} from 'react'
import {errorTip} from '../../common/util'
import io from './io'

export default ({list}) => {
  const [strategyList, setStrategyList] = useState() // 策略列表
  const [conditionList, setConditionList] = useState([]) // 触发条件事件
  const [strChannelList, setStrChannelList] = useState([]) // 未打平触达渠道列表
  const [allChannelActions, setAllChannelActions] = useState([]) // 所有策略营销动作列表
  const [templateList, setTemplateList] = useState([]) // 内容模版列表

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
    setStrategyList(list)
    list.forEach(item => {
      const {channel} = item.sendOutContent
      getChannelActions(channel.channelId)
    })
  }, [list])

  useEffect(() => {
    getConditionChannelList()
    getTemplate()
    getStrChannelList()
  }, [])

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
      return (
        <div className="strategy-list">
          <div className="left-item-select mb12 mr12" style={{minHeight: 72}}>
            <div className="left-item-header-select pl16 pt8 pb8 fs14 FBH FBJB">
              <span>{strategyName}</span>
            </div>
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
        </div>
      )
    })
    return itemList
  }
  return <div className="sales-detail-two">{setLeftItem()}</div>
}
