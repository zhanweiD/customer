import React, {Component, useEffect, Fragment} from 'react'
import {action, toJS, observable} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Spin} from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import {RuleContent} from '../component'
import SetRule from './drawer'

import store from './store'

@observer
class RuleDetail extends Component {
  constructor(props) {
    super(props)
    // store.projectId = props.projectId

    const {match: {params}} = props

    store.groupId = params.groupId
    store.objId = params.objId
    store.projectId = params.projectId
  }

  @observable visible = false

  wherePosMap = {}
  whereMap = {}

  componentWillMount() {
    const t = this
    if (store.groupId) {
      store.getConfigTagList(null, () => {
        store.getDetail(store.groupId, () => {
          t.wherePosMap = store.wherePosMap || {}
          t.whereMap = toJS(store.whereMap) || {}
        })
      })
      store.getRelList()
    }
  }

  componentWillUnmount() {
    store.destroy()
  }

  @action goBack = () => {
    // 返回规则详情
    window.location.href = `${window.__keeper.pathHrefPrefix}/group/manage/${store.groupId}/${store.objId}`
  }

  @action openDrawer = (flag, relId) => {
    store.getOtherEntity({
      relationId: relId,
    })

    store.getDrawerConfigTagList({
      objId: relId,
    }, () => {
      this.drawerFlag = flag
      this.visible = true
    })
  }

  @action submitRule = (posData, data) => {
    this.wherePosMap[this.drawerFlag] = posData
    this.whereMap[this.drawerFlag] = data
    this.visible = false
  }

  @action onClose = () => {
    this.visible = false
    this.drawerFlag = undefined
    // store.getConfigTagList()
  }

  render() {
    const {configTagList, drawerConfigTagList, relList, posList, detailLoading, objId} = store
    return (
      <div className="oa">
        <div className="content-header">规则配置详情</div>
        <Spin spinning={detailLoading}>
          <div className="rule-detail header-page">
      
            {
              posList && !detailLoading ? (
                <Fragment>
                  <RuleContent 
                    configTagList={toJS(configTagList)}
                    drawerConfigTagList={toJS(drawerConfigTagList)}
                    relList={toJS(relList)}
                    openDrawer={this.openDrawer}
                    posList={toJS(posList)}
                    type="config"
                    page="detail"
                    stepOneObjId={objId}
                  />
                  <SetRule 
                    visible={this.visible} 
                    onClose={this.onClose}
                    posList={this.wherePosMap[this.drawerFlag]}
                    store={store}
                  />
                </Fragment>
              ) : null
            }
         
            <div className="steps-action">
              <Button
                type="primary"
                onClick={this.goBack}
              >
                返回
              </Button>
            </div>
          </div>
        </Spin>
      </div>
    )
  }
}

export default props => {
  // const ctx = OnerFrame.useFrame()

  // useEffect(() => {
  //   ctx.useProject(true, null, {visible: false})
  // }, [])

  return (
    <RuleDetail {...props} />
  )
}
