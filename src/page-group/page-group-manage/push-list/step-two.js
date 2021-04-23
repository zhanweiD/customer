import React, {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Form, Button} from 'antd'
import DrawerMapping from './mapping'

@observer
export default class StepTwo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action prev = () => {
    this.store.current -= 1
  }

  @action submit = () => {
    this.store.setParams()
    if (this.store.isEdit) {
      this.store.editPush()
    } else {
      this.store.addPush()
    }
  }
  
  render() {
    const {submitLoading, current} = this.store
    if (!current) return null // 防止无效请求
    return (
      <div style={{display: current ? 'block' : 'none'}}>
        <DrawerMapping store={this.store} />
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={this.prev}>上一步</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.submit}
            loading={submitLoading}
          >
            确定
          </Button>
        </div>
      </div>
    )
  }
}
