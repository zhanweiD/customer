import {useState, useEffect} from 'react'
import {Cascader, Form, Button, DatePicker, TimePicker, Radio, Input, Select, Collapse} from 'antd'
import {MinusCircleOutlined} from '@ant-design/icons'
import {CycleSelect} from '@dtwave/uikit'
import Attr from '../icon/wechat-attr.svg'

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

  const matchEnent = data => {
    const channel = conditionList.filter(item => item.id === data[0])[0] || {}
    const account = conditionList.filter(item => item.id === data[1])[0] || {}
    const event = conditionList.filter(item => item.id === data[2])[0] || {}
    return {
      eventId: event.id,
      eventCode: event.code,
      channelId: channel.id,
      channelCode: channel.code,
      accountId: account.id,
      accountCode: account.code,
    }
  }
  const onFinish = () => {
    stepForm.validateFields().then(value => {
      console.log(value)
      const {startEndDate, interval, time} = value
      let params = {}

      if (startEndDate) {
        value.startTime = `${startEndDate[0].format(dateTimeFormat)} 00:00:00`
        value.endTime = `${startEndDate[1].format(dateTimeFormat)} 23:59:59`
      }
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
        console.log(params)
      } else {
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
        console.log(params)
      }
      setTwoFormData(params)
      // setStrategyDetail({...strategyDetail, ...params})
      nextStep()
    }).catch(err => console.log(err))
  }
  const changePlanType = v => {
    setPlanType(v)
  }
  const changePeriod = v => {
    setPeriod(v)
    setCornTime({})
    stepForm.setFields([{
      time: '', 
      interval: '',
    }])
  }
  const changeDoneLogic = v => {
    setDoneLogic(v)
  }
  const changeNotDoneLogic = v => {
    setNotDoneLogic(v)
  }
  const disabledDate = time => {
    return time > moment(planInfo.endTime, 'YYYY-MM-DD HH:mm:ss') || time < moment(planInfo.startTime, 'YYYY-MM-DD HH:mm:ss')
  }

  const checkSelectEvent = () => {
    const data = []
    stepForm.validateFields(['notDoneEvents']).then(value => {
      console.log(value)
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
  const checkDoneSelectEvent = () => {
    const data = []
    stepForm.validateFields(['doneEvents']).then(value => {
      console.log(value)
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

  // 根据重复方式生成触发时间组件
  const setTime = () => {
    const setMonth = () => {
      const monthData = []
      for (let i = 1; i <= 31; i++) {
        monthData.push(<Option value={i}>{`${i}号`}</Option>)
      }
      return monthData
    }
    if (period === '1') {
      return (
        <Item
          noStyle 
          name="time"
          rules={[{required: true, message: '请选择时间'}]}
          initialValue={cornTime.time ? moment(cornTime.time, timeFormat) : undefined}
        >
          <TimePicker format={timeFormat} style={{width: '40%'}} />
        </Item>
      )
    } 
    if (period === '2') {
      return (
        <Input.Group compact>
          <Item 
            noStyle 
            name="interval" 
            rules={[{required: true, message: '请选择日期'}]}
            initialValue={cornTime.interval}
          >
            <Select style={{width: '60%'}} placeholder="请选择日期">
              <Option value={1}>星期一</Option>
              <Option value={2}>星期二</Option>
              <Option value={3}>星期三</Option>
              <Option value={4}>星期四</Option>
              <Option value={5}>星期五</Option>
              <Option value={6}>星期六</Option>
              <Option value={7}>星期日</Option>
            </Select>
          </Item>
          <Item 
            noStyle 
            name="time" 
            rules={[{required: true, message: '请选择时间'}]}
            initialValue={cornTime.time ? moment(cornTime.time, timeFormat) : undefined}
          >
            <TimePicker format={timeFormat} style={{width: '40%'}} />
          </Item>
        </Input.Group>
      )
    } 
    if (period === '3') {
      return (
        <Input.Group compact>
          <Item 
            noStyle 
            name="interval" 
            rules={[{required: true, message: '请选择日期'}]}
            initialValue={cornTime.interval}
          >
            <Select style={{width: '60%'}} placeholder="请选择日期">
              {
                setMonth()
              }
            </Select>
          </Item>
          <Item 
            noStyle 
            name="time" 
            initialValue={cornTime.time ? moment(cornTime.time, timeFormat) : undefined}
            rules={[{required: true, message: '请选择时间'}]}
          >
            <TimePicker format={timeFormat} style={{width: '40%'}} />
          </Item>
        </Input.Group>
      )
    }
    return (
      <Input.Group compact>
        <Item 
          noStyle 
          name="interval" 
          rules={[{required: true, message: '请选择日期'}]}
          initialValue={cornTime.date ? moment(cornTime.date, dateFormat) : undefined}
        >
          <DatePicker disabledDate={disabledDate} format={dateFormat} style={{width: '60%'}} />
        </Item>
        <Item 
          noStyle 
          name="time" 
          rules={[{required: true, message: '请选择时间'}]}
          initialValue={cornTime.time ? moment(cornTime.time, timeFormat) : undefined}
        >
          <TimePicker format={timeFormat} style={{width: '40%'}} />
        </Item>
      </Input.Group>
    )
  }

  return (
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
          <Select onChange={changePlanType}>
            <Option value={0}>定时触发</Option>
            <Option value={1}>事件触发</Option>
          </Select>
        </Item>
        {
          planType === 1 && (
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
                      style={{width: 72, margin: '8px'}}
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
                        className="add-event-btn fs12 hand"
                        onClick={() => {
                          add()
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
          )
        }
        {
          planType === 1 && (
            <Item>
              <Input.Group compact>
                <span>且在</span>
                <Item 
                  noStyle 
                  name="timeGap" 
                  initialValue={strategyEventCondition.timeGap ? strategyEventCondition.timeGap : undefined}
                  rules={[
                    // {required: true, message: '请输入时间'},
                    {validator: checkNumber},
                  ]}
                >
                  <Input placeholder="请输入" style={{width: 72, marginLeft: 8}} type="number" />
                </Item>
                <Item 
                  noStyle 
                  name="timeUnit" 
                  initialValue={strategyEventCondition.timeUnit || 'MINUTES'}
                  rules={[{required: true, message: '请选择单位'}]}
                >
                  <Select style={{width: 72}}>
                    <Option value="MINUTES">分钟</Option>
                    <Option value="HOURS">小时</Option>
                    <Option value="DAYS">天</Option>
                  </Select>
                </Item>
                <span className="ml8">内</span>
              </Input.Group>
            </Item>
          )
        }

        {
          planType === 1 && (
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
                      style={{width: 72, margin: '8px'}}
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
                              options={notConditionList}
                              expandTrigger="hover"
                              style={{width: 360}}
                              onChange={checkSelectEvent}
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
                        className="add-event-btn fs12 hand"
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
          )
        }

        {
          planType === 0 && (
            <Item
              label="重复"
              name="frequency"
              rules={[{required: true, message: '请选择周期'}]}
              initialValue={period}
            >
              <Select onChange={changePeriod} placeholder="请选择周期">
                <Option value="0">单次</Option>
                <Option value="1">每天</Option>
                <Option value="2">每周</Option>
                <Option value="3">每月</Option>
              </Select>
            </Item>
          )
        }

        {
          planType === 0 && (
            <Item
              label="触发时间"
              extra="将在这个时间对受众用户进行触达"
            >
              {setTime()}
            </Item>
          )
        }

        {
          (period !== '0' || planType === 1) && (
            <Item 
              label="起止日期" 
              name="startEndDate"
              // style={{marginTop: 24}}
              rules={[{required: true, message: '请选择日期'}]}
              initialValue={strategyEventCondition.startTime ? [moment(strategyEventCondition.startTime, dateTimeFormat), moment(strategyEventCondition.endTime, dateTimeFormat)] : undefined}
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
      <div className="steps-action">
        <Button className="mr8" onClick={prevStep}>
          上一步
        </Button>
        <Button type="primary" onClick={onFinish}>
          下一步
        </Button>
      </div>
    </div>
  )
}
