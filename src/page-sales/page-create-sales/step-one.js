import {useEffect, useState} from 'react'
import {Form, Select, Button, Input, Radio, Collapse, Cascader} from 'antd'
import {MinusCircleOutlined} from '@ant-design/icons'
import {errorTip} from '@util'
import Attr from '../icon/wechat-attr.svg'
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
  const [condList, setCondList] = useState([1])
  const [promptTags, setPromptTags] = useState([]) // 标签预提示
  const [userLogic, setUserLogic] = useState('OR') // 用户筛选关系
  const [clientGroup, setClientGroup] = useState([{tagId: undefined, comparision: undefined, rightParams: undefined}]) // 用户筛选详情
  
  // 标签值预提示
  async function getPromptTag(objIdAndTagId) {
    try {
      const res = await io.getPromptTag({
        objIdAndTagId,
      })
      // console.log(res)
      setPromptTags(res)
    } catch (error) {
      console.log(error)
    }
  }

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

  const complete = () => {
    oneForm.validateFields().then(value => {
      console.log(value)
      if (value.clientGroupFilterType) {
        const events = value.clientGroupFilterContent.map(item => matchEnent(item.event))
        value.clientGroupUserActionFilterContent = {events}
      } else if (value.clientGroupFilterContent[0].tagId) {
        const param = value.clientGroupFilterContent.map(item => {
          item.leftTagId = item.tagId ? item.tagId.split('.')[1] : null
          return item
        })
        value.clientGroupTagFilterContent = JSON.stringify({logic: userLogic, express: param})
      }
      // const param = {
      //   ...strategyDetail,
      //   ...value,
      // }
      setOneFormData(value)
      // delete param.clientGroupFilterContent
      // setStrategyDetail(param)
      nextStep()
    })
  }

  const onChange = value => {
    console.log(value)
  }

  const changeUserLogic = v => {
    setUserLogic(v)
  }
  
  useEffect(() => {
    if (!strategyDetail.id) return
    if (strategyDetail.clientGroupFilterType) {
      const {clientGroupUserActionFilterContent, clientGroupFilterType} = strategyDetail
      const list = clientGroupUserActionFilterContent.events.map(item => ({event: [item.channelId, item.accountId, item.eventId]}))
      setClientGroup(list)
      setRadioType(clientGroupFilterType)
    } else {
      const {clientGroupTagFilterContent, clientGroupFilterType} = strategyDetail
      const item = JSON.parse(clientGroupTagFilterContent)
      setUserLogic(item.logic)
      setClientGroup(item.express)
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
            header={radioType ? '用户行为属性满足' : (
              <div className="FBH header-select">
                用户实体属性满足
                <Select 
                  value={userLogic}
                  style={{width: 72, margin: '8px'}} 
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
                            // rules={[{required: true, message: '请选择事件'}]}
                          >
                            <Cascader
                              placeholder="请选择事件"
                              options={filterChannelList}
                              expandTrigger="hover"
                              fieldNames={{
                                label: 'name',
                                value: 'id',
                                children: 'children',
                              }}
                              onChange={onChange}
                            />
                          </Item>
                          {
                            fields.length > 1 ? (
                              <MinusCircleOutlined 
                                style={{
                                  position: 'absolute', top: 5, right: 112, color: '#999'}} 
                                onClick={() => { 
                                  remove(name) 
                                  const newData = [...condList]
                                  newData.splice(index, 1)
                                  setCondList(newData)
                                }}
                              />
                            ) : null
                          }
                        </div>
                      ) : (  
                        <div className="pr">
                          {/* {index ? (
                            <div className="conditions-div">
                              <span 
                                className="conditions-btn hand"
                                onClick={() => changeConditions(index)}
                                // style={{position: 'relative', top: '11px', right: '24px'}}
                              >
                                {condList[index] ? '或' : '且'}
                              </span>
                            </div>
                          ) : null} */}
                          {/* <Input.Group compact style={{marginLeft: '48px'}}> */}
                          <Input.Group compact>
                            <Item
                              {...restField}
                              name={[name, 'tagId']}
                              fieldKey={[fieldKey, 'tagId']}
                              // rules={[{required: true, message: '请选择标签'}]}
                            >
                              <Select style={{width: 160}} placeholder="请选择标签" onChange={getPromptTag}>
                                {
                                  objTagList.map(item => <Option value={item.id}>{item.name}</Option>)
                                }
                              </Select>
                            </Item>
                            <Item
                              {...restField}
                              name={[name, 'comparision']}
                              fieldKey={[fieldKey, 'comparision']}
                              // rules={[{required: true, message: '请选择条件'}]}
                            >
                              <Select style={{width: 128}} placeholder="请选择条件">
                                <Option value="not in">不等于</Option>
                                <Option value="in">等于</Option>
                              </Select>
                            </Item>
                            <Item
                              {...restField}
                              name={[name, 'rightParams']}
                              fieldKey={[fieldKey, 'rightParams']}
                              // rules={[{required: true, message: '请输入或选择'}]}
                            >
                              <Select mode="tags" style={{width: 160}} placeholder="请输入或选择">
                                {
                                  promptTags.map(item => <Option value={item}>{item}</Option>)
                                }
                              </Select>
                            </Item>
                            {
                              fields.length > 1 ? (
                                <MinusCircleOutlined 
                                  style={{marginLeft: 8, marginTop: 5, color: '#999'}} 
                                  onClick={() => { 
                                    remove(name) 
                                    const newData = [...condList]
                                    newData.splice(index, 1)
                                    setCondList(newData)
                                  }}
                                />
                              ) : null
                            }
                          </Input.Group>
                        </div>
                      )
                    })}
                    <div
                      className="add-event-btn fs12 hand"
                      onClick={() => {
                        add()
                        setCondList([...condList, 1])
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
        <Button className="mr8" onClick={complete}>
          取消
        </Button>
        <Button type="primary" onClick={complete}>
          下一步
        </Button>
      </div>
    </div>
  )
}

export default CreateSales
