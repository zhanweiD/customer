import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Modal, Button} from 'antd'

@inject('bigStore')
@observer
export default class ModalLog extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  @action handleCancel = () => {
    this.store.visibleLog = false
  }

  render() {
    const {visibleLog, submitLog} = this.store
    
    const modalConfig = {
      title: '提交日志',
      visible: visibleLog,
      onCancel: this.handleCancel,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      footer: [<Button onClick={this.handleCancel}>关闭</Button>],
    } 
    return (
      <Modal {...modalConfig}>
        <div style={{
          minHeight: '200px', maxHeight: '500px', overflow: 'auto', whiteSpace: 'pre-wrap',
        }}
        >
          {
            toJS(submitLog)
          }
        </div>
      </Modal>
    )
  }
}
