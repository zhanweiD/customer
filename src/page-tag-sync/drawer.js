/**
 * @description 添加同步计划
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {
  Drawer, Steps,
} from 'antd'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'

import store from './store-drawer'

const {Step} = Steps

@inject('bigStore')
@observer
export default class DrawerAddSync extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    store.projectId = props.projectId
    store.destroy()
  }
  
  @action.bound closeDrawer() {
    // store.destroy()
    this.bigStore.visible = false
  }

  render() {
    const {visible} = this.bigStore
    const {currentStep} = store

    const drawerConfig = {
      title: '新建同步计划',
      visible,
      closable: true,
      width: 1120,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.closeDrawer,
    }

    return (
      <Drawer
        {...drawerConfig}
      >
        <div className="add-sync">
          <Steps size="small" current={currentStep} className="add-sync-step">
            <Step title="基础信息" />
            <Step title="配置同步标签" />
            <Step title="预览保存" />
          </Steps>
          <StepOne 
            store={store}
            show={currentStep === 0} 
            closeDrawer={this.closeDrawer}
          />
          <StepTwo 
            store={store}
            show={currentStep === 1} 
            closeDrawer={this.closeDrawer}
          />
          <StepThree
            store={store}
            show={currentStep === 2} 
            closeDrawer={this.closeDrawer}
          />
        </div>
      </Drawer>
    )
  }
}
