import {useEffect, useState} from 'react'
import {Form, Select, Button, Input, Radio, Collapse, Cascader} from 'antd'
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons'
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
const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const listToTree = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === -1)
}

const CreateSales = ({
  nextStep, current, tagList,
}) => {
  const [oneForm] = Form.useForm()
  const [condCount, setCondCount] = useState(0)
  const [radioType, setRadioType] = useState(0)
  const [condList, setCondList] = useState([true])
  const [filterChannelList, setFilterChannelList] = useState([]) // 行为筛选事件
  const [originEventList, setOriginEventList] = useState([]) // 行为筛选事件打平
  const [promptTags, setPromptTags] = useState([]) // 标签预提示

  // 获取目标事件
  const getFilterChannelList = async () => {
    try {
      const res = await io.getFilterChannelList()
      setOriginEventList(res || [])
      setFilterChannelList(listToTree(res || []))
    } catch (error) {
      errorTip(error.message)
    }
  }
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

  const complete = () => {
    nextStep()
    console.log(condList)
    console.log(condList.map(item => (!!item)))

    // oneForm.validateFields().then(value => {
    //   console.log(value)
    // })
  }

  const changeConditions = index => {
    const cDate = [...condList]
    cDate[index] = !cDate[index]
    setCondList(cDate)
  }

  const onChange = value => {
    console.log(value)
  }
  
  // useEffect(() => {
  //   if (condCount) {
  //     const newDate = []
  //     for (let i = 0; i < condCount; i++) {
  //       newDate.push(true)
  //     }
  //     setCondList(newDate)
  //   }
  // }, [condCount])

  useEffect(() => {
    console.log(condList)
  }, [condList])
  useEffect(() => {
    getFilterChannelList()
  }, [])
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
          name="type"
          label="筛选类型"
          initialValue={0}
          style={{marginBottom: 12}}
        >
          <Radio.Group name="radiogroup" onChange={v => setRadioType(v.target.value)}>
            <Radio value={0}>按用户标签筛选</Radio>
            <Radio value={1}>按用户行为筛选</Radio>
          </Radio.Group>
        </Item>
        <Collapse 
          // style={{width: 'calc(100% + 48px)', marginLeft: '-24px'}} 
          defaultActiveKey={['1']}
          style={{position: 'relative'}}
        >
          <Panel header={radioType ? '用户行为属性满足' : '用户实体属性满足'} key="1">
            <List
              name="clientGroupFilterContent"
              initialValue={[{one: undefined, tow: undefined, three: undefined}]}
              // initialValue={data}
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
                          {index ? (
                            <div className="conditions-div">
                              <span 
                                className="conditions-btn hand"
                                onClick={() => changeConditions(index)}
                                // style={{position: 'relative', top: '11px', right: '24px'}}
                              >
                                {condList[index] ? '或' : '且'}
                              </span>
                            </div>
                          ) : null}
                          <Input.Group compact style={{marginLeft: '48px'}}>
                            <Item
                              {...restField}
                              name={[name, 'one']}
                              fieldKey={[fieldKey, 'one']}
                              rules={[{required: true, message: '请选择标签'}]}
                            >
                              <Select style={{width: 160}} placeholder="请选择标签" onChange={getPromptTag}>
                                {
                                  tagList.map(item => <Option value={item.objIdTagId}>{item.objNameTagName}</Option>)
                                }
                              </Select>
                            </Item>
                            <Item
                              {...restField}
                              name={[name, 'two']}
                              fieldKey={[fieldKey, 'two']}
                              rules={[{required: true, message: '请选择条件'}]}
                            >
                              <Select style={{width: 128}} placeholder="请选择条件">
                                <Option value="not in">不等于</Option>
                                <Option value="in">等于</Option>
                              </Select>
                            </Item>
                            <Item
                              {...restField}
                              name={[name, 'three']}
                              fieldKey={[fieldKey, 'three']}
                              rules={[{required: true, message: '请输入或选择'}]}
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
                        setCondList([...condList, true])
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
