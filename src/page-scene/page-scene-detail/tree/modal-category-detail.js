import {Component} from 'react'
import {Modal, Spin, Button} from 'antd'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Time} from '../../../common/util'
import {LabelItem} from '../../../component'

@inject('bigStore')
@observer
class ModalCategoryDetail extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = this.bigStore.categoryStore
  }

  @action.bound handleOnCancel() {
    this.store.modalVisible.readCategory = false
  }

  render() {
    const {cateDetail, modalVisible, detailLoading} = this.store
    const modalProps = {
      title: '类目详情',
      visible: modalVisible.readCategory,
      maskClosable: false,
      width: 520,
      destroyOnClose: true,
      onCancel: this.handleOnCancel,
      footer: [<Button type="primary" onClick={this.handleOnCancel}>关闭</Button>],
    }

    return (
      <Modal {...modalProps}>
        <Spin spinning={detailLoading}>
          <LabelItem labelWidth={90} label="类目名称" value={cateDetail.name} />
          <LabelItem labelWidth={90} label="所属类目" value={cateDetail.fullName || '--'} />
          <LabelItem labelWidth={90} label="创建者" value={cateDetail.cuser} />
          <LabelItem labelWidth={90} label="创建时间" value={<Time timestamp={cateDetail.cdate} />} />
          <LabelItem labelWidth={90} label="描述" value={cateDetail.descr} />
        </Spin>
      </Modal>
    )
  }
}

export default ModalCategoryDetail
