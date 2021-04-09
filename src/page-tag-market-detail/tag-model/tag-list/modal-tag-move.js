import {Component} from 'react'
import {action} from 'mobx'
import {inject, observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../../component'

@inject('bigStore')
@observer
export default class ModalTagMove extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.treeStore = props.treeStore
    this.bigStore = props.bigStore
  }

  selectContent= () => [{
    label: '标签类目',
    key: 'cateId',
    // initialValue: this.store.drawerTagInfo.pathIds && this.store.drawerTagInfo.pathIds.length ? this.store.drawerTagInfo.pathIds.slice(1) : undefined,
    component: 'cascader',
    rules: [
      '@requiredSelect',
    ],
    control: {
      options: this.store.tagCateSelectList,
      // valueName: 'id',
      // selectCon: ['isLeaf', 2],
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
  }]

  @action handleCancel = () => {
    this.store.tagApplyVisible = false
  }

  submit = () => {
    const t = this
    const {store} = t

    this.form.validateFields((err, values) => {
      if (!err) {
        const {applyInfo} = store

        const params = {
          // type: applyInfo.type,
          // ids: [applyInfo.id],
          targetId: values.cateId[values.cateId.length - 1],
        }
        // store.tagMove(params, this.bigStore.getTagCateTree)
        store.tagMove(params, this.treeStore.getTagCateTree)
      }
    })
  }

  render() {
    const {
      tagApplyVisible: visible, 
      applyInfo, 
      confirmLoading,
    } = this.store
    const modalConfig = {
      title: '移动至',
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
    
    const formConfig = {
      selectContent: visible && this.selectContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }

    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }
}
