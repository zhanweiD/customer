import {Component} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Steps, Drawer} from 'antd'

import StepOne from './step-one'
import StepTwo from './step-two'

const {Step} = Steps

@observer
export default class PushDrawer extends Component {
  constructor(props) {
    super(props)

    this.store = props.store
    // this.store.getGroupList()
    // this.store.getStorages()
  }

  @action onClose = () => {
    this.store.drawerVisible = false
    this.store.detail = {}
  }

  render() {
    const {current, submitLoading, drawerVisible, isEdit} = this.store
    const drawerConfig = {
      title: isEdit ? '编辑推送' : '新建推送',
      visible: drawerVisible,
      closable: true,
      width: 1120,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.onClose,
    }

    return (
      <Drawer {...drawerConfig}>
        <Steps current={current} style={{width: '80%', margin: '0 auto'}}>
          <Step title="推送配置" />
          <Step title="字段映射" />
        </Steps>
        <StepOne store={this.store} />
        <StepTwo store={this.store} />
        {/* {
          current === 1 ? <StepTwo store={this.store} /> : <StepOne store={this.store} />
        } */}
      </Drawer>
    )
  }
}
