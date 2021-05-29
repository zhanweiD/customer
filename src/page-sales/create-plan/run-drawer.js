import {useState, useEffect} from 'react'
import {Drawer, Form, Button, DatePicker, TimePicker, Radio, Input, Select, Collapse} from 'antd'
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons'
import {CycleSelect} from '@dtwave/uikit'

const {Option} = Select
const {Item} = Form
const {Panel} = Collapse
const {RangePicker} = DatePicker
const dateFormat = 'YYYY-MM-DD'
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
const timeFormat = 'HH:mm:ss'

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

export default ({
  showRun, 
  runDrawer, 
  setRunForm, 
  runFormData = {}, 
  groupList, 
  eventList,
}) => {
  const [runForm] = Form.useForm()
  const [planType, setPlanType] = useState(0) // 计划类型 0定时1事件
  const [period, setPeriod] = useState(0) // 重复, 计划触发周期，0 单次 1 每天 2 每周 3 每月
  let cycle = null // corn
  const [touchWay, setTouchWay] = useState('now')
  const {
    clientGroupId, 
    targetGap, 
    targetUnit, 
    setRestrict,
    endTime,
    startTime,
    triggerTime,
    triggerGap,
    triggerUnit,
    noRepeatTime,
    triggerEventList = [{id: undefined}],
    targetEvent,
  } = runFormData
  // const [neverTime, setNeverTime] = useState(noRepeatTime)
  let cornTime = triggerTime ? CycleSelect.cronSrialize(triggerTime) : {}
  const onFinish = () => {
    runForm.validateFields().then(value => {
      const {startEndDate, interval, time} = value
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
      // CycleSelect.cronSrialize('0 45 3 1,2,3 * ? *')
      if (startEndDate) {
        value.startTime = startEndDate[0].format(dateTimeFormat)
        value.endTime = startEndDate[1].format(dateTimeFormat)
      }
      setRunForm(value)
      console.log(value)
      runDrawer(false)
      // runForm.resetFields() // 时间类控件重置有问题
    }).catch(err => console.log(err))
  }
  const closeDrawer = () => {
    // runForm.resetFields()
    runDrawer(false)
  }
  const changePlanType = v => {
    setPlanType(v)
  }
  const changePeriod = v => {
    setPeriod(v)
    cornTime = {}
    // setNeverTime('')
    runForm.resetFields(['time', 'interval'])
  }
  const changTouchWay = v => {
    setTouchWay(v)
  }
  useEffect(() => {
    setPlanType(runFormData.type || 0)
    setPeriod(runFormData.period || 0)
    setTouchWay(triggerGap ? 'delay' : 'now')
  }, [runFormData])
  const setTouchType = () => {
    return (
      <Input.Group compact>
        <Item 
          noStyle 
          name="way" 
          initialValue={touchWay} 
          rules={[{required: true, message: '请选择触达方式'}]}
        >
          <Select 
            style={{width: touchWay === 'now' ? '100%' : '30%'}} 
            onChange={changTouchWay}
          >
            <Option value="now">立即</Option>
            <Option value="delay">延迟</Option>
          </Select>
        </Item>
        {
          touchWay !== 'now' && (
            <Item 
              noStyle 
              name="triggerGap" 
              rules={[{required: true, message: '请输入时间'}]}
              initialValue={triggerGap}
            >
              <Input style={{width: '40%'}} type="number" placeholder="请输入时间" />
            </Item>
          )
        }
        {
          touchWay !== 'now' && (
            <Item 
              noStyle 
              name="triggerUnit" 
              initialValue={triggerUnit || 1}
              rules={[{required: true, message: '请选择单位'}]}
            >
              <Select style={{width: '30%'}}>
                <Option value={1}>分钟</Option>
                <Option value={2}>小时</Option>
                <Option value={3}>天</Option>
              </Select>
            </Item>
          )
        }
      </Input.Group>
    )
  }
  // 触发时间组件
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
    <Drawer
      title="开始控件"
      width={560}
      className="run-drawer"
      destroyOnClose
      onClose={closeDrawer}
      visible={showRun}
      bodyStyle={{paddingBottom: 80}}
      footer={(
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={closeDrawer} style={{marginRight: 8}}>
            取消
          </Button>
          <Button onClick={onFinish} type="primary">
            确定
          </Button>
        </div>
      )}
    >
      <Form 
        {...layout}
        className="run-form"
        name="runDrawer"
        form={runForm}
      >
        <Item
          label="受众用户"
          name="clientGroupId"
          className="user-pb8"
          extra="营销活动需要触达的人群"
          initialValue={clientGroupId}
          rules={[{required: true, message: '请选择人群'}]}
        >
          <Select placeholder="请选择人群">
            {/* <Option value="1">全部</Option> */}
            {
              groupList.map(item => <Option value={item.id}>{item.name}</Option>)
            }
          </Select>
        </Item>
        <Collapse 
          style={{width: 'calc(100% + 48px)', marginLeft: '-24px'}} 
          defaultActiveKey={['1']}
        >
          <Panel header="触发条件" key="1">
            <Item
              label="计划类型"
              name="type"
              initialValue={planType}
              rules={[{required: true, message: '请选择计划类型'}]}
            >
              <Select onChange={changePlanType}>
                <Option value={0}>定时触发</Option>
                <Option value={1}>事件触发</Option>
              </Select>
            </Item>
            {
              planType === 1 && (<div className="fs12 ml24 mb16">满足一下任何事件都可以进入主流程</div>)
            }
            {
              planType === 1 && (
                <Form.List
                  name="triggerEventList"
                  initialValue={triggerEventList}
                >
                  {(fields, {add, remove}, {errors}) => (
                    <div>
                      {fields.map((field, index) => (
                        <div className="mb24 pr">
                          <Form.Item
                            {...field}
                            {...layout}
                            name={[field.name, 'id']}
                            fieldKey={[field.fieldKey, 'id']}
                            className="position-icon"
                            label={`事件${index + 1}`}
                            rules={[{required: true, message: '请选择事件'}]}
                          >
                            <Select style={{width: '95%'}} placeholder="请选择事件">
                              {/* <Option value="1">全部</Option> */}
                              {
                                eventList.map(item => <Option value={item.id}>{item.name}</Option>)
                              }
                            </Select>
                          </Form.Item>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(field.name)}
                            />
                          ) : null}
                        </div>
                      ))}
                      <Button
                        type="primary"
                        onClick={() => add()}
                        style={{width: '40%', marginLeft: '24px', marginBottom: '24px'}}
                        icon={<PlusOutlined />}
                      >
                        添加事件
                      </Button>
                    </div>
                  )}
                </Form.List>
              )
            }
            {
              planType === 1 && (
                <Item 
                  label="触达方式" 
                >
                  {setTouchType()}
                </Item>
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
              period !== 0 && (
                <Item 
                  label="起止日期" 
                  name="startEndDate"
                  rules={[{required: true, message: '请选择日期'}]}
                  initialValue={startTime ? [moment(startTime, dateTimeFormat), moment(endTime, dateTimeFormat)] : undefined}
                >
                  <RangePicker showTime format={dateTimeFormat} />
                </Item>
              )
            }
            <Item 
              label="参与限制" 
              name="setRestrict" 
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
          </Panel>
        </Collapse>
        
        <Collapse 
          style={{width: 'calc(100% + 48px)', marginLeft: '-24px'}}
          defaultActiveKey={['1']}
        >
          <Panel style={{width: '100%'}} header="目标设置" key="1">
            <div className="fs12 mb16 ml24">首要目标</div>
            <Item
              label="完成时间"
              extra="用户进入流程后，在该时间内完成一次转化事件，则认为完成目标"
            >
              <Input.Group compact>
                <Item 
                  noStyle 
                  name="targetGap" 
                  initialValue={targetGap}
                  rules={[{required: true, message: '请输入时间'}]}
                >
                  <Input placeholder="请输入时间" style={{width: '70%'}} type="number" />
                </Item>
                <Item 
                  noStyle 
                  name="targetUnit" 
                  initialValue={targetUnit || 1}
                  rules={[{required: true, message: '请选择单位'}]}
                >
                  <Select style={{width: '30%'}}>
                    <Option value={1}>分钟</Option>
                    <Option value={2}>小时</Option>
                    <Option value={3}>天</Option>
                  </Select>
                </Item>
              </Input.Group>
            </Item>
            <Item
              label="完成事件"
              name="targetEvent"
              initialValue={targetEvent}
              rules={[{required: true, message: '请选择事件'}]}
            >
              <Select style={{width: '95%'}} placeholder="请选择事件">
                {/* <Option value="1">全部</Option> */}
                {
                  eventList.map(item => <Option value={item.id}>{item.name}</Option>)
                }
              </Select>
            </Item>
            {/* <Form.List
              name="conversion-event"
            >
              {(fields, {add, remove}, {errors}) => (
                <div>
                  {fields.map((field, index) => (
                    <Form.Item
                      required={false}
                      key={field.key}
                      wrapperCol={{span: 24}}
                    >
                      <Form.Item
                        {...field}
                        {...layout}
                        className="position-icon"
                        label={`转化事件${index + 1}`}
                      >
                        <Input style={{width: '95%'}} placeholder="passenger name" />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Button
                    type="primary"
                    onClick={() => add()}
                    style={{width: '40%', marginLeft: '24px'}}
                    icon={<PlusOutlined />}
                  >
                    添加事件
                  </Button>
                </div>
              )}
            </Form.List> */}
          </Panel>
        </Collapse>
      </Form>
    </Drawer>
  )
}
