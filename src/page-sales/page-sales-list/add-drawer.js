import {useState, useEffect} from 'react'
import {
  Drawer, Form, Button, DatePicker, Input, Select, Collapse, Tooltip, Cascader, Spin,
} from 'antd'
import {errorTip, debounce} from '@util'
import io from './io'
import dropdown from '../../icon/dropdown.svg'

const {Option} = Select
const {Item} = Form
const {Panel} = Collapse
const {RangePicker} = DatePicker
const {TextArea} = Input
const dateFormat = 'YYYY-MM-DD'

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
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

export default ({
  showModal, 
  setModal, 
  planInfo,
  addPlan,
  editPlan,
  addLoading,
}) => {
  const [groupList, setGroupList] = useState([])
  const [eventList, setEventList] = useState([])
  const [eventOriginList, setOriginEventList] = useState([])
  
  const [addForm] = Form.useForm()
  const {
    id,
    planName,
    clientGroupId,
    startTime,
    endTime,
    descr,
    firstTargetContent = {},
  } = planInfo
  const {event} = firstTargetContent
  const defaultEvent = event ? [event.channelId, event.accountId, event.eventId] : undefined
  // 获取人群
  const getGroupList = async () => {
    try {
      const res = await io.getGroupList()
      setGroupList(res || [])
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 获取目标事件
  const getTargetChannelList = async () => {
    try {
      const res = await io.getTargetChannelList()
      setOriginEventList(res || [])
      setEventList(listToTree(res || []))
    } catch (error) {
      errorTip(error.message)
    }
  }
  // 计划名称查重
  const checkPlanName = async (name, callback) => {
    try {
      const res = await io.checkName({planName: name, id})
      if (res.isExist) callback('计划名称重复')
      else callback()
    } catch (error) {
      errorTip(error.message)
    }
  }

  const checkName = (rule, value, callback) => {
    if (value) {
      // 防抖设计
      debounce(() => checkPlanName(value, callback), 500)
    } else {
      callback()
    }
  }

  const changeEvent = v => {
    console.log(v)
  }
  const setEvent = data => {
    const channel = eventOriginList.filter(item => item.id === data[0])[0] || {}
    const account = eventOriginList.filter(item => item.id === data[1])[0] || {}
    const eventItem = eventOriginList.filter(item => item.id === data[2])[0] || {}
    return {
      channelId: channel.id,
      channelCode: channel.code,
      accountId: account.id,
      accountCode: account.code,
      eventId: eventItem.id,
      eventCode: eventItem.code,
      eventName: eventItem.name,
    }
  }
  const checkNumber = (rule, value, callback) => {
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
  }

  const onFinish = () => {
    addForm.validateFields().then(value => {
      const {startEndDate} = value
      // 人群处理
      const group = groupList.filter(item => item.id === value.clientGroupId)[0] || {}
      // 详情展示name
      const names = {
        clientGroupName: group.name,
        planGroupName: '默认分组',
      }
      value.front = JSON.stringify(names)
      // 时间处理
      value.startTime = `${startEndDate[0].format(dateFormat)} 00:00:00`
      value.endTime = `${startEndDate[1].format(dateFormat)} 23:59:59`
      delete value.startEndDate
      // 目标设置处理
      value.firstTargetContents = {
        timeGap: value.timeGap,
        timeUnit: value.timeUnit,
        event: setEvent(value.event),
      }
      delete value.timeGap
      delete value.timeUnit
      delete value.event
      // 编辑新增
      if (planInfo.id) {
        value.id = planInfo.id
        editPlan(value)
      } else {
        addPlan(value)
      }
    }).catch(err => console.log(err))
  }
  const closeDrawer = () => {
    setModal(false)
  }

  const disabledDate = time => {
    return time && time < moment().startOf('day')
  }

  useEffect(() => {
    getTargetChannelList()
    getGroupList()
  }, [])

  useEffect(() => {
    addForm.resetFields()
  }, [planInfo])

  return (
    <Drawer
      title={id ? '编辑计划' : '新建计划'}
      width={525}
      className="add-form"
      visible={showModal}
      onClose={closeDrawer}
      destroyOnClose
      maskClosable={false}
      footer={(
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={closeDrawer} style={{marginRight: 8}}>
            取消
          </Button>
          <Tooltip title="保存之后，自动跳转至策略配置页面">
            <Button loading={addLoading} onClick={onFinish} type="primary">
              保存
            </Button>
          </Tooltip>
        </div>
      )}
    >
      <Form 
        form={addForm}
        {...layout}
        className="add-form"
        name="addDrawer"
      >
        <Collapse 
          // style={{width: 'calc(100% + 48px)', marginLeft: '-24px'}} 
          defaultActiveKey={['1']}
        >
          <Panel header="基础信息" key="1">
            <Item
              label="计划名称"
              name="planName"
              initialValue={planName}
              rules={[
                {required: true, message: '输入计划名称'},
                {validator: checkName},
              ]}
            >
              <Input placeholder="请输入计划名称" />
            </Item>
            <Item
              label="计划分组"
              name="planGroupId"
              initialValue={1}
              rules={[{required: true, message: '请选择分组'}]}
            >
              <Select 
                // labelInValue
                placeholder="请选择分组"
                suffixIcon={<img src={dropdown} alt="dropdown" />}
              >
                <Option value={1}>默认分组</Option>
              </Select>
            </Item>
            <Item
              label="受众用户"
              name="clientGroupId"
              initialValue={clientGroupId}
              rules={[{required: true, message: '请选择人群'}]}
            >
              <Select 
                // labelInValue
                placeholder="请选择人群"
                suffixIcon={<img src={dropdown} alt="dropdown" />}
              >
                {
                  groupList.map(item => <Option value={item.id}>{item.name}</Option>)
                }
              </Select>
            </Item>
            <Item
              label="有效时间"
              name="startEndDate"
              rules={[{required: true, message: '请选择日期'}]}
              initialValue={startTime ? [moment(startTime, dateFormat), moment(endTime, dateFormat)] : undefined}
            >
              <RangePicker disabledDate={disabledDate} format={dateFormat} />
            </Item>
            <Item
              label="描述"
              name="descr"
              initialValue={descr}
            >
              <TextArea placeholder="请输入描述" autoSize={{minRows: 3, maxRows: 5}} />
            </Item>
          </Panel>
        </Collapse>
        
        <Collapse 
          // style={{width: 'calc(100% + 48px)', marginLeft: '-24px'}}
          defaultActiveKey={['1']}
        >
          <Panel style={{width: '100%'}} header="目标设置" key="1">
            <div className="fs14 mb16">首要目标</div>
            <Item
              label="完成时间"
              name="validation-time"
              initialValue="validation-time"
              rules={[{required: true, message: '请输入时间'}]}
              extra="用户进入流程后，在该时间内完成一次转化事件，则认为完成目标"
            >
              <Input.Group compact>
                <Item 
                  noStyle 
                  name="timeGap" 
                  initialValue={firstTargetContent.timeGap}
                  rules={[
                    // {required: true, message: '请输入时间'},
                    {validator: checkNumber},
                  ]}
                >
                  <Input placeholder="请输入时间" style={{width: '70%'}} type="number" />
                </Item>
                <Item 
                  noStyle 
                  name="timeUnit" 
                  initialValue={firstTargetContent.timeUnit || 'MINUTES'}
                >
                  <Select 
                    style={{width: '30%'}}
                    suffixIcon={<img src={dropdown} alt="dropdown" />}
                  >
                    <Option value="MINUTES">分钟</Option>
                    <Option value="HOURS">小时</Option>
                    <Option value="DAYS">天</Option>
                  </Select>
                </Item>
              </Input.Group>
            </Item>
            <Item
              label="完成事件"
              name="event"
              initialValue={defaultEvent}
              rules={[{required: true, message: '请选择事件'}]}
            >
              <Cascader
                placeholder="请选择事件"
                options={eventList}
                expandTrigger="hover"
                suffixIcon={<img src={dropdown} alt="dropdown" />}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                  children: 'children',
                }}
                onChange={changeEvent}
              />
            </Item>
          </Panel>
        </Collapse>
      </Form>
    </Drawer>
  )
}
