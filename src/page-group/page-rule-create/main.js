import {Component, useEffect, Fragment} from 'react'
import {observer, Provider} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Steps, message, Modal} from 'antd'

import {authView} from '../../component'
import store from './store'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'
import './main.styl'

const {Step} = Steps
let headerTitle = ''
@observer
class RuleCreate extends Component {
  constructor(props) {
    super(props)

    const {match: {params}} = props

    store.type = 2
    
    store.groupId = +params.groupId
    store.isCopy = +params.isCopy

    if (params.isCopy) {
      return headerTitle = '复制群体'
    }
    if (params.groupId) {
      headerTitle = '编辑群体'
    } else {
      headerTitle = '新建群体'
    }
  }

  componentWillMount() {
    store.getEntityList()
    
    if (store.groupId) {
      store.getDetail(store.groupId)
    }
  }

  componentWillUnmount() {
    store.destroy()
  }

  @action prev = () => {
    store.current -= 1
    store.submitLoading = false
  }

  @action save = values => {
    const {groupId, isCopy} = store

    if (groupId && !isCopy) {
      store.editGroup(values, res => {
        // this.showResult(res)
      })
    } else {
      store.addGroup(values, res => {
        // this.showResult(res)
      })
    }
  }

  @action showResult = result => {
    const {oneForm, groupId, isCopy} = store

    if (result) {
      message.success(`群体 ${oneForm.name} ${groupId && !isCopy ? '编辑' : '创建'}成功`)
      window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/group/manage`
    } else {
      Modal.error({
        content: `群体 ${oneForm.name} 创建失败 您可以重新创建`,
      })
    }
  }

  render() {
    const {
      current, 
      objId,
      groupId,
      isCopy,
      saveInfo,
    } = store
    return (
      <Provider store={store}>
        <div className="oa">
          <div className="content-header">{headerTitle}</div>
          <div className="rule-create mt72">
            <Steps size="small" current={current} style={{width: '80%', margin: '0 auto'}}>
              <Step title="信息配置" />
              <Step title="圈选规则" />
              <Step title="完成" />
            </Steps>
            <StepOne
              prev={this.prev}
              save={this.save}
            />
          
            {
              store.current === 1 ? <StepTwo save={this.save} /> : null
            }
         
            {
              store.current === 2 ? (
                <StepThree 
                  current={current} 
                  objId={objId}
                  groupId={groupId}
                  isCopy={isCopy}
                  saveInfo={saveInfo}
                />
              ) : null
            }
         
          </div>
        </div>
      </Provider>
    )
  }
}
export default authView(RuleCreate)
