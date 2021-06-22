/**
 * @description 客群分析
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {DatePicker, Select, Spin, Cascader, Checkbox, Button} from 'antd'

import {NoData, AuthView} from '../../component'
import Chart from './chart'
import store from './store'
import './main.styl'

const {Option} = Select

@observer
class Group extends Component {
  componentDidMount() {
    store.getGroup()
  }

  componentWillUnmount() {
    this.resetValue()
  }

  @action changeTag = v => {
    store.checkList = v
  } 
  @action changeGroup = v => {
    store.groupId = v
    store.getTagList()
  } 
  @action resetValue = () => {
    store.checkList = []
    store.tagData = []
  } 

  render() {
    const {loading, tagList, groupList, groupId, tagLoading, checkList, tagData} = store

    return (
      <div className="analyze-group oa">
        <div className="content-header">
          <span className="mr24">客群画像</span>
          <Select 
            placeholder="请选择客群"
            value={groupId ? `${groupId}` : null} 
            style={{width: '128px'}} 
            onChange={this.changeGroup}
          >
            {
              groupList.map(item => <Option key={item.groupId}>{item.groupName}</Option>)
            }
          </Select>
        </div> 

        <div className="ml16 mr16 mt72">
          <Spin spinning={loading}>
            {
              tagList.length ? (
                <div className="bgf mt16 mb16 p24 pt16 pb16">
                  <div className="fs14 mb8">枚举标签</div>
                  <Spin spinning={tagLoading}>
                    <Checkbox.Group value={toJS(checkList)} options={tagList} onChange={this.changeTag} /> 
                  </Spin>
                  <div className="mt8 far">
                    <Button disabled={!checkList.length} className="mr8" type="primary" onClick={store.getTagData}>确定</Button>
                    <Button onClick={this.resetValue}>重置</Button>
                  </div>
                </div>
              ) : <div className="bgf mt16 mb16 pt16"><NoData text="暂无数据" /></div>
            }
            
            <div className="bgf pt24 pl24 pr8" style={{overflow: 'auto'}}>
              {
                tagData.length ? (
                  tagData.map(item => (
                    <div className="fl pr16 pb16" style={{width: '50%'}}>
                      <Chart store={store} data={item.data} title={item.tagName} />
                    </div>
                  ))
                ) : <div className="bgf mt16" style={{height: 'calc(100vh - 314px)'}}><NoData text="暂无数据，请选择标签" /></div>
              }
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}
export default AuthView(Group)
