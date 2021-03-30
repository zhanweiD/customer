/**
 * @description 单项item
 */
import {useState} from 'react'
import {Select, Input, Form, Tooltip, DatePicker} from 'antd'
import {IconDel, IconTreeAdd} from '../../icon-comp'
import {functionList, condition, entityFunctionList, textCondition} from './util'
import io from '../rule-create/io'
import {getNamePattern} from '../../common/util'

const {Option} = Select
const {RangePicker} = DatePicker
const FormItem = Form.Item
const dateFormat = 'YYYY/MM/DD'

const RuleItem = ({
  pos = [], 
  delCon, 
  flag,
  addCombineCon,
  addCombineItem,
  ruleIfBoxKey,
  ruleType,
  configTagList = [],
  drawerConfigTagList = [],
  relList = [],
  otherEntity = [],
  openDrawer,
  formRef,
  changeRelWithRuleConfig,
  stepOneObjId,
  editTagId,
  ...rest
}) => {
  // const ctx = OnerFrame.useFrame()
  // const projectId = ctx.useProjectId()

  const [relTagList, changeRelTagList] = useState([])
  const [tagList, changeTagList] = useState(ruleType === 'set-rule' ? drawerConfigTagList : configTagList)

  // render
  const [entityTagList, changeEntityTagList] = useState(tagList)
  const [relRenderTag, changeRelRenderTag] = useState([])

  const [functionRList] = useState((ruleType === 'config' && +ruleIfBoxKey.slice(-1) === 1) ? entityFunctionList : functionList)

  const [relId, changeRelId] = useState()
  // 比较符
  const [editObj] = entityTagList.filter(d => d.objIdTagId === editTagId) // 编辑时标签对象
  let delComparisonMap = condition
  if (editObj) {
    delComparisonMap = editObj.tagType === 3 || editObj.tagType === 4 ? textCondition : condition
  }
  const [comparisonMap, changeComparisonMap] = useState(delComparisonMap)
  const [functionType, changeFunctionType] = useState('count')

  // tag type
  const [tagType, changeTagType] = useState(4)
  const [operatType, changeOperatType] = useState('=')

  const posStyle = {
    left: pos[0],
    top: pos[1],
  }

  const levelEnd = rest.level[rest.level.length - 1]

  const key = `${ruleIfBoxKey}-${flag}`

  // 选择函数
  const onSelectFun = e => {
    const [obj] = functionRList.filter(d => d.value === e)
    changeFunctionType(() => obj.value)

    if (+ruleIfBoxKey.slice(-1) === 1) {
      const newTagList = relTagList.filter(d => obj.tagTypeList.includes(d.tagType))
      changeRelRenderTag(newTagList)
    } else {
      const newTagList = tagList.filter(d => obj.tagTypeList.includes(d.tagType))
      changeEntityTagList(newTagList)
    }

    const key = `${ruleIfBoxKey}-${flag}`
    const keyData = formRef.current.getFieldValue(key)

    formRef.current.setFieldsValue({
      [key]: {
        ...keyData,
        leftTagId: undefined,
      },
    })
  }

  // 根据对象获取标签数据
  async function getRelTagList(id) {
    const res = await io.getConfigTagList({
      // projectId,
      relationId: id,
      objId: stepOneObjId,
    })
    changeRelTagList(res)
    changeRelRenderTag(res)
  }

  const open = () => {
    openDrawer(key, relId)
  }

  // 选择关系对象
  const onSelectRel = id => {
    if (+relId !== +id) {
      if (relId && ruleType === 'config') {
        changeRelWithRuleConfig(id)
      } 
      changeRelId(id)
      getRelTagList(id)
    }
  }

  // 选择标签
  const onSelectTag = (e, item) => {
    changeTagType(item.tagType)
    let obj = {}
    if (+ruleIfBoxKey.slice(-1) === 1) {
      [obj] = entityTagList.filter(d => d.objIdTagId === e)
    } else {
      [obj] = entityTagList.filter(d => d.objIdTagId === e)
    }
    // if (obj.tagType === 4 && functionType !== 'count') {
    if (obj.tagType === 4) {
      changeComparisonMap(textCondition)
    } else {
      changeComparisonMap(condition)
    }

    const key = `${ruleIfBoxKey}-${flag}`
    const keyData = formRef.current.getFieldValue(key)

    formRef.current.setFieldsValue({
      [key]: {
        ...keyData,
        comparision: '=',
      },
    })
  }

  if (!rest.relId && otherEntity[0] && otherEntity[0].objId && typeof relId === 'undefined') {
    changeRelId(otherEntity[0].objId)
    getRelTagList(otherEntity[0].objId)
  }

  if (rest.relId && typeof relId === 'undefined') {
    changeRelId(rest.relId)
    getRelTagList(rest.relId)
  }

  const selectCondit = v => {
    changeOperatType(v)
  }

  // 生成form item
  const setConditValue = () => {
    // 数值型 介于 输入最大最小值 其余单input
    if (tagType === 2) {
      if (operatType === 'in') {
        return ([
          <FormItem
            label={null}
            name={[key, 'rightParams']}
            rules={[{required: true, message: '不能为空'}, ...getNamePattern()]}
            initialValue={rest.rightParams}
          >
            <Input size="small" placeholder="最小值" style={{width: 120}} disabled={rest.page === 'detail'} />
          </FormItem>,
          <FormItem
            label={null}
            name={[key, 'rightParamsMax']}
            rules={[{required: true, message: '不能为空'}, ...getNamePattern()]}
            initialValue={rest.rightParams}
          >
            <Input size="small" placeholder="最大值" style={{width: 120}} disabled={rest.page === 'detail'} />
          </FormItem>,
        ])
      } 
      return ([
        <FormItem
          label={null}
          name={[key, 'rightParams']}
          rules={[{required: true, message: '不能为空'}, ...getNamePattern()]}
          initialValue={rest.rightParams}
        >
          <Input size="small" placeholder="请输入" style={{width: 120}} disabled={rest.page === 'detail'} />
        </FormItem>,
      ])
    } 

    // 枚举型 等于不等于 select 其他 input
    if (tagType === 3) {
      if (operatType === '=' || operatType === '!=') {
        return ([
          <FormItem
            label={null}
            name={[key, 'rightParams']}
            rules={[{required: true, message: '不能为空'}]}
            initialValue={rest.rightParams}
          >
            <Select size="small" placeholder="请选择" style={{width: 120}} disabled={rest.page === 'detail'}>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
            </Select>
          </FormItem>,
        ])
      } 

      return ([
        <FormItem
          label={null}
          name={[key, 'rightParams']}
          rules={[{required: true, message: '不能为空'}, ...getNamePattern()]}
          initialValue={rest.rightParams}
        >
          <Input size="small" placeholder="请输入" style={{width: 120}} disabled={rest.page === 'detail'} />
        </FormItem>,
      ])
    }

    // 文本型 input
    if (tagType === 4) {
      return ([
        <FormItem
          label={null}
          name={[key, 'rightParams']}
          rules={[{required: true, message: '不能为空'}, ...getNamePattern()]}
          initialValue={rest.rightParams}
        >
          <Input size="small" placeholder="请输入" style={{width: 120}} disabled={rest.page === 'detail'} />
        </FormItem>,
      ])
    }

    // 日期型 介于双DatePicker 其他单DatePicker
    if (tagType === 5) {
      if (operatType === 'in') {
        return ([
          <FormItem
            label={null}
            name={[key, 'rightParams']}
            rules={[{required: true, message: '不能为空'}]}
            initialValue={rest.rightParams}
          >
            <RangePicker
              style={{width: 240}}
              format={dateFormat}
              disabled={rest.page === 'detail'}
              size="small"
            />
          </FormItem>,
        ])
      }
      return ([
        <FormItem
          label={null}
          name={[key, 'rightParams']}
          rules={[{required: true, message: '不能为空'}]}
          initialValue={rest.rightParams}
        >
          <DatePicker size="small" style={{width: 120}} disabled={rest.page === 'detail'} />
        </FormItem>,
      ])
    }
  }
  
  // console.log(props)
  return (  
    <div className="rule-item" style={posStyle}>
      <Form.Item>
        <Input.Group compact>
          {/* {
            ruleType === 'set-rule' && +ruleIfBoxKey.slice(-1) === 1 ? (
              <FormItem
                label={null}
                size="small"
                name={[key, 'relId']}
                initialValue={rest.relId || (otherEntity[0] && otherEntity[0].objId)}
                rules={[{required: true, message: '请选择'}]}
              >
                <Select 
                  showSearch
                  style={{width: 170}}
                  optionFilterProp="children"
                  placeholder="请选择"
                  onSelect={onSelectRel}
                  disabled={rest.page === 'detail'}
                >
                  {
                    otherEntity.map(d => <Option value={d.objId}>{d.objName}</Option>)
                  }
                </Select>
              </FormItem>
            ) : null
          } */}
          {/* {
            ruleType === 'config' && +ruleIfBoxKey.slice(-1) === 1 && rest.page !== 'detail' ? (
              <Tooltip title="更换关系对象会导致已设置的筛选条件被删除!">
                <FormItem
                  label={null}
                  name={[key, 'relId']}
                  rules={[{required: true, message: '请选择关系'}]}
                  initialValue={rest.relId}
                >
                  <Select
                    showSearch
                    style={{width: 170}}
                    optionFilterProp="children"
                    placeholder="请选择关系"
                    onChange={onSelectRel}
                    disabled={rest.page === 'detail'}
                  >
                    {
                      relList.map(d => <Option value={d.objId}>{d.objName}</Option>)
                    }
                  </Select>
                </FormItem>
              </Tooltip>
            ) : null
          }

          {
            ruleType === 'config' && +ruleIfBoxKey.slice(-1) === 1 && rest.page === 'detail' ? (
              <FormItem
                label={null}
                name={[key, 'relId']}
                rules={[{required: true, message: '请选择关系'}]}
                initialValue={rest.relId}
              >
                <Select
                  showSearch
                  style={{width: 170}}
                  optionFilterProp="children"
                  placeholder="请选择关系"
                  onChange={onSelectRel}
                  disabled={rest.page === 'detail'}
                >
                  {
                    relList.map(d => <Option value={d.objId}>{d.objName}</Option>)
                  }
                </Select>
              </FormItem>
            ) : null
          } */}
          {/* <FormItem
            label={null}
            name={[key, 'leftFunction']}
            rules={[{required: true, message: '请选择函数'}]}
            initialValue={rest.leftFunction || (functionRList.length === 2 ? '标签值' : 'count')}
          >
            <Select 
              showSearch
              style={{width: 90}}
              optionFilterProp="children"
              placeholder="选择函数"
              onSelect={onSelectFun}
              disabled={rest.page === 'detail'}
            >
              {
                functionRList.map(d => <Option value={d.value}>{d.name}</Option>)
              }
            </Select>
          </FormItem> */}
          {
            +ruleIfBoxKey.slice(-1) === 1 ? (
              <FormItem
                label={null}
                name={[key, 'leftTagId']}
                rules={[{required: true, message: '请选择标签'}]}
                initialValue={rest.leftTagId}
              >
                <Select 
                  showSearch
                  style={{width: 170}}
                  // optionFilterProp="children"
                  placeholder="选择标签"
                  disabled={rest.page === 'detail'}
                  onSelect={onSelectTag}
                  filterOption={(input, option) => option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    entityTagList.map(d => (
                      <Option tagType={d.tagType} value={d.objIdTagId} name={d.objNameTagName}>
                        <div title={d.objNameTagName} className="omit">{d.objNameTagName}</div>
                      </Option>
                    ))}
                </Select>
              </FormItem>
            ) : (
              <FormItem
                label={null}
                name={[key, 'leftTagId']}
                rules={[{required: true, message: '请选择标签'}]}
                initialValue={rest.leftTagId}
              >
                <Select 
                  showSearch
                  style={{width: 170}}
                  optionFilterProp="children"
                  placeholder="选择标签"
                  disabled={rest.page === 'detail'}
                  onSelect={onSelectTag}
                  filterOption={(input, option) => option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    entityTagList.map(d => (
                      <Option tagType={d.tagType} value={d.objIdTagId} name={d.objNameTagName}>
                        <div title={d.objNameTagName} className="omit">{d.objNameTagName}</div>
                      </Option>
                    ))}
                </Select>
              </FormItem>
            )
          }
           
          <FormItem
            label={null}
            name={[key, 'comparision']}
            initialValue={rest.comparision || '='}
          >
            <Select 
              showSearch
              style={{width: 90}}
              optionFilterProp="children"
              disabled={rest.page === 'detail'}
              onChange={selectCondit}
            >
              {
                comparisonMap.map(d => <Option value={d.value}>{d.name}</Option>)
              }
         
            </Select>
          </FormItem>
          {/* <FormItem
            label={null}
            name={[key, 'rightFunction']}
            initialValue={rest.rightFunction || '固定值'}
          >
            <Select style={{width: 90}} disabled={rest.page === 'detail'}>
              <Option value="固定值">固定值</Option>
            </Select>
          </FormItem> */}
          {
            setConditValue()
          }
          {/* <FormItem
            label={null}
            name={[key, 'rightParams']}
            rules={[{required: true, message: '不能为空'}, ...getNamePattern()]}
            initialValue={rest.rightParams}
          >
            <Input size="small" placeholder="请输入" style={{width: 120}} disabled={rest.page === 'detail'} />
          </FormItem> */}

          {
            rest.page === 'detail' ? null : (
              <FormItem label={null}>
                <div className="FBH fs14" style={{color: '#919eab'}}>
                  {
                    +ruleIfBoxKey.slice(-1) === 1 
                && ruleType === 'config' 
                && relId 
                      ? <a href onClick={open} className="ml8 fs12">设置筛选</a> : null
                  }

                  {
                    rest.level.length === 3 && rest.isEnd ? <IconTreeAdd size="14" onClick={() => addCombineItem()} className="ml8" /> : null
                  }

                  {
                    rest.level.length === 2 ? <IconTreeAdd size="14" onClick={() => addCombineCon()} className="ml8" /> : null
                  }
              
                  {/* {

                    rest.level.length === 1 ? null : rest.level.length === 3 
                      ? <IconTreeAdd size="14" onClick={() => addCombineItem()} className="ml8" /> 

                      : <IconTreeAdd size="14" onClick={() => addCombineCon()} className="ml8" />

                  } */}
                  {/* <IconDel size="14" className="ml8" onClick={() => delCon()} style={{right: '0px'}} /> */}
                  {
                    rest.len === 1 ? <IconDel size="14" className="ml8" onClick={() => delCon()} style={{right: '0px'}} /> : null
                  }
                  {
                    levelEnd === 0
                      ? null 
                      : <IconDel size="14" className="ml8" onClick={() => delCon()} style={{right: '0px'}} />
                  }
                  
                </div>
            
              </FormItem>
            )
          }

          {
            rest.page === 'detail'  
            && +ruleIfBoxKey.slice(-1) === 1 
            && ruleType === 'config' 
            && relId ? <a href onClick={open} className="ml8 fs12 mt8">查看筛选</a> : null
          }
         
          
        </Input.Group>
       
      </Form.Item>
        
    </div>
  )
}

export default RuleItem
