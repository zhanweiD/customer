import {useEffect, useState} from 'react'
import {Form, Select, Button, Input} from 'antd'
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons'

const {Item, List} = Form
const {Option} = Select 
const layout = {
  labelCol: {
    offset: 1,
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
}
const data = [
  {
    one: '0',
    two: '0',
    three: '0',
    conditions: false,
  },
  {
    one: '0',
    two: '0',
    three: '0',
    conditions: false,
  },
  {
    one: '1',
    two: '1',
    three: '1',
    conditions: false,
  },
]

const CreateSales = () => {
  const [oneForm] = Form.useForm()
  const [condCount, setCondCount] = useState(0)
  const [condList, setCondList] = useState([true])

  const complete = () => {
    console.log(condList)
    console.log(condList.map(item => (!!item)))

    oneForm.validateFields().then(value => {
      console.log(value)
    })
  }

  const changeConditions = index => {
    const cDate = [...condList]
    cDate[index] = !cDate[index]
    setCondList(cDate)
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

  return (
    <div>
      <Form
        name="create-form"
        {...layout}
        form={oneForm}
      >
        <List
          name="triggerEventList"
          initialValue={[{one: undefined, tow: undefined, three: undefined}]}
          // initialValue={data}
        >
          {(fields, {add, remove}) => {
            return (
              <div>
                {fields.map(({key, name, fieldKey, ...restField}, index) => {
                  return (
                    <div>
                      {index ? (
                        <Button 
                          id={`btn-${index}`}
                          className="conditions-btn"
                          onClick={() => changeConditions(index)}
                          style={{position: 'relative', top: '-12px'}}
                        >
                          {condList[index] ? '或' : '且'}
                        </Button>
                      ) : null}
                      <Input.Group id={`item-${index}`} compact style={{marginLeft: '48px'}}>
                        <Item
                          {...restField}
                          name={[name, 'one']}
                          fieldKey={[fieldKey, 'one']}
                          rules={[{required: true, message: 'Missing first name'}]}
                        >
                          <Select style={{width: 160}} placeholder="First Name">
                            <Option value="0">全部</Option>
                            <Option value="1">测试</Option>
                          </Select>
                        </Item>
                        <Item
                          {...restField}
                          name={[name, 'two']}
                          fieldKey={[fieldKey, 'two']}
                          rules={[{required: true, message: 'Missing last name'}]}
                        >
                          <Select style={{width: 160}} placeholder="First Name">
                            <Option value="0">全部</Option>
                            <Option value="1">测试</Option>
                          </Select>
                        </Item>
                        <Item
                          {...restField}
                          name={[name, 'three']}
                          fieldKey={[fieldKey, 'three']}
                          rules={[{required: true, message: 'Missing last name'}]}
                        >
                          <Select mode="tags" style={{width: 160}} placeholder="First Name">
                            <Option value="0">全部</Option>
                            <Option value="1">测试</Option>
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
                <Button
                  type="primary"
                  onClick={() => {
                    add()
                    setCondList([...condList, true])
                  }}
                  style={{width: '40%', marginLeft: '24px', marginBottom: '24px', display: 'block'}}
                  icon={<PlusOutlined />}
                >
                  添加事件
                </Button>
              </div>
            )
          }}
        </List>
      </Form>
      <Button onClick={complete}>
        提交
      </Button>
    </div>
  )
}

export default CreateSales
