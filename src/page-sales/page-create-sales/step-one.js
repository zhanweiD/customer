import {useEffect, useState} from 'react'
import {Form, Select, Button, Input, Radio, Collapse, Cascader, Popconfirm} from 'antd'
import {MinusCircleOutlined} from '@ant-design/icons'
import Attr from '../icon/wechat-attr.svg'
import RuleItem from './ruleItem'
import io from './io'

const {Item, List} = Form
const {Option} = Select 
const {Panel} = Collapse
const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 18,
  },
}

const listToTree = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === -1)
}

const CreateSales = ({
  nextStep, 
  current, 
  objTagList, 
  oneFormData, 
  setOneFormData, 
  setStrategyDetail, 
  strategyDetail,
  filterChannelList,
  originEventList,
}) => {
  const [oneForm] = Form.useForm()
  const [radioType, setRadioType] = useState(0)
  const [userLogic, setUserLogic] = useState('OR') // 用户筛选关系
  const [clientGroup, setClientGroup] = useState([]) // 用户筛选详情
  const [selectKey, setSelectKey] = useState([]) // 已选事件id
  const [channelList, setChannelList] = useState([]) // 带disable的事件

  // 返回事件全部信息（code, id）
  const matchEnent = data => {
    const channel = originEventList.filter(item => item.id === data[0])[0] || {}
    const account = originEventList.filter(item => item.id === data[1])[0] || {}
    const event = originEventList.filter(item => item.id === data[2])[0] || {}
    return {
      eventId: event.id,
      eventCode: event.code,
      channelId: channel.id,
      channelCode: channel.code,
      accountId: account.id,
      accountCode: account.code,
    }
  }

  // 保存表单值
  const complete = () => {
    oneForm.validateFields().then(value => {
      if (value.clientGroupFilterType) {
        const events = value.clientGroupFilterContent.map(item => matchEnent(item.event))
        value.clientGroupUserActionFilterContent = {events, logic: userLogic}
      } else if (value.clientGroupFilterContent[0]) {
        const param = value.clientGroupFilterContent.map(item => {
          item.leftTagId = item.tagId ? item.tagId.split('.')[1] : null
          return item
        })
        value.clientGroupTagFilterContent = JSON.stringify({logic: userLogic, express: param || []})
      }

      setOneFormData(value)
      nextStep()
    })
  }

  // 用户筛选类型
  const changeUserLogic = v => {
    setUserLogic(v)
  }

  // 选择事件
  const checkSelectEvent = () => {
    const data = []
    oneForm.validateFields(['clientGroupFilterContent']).then(value => {
      value.clientGroupFilterContent.forEach(item => {
        if (item) {
          data.push(item.event[2])
        }
      })
      setSelectKey(data)
    }).catch(err => {
      console.log(err)
    })
  }

  // 为已选择事件添加disabled
  useEffect(() => {
    const data = originEventList.map(item => {
      if (selectKey.find(jtem => jtem === item.id)) {
        item.disabled = true
      } else {
        item.disabled = false
      }
      return item
    })
    setChannelList(listToTree(data) || [])
  }, [selectKey, originEventList])
  
  useEffect(() => {
    if (!strategyDetail.id) return
    if (strategyDetail.clientGroupFilterType) {
      const {clientGroupUserActionFilterContent, clientGroupFilterType} = strategyDetail
      const list = clientGroupUserActionFilterContent.events.map(item => ({event: [item.channelId, item.accountId, item.eventId]}))
      setClientGroup(list)
      setUserLogic(clientGroupUserActionFilterContent.logic)
      setRadioType(clientGroupFilterType)
    } else {
      const {clientGroupTagFilterContent, clientGroupFilterType} = strategyDetail
      if (clientGroupTagFilterContent) {
        const item = JSON.parse(clientGroupTagFilterContent)
        setUserLogic(item.logic)
        setClientGroup(item.express)
      }
      setRadioType(clientGroupFilterType)
    }
    oneForm.resetFields()
  }, [strategyDetail])
  
  useEffect(() => {
    oneForm.setFieldsValue({clientGroupFilterType: radioType})
  }, [radioType])
  useEffect(() => {
    oneForm.setFieldsValue({clientGroupFilterContent: clientGroup})
  }, [clientGroup])

  return (
    <div 
      style={{display: current === 0 ? 'block' : 'none'}} 
      className="p24 pt0 bgf pr step-one step-content"
    >
      <Form
        name="create-form"
        {...layout}
        form={oneForm}
      >
        <Item
          name="clientGroupFilterType"
          label="筛选类型"
          initialValue={radioType}
          style={{marginBottom: 12}}
        >
          <Radio.Group name="radiogroup" onChange={v => setRadioType(v.target.value)}>
            <Radio value={0}>按用户标签筛选</Radio>
            <Radio value={1}>按用户行为筛选</Radio>
          </Radio.Group>
        </Item>
        <Collapse 
          defaultActiveKey={['1']}
          style={{position: 'relative'}}
        >
          <Panel 
            header={(
              <div className="FBH header-select">
                {radioType ? '用户行为属性满足' : '用户实体属性满足'}
                <Select 
                  value={userLogic}
                  style={{width: 72, margin: '4px'}} 
                  onClick={e => e.stopPropagation()}
                  onChange={changeUserLogic}
                >
                  <Option value="OR">任意</Option>
                  <Option value="AND">全部</Option>
                </Select>
              </div>
              // '用户实体属性满足'
            )} 
            key="1"
          >
            <List
              name="clientGroupFilterContent"
              initialValue={clientGroup}
            >
              {(fields, {add, remove}) => {
                return (
                  <div>
                    {fields.map(({key, name, fieldKey, ...restField}, index) => {
                      return radioType ? (
                        <div className="pr">
                          <Item
                            {...restField}
                            name={[name, 'event']}
                            fieldKey={[fieldKey, 'event']}
                            rules={[{required: true, message: '请选择事件'}]}
                          >
                            <Cascader
                              placeholder="请选择事件"
                              // options={filterChannelList}
                              options={channelList}
                              expandTrigger="hover"
                              fieldNames={{
                                label: 'name',
                                value: 'id',
                                children: 'children',
                              }}
                              onChange={checkSelectEvent}
                            />
                          </Item>
                          <MinusCircleOutlined 
                            style={{
                              position: 'absolute', fontSize: 16, top: 8, right: 112, color: '#999'}} 
                            onClick={() => remove(name)}
                          />
                        </div>
                      ) : (  
                        <div className="pr user-config">
                          <RuleItem 
                            restField={restField}
                            name={name}
                            fieldKey={fieldKey}
                            objTagList={objTagList}
                            remove={remove}
                            checkSelectEvent={checkSelectEvent}
                            clientGroup={clientGroup[index]}
                          />
                        </div>
                      )
                    })}
                    <div
                      className="add-event-btn fs14 hand"
                      onClick={() => {
                        oneForm.validateFields().then(() => add())
                      }}
                    >
                      <img style={{marginBottom: 1}} src={Attr} alt="属性" />
                      <span className="ml4">添加</span>
                    </div>
                  </div>
                )
              }}
            </List>
          </Panel>
        </Collapse>
      </Form>

      <div className="steps-action">
        <Popconfirm
          title="取消后返回营销计划列表?"
          onConfirm={() => window.location.href = `${window.__keeper.pathHrefPrefix}/sales/list`}
          onCancel={() => {}}
          okText="确认"
          cancelText="取消"
        >
          <Button className="mr8">
            取消
          </Button>
        </Popconfirm>
        <Button type="primary" onClick={complete}>
          下一步
        </Button>
      </div>
    </div>
  )
}

export default CreateSales
