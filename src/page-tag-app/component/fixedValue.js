import {Component} from 'react'
import {Select, Input} from 'antd'
import {Form} from '@ant-design/compatible'

const {Option} = Select
const FormItem = Form.Item

const formItemLayout = null

const functionList = [{
  name: '标签值',
  value: '标签值',
  tagTypeList: [1, 2, 3, 4, 5, 6],
}, {
  name: '固定值',
  value: '固定值',
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

@Form.create()
export default class FixedValue extends Component {
  constructor(props) {
    super(props)
    this.state = {
      thenFunction: undefined,
      typeList: [1, 2, 3, 4, 5, 6],
      params: props.detail && props.detail.params && props.detail.params[0],
    }
  }

  componentWillReceiveProps(next) {
    const {clearActionKey} = this.props
    const {form: {resetFields}} = this.props

    if (next.clearActionKey && !_.isEqual(clearActionKey, next.clearActionKey)) {
      resetFields()
    }
  }

  onSelect = e => {
    const [fun] = functionList.filter(d => d.value === e)
    
    if (fun) {
      if (e === 'count') {
        const tag = this.props.tagList.filter(d => d.objMainTag === 1)

        this.props.form.setFieldsValue({leftTagId: tag[0] && tag[0].objIdTagId})
      } else {
        this.props.form.resetFields(['thenParams'])
      }

      this.setState({
        thenFunction: e,
        typeList: fun.tagTypeList,
        params: undefined,
      })
    }
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue,
      },
      detail = {},
      tagList = [],
    } = this.props

    const {thenFunction, typeList, params} = this.state

    const tags = thenFunction === 'count' ? tagList.filter(d => d.objMainTag === 1) : tagList.filter(d => typeList.includes(d.tagType))
   
    return (
      <div className="FBH">
        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('thenFunction', {
            initialValue: (detail && detail.function) || '固定值',
          })(
            <Select 
              showSearch
              className="mr8" 
              style={{width: 100}}
              optionFilterProp="children"
              onSelect={e => this.onSelect(e)}
            >
              {
                functionList.map(d => <Option value={d.value}>{d.name}</Option>)
              }
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={null}
        >
          {getFieldDecorator('thenParams', {
            initialValue: params,
            rules: [
              {required: true, message: '请输入'},
            ],
          })(
            getFieldValue('thenFunction') === '固定值' 
              ? <Input size="small" placeholder="请输入" style={{width: 180}} value={params} /> 
              : (
                <Select 
                  showSearch
                  className="mr8" 
                  style={{width: 180}}
                  optionFilterProp="children"
                  placeholder="选择标签"
                  value={params}
                  onSelect={this.selectTag}
                >
                  
                  {tags.map(d => (
                    <Option value={d.objIdTagId}>
                      <div title={d.objNameTagName} className="omit">{d.objNameTagName}</div>
                    </Option>
                  ))}
         
                </Select>
              )
          )}
        </FormItem>
      </div>
    )
  }
}
