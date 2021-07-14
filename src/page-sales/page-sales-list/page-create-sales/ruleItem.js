import {useState, useEffect} from 'react'
import {Form, Select, Input} from 'antd'
import {MinusCircleOutlined} from '@ant-design/icons'

import io from './io'

const {Item} = Form
const {Option} = Select

const condition = [{
  value: 'in',
  name: '等于',
}, {
  value: 'gt',
  name: '大于',
}, {
  value: 'gte',
  name: '大于等于',
}, {
  value: 'lt',
  name: '小于',
}, {
  value: 'lte',
  name: '小于等于',
}, {
  value: 'not in',
  name: '不等于',
}]

const textCondition = [{
  value: 'in',
  name: '等于',
}, {
  value: 'not in',
  name: '不等于',
}]

export default ({
  restField,
  name,
  fieldKey,
  objTagList,
  remove,
  checkSelectEvent,
  clientGroup,
}) => {
  const [promptTags, setPromptTags] = useState([])
  const [comparisionDomList, setComparisionDomList] = useState(textCondition)
  // 标签值预提示
  async function getPromptTag(objIdAndTagId) {
    try {
      const res = await io.getPromptTag({
        objIdAndTagId,
      })
      setPromptTags(res)
    } catch (error) {
      console.log(error)
    }
  }

  const changeTag = v => {
    getPromptTag(v)
    if (objTagList.filter(item => item.id === v)[0].tagType === 4) {
      setComparisionDomList(textCondition)
    } else {
      setComparisionDomList(condition)
    }
  } 

  useEffect(() => {
    if (clientGroup && objTagList.length) {
      changeTag(clientGroup.tagId)
    }
  }, [clientGroup, objTagList])

  return (
    <Input.Group compact>
      <Item
        {...restField}
        name={[name, 'tagId']}
        fieldKey={[fieldKey, 'tagId']}
        rules={[{required: true, message: '请选择标签'}]}
      >
        <Select style={{width: 128}} placeholder="请选择标签" onChange={changeTag}>
          {
            objTagList.map(item => <Option value={item.id}>{item.name}</Option>)
          }
        </Select>
      </Item>
      <Item
        {...restField}
        name={[name, 'comparision']}
        fieldKey={[fieldKey, 'comparision']}
        rules={[{required: true, message: '请选择条件'}]}
      >
        <Select style={{width: 128, marginLeft: '8px'}} placeholder="请选择条件">
          {
            comparisionDomList.map(item => <Option value={item.value}>{item.name}</Option>)
          }
        </Select>
      </Item>
      <Item
        {...restField}
        name={[name, 'rightParams']}
        fieldKey={[fieldKey, 'rightParams']}
        rules={[{required: true, message: '请输入或选择'}]}
      >
        <Select 
          mode="tags" 
          className="select-height"
          style={{width: 200, marginLeft: '8px'}} 
          placeholder="请输入或选择"
        >
          {
            promptTags.map(item => <Option value={item}>{item}</Option>)
          }
        </Select>
      </Item>
      <MinusCircleOutlined 
        style={{marginLeft: 8, marginTop: 8, fontSize: 16, color: '#999'}} 
        onClick={() => { 
          remove(name) 
          checkSelectEvent()
        }}
      />
    </Input.Group>
  )
}
