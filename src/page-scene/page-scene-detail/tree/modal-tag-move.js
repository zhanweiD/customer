import {Component} from 'react'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Spin, Cascader} from 'antd'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'

const FormItem = Form.Item

@inject('bigStore')
@observer
class ModalTagMove extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = this.bigStore.categoryStore
  }

  @action.bound handleOnCancel() {
    const {form} = this.props
    this.store.tagDetail = false
    this.store.modalVisible.moveTag = false
    form.resetFields()
  }

  @action.bound handleOnOk() {
    const {
      form: {validateFields},
    } = this.props
    const {currentTreeItemKey} = this.store

    validateFields((err, values) => {
      if (!err) {
        const param = {
          treeId: currentTreeItemKey,
          moveCateId: values.objIds.pop(),
        }

        this.store.moveTag(param)
      }
    })
  }

  @action loop(data) {
    return data.map(item => {
      item.label = item.name
      item.value = item.id
      if (item.children && item.children.length) this.loop(item.children)
      return item
    })
  }

  render() {
    const {form: {getFieldDecorator}} = this.props
    const {
      tagDetail, modalVisible, confirmLoading, moveTreeData,
    } = this.store

    const modalProps = {
      title: '移动至',
      visible: modalVisible.moveTag,
      onCancel: this.handleOnCancel,
      onOk: this.handleOnOk,
      maskClosable: false,
      width: 520,
      destroyOnClose: true,
      confirmLoading,
    }

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      colon: false,
    }

    return (
      <Modal {...modalProps}>
        <Form>
          <Spin spinning={this.store.detailLoading}>
            <FormItem {...formItemLayout} label="类目名称">
              {getFieldDecorator('objIds', {
                initialValue: tagDetail.objIds,
                rules: [
                  {required: true, message: '类目名称不可为空'},
                ],
              })(
                <Cascader
                  size="small"
                  placeholder="请选择"
                  allowClear={false}
                  options={this.loop(toJS(moveTreeData))}
                />
              )}
            </FormItem>
          </Spin>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalTagMove)
