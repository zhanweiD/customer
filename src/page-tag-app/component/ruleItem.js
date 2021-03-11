import {Component} from 'react'
import {Select, Input} from 'antd'
import {Form} from '@ant-design/compatible'
import {IconDel} from '../../icon-comp'

const {Option} = Select
const FormItem = Form.Item

const formItemLayout = null

const ruleFunctionList = [{
  name: '标签值',
  value: '标签值',
  tagTypeList: [1, 2, 3, 4, 5, 6],
}]

const functionList = [{
  name: '标签值',
  value: '标签值',
  tagTypeList: [1, 2, 3, 4, 5, 6],
}, {
  name: '绝对值',
  value: 'abs',
  tagTypeList: [2, 3],
}, {
  name: '总记录数',
  value: 'count',
  tagTypeList: [1, 2, 3, 4, 5, 6],
}, {
  name: '求和',
  value: 'sum',
  tagTypeList: [2, 3],
}, {
  name: '平均数',
  value: 'avg',
  tagTypeList: [2, 3],
}, {
  name: '最小值',
  value: 'min',
  tagTypeList: [2, 3],
}, {
  name: '最大值',
  value: 'max',
  tagTypeList: [2, 3],
}]

const condition = [{
  value: '=',
  name: '等于',
}, {
  value: '>',
  name: '大于',
}, {
  value: '>=',
  name: '大于等于',
}, {
  value: '<',
  name: '小于',
}, {
  value: '<=',
  name: '小于等于',
}, {
  value: '!=',
  name: '不等于',
}, 
// {
//   value: 'in',
//   name: '在集合',
// }, {
//   value: 'not in',
//   name: '不在集合',
// }, {
//   value: 'is null',
//   name: '为空',
// }
]

const textCondition = [{
  value: '=',
  name: '等于',
}, {
  value: '!=',
  name: '不等于',
}]

// let conditions = condition

@Form.create()
export default class RuleItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      leftFunction: undefined,
      typeList: [1, 2, 3, 4, 5, 6],
      leftTagId: props.info && props.info.leftTagId,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tagType !== this.props.tagType) {
      this.tagType = this.props.tagType
    }
  }

  onSelect = e => {
    const [fun] = functionList.filter(d => d.value === e)
    if (fun) {
      if (e === 'count') {
        const tag = this.props.tagList.filter(d => d.objMainTag === 1)

        this.props.form.setFieldsValue({leftTagId: tag[0] && tag[0].objIdTagId})
      } else {
        this.props.form.resetFields(['leftTagId'])
      }
     
      this.setState({
        leftFunction: e,
        typeList: fun.tagTypeList,
        leftTagId: undefined,
      })
    }
  }

  // 选择标签
  onSelectTag = tag => {
    console.log(tag.tagType)
    this.tagType = tag.tagType
    this.props.info.comparision = undefined

    this.props.form.resetFields(['comparision'])
  }

  render() {
    const {
      pos = [], 
      delCon, 
      // funcList = [], 
      tagList = [],
      form: {
        getFieldDecorator,
      },
      info,
      type,
    } = this.props

    const posStyle = {
      left: pos[0],
      top: pos[1],
    }

    // 操作符设置
    const conditions = this.tagType === 4 ? textCondition : condition

    const {level} = info

    const {leftFunction, typeList, leftTagId} = this.state

    const tags = leftFunction === 'count' ? tagList.filter(d => d.objMainTag === 1) : tagList.filter(d => typeList.includes(d.tagType))
    return (  
      <div className="rule-item" style={posStyle}>
        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('leftFunction', {
            rules: [
              {required: true, message: '请选择函数'},
            ],
            initialValue: info.leftFunction || '标签值',
          })(
            <Select 
              showSearch
              className="mr8" 
              style={{width: 100}}
              optionFilterProp="children"
              placeholder="选择函数"
              onSelect={this.onSelect}
            >
              {
                type === 'setRule' 
                  ? ruleFunctionList.map(d => <Option value={d.value}>{d.name}</Option>)
                  : functionList.map(d => <Option value={d.value}>{d.name}</Option>)
              }
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('leftTagId', {
            rules: [
              {required: true, message: '请选择标签'},
            ],
            initialValue: leftTagId,
          })(
            <Select 
              showSearch
              className="mr8" 
              onSelect={(tagId, tag) => this.onSelectTag(tag)}
              style={{width: 180}}
              optionFilterProp="children"
              placeholder="选择标签"
            >
              {
                tags.map(d => (
                  <Option tagType={d.tagType} value={d.objIdTagId}>
                    <div title={d.objNameTagName} className="omit">{d.objNameTagName}</div>
                  </Option>
                ))}
         
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('comparision', {
            initialValue: info.comparision || '=',
          })(
            <Select 
              showSearch
              className="mr8" 
              style={{width: 100}}
              optionFilterProp="children"
            >
              {
                conditions.map(d => <Option value={d.value}>{d.name}</Option>)
              }
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('rightFunction', {
            initialValue: info.rightFunction || '固定值',
          })(
            <Select className="mr8" style={{width: 100}}>
              <Option value="固定值">固定值</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('rightParams', {
            initialValue: info.rightParams,
            rules: [
              {required: true, message: '不能为空'},
            ],
          })(
            <Input size="small" placeholder="请输入" style={{width: 120}} />
          )}
        </FormItem>
       
        {
          level[level.length - 1] > 0 && type !== 'detail' ? <IconDel size="16" className="rule-item-action" onClick={() => delCon()} style={{right: '0px'}} /> : null
        }
       
      </div>
    )
  }
}
