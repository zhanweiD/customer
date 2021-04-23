import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Spin} from 'antd'
import {ModalForm} from '../../component'

@observer
export default class ModalAdd extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.store.getObjList()
  }

  @action.bound selectStorageType(type) {
    console.log(this.form)
    this.form.resetFields(['storageId', 'objId'])
    // this.store.getStorageList({
    //   storageType: type,
    // })
  }

  @action.bound selectStorage(id) {
    this.form.resetFields(['objId'])
    this.store.getObjList()
  }

  selectContent = () => {
    const {info, storageType, storageSelectList, storageTypeLoading, storageSelectLoading, objList} = this.store
    return [{
      label: '场景名称',
      key: 'name',
      initialValue: info.name,
      component: 'input',
      rules: [
        '@namePattern',
        '@nameUnderline',
        '@nameShuQi',
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.handleNameValidator},
      ],
    }, 
    {
      label: '对象',
      key: 'objId',
      initialValue: info.objId,
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: toJS(objList),
      },
      component: 'select',
      // extra: <span>
      //   若无可用的对象，请先
      //   <a className="ml4" target="_blank" rel="noopener noreferrer" href="/taghub/index.html/#/tag/sync">去标签同步中添加同步计划</a>
      //        </span>,
    }, {
      label: '描述',
      key: 'descr',
      initialValue: info.descr,
      component: 'textArea',
      rules: [
        '@max128',
      ],
    }]
  }

  @action handleCancel = () => {
    this.store.modalVisible = false
    this.handleReset()
  }

  @action handleReset = () => {
    this.form.resetFields()
    this.store.info = {}
    this.store.isEdit = false
  }

  @action handleSubmit = e => {
    const {store} = this.props

    this.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      if (store.isEdit) {
        store.editScene({
          occasionId: store.info.id,
          ...values,
        }, () => {
          this.handleReset()
        })
      } else {
        store.addScene(values, () => {
          this.handleReset()
        })
      }
    })
  }

  checkName = (rule, value, callback) => {
    const params = {
      name: value,
    }

    if (this.store.info && this.store.info.id) {
      params.id = this.store.info.id
    }

    this.store.checkName(params, callback)
  }

  // 名称查重校验
  @action handleNameValidator = (rule, value = '', callback) => {
    const {info} = this.store
    
    // 后端校验
    const params = {
      name: value,
    }

    if (info.id) {
      params.occasionId = info.id
    }

    this.store.checkName(params, callback)
  }

  render() {
    const {
      store: {
        modalVisible: visible,
        isEdit,
        confirmLoading,
      },
    } = this.props

    const modalConfig = {
      title: isEdit ? '编辑场景' : '添加场景',
      visible,
      onCancel: this.handleCancel,
      onOk: this.handleSubmit,
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
