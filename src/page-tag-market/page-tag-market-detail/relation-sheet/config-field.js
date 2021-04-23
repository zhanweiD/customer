import {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Drawer, Steps, Button} from 'antd'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import StepTwo from './config-field-step-two'

// 标签配置（字段->标签）

@observer
export default class ConfigField extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 从第二步“确定”，决定是不是要进入第三步
  @action.bound confirmStepTwo() {
    this.store.saveEntityField(() => {
      // 加载结果数据
      this.store.getList()
      this.onClose()
    })
  }
  // 关闭
  onClose = () => {
    const {onClose} = this.props
    onClose()
  }


  render() {
    const {visible} = this.props
    return (
      <Drawer
        title="配置字段"
        visible={visible}
        // width="73%"
        width={560}
        onClose={this.onClose}
        maskClosable={false}
        destroyOnClose
      >
        {/* 内容区域 */}
        <div style={{paddingBottom: '28px'}}>
          <StepTwo store={this.store} />
        </div>

        {/* 底部步骤控制按钮 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Fragment>
            <Button 
              className="mr8"
              onClick={this.onClose}
            >
                取消
            </Button>
            <Button 
              type="primary" 
              onClick={this.confirmStepTwo}
              // loading={store.loadings.tagSaving}
            >
                确定
            </Button>
          </Fragment>
        </div>
      </Drawer>
    )
  }
}
