import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
import DrawerConfig from './drawer'
import DrawerTagConfig from './drawer-tag'

@observer
export default class ConfigInfo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound viewRule() {
    this.store.getRuleInfo()
    this.store.drawerVisible = true
  }

  @action.bound closeDrawer() {
    this.store.drawerVisible = false
  }


  @action.bound viewTag() {
    this.store.getTagDetail()
    this.store.drawerTagVisible = true
  }

  render() {
    const {
      ruleInfo,
      configInfo, 
      posInfoList,
      drawerVisible, 
      ruleInfoLoading,
      configInfoLoading, 
      configTagList,
    } = this.store

    return (
      <Spin spinning={configInfoLoading}>
        <div className="config-info">
          {/* <div className="info-title">
            <span className="mr8">数据过滤规则</span>
            {
              configInfo.where ? <a href onClick={this.viewRule}>查看</a> : null
            }
           
          </div>
          <div className="FBH ml32 mb24">
            <div>{configInfo.where || '（暂未设置数据过滤规则）'}</div>
          </div> */}
          <div>
            <span className="mr8">组合标签</span>
            <a href onClick={this.viewTag}>查看</a>
            {/* <a href={`/asset-tag/index.html#/visual/tags/${this.store.visualId}`}>查看</a> */}
          </div>  
          {
            configInfo.tagContents && configInfo.tagContents.map(d => (
              <div className="FBH mt8 mb8">
                <div style={{color: ' rgba(0, 0, 0, 0.45)'}}>{`${d.tagName}：`}</div>
                <div>{d.content}</div>
              </div>
            ))
          }
        </div>
        <DrawerConfig 
          drawerVisible={drawerVisible}
          closeDrawer={this.closeDrawer}
          loading={ruleInfoLoading}
          ruleInfo={ruleInfo}
          posInfoList={toJS(posInfoList)}
          configTagList={toJS(configTagList)}
        />
        <DrawerTagConfig 
          store={this.store}
        />
      </Spin> 
    )
  }
}
