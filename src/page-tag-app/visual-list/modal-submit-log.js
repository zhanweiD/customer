/**
 * @description 查询提交
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {
  Modal, Button, Spin,
} from 'antd'

@observer
export default class ModalSubmitLog extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound handleCancel() {
    this.store.visibleLog = false
    this.store.submitLog = ''
  }

  render() {
    const {visibleLog, submitLog, submitLogLoading} = this.store

    return (
      <Modal
        visible={visibleLog}
        maskClosable={false}
        destroyOnClose
        title="日志"
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel} type="primary">
            关闭
          </Button>,
        ]}
      >
        <Spin spinning={submitLogLoading}>
          <div style={{
            minHeight: '200px', maxHeight: '500px', overflow: 'auto', whiteSpace: 'pre-wrap',
          }}
          >
            {toJS(submitLog)}
          </div>
        </Spin>
      </Modal>
    )
  }
}
