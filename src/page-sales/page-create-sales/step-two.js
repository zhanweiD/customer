import {useState, useEffect} from 'react'
import {Cascader, Form, Button, DatePicker, TimePicker, Radio, Input, Select, Collapse} from 'antd'
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons'
import {CycleSelect} from '@dtwave/uikit'
import Attr from '../icon/wechat-attr.svg'

const {Option} = Select
const {Item} = Form
const {Panel} = Collapse
const {RangePicker} = DatePicker
const dateFormat = 'YYYY-MM-DD'
const dateTimeFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm:ss'

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
  // twoFormData = {}, 
  // setTwoFormData,
  setStrategyDetail, 
  strategyDetail,
  treeConditionList,
  conditionList,
}) => {
  const [stepForm] = Form.useForm()
  const [planType, setPlanType] = useState(1) // 计划类型 0定时1事件
  const [doneLogic, setDoneLogic] = useState(0) // 完成 0任意1全部 事件
  const [notDoneLogic, setnotDoneLogic] = useState(0) // 未完成 0任意1全部 事件
  const [period, setPeriod] = useState(0) // 重复, 计划触发周期，0 单次 1 每天 2 每周 3 每月
  let cycle = null // corn
  const {
    setRestrict,
    endTime,
    startTime,
    triggerTime,
    noRepeatTime,
    triggerEventList = [undefined],
  } = strategyDetail
  let cornTime = triggerTime ? CycleSelect.cronSrialize(triggerTime) : {}

  const onFinish = () => {
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
    stepForm.validateFields().then(value => {
      const {startEndDate, interval, time, way} = value
      if (planType === 0) {
        switch (period) {
          case 1:
            cycle = 'day'
            break
          case 2:
            cycle = 'week'
            break
          case 3:
            cycle = 'month'
            break
          default:
            cycle = ''
            value.noRepeatTime = `${interval.format(dateFormat)} ${time.format(timeFormat)}`
            break
        }
      }
      if (time && cycle) {
        const ctime = CycleSelect.formatCron(
          {cycle, time: time.format(timeFormat), interval}
        )
        value.triggerTime = ctime
      }
      if (startEndDate) {
        value.startTime = `${startEndDate[0].format(dateTimeFormat)} 00:00:00`
        value.endTime = `${startEndDate[1].format(dateTimeFormat)} 23:59:59`
      }
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
      const param = {
        strategyConditionType: value.strategyConditionType,
        strategyRestrict: value.strategyRestrict,
        strategyEventConditionContent,
      }
      console.log(param)
      setStrategyDetail({...strategyDetail, ...param})
      nextStep()
    }).catch(err => console.log(err))
  }
  const changePlanType = v => {
    console.log(v)
    setPlanType(v)
  }
  const changePeriod = v => {
    setPeriod(v)
    cornTime = {}
    stepForm.setFields([{
      time: '', 
      interval: '',
    }])
  }
  const changeDoneLogic = (e, v) => {
    e.stopPropagation()
    setDoneLogic(v)
  }
  const changeNotDoneLogic = v => {
    setnotDoneLogic(v)
  }
  const disabledDate = time => {
    return time && time < moment().endOf('day')
  }
 
  useEffect(() => {
    // setPlanType(twoFormData.type || 0)
    // setPeriod(twoFormData.period || 0)
    // setTouchWay(triggerGap ? 'delay' : 'now')
  }, [])

  // 根据重复方式生成触发时间组件
  const setTime = () => {
    const setMonth = () => {
      const monthData = []
      for (let i = 1; i <= 31; i++) {
        monthData.push(<Option value={i}>{`${i}号`}</Option>)
      }
      return monthData
    }

    if (period === 1) {
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
    if (period === 2) {
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
    if (period === 3) {
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
          initialValue={noRepeatTime ? moment(noRepeatTime.split(' ')[0], dateFormat) : undefined}
        >
          <DatePicker format={dateFormat} style={{width: '60%'}} />
        </Item>
        <Item 
          noStyle 
          name="time" 
          rules={[{required: true, message: '请选择时间'}]}
          initialValue={noRepeatTime ? moment(noRepeatTime.split(' ')[1], timeFormat) : undefined}
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
                      onClick={(e, v) => changeDoneLogic(e, v)}
                      defaultValue={0} 
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
                  initialValue={triggerEventList}
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
                              options={treeConditionList}
                              expandTrigger="hover"
                              style={{width: 360}}
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
                              onClick={() => remove(field.name)}
                            />
                          ) : null}
                        </div>
                      ))}
                      <div
                        className="add-event-btn fs12 hand"
                        onClick={() => { add() }}
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
            <Input.Group compact style={{marginBottom: 16}}>
              <span>且在</span>
              <Item 
                noStyle 
                name="timeGap" 
                rules={[{required: true, message: '请输入时间'}]}
              >
                <Input placeholder="请输入" style={{width: 72, marginLeft: 8}} type="number" />
              </Item>
              <Item 
                noStyle 
                name="timeUnit" 
                initialValue="MINUTES"
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
                      onClick={(e, v) => changeNotDoneLogic(e, v)}
                      defaultValue={0} 
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
                  initialValue={triggerEventList}
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
                              options={treeConditionList}
                              expandTrigger="hover"
                              style={{width: 360}}
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
                              onClick={() => remove(field.name)}
                            />
                          ) : null}
                        </div>
                      ))}
                      <div
                        className="add-event-btn fs12 hand"
                        onClick={() => { add() }}
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
              name="period"
              rules={[{required: true, message: '请选择周期'}]}
              initialValue={period}
            >
              <Select onChange={changePeriod} placeholder="请选择周期">
                <Option value={0}>单次</Option>
                <Option value={1}>每天</Option>
                <Option value={2}>每周</Option>
                <Option value={3}>每月</Option>
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
          (period !== 0 || planType === 1) && (
            <Item 
              label="起止日期" 
              name="startEndDate"
              // style={{marginTop: 24}}
              rules={[{required: true, message: '请选择日期'}]}
              initialValue={startTime ? [moment(startTime, dateTimeFormat), moment(endTime, dateTimeFormat)] : undefined}
            >
              <RangePicker disabledDate={disabledDate} format={dateTimeFormat} />
            </Item>
          )
        }
        <Item 
          label="参与限制" 
          name="strategyRestrict" 
          initialValue={setRestrict || 0}
          rules={[{required: true, message: '请选择次数'}]}
        >
          <Radio.Group>
            <Radio value={0}>
              参与一次
            </Radio>
            <Radio value={1} disabled>
              参与多次
            </Radio>
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
