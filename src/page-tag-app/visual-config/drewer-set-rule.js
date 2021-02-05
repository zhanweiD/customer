import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Drawer, Button, Popconfirm, Spin} from 'antd'
import {RuleIfBox} from '../component'

import {getWhenData} from './util'

@observer
export default class DrewerSetRule extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @observable clearActionKey = 0
  @observable submitActionKey = 0
  combineData = []
  allData=[]

  @action.bound onClose() {
    this.store.ruleLoading = false
    this.store.drawerRuleVisible = false
  }

  @action.bound clear() {
    this.clearActionKey = Math.random()
  }

  @action.bound confirm() {
    this.submitActionKey = Math.random()
  }

  @action.bound submitCondition(conditionData, allData) {
    const andOr = allData.filter(d => d.type === 1)

    this.combineData = getWhenData(conditionData.concat(andOr))
    this.allData = allData
    this.getSubmitData()
  }

  @action.bound getSubmitData() {
    const result = {};

    [result.when] = this.combineData
    result.when.posInfoList = this.allData

    this.submit(result)
  }

  @action.bound submit(data) {
    const {ruleDetail} = this.store

    if (ruleDetail.id) {
      this.store.updateVisualRule({...data, id: ruleDetail.id})
    } else { this.store.saveVisualRule(data) }
  }

  render() {
    const {
      // funcList, 
      tagList,
    } = this.props

    const {drawerRuleVisible, ruleLoading, ruleDetail} = this.store

    const drawerConfig = {
      title: '数据过滤规则设置',
      placement: 'right',
      width: 1120,
      closable: true,
      visible: drawerRuleVisible,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.onClose,
      className: 'set-rule',
    }
    return (
      <Drawer
        {...drawerConfig}
      >
        <Spin spinning={ruleLoading}>
          <div style={{paddingBottom: '60px'}}>
            <Popconfirm
              placement="rightTop"
              title="确认清空规则？"
              onConfirm={this.clear}
              okText="是"
              cancelText="否"
            >
              <Button type="primary" className="mb16">清空规则</Button>
            </Popconfirm>

            <div>
              <div className="condition-item-box">
                <RuleIfBox
                  id="set-rule"
                  clearActionKey={this.clearActionKey}
                  submitActionKey={this.submitActionKey}
                  // funcList={funcList}
                  tagList={tagList}
                  submit={this.submitCondition}
                  detail={ruleDetail.when && toJS(ruleDetail.when.posInfoList)}
                  type="setRule"
                />
              </div>
            </div>
          </div>
        </Spin>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={this.onClose}>取消</Button>
          <Button
            type="primary"
            onClick={this.confirm}
          >
            确定
          </Button>
        </div>
      </Drawer>
    )
  }
}
