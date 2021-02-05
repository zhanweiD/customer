import {Component} from 'react'
import {Spin} from 'antd'
import {action, observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import {DetailHeader, TabRoute} from '../../component'
import {Time} from '../../common/util'
import ConfigInfo from './config-info'

import store from './store'

const tabs = [
  {name: '配置信息', value: 0}, 
]

@inject()
@observer
export default class VisualDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.visualId = match.params.id 
  }

  componentWillMount() {
    store.getDetail()
    store.getConfigInfo()
    store.getSelectTag()
  }

  @observable tabId = 0 // 当前详情tabID 

  @action.bound changeTab(id) {
    this.tabId = id
  }

  componentWillUnmount() {
    store.configTagList.clear()
    store.posInfoList.clear()
    store.ruleInfo = {}
    store.configInfo = {}
  }

  render() {
    const {infoLoading, detail} = store

    const baseInfo = [{
      title: '所属对象',
      value: detail.objName,
    }, 
    // {
    //   title: '源标签对象限制',
    //   value: detail.sourceObjName && detail.sourceObjName.join('-'),
    // }, 
    // {
    //   title: '创建人',
    //   value: detail.cuserName,
    // }, 
    {
      title: '创建时间',
      value: <Time timestamp={detail.createTime} />,
    }]

    const tabConfig = {
      tabs,
      currentTab: this.tabId,
      changeTab: this.changeTab,
      changeUrl: false,
    }

    const Content = [ConfigInfo][+this.tabId]

    return (
      <div className="page-visual-detail">
        <Spin spinning={infoLoading}>
          <DetailHeader
            name={detail.name}
            descr={detail.descr}
            baseInfo={baseInfo}
          />
        </Spin>
        <div className="list-content">
          <TabRoute {...tabConfig} />
          <Content store={store} />
        </div>
      </div>
    )
  }
}
