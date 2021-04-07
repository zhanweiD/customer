import {observer} from 'mobx-react'
import {Component} from 'react'
import PropTypes from 'prop-types'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Input, Spin, Select, Switch, Cascader} from 'antd'
import {isJsonFormat, enNameReg, getNamePattern, getEnNamePattern, debounce} from '../../common/util'
import store from './store-tag'

const FormItem = Form.Item
const {Option} = Select
const nameTypeMap = {
  name: 1,
  enName: 2,
}

@observer
class ModalTagEdit extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired, // 是否可见
    onCancel: PropTypes.func.isRequired, // 关闭弹框回调
    onOk: PropTypes.func.isRequired, // 点击确定的回调
  }

  state = {
    isEnum: this.props.tagDetail.isEnum || false, // 是否枚举
    confirmLoading: false, // 确认按钮加载状态
  }

  // 改变是否枚举值
  changeIsEnum(v) {
    this.setState({
      isEnum: v,
    })
  }

  render() {
    const {
      form: {getFieldDecorator}, 
      tagDetail,
      visible,
      onCancel,
      cateList = [],
      title,
    } = this.props

    const {isEnum, confirmLoading} = this.state

    const modalProps = {
      title: title || '编辑标签',
      visible,
      onCancel,
      onOk: this.handleOk,
      maskClosable: false,
      width: 520,
      destroyOnClose: true,
      confirmLoading,
      okText: '确定',
      cancelText: '取消',
    }

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      colon: false,
    }

    // 默认类目
    const defaultCate = cateList.filter(d => d.aId === -1)
    const defaultCateV = defaultCate.length ? [defaultCate[0].id] : undefined
    let pathIds = []
    if (tagDetail.pathIds) {
      if (tagDetail.pathIds.length > 1) {
        pathIds = tagDetail.pathIds.slice(1)
      } else {
        pathIds = tagDetail.pathIds
      }
    } else {
      pathIds = defaultCateV
    }
    return (
      <Modal {...modalProps}>
        <Form>
          <Spin spinning={false}>
            <FormItem {...formItemLayout} label="标签名称">
              {getFieldDecorator('name', {
                initialValue: tagDetail.name || undefined,
                rules: [
                  // {required: true, message: '名称不可为空'},
                  ...getNamePattern(),
                  {validator: this.checkName},
                ],
              })(<Input size="small" autoComplete="off" placeholder="不超过32个字，允许中文、英文、数字或下划线" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="标签标识">
              {getFieldDecorator('enName', {
                initialValue: tagDetail.enName || undefined,
                rules: [
                  // {required: true, message: '标签标识不可为空'},
                  ...getEnNamePattern(),
                  {validator: this.checkName},
                ],
              })(<Input size="small" autoComplete="off" placeholder="不超过32个字，允许英文、数字或下划线，必须以英文开头" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="是否枚举">
              {getFieldDecorator('isEnum', {
                initialValue: tagDetail.isEnum || 0,
                valuePropName: 'checked',
              })(<Switch size="small" checkedChildren="是" unCheckedChildren="否" onChange={v => this.changeIsEnum(v)} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="数据类型">
              {getFieldDecorator('valueType', {
                initialValue: +tagDetail.valueType || undefined,
                rules: [{required: true, message: '请选择数据类型'}],
              })(
                <Select placeholder="请下拉选择" showSearch optionFilterProp="children">
                  {
                    window.njkData.dict.dataType.map(item => (
                      <Option key={item.key} value={item.key}>{item.value}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="所属类目">
              {getFieldDecorator('pathIds', {
                // initialValue: tagDetail.pathIds ? tagDetail.pathIds.slice(1) : defaultCateV,
                initialValue: pathIds,
              })(
                <Cascader
                  size="small"
                  options={cateList}
                  placeholder="请选择标签类目"
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('descr', {
                rules: [
                  {transform: value => value && value.trim()},
                  {max: 128, message: '业务逻辑不能超过128个字符'},
                ],
                initialValue: tagDetail.descr || undefined,
              })(
                <Input.TextArea
                  autoComplete="off"
                  rows="3"
                  size="small"
                  placeholder="标签表示的业务逻辑，例如“该用户的手机号”，不超过128个字"
                />
              )}
            </FormItem>
          </Spin>
        </Form>
      </Modal>
    )
  }

  // 确定
  handleOk = () => {
    const {form, onOk} = this.props

    form.validateFields((errs, values) => {
      if (!errs) {
        this.setState({
          confirmLoading: true,
        })

        const valuesCopy = {...values}

        // 如果不是枚举值，清空这个字段
        if (!valuesCopy.isEnum) {
          valuesCopy.enumValue = ''
        }

        // 将枚举值字段改成数字
        valuesCopy.isEnum = +valuesCopy.isEnum

        // 调用传入的“确定”回调
        onOk(valuesCopy, () => {
          this.setState({
            confirmLoading: false,
          })
        })
      } else {
        console.log('handleOk Errors: ', errs)
      }
    })
  }

  // 校验枚举值输入
  handleEnumValueValidator(rule, value, callback) {
    if (value) {
      if (!isJsonFormat(value)) {
        callback('请输入正确的JSON格式')
      }
      callback()
    } else {
      callback()
    }
  }

  // 改变是否枚举值
  changeIsEnum(v) {
    this.setState({
      isEnum: v,
    })
  }

  /**
   * @description 重名校验
   */
  checkName = (rule, value, callback) => {
    const params = {
      name: value,
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 标签标识
    }

    if (store.nameKeyWord.includes(value)) {
      callback('名称与关键字重复')
      return 
    }
    
    if (store.tagId) {
      params.id = store.tagId
    }
    // debounce(() => store.checkName(params, callback), 500)
    store.checkName(params, callback)
  }
}

export default Form.create()(ModalTagEdit)
