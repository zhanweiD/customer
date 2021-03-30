// 基础信息
import {Component} from 'react'
import {
  Input, Select, Button,
} from 'antd'
import {Form} from '@ant-design/compatible'
import {action} from 'mobx'
import {observer} from 'mobx-react'

const FormItem = Form.Item
const Option = {Select}
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 10},
}

@Form.create()
@observer
export default class BaseInfo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // @action.bound selectObj(e) {
  //   this.store.objId = e
  // }

  // @action.bound selectAssObj(e) {
  //   this.store.assObjId = e
  // }

  backTagApp = () => {
    window.history.back()
  }

  @action.bound next() {
    const {form: {validateFields}} = this.props
    const {detailBaseInfo, objId} = this.store
    const t = this

    validateFields((err, params) => {
      if (err) {
        return
      }
      params.objId = objId
      if (detailBaseInfo.id) {
        params.id = detailBaseInfo.id
        t.store.updateBaseInfo(params)
      } else {
        t.store.saveBaseInfo(params)
      }
    })
  }

  checkName = (rule, value, callback) => {
    const {detailBaseInfo, objId} = this.store

    const params = {
      name: value,
      objId,
    }

    if (detailBaseInfo.id) {
      params.id = detailBaseInfo.id
    }

    this.store.checkName(params, callback)
  }

  render() {
    const {
      form: {
        getFieldDecorator,
      },
      show,
    } = this.props

    const {
      objList,
      assObjList,
      detailBaseInfo,
    } = this.store

    return (
      <div className="mt32" style={{display: show ? 'block' : 'none', height: '100%'}}>
        <Form>
          <FormItem {...formItemLayout} label="方案名称">
            {getFieldDecorator('name', {
              initialValue: detailBaseInfo.name,
              rules: [
                {transform: value => value && value.trim()},
                {required: true, message: '方案名称不能为空'},  
                {max: 32, message: '输入不能超过32个字符'},
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input size="small" autoComplete="off" placeholder="请输入方案名称" />
            )}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="所属对象">
            {getFieldDecorator('objId', {
              initialValue: detailBaseInfo.objId,
              rules: [{required: true, message: '请选择所属对象'}],
            })(
              <Select 
                placeholder="请选择所属对象" 
                style={{width: '100%'}} 
                onSelect={v => this.selectObj(v)}
              >
                {
                  objList.map(item => (
                    <Option key={item.objId} value={item.objId}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem> */}

          <FormItem {...formItemLayout} label="方案描述">
            {getFieldDecorator('descr', {
              initialValue: detailBaseInfo.descr,
              rules: [
                {transform: value => value && value.trim()},
                {max: 128, whitespace: true, message: '输入不能超过128个字符'},
              ],
            })(
              <TextArea placeholder="请输入方案描述" />
            )}
          </FormItem>
        </Form>
        <div className="bottom-button">
          {/* <Button style={{marginRight: 16}} onClick={this.backTagApp}>返回</Button> */}
          <Button
            type="primary"
            onClick={this.next}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
