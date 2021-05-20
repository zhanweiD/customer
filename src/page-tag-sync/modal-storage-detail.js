import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Button, Spin} from 'antd'
import {ModalDetail} from '../component'

@observer
export default class ModalStotage extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.storageVisible = false
  }

  render() {
    const {
      storageVisible: visible, storageDetail: detail, detailLoading,
    } = this.store

    const content = [{
      name: '名称',
      value: detail.storageName,
    }, {
      name: '资源组',
      value: detail.relGroupName,
    }, {
      name: '类型',
      value: detail.storageType,
    }, {
      name: '地址',
      value: detail.connectUrl,
    }, {
      name: '数据库',
      value: detail.dbName,
    }, {
      name: '用户名',
      value: detail.userName,
    }, {
      name: '描述',
      value: detail.descr,
    }]


    const modalConfig = {
      title: '查看数据源',
      visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      footer: [<Button onClick={this.handleCancel}>关闭</Button>],
    }

    return (
      <Modal {...modalConfig}>
        <Spin spinning={detailLoading}>
          <ModalDetail data={content} />
        </Spin>
      </Modal>
    )
  }
}
