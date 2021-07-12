import {useState, useEffect, Fragment} from 'react'
import {
  Cascader, Form, Button, DatePicker, Radio, Input, Select, Collapse,
} from 'antd'
import {MinusCircleOutlined} from '@ant-design/icons'
import {CycleSelect} from '@dtwave/uikit'
import {setTimeDom} from './unit'
import Attr from '../icon/wechat-attr.svg'
import dropdown from '../../../icon/dropdown.svg'

const {Option} = Select
const {Item} = Form
const {Panel} = Collapse
const {RangePicker} = DatePicker
const dateFormat = 'YYYY-MM-DD'
const dateTimeFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm:ss'

const listToTree = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === -1)
}

const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 17,
  },
}
const layout1 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
}

export default ({
  current, 
  nextStep,
  prevStep,
  planInfo,
  twoFormData = {}, 
  setTwoFormData,
  setStrategyDetail, 
  strategyDetail,
  treeConditionList,
  conditionList,
  resetThreeForm,
}) => {
  const [stepForm] = Form.useForm()
  const [planType, setPlanType] = useState(1) // 计划类型 0定时1事件
  const [doneLogic, setDoneLogic] = useState(0) // 完成 0任意1全部 事件
  const [notDoneLogic, setNotDoneLogic] = useState(0) // 未完成 0任意1全部 事件
  const [period, setPeriod] = useState('0') // 重复, 计划触发周期，0 单次 1 每天 2 每周 3 每月
  const [strategyEventCondition, setStrategyEventCondition] = useState({}) // 触发条件详情
  const [doneEventList, setDoneEventList] = useState([undefined]) // 完成事件
  const [notDoneEventList, setNotDoneEventList] = useState([]) // 未完成事件
  const [cornTime, setCornTime] = useState({}) // 触发时间
  const [doneSelectKey, setDoneSelectKey] = useState([]) // 完成已选事件key
  const [selectKey, setSelectKey] = useState([]) // 未完成已选事件key
  const [notDoneCount, setNotDoneCount] = useState(0) // 未完成事件
  const [doneConditionList, setDoneConditionList] = useState([]) // 完成事件list带disabled
  const [notConditionList, setNotConditionList] = useState([]) // 未完成事件带disabled

  // 输入时间格式校验
  const checkNumber = (rule, value, callback) => {
    if (notDoneCount) {
      if (!value) {
        callback('请输入时间')
        return
      } 
      if (`${value}`.slice(0, 1) === '0') {
        callback('不支持0开头时间')
      }
      if (value - 0 > 0) {
        if (`${value}`.indexOf('.') !== -1) {
          callback('请输入有效时间')
        } else {
          callback()
        }
      } else {
        callback('请输入有效时间')
      }
    } else {
      callback()
    }
  }

  // 匹配事件返回全量信息（code + id）
  const matchEnent = data => {
    const channel = conditionList.filter(item => item.id === data[0])[0] || {}
    const account = conditionList.filter(item => item.id === data[1])[0] || {}
    const event = conditionList.filter(item => item.id === data[2])[0] || {}
    return {
      eventId: event.id,
      eventCode: event.code,
      eventName: event.name,
      channelId: channel.id,
      channelCode: channel.code,
      accountId: account.id,
      accountCode: account.code,
    }
  }

  // 保存表单数据
  const onFinish = () => {
    stepForm.validateFields().then(value => {
      const {startEndDate, interval, time} = value
      let params = {}

      if (startEndDate) {
        value.startTime = `${startEndDate[0].format(dateTimeFormat)} 00:00:00`
        value.endTime = `${startEndDate[1].format(dateTimeFormat)} 23:59:59`
      }
      // 事件触发
      if (value.strategyConditionType) {
        const {doneEvents, notDoneEvents} = value
        const strategyEventConditionContent = {
          doneLogic,
          notDoneLogic,
          timeGap: value.timeGap,
          timeUnit: value.timeUnit,
          doneEvents: doneEvents.map(item => matchEnent(item)),
          notDoneEvents: notDoneEvents.map(item => matchEnent(item)),
          startTime: value.startTime,
          endTime: value.endTime,
        }
        params = {
          strategyConditionType: value.strategyConditionType,
          strategyRestrict: value.strategyRestrict,
          strategyEventConditionContent,
        }
      } else {
        // 定时触发
        value.strategyFixConditionContent = {}
        let cycle = null // corn
        let ctime = null
        switch (period) {
          case '1':
            cycle = 'day'
            break
          case '2':
            cycle = 'week'
            break
          case '3':
            cycle = 'month'
            break
          default:
            cycle = ''
            ctime = `${interval.format(dateFormat)} ${time.format(timeFormat)}`
            break
        }
        if (period !== '0') {
          ctime = CycleSelect.formatCron(
            {cycle, time: time.format(timeFormat), interval}
          )
        }
        
        const strategyFixConditionContent = {
          frequency: value.frequency,
          cron: ctime,
          startTime: value.startTime,
          endTime: value.endTime,
        }
        params = {
          strategyConditionType: value.strategyConditionType,
          strategyFixConditionContent,
        }
      }

      setTwoFormData(params)
      nextStep()
    }).catch(err => console.log(err))
  }

  // 改变触发类型
  const changePlanType = v => {
    setPlanType(v)
    // resetThreeForm.resetFields()
  }

  // 改变重复类型
  const changePeriod = v => {
    setPeriod(v)
    setCornTime({})
    stepForm.setFields([{
      time: '', 
      interval: '',
    }])
  }

  // 完成任意/全部事件
  const changeDoneLogic = v => {
    setDoneLogic(v)
  }

  // 不完成任意/全部事件
  const changeNotDoneLogic = v => {
    setNotDoneLogic(v)
  }

  // 禁用时间
  const disabledDate = time => {
    return time > moment(planInfo.endTime, 'YYYY-MM-DD HH:mm:ss') || time < moment(planInfo.startTime, 'YYYY-MM-DD HH:mm:ss')
  }

  // 已选完成事件disabled
  const checkSelectEvent = () => {
    const data = []
    stepForm.validateFields(['notDoneEvents']).then(value => {
      value.notDoneEvents.forEach(item => {
        if (item) {
          data.push(item[2])
        }
      })
      setSelectKey(data)
    }).catch(err => {
      console.log(err)
    })
  }

  // 已选未完成事件disabled
  const checkDoneSelectEvent = () => {
    const data = []
    stepForm.validateFields(['doneEvents']).then(value => {
      value.doneEvents.forEach(item => {
        if (item) {
          data.push(item[2])
        }
      })
      setDoneSelectKey(data)
    }).catch(err => {
      console.log(err)
    })
  }

  // 为已选择完成事件添加disabled
  useEffect(() => {
    const data = conditionList.map(item => {
      if (doneSelectKey.find(jtem => jtem === item.id)) {
        item.disabled = true
      } else {
        item.disabled = false
      }
      return item
    })
    setDoneConditionList(listToTree(data) || [])
  }, [doneSelectKey, conditionList])

  // 为已选择未完成事件添加disabled
  useEffect(() => {
    const data = conditionList.map(item => {
      if (selectKey.find(jtem => jtem === item.id)) {
        item.disabled = true
      } else {
        item.disabled = false
      }
      return item
    })
    setNotConditionList(listToTree(data) || [])
  }, [selectKey, conditionList])
 
  useEffect(() => {
    if (!strategyDetail.id) {
      setStrategyEventCondition({})
      setDoneEventList([undefined])
      setNotDoneEventList([])
      setNotDoneLogic(0)
      setDoneLogic(0)
      setPlanType(1)
      setCornTime({})
      setPeriod('0')
      setTimeout(() => {
        stepForm.resetFields()
      }, 0)
      return
    } 
    // 事件触发
    if (strategyDetail.strategyConditionType) {
      const {strategyEventConditionContent, strategyConditionType} = strategyDetail
      const {doneEvents, notDoneEvents = []} = strategyEventConditionContent
      const done = doneEvents.map(item => [item.channelId, item.accountId, item.eventId])
      const notDone = notDoneEvents.map(item => [item.channelId, item.accountId, item.eventId])
      setStrategyEventCondition(strategyEventConditionContent)
      setDoneEventList(done)
      setNotDoneEventList(notDone)
      setNotDoneLogic(strategyEventConditionContent.notDoneLogic)
      setDoneLogic(strategyEventConditionContent.doneLogic)
      setPlanType(strategyConditionType)
    } else {
      // 定时触发
      const {strategyFixConditionContent, strategyConditionType} = strategyDetail
      const {cron, frequency} = strategyFixConditionContent
      setStrategyEventCondition(strategyFixConditionContent)
      if (frequency !== '0') {
        setCornTime(CycleSelect.cronSrialize(cron))
      } else {
        const data = cron.split(' ')
        setCornTime({date: data[0], time: data[1]})
      }
      setPlanType(strategyConditionType)
      setPeriod(frequency)
    }
    setTimeout(() => {
      stepForm.resetFields()
    }, 0)
  }, [strategyDetail])

  return (
    <Fragment>
      <div 
        className="pl16 pr16 pr step-two step-content" 
        style={{display: current === 1 ? 'block' : 'none'}}
      >
        <Form 
          {...layout}
          // className="run-form"
          name="stepForm"
          form={stepForm}
        >
          <Item
            label="触发类型"
            name="strategyConditionType"
            initialValue={planType}
            rules={[{required: true, message: '请选择计划类型'}]}
          >
            <Select 
              onChange={changePlanType}
              disabled={strategyDetail.id}
              suffixIcon={<img src={dropdown} alt="dropdown" />}
            >
              <Option value={0}>定时触发</Option>
              <Option value={1}>事件触发</Option>
            </Select>
          </Item>
          {
            planType === 1 && (
              <div>

                <Collapse 
                  style={{marginBottom: 16, position: 'relative'}} 
                  defaultActiveKey={['1']}
                >
                  <Panel 
                    header={(
                      <div className="FBH header-select">
                        完成下列
                        <Select 
                          onClick={e => e.stopPropagation()}
                          onChange={changeDoneLogic}
                          value={doneLogic} 
                          style={{width: 72, margin: '4px'}}
                          suffixIcon={<img src={dropdown} alt="dropdown" />}
                        >
                          <Option value={0}>任意</Option>
                          <Option value={1}>全部</Option>
                        </Select>
                        事件
                      </div>
                    )} 
                    key="1"
                  >
                    <Form.List
                      name="doneEvents"
                      initialValue={doneEventList}
                    >
                      {(fields, {add, remove}, {errors}) => (
                        <div>
                          {fields.map((field, index) => (
                            <div style={{width: 360}} className="pr">
                              <Item
                                {...field}
                                {...layout1}
                                // name={[field.name, 'id']}
                                // fieldKey={[field.fieldKey, 'id']}
                                style={{marginBottom: index === fields.length - 1 ? '0px' : '24px'}}
                                className="position-icon"
                                // label={`事件${index + 1}`}
                                rules={[{required: true, message: '请选择事件'}]}
                              >
                                <Cascader
                                  placeholder="请选择事件"
                                  // options={treeConditionList}
                                  options={doneConditionList}
                                  expandTrigger="hover"
                                  style={{width: 360}}
                                  onChange={checkDoneSelectEvent}
                                  suffixIcon={<img src={dropdown} alt="dropdown" />}
                                  fieldNames={{
                                    label: 'name',
                                    value: 'id',
                                    children: 'children',
                                  }}
                                />
                              </Item>
                              {fields.length > 1 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => {
                                    remove(field.name)
                                    checkDoneSelectEvent()
                                  }}
                                />
                              ) : null}
                            </div>
                          ))}
                          <div
                            className="add-event-btn fs14 hand"
                            onClick={add}
                          >
                            <img style={{marginBottom: 1}} src={Attr} alt="属性" />
                            <span className="ml4">添加事件</span>
                          </div>
                        </div>
                      )}
                    </Form.List>
                  </Panel>
                </Collapse>
                <Item>
                  <Input.Group compact>
                    <span className="mt4">且在</span>
                    <Item 
                      noStyle 
                      name="timeGap" 
                      initialValue={strategyEventCondition.timeGap ? strategyEventCondition.timeGap : undefined}
                      rules={[
                        {validator: checkNumber},
                      ]}
                    >
                      <Input placeholder="请输入" style={{width: 96, marginLeft: 8}} type="number" />
                    </Item>
                    <Item 
                      noStyle 
                      name="timeUnit" 
                      initialValue={strategyEventCondition.timeUnit || 'MINUTES'}
                      rules={[{required: true, message: '请选择单位'}]}
                    >
                      <Select 
                        style={{width: 72}}
                        suffixIcon={<img src={dropdown} alt="dropdown" />}
                      >
                        <Option value="MINUTES">分钟</Option>
                        <Option value="HOURS">小时</Option>
                        <Option value="DAYS">天</Option>
                      </Select>
                    </Item>
                    <span className="ml8 mt4">内</span>
                  </Input.Group>
                </Item>
                <Collapse 
                  style={{marginBottom: 16, position: 'relative'}} 
                  defaultActiveKey={['1']}
                >
                  <Panel 
                    header={(
                      <div className="FBH header-select">
                        未完成下列
                        <Select 
                          onClick={e => e.stopPropagation()}
                          onChange={changeNotDoneLogic}
                          value={notDoneLogic} 
                          style={{width: 72, margin: '4px'}}
                          suffixIcon={<img src={dropdown} alt="dropdown" />}
                        >
                          <Option value={0}>任意</Option>
                          <Option value={1}>全部</Option>
                        </Select>
                        事件
                      </div>
                    )} 
                    key="1"
                  >
                    <Form.List
                      name="notDoneEvents"
                      initialValue={notDoneEventList}
                    >
                      {(fields, {add, remove}, {errors}) => (
                        <div>
                          {fields.map((field, index) => (
                            <div style={{width: 360}} className="pr">
                              <Item
                                {...field}
                                {...layout1}
                                style={{marginBottom: index === fields.length - 1 ? '0px' : '24px'}}
                                className="position-icon"
                                rules={[{required: true, message: '请选择事件'}]}
                              >
                                <Cascader
                                  placeholder="请选择事件"
                                  options={notConditionList}
                                  expandTrigger="hover"
                                  style={{width: 360}}
                                  onChange={checkSelectEvent}
                                  suffixIcon={<img src={dropdown} alt="dropdown" />}
                                  fieldNames={{
                                    label: 'name',
                                    value: 'id',
                                    children: 'children',
                                  }}
                                />
                              </Item>
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => {
                                  remove(field.name)
                                  setNotDoneCount(notDoneCount - 1)
                                  checkSelectEvent()
                                  setTimeout(() => {
                                    stepForm.validateFields(['timeGap'])
                                  }, 0)
                                }}
                              />
                            </div>
                          ))}
                          <div
                            className="add-event-btn fs14 hand"
                            onClick={() => { 
                              add() 
                              setNotDoneCount(notDoneCount + 1)
                              setTimeout(() => {
                                stepForm.validateFields(['timeGap'])
                              }, 0)
                            }}
                          >
                            <img style={{marginBottom: 1}} src={Attr} alt="属性" />
                            <span className="ml4">添加事件</span>
                          </div>
                        </div>
                      )}
                    </Form.List>
                  </Panel>
                </Collapse>
              </div>
            )
          }

          {
            planType === 0 && (
              <div>
                <Item
                  label="重复"
                  name="frequency"
                  rules={[{required: true, message: '请选择周期'}]}
                  initialValue={period}
                >
                  <Select 
                    onChange={changePeriod} 
                    placeholder="请选择周期"
                    suffixIcon={<img src={dropdown} alt="dropdown" />}
                  >
                    <Option value="0">单次</Option>
                    <Option value="1">每天</Option>
                    <Option value="2">每周</Option>
                    <Option value="3">每月</Option>
                  </Select>
                </Item>
                <Item
                  label="触发时间"
                  extra="将在这个时间对受众用户进行触达"
                >
                  {setTimeDom({
                    period,
                    cornTime,
                    disabledDate,
                  })}
                </Item>
              </div>
            )
          }

          {
            (period !== '0' || planType === 1) && (
              <Item 
                label="起止日期" 
                name="startEndDate"
                // style={{marginTop: 24}}
                rules={[{required: true, message: '请选择日期'}]}
                initialValue={
                  strategyEventCondition.startTime ? (
                    [moment(strategyEventCondition.startTime, dateTimeFormat), moment(strategyEventCondition.endTime, dateTimeFormat)]
                  ) : [moment(planInfo.ctime, dateTimeFormat), moment(planInfo.endTime, dateTimeFormat)]
                }
              >
                <RangePicker disabledDate={disabledDate} format={dateTimeFormat} />
              </Item>
            )
          }

          <Item 
            label="参与限制" 
            name="strategyRestrict" 
            initialValue={strategyDetail.strategyRestrict || 1}
            rules={[{required: true, message: '请选择次数'}]}
          >
            <Radio.Group>
              <Radio value={1}>
                参与一次
              </Radio>
              {/* <Radio value={0} disabled>
              参与多次
            </Radio> */}
            </Radio.Group>
          </Item>
          
        </Form>
      </div>
      <div className="steps-action" style={{display: current === 1 ? 'block' : 'none'}}>
        <Button className="mr8" onClick={prevStep}>
          上一步
        </Button>
        <Button type="primary" onClick={onFinish}>
          下一步
        </Button>
      </div>
    </Fragment>
  )
}
