import {Component} from 'react'
import {Steps} from 'antd'
import {observer, Provider, inject} from 'mobx-react'
import BaseInfo from './base-info'
import LogicConfig from './logic-config'
import UpdateConfig from './update-config'

import store from './store'

const {Step} = Steps

@inject()
@observer
export default class VisualConfig extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.visualId = match.params && +match.params.id // 方案id
    store.objId = match.params && +match.params.objId // 对象id
  }
  
  // componentWillMount() {
  //   store.getObjList()
  // }

  componentDidMount() {
    const {match} = this.props
    if (match.params && match.params.id) {
      store.getDetail(store.visualId)
    }
  }
  componentWillUnmount() {
    store.currentStep = 0
    store.tagTreeData.clear()
    store.configInfo = {}
    store.configIdInfo = {}
    store.detailBaseInfo = {}

    // store.objId = undefined 
    // store.assObjId = undefined
    store.objList.clear()
    store.tagCateSelectList.clear()

    store.submitLoading = false
  }
  render() {
    const {currentStep, visualId, detailLoading} = store

    return (
      <Provider bigStore={store}>
        <div className="visual-config"> 
          <div className="header-wrap">
            <div className="header">
              {/* <div className="btn-back">返回</div> */}
              <Steps size="small" current={currentStep} className="header-step">
                <Step title="基础信息" />
                <Step title="逻辑配置" />
                <Step title="更新配置" />
              </Steps>
            </div>
          </div>
          <div className="content">
            <BaseInfo 
              store={store}
              show={+currentStep === 0} 
            />
            <LogicConfig 
              detailLoading={detailLoading}
              visualId={visualId}
              show={+currentStep === 1}
            />
            <UpdateConfig 
              store={store}
              show={+currentStep === 2}
            />
          </div>  
        </div>
      </Provider>
    )
  }
}
