import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Spin} from 'antd'
import {ModalForm} from '../../component'
import {debounce} from '../../common/util'

@observer
export default class GroupModal extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => {
    return [{
      label: '群体名称',
      key: 'name',
      component: 'input',
      rules: [
        '@namePattern',
        '@nameUnderline',
        '@nameShuQi',
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.checkName},
      ],
    }, 
    {
      label: '描述',
      key: 'descr',
      component: 'textArea',
      rules: [
        '@max128',
      ],
    }]
  }

  submit = () => {
    const {store} = this
    this.form.validateFields((err, values) => {
      if (!err) {
        store.saveUnitList(values)
        // store.addList(values, () => {
        //   this.handleCancel()
        // })
      }
    })
  }

  @action handleCancel = () => {
    this.store.visible = false
  }

  @action checkName = (rule, value, callback) => {
    if (value) {
      // 防抖设计
      debounce(() => this.store.checkName(value, callback), 500)
    } else {
      callback()
    }
  }

  render() {
    const {
      visible,
      confirmLoading,
    } = this.store
    const modalConfig = {
      title: '保存群体',
      visible,
      maskClosable: false,
      closable: true,
      confirmLoading,
      onCancel: this.handleCancel,
      onOk: this.submit,
      width: 525,
      destroyOnClose: true,
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
