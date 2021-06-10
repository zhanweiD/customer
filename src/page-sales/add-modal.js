import {useState, useEffect} from 'react'
import {
  Drawer, Form, Button, DatePicker, Input, Select, Collapse, Tooltip,
} from 'antd'
import {errorTip} from '@util'
import io from './io'

const {Option} = Select
const {Item} = Form
const {Panel} = Collapse
const {RangePicker} = DatePicker
const {TextArea} = Input
const dateFormat = 'YYYY-MM-DD'

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
  addPlan,
  planInfo,
  editPlan,
  eventList = [],
}) => {
  const [groupList, setGroupList] = useState([])
  const [addForm] = Form.useForm()

  // 获取人群
  const getGroupList = async () => {
    try {
      const res = await io.getGroupList()
      setGroupList(res)
    } catch (error) {
      errorTip(error.message)
    }
  }

  const onFinish = () => {
    addForm.validateFields().then(value => {
      const {startEndDate} = value
      console.log(value)
      value.type = 1 // 首要目标
      // 时间处理
      if (startEndDate) {
        value.startTime = `${startEndDate[0].format(dateFormat)} 00:00:00`
        value.endTime = `${startEndDate[1].format(dateFormat)} 23:59:59`
        delete value.startEndDate
      }
      // 目标设置处理
      value.firstTargetContents = {
        timeGap: value.timeGap,
        timeUnit: value.timeUnit,
        event: value.event,
      }
      delete value.timeGap
      delete value.timeUnit
      delete value.event
      // 编辑新增
      if (planInfo) {
        value.id = planInfo.id
        editPlan(value)
      } else {
        addPlan(value)
      }
      setModal(false)
    }).catch(err => console.log(err))
  }
  const closeDrawer = () => {
    setModal(false)
  }
  
  useEffect(() => {
    getGroupList()
  }, [])

  return (
    <Drawer
      title="计划配置"
      width={525}
      className="add-form"
      visible={showModal}
      onCancel={closeDrawer}
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
            <Button onClick={onFinish} type="primary">
              保存
            </Button>
          </Tooltip>
        </div>
      )}
    >
      <Form 
        {...layout}
        className="run-form"
        name="runDrawer"
        form={addForm}
      >
        <Collapse 
          // style={{width: 'calc(100% + 48px)', marginLeft: '-24px'}} 
          defaultActiveKey={['1']}
        >
          <Panel header="基础信息" key="1">
            <Item
              label="计划名称"
              name="planName"
              rules={[{required: true, message: '输入计划名称'}]}
            >
              <Input placeholder="请输入计划名称" />
            </Item>
            <Item
              label="计划分组"
              name="planGroupId"
              initialValue={1}
              rules={[{required: true, message: '请选择分组'}]}
            >
              <Select placeholder="请选择分组">
                <Option value={1}>默认分组</Option>
              </Select>
            </Item>
            <Item
              label="受众用户"
              name="clientGroupId"
              rules={[{required: true, message: '请选择人群'}]}
            >
              <Select placeholder="请选择人群">
                {
                  groupList.map(item => <Option value={item.id}>{item.name}</Option>)
                }
              </Select>
            </Item>
            <Item
              label="有效时间"
              name="startEndDate"
              rules={[{required: true, message: '请选择日期'}]}
              // initialValue={startTime ? [moment(startTime, dateFormat), moment(endTime, dateFormat)] : undefined}
            >
              <RangePicker format={dateFormat} />
            </Item>
            <Item
              label="描述"
              name="descr"
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
            <div className="fs12 mb16">首要目标</div>
            <Item
              label="完成时间"
              // name="firstTargetContents"
              extra="用户进入流程后，在该时间内完成一次转化事件，则认为完成目标"
            >
              <Input.Group compact>
                <Item 
                  noStyle 
                  name="timeGap" 
                  rules={[{required: true, message: '请输入时间'}]}
                >
                  <Input placeholder="请输入时间" style={{width: '70%'}} type="number" />
                </Item>
                <Item 
                  noStyle 
                  name="timeUnit" 
                  initialValue="MINUTE"
                  rules={[{required: true, message: '请选择单位'}]}
                >
                  <Select style={{width: '30%'}}>
                    <Option value="MINUTE">分钟</Option>
                    <Option value="HOUR">小时</Option>
                    <Option value="DAY">天</Option>
                  </Select>
                </Item>
              </Input.Group>
            </Item>
            <Item
              label="完成事件"
              name="event"
              rules={[{required: true, message: '请选择事件'}]}
            >
              <Select style={{width: '95%'}} placeholder="请选择事件">
                <Option value="1">全部</Option>
                {
                  eventList.map(item => <Option value={item.id}>{item.name}</Option>)
                }
              </Select>
            </Item>
          </Panel>
        </Collapse>
      </Form>
    </Drawer>
  )
}
