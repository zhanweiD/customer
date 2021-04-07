import {Component} from 'react'
import {Modal, Button, Spin} from 'antd'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import ModalDetail from '../../../component/modal-detail'

@observer
export default class TagDetailModal extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.detailVisible = false
    this.store.drawerTagInfo = {}
  }

  render() {
    const {
      detailVisible, drawerTagInfo, tagCateList,
    } = this.store
    const ownCate = tagCateList.find(item => item.id === drawerTagInfo.parentId)
    if (!ownCate) return null
    const content = [{
      name: '标签名称',
      value: drawerTagInfo.name,
    }, {
      name: '关联字段',
      value: drawerTagInfo.fieldName,
    }, {
      name: '所属类目',
      value: ownCate.name,
    }, {
      name: '描述',
      value: drawerTagInfo.descr,
    }]

    const proContent = [{
      name: '责任人',
      value: drawerTagInfo.creator,
    }, {
      name: '创建时间',
      value: moment(+drawerTagInfo.createTime).format('YYYY-MM-DD'),
    }, 
    // {
    //   name: '数据更新时间',
    //   value: drawerTagInfo.createTime,
    // }, {
    //   name: '数据更新周期',
    //   value: drawerTagInfo.valueType,
    // }, 
    {
      name: '数据源',
      value: drawerTagInfo.dataSource,
    }]

    const modalConfig = {
      title: '标签详情',
      visible: detailVisible,
      onCancel: this.handleCancel,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      footer: [<Button type="primary" onClick={this.handleCancel}>关闭</Button>],
    }

    return (
      <Modal {...modalConfig}>
        <div className="mb16 c85">基础信息</div>
        <ModalDetail data={content} labelWidth={64} />
        <div className="mb16 c85">生产信息</div>
        <ModalDetail data={proContent} labelWidth={64} />
      </Modal>
    )
  }
}
