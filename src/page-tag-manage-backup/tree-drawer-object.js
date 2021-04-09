import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Button, Drawer, Input, Select} from 'antd'
import {getNamePattern, getEnNamePattern, nameTypeMap} from '../common/util'

const FormItem = Form.Item
const Option = {Select}
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
  colon: false,
}

@inject('store')
@Form.create()
@observer
class ModalObject extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  /**
   * @description 中英文名 重名校验
   */
  @action checkName = (rule, value, callback) => {
    const {
      objDetail,
      isAdd,
    } = this.store

    const params = {
      name: value,
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名
    }

    if (rule.field === 'tagName' || rule.field === 'tagEnName') {
      params.type = 2 // 校验主标签
    } else {
      params.type = 1 // 校验主标签
      params.id = objDetail.id
    }

    if (!isAdd) {
      if (rule.field === 'name' || rule.field === 'enName') {
        params.id = objDetail.id
      }

      if (rule.field === 'tagName' || rule.field === 'tagEnName') {
        params.id = objDetail.tagId
      }
    }
   
    this.store.checkName(params, callback)
  }

  @action.bound handleCancel() {
    this.store.visible = false
    this.store.confirmLoading = false
  }

  submit = () => {
    const t = this
    const {store} = t

    const {
      isAdd,
      objDetail,
    } = store

    const {form: {validateFields}} = this.props
    validateFields((err, values) => {
      if (!err) {
        const param = {
          ...values,
          objTypeCode: 4,
          type: 2,
        }
        // 编辑 
        if (!isAdd) {
          const params = {id: objDetail.id, ...param}
          store.editNode(params, () => {
            t.handleCancel()
            // 编辑节点为当前选中节点
            if (objDetail.id === t.store.objId) {
              // 刷新对象详情
              t.store.updateDetailKey = Math.random()
            }
          })
        } else {
          // 新增
          store.addNode(param, () => {
            t.handleCancel()
            t.store.objId = store.objId
          })
        }
      }
    })
  }

  render() {
    const {
      form: {
        getFieldDecorator,
      },
      store: {
        objDetail,
        visible,
        confirmLoading,
      },
    } = this.props

    const {
      isAdd,
    } = this.store

    const data = isAdd ? {objCatId: objDetail.id, objCatName: objDetail.name} : objDetail

    // 抽屉配置
    const drawerConfig = {
      title: isAdd ? '新建对象' : '编辑对象',
      visible,
      closable: true,
      width: 560,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.handleCancel,
      className: 'object-drawer',
    }
    
    return (
      <Drawer
        {...drawerConfig}
      >
        <Form>
          <h4 className="mb24">基础信息</h4>
          <FormItem {...formItemLayout} label="对象名称">
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [
                // {required: true, message: '对象名称不能为空'},
                ...getNamePattern(),
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input size="small" autoComplete="off" placeholder="请输入对象名称" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="对象标识">
            {getFieldDecorator('enName', {
              initialValue: data.enName,
              rules: [
                // {required: true, message: '对象标识不能为空'},
                ...getEnNamePattern(),
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input size="small" autoComplete="off" placeholder="请输入对象标识" />
            )}
          </FormItem>
          
          <FormItem {...formItemLayout} label="对象描述">
            {getFieldDecorator('descr', {
              initialValue: data.descr,
              rules: [
                {transform: value => value && value.trim()},
                {max: 128, whitespace: true, message: '输入不能超过128个字符'},
              ],
            })(
              <TextArea placeholder="请输入对象描述" />
            )}
          </FormItem>

          <h4 className="mb24">主标签配置</h4>
          <FormItem {...formItemLayout} label="标签名称">
            {getFieldDecorator('tagName', {
              initialValue: data.tagName,
              rules: [
                // {required: true, message: '标签名称不能为空'},
                ...getNamePattern(),
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input size="small" autoComplete="off" placeholder="请输入标签名称" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="标签标识">
            {getFieldDecorator('tagEnName', {
              initialValue: data.tagEnName,
              rules: [
                // {required: true, message: '标签标识不能为空'},
                ...getEnNamePattern(),
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input size="small" autoComplete="off" placeholder="请输入标签标识" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="数据类型">
            {getFieldDecorator('tagValueType', {
              initialValue: data.tagValueType || 4,
              rules: [{required: true, message: '请选择数据类型'}],
            })(
              <Select size="small" placeholder="请选择数据类型" showSearch optionFilterProp="children">
                {
                  window.njkData.dict.dataType.map(item => (
                    <Option style={{fontSize: '12px'}} key={item.key} value={item.key}>{item.value}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="业务逻辑">
            {getFieldDecorator('tagDescr', {
              initialValue: data.tagDescr,
              rules: [
                {transform: value => value && value.trim()},
                {max: 128, whitespace: true, message: '输入不能超过128个字符'},
              ],
            })(
              <TextArea placeholder="请输入业务逻辑" />
            )}
          </FormItem>
        </Form>

        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={this.handleCancel}>取消</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.submit}
            loading={confirmLoading}
          >
            确定
          </Button>
        </div>
      </Drawer>
    )
  }
}

export default ModalObject
