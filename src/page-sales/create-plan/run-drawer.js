import {useState} from 'react'
import {Drawer, Form, Button, DatePicker, TimePicker, Radio, Input, Select, Collapse} from 'antd'
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons'

const {Option} = Select
const {Item} = Form
const {Panel} = Collapse
const {RangePicker} = DatePicker

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

export default ({showRun, runDrawer}) => {
  const [runForm] = Form.useForm()
  const [planType, setPlanType] = useState('timing')
  const [align, setAlign] = useState('never')
  const [touchWay, setTouchWay] = useState('now')

  const onFinish = () => {
    runForm.validateFields().then(value => {
      console.log(value)
      runDrawer(false)
      runForm.resetFields()
    }).catch(err => console.log(err))
  }
  const closeDrawer = () => {
    runDrawer(false)
    runForm.resetFields()
  }
  const changePlanType = v => {
    setPlanType(v)
  }
  const changeAlign = v => {
    setAlign(v)
  }
  const changTouchWay = v => {
    setTouchWay(v)
  }
  const setTouchType = () => {
    return (
      <Input.Group compact>
        <Item noStyle name="way" initialValue={touchWay} rules={[{required: true, message: '请选择触达方式'}]}>
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
            <Item noStyle name="time" rules={[{required: true, message: '请输入时间'}]}>
              <Input style={{width: '40%'}} type="number" placeholder="请输入时间" />
            </Item>
          )
        }
        {
          touchWay !== 'now' && (
            <Item noStyle name="type" initialValue="min" rules={[{required: true, message: '请选择单位'}]}>
              <Select style={{width: '30%'}}>
                <Option value="min">分钟</Option>
                <Option value="hours">小时</Option>
                <Option value="day">天</Option>
              </Select>
            </Item>
          )
        }
      </Input.Group>
    )
  }
  const setTime = () => {
    const setMonth = () => {
      const monthData = []
      for (let i = 1; i <= 31; i++) {
        monthData.push(<Option value={i}>{`${i}号`}</Option>)
      }
      return monthData
    }
    if (align === 'day') {
      return <TimePicker style={{width: '40%'}} />
    } 
    if (align === 'week') {
      return (
        <Input.Group compact>
          <Item noStyle name="date" rules={[{required: true, message: '请选择'}]}>
            <Select style={{width: '60%'}} placeholder="请选择">
              <Option value="monday">星期一</Option>
              <Option value="tuesday">星期二</Option>
              <Option value="wednesday">星期三</Option>
              <Option value="thursday">星期四</Option>
              <Option value="friday">星期五</Option>
              <Option value="saturday">星期六</Option>
              <Option value="sunday">星期日</Option>
            </Select>
          </Item>
          <Item noStyle name="time" rules={[{required: true, message: '请选择时间'}]}>
            <TimePicker style={{width: '40%'}} />
          </Item>
        </Input.Group>
      )
    } 
    if (align === 'month') {
      return (
        <Input.Group compact>
          <Item noStyle name="date" rules={[{required: true, message: '请选择时间'}]}>
            <Select style={{width: '60%'}} placeholder="请选择">
              {
                setMonth()
              }
            </Select>
          </Item>
          <Item noStyle name="time" rules={[{required: true, message: '请选择时间'}]}>
            <TimePicker style={{width: '40%'}} />
          </Item>
        </Input.Group>
      )
    }
    return (
      <Input.Group compact>
        <Item noStyle name="date" rules={[{required: true, message: '请选择时间'}]}>
          <DatePicker style={{width: '60%'}} />
        </Item>
        <Item noStyle name="time" rules={[{required: true, message: '请选择时间'}]}>
          <TimePicker style={{width: '40%'}} />
        </Item>
      </Input.Group>
    )
  }

  return (
    <Drawer
      title="开始控件"
      width={560}
      className="run-drawer"
      onClose={closeDrawer}
      visible={showRun}
      bodyStyle={{paddingBottom: 80}}
      footer={(
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={() => runDrawer(false)} style={{marginRight: 8}}>
            取消
          </Button>
          <Button onClick={onFinish} type="primary">
            保存
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
          name="username"
          className="user-pb8"
          extra="营销活动需要触达的人群"
          rules={[{required: true, message: '请选择人群'}]}
        >
          <Select placeholder="请选择人群">
            <Option value="1">全部</Option>
          </Select>
        </Item>
        <Collapse 
          style={{width: 'calc(100% + 48px)', marginLeft: '-24px'}} 
          defaultActiveKey={['1']}
        >
          <Panel header="触发条件" key="1">
            <Item
              label="计划类型"
              name="planType"
              initialValue={planType}
              rules={[{required: true, message: '请选择计划类型'}]}
            >
              <Select onChange={changePlanType}>
                <Option value="timing">定时触发</Option>
                <Option value="event">事件触发</Option>
              </Select>
            </Item>
            {
              planType === 'event' && (<div className="fs12 ml24 mb16">满足一下任何事件都可以进入主流程</div>)
            }
            {
              planType === 'event' && (
                <Form.List
                  name="conversion-event"
                  initialValue={[{
                    event: undefined,
                  }]}
                >
                  {(fields, {add, remove}, {errors}) => (
                    <div>
                      {fields.map((field, index) => (
                        <div className="mb24 pr">
                          <Form.Item
                            {...field}
                            {...layout}
                            name={[field.name, 'event']}
                            fieldKey={[field.fieldKey, 'event']}
                            className="position-icon"
                            label={`事件${index + 1}`}
                            rules={[{required: true, message: '请选择事件'}]}
                          >
                            <Select style={{width: '95%'}} placeholder="请选择事件">
                              <Option value="2">APP注册</Option>
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
                      {/* <Form.ErrorList errors={errors} /> */}
                    </div>
                  )}
                </Form.List>
              )
            }
            {
              planType === 'event' && (
                <Item 
                  label="触达方式" 
                >
                  {setTouchType()}
                </Item>
              )
            }
            {
              planType === 'timing' && (
                <Item
                  label="重复"
                  name="align"
                  rules={[{required: true, message: '请选择周期'}]}
                >
                  <Select onChange={changeAlign} placeholder="请选择周期">
                    <Option value="never">永不</Option>
                    <Option value="day">每天</Option>
                    <Option value="week">每周</Option>
                    <Option value="month">每月</Option>
                  </Select>
                </Item>
              )
            }
            {
              planType === 'timing' && (
                <Item
                  label="触发时间"
                  name="time"
                  extra="将在这个时间对受众用户进行触达"
                >
                  {setTime()}
                </Item>
              )
            }
            {
              align !== 'never' && (
                <Item label="起止日期" name="startDate">
                  <RangePicker />
                </Item>
              )
            }
            <Item 
              label="参与限制" 
              name="join-limit" 
              initialValue="one"
              rules={[{required: true, message: '请选择次数'}]}
            >
              <Radio.Group>
                <Radio value="one">
                  参与一次
                </Radio>
                <Radio value="more" disabled>
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
                <Item noStyle name="number" rules={[{required: true, message: '请输入时间'}]}>
                  <Input style={{width: '70%'}} type="number" />
                </Item>
                <Item noStyle name="type" initialValue="min" rules={[{required: true, message: '请选择单位'}]}>
                  <Select style={{width: '30%'}}>
                    <Option value="min">分钟</Option>
                  </Select>
                </Item>
              </Input.Group>
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
