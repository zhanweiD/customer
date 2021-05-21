import {Component} from 'react'
import {action, toJS} from 'mobx'
import {inject, observer} from 'mobx-react'
import {Modal} from 'antd'
import _ from 'lodash'
import {Form} from '@ant-design/compatible'
import MultiCascader from 'antd-multi-cascader'
import {ModalForm} from '../../../../component'

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
  colon: false,
}

@inject('bigStore')
@Form.create()
@observer
export default class ModalTagMove extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.treeStore = props.treeStore
    this.bigStore = props.bigStore
  }

  @action handleCancel = () => {
    this.store.updateBizVisible = false
  }

  submit = () => {
    const {form, bigStore, store, treeStore} = this.props

    form.validateFields((err, values) => {
      if (!err) {
        const {biz} = values
        const {bizOriginList} = bigStore
        let bizValue = []

        biz.forEach(item => {
          const target = _.find(bizOriginList, e => e.bizCode === item)
          const parentNode = _.find(bizOriginList, e => e.bizCode === target.parentCode)

          if (!parentNode) {
            // 没找到，说明是第一级
            bizValue.push([target.bizCode])
          } else if (target.parentCode === parentNode.bizCode && parentNode.parentCode === '-1') {
            // 第二级
            bizValue.push([target.parentCode, target.bizCode])
          } else {
            bizValue.push([parentNode.parentCode, target.parentCode, target.bizCode])
          }
        })

        // 去掉【全部】
        bizValue.forEach(item => {
          _.remove(item, e => e === 'ALL')
        })

        // 选择【全部】的情况
        if (JSON.stringify(bizValue) === '[[]]') {
          bizValue = undefined
        }

        store.batchUpdateBiz({
          tagIds: toJS(store.publishRowKeys),
          biz: bizValue,
        }, () => {
          treeStore.getTagCateTree()
          this.store.updateBizVisible = false
        })
      }
    })
  }

  render() {
    const {form: {getFieldDecorator}} = this.props
    
    const {
      updateBizVisible: visible,
      confirmLoading,
    } = this.store
    const modalConfig = {
      title: '设置业务类型',
      visible,
      okText: '确定',
      cancelText: '取消',
      onCancel: this.handleCancel,
      onOk: this.submit,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      confirmLoading,
    }

    return (
      <Modal {...modalConfig}>
        <Form>
          <Form.Item
            label="业务类型"
            name="biz"
            key="biz"
            {...formItemLayout}
          >
            {getFieldDecorator('biz', {
              rules: [
                {required: true, message: '请选择'},
              ],
            })(
              <MultiCascader
                data={toJS(this.bigStore.bizList)}
                placeholder="请选择"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
