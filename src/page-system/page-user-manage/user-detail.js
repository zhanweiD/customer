import {Component} from 'react'
import {Modal, Button, Spin} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'

import ModalDetail from '../../component/modal-detail'

@observer
export default class UserDetail extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.detailVisible = false
  }

  render() {
    const {
      detailVisible, nowRecord,
    } = this.store
    if (!nowRecord.roles) return null
    const roleNames = nowRecord.roles.map(item => item.name)

    const content = [{
      name: '姓名',
      value: nowRecord.userName,
    }, {
      name: '用户名',
      value: nowRecord.userAccount,
    }, {
      name: '手机号',
      value: nowRecord.userPhone,
    }, {
      name: '邮箱',
      value: nowRecord.userEmail,
    }, {
      name: '所属部门',
      value: `${nowRecord.orgName}/${nowRecord.deptName}`,
    }, {
      name: '角色',
      value: roleNames.join(','),
    }]


    const modalConfig = {
      title: '用户详情',
      visible: detailVisible,
      onCancel: this.handleCancel,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      footer: [<Button type="primary" onClick={this.handleCancel}>关闭</Button>],
    }

    return (
      <Modal {...modalConfig}>
        <ModalDetail data={content} labelWidth={60} />
      </Modal>
    )
  }
}
