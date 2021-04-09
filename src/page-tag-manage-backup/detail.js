/**
 * @description 对象管理 - 对象详情信息
 */
import {Component} from 'react'
import {observer, Provider} from 'mobx-react'
import {Spin, Tabs} from 'antd'
import {action} from 'mobx'
import {
  DetailHeader, OverviewCardWrap, 
} from '../component'
import TagModel from './tag-model'
import DateSheet from './data-sheet'
import RelationSheet from './relation-sheet'

const {TabPane} = Tabs

@observer
export default class ObjectDetail extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound changeTab(id) {
    this.store.tabId = id
  }

  render() {
    const {
      objId, objDetail, loading,
    } = this.store

    // 对象指标信息卡
    const cards = [
      {
        title: '标签总数',
        tooltipText: '该对象下的标签总数',
        values: [objDetail.tag],
      }, {
        title: '数据表总数',
        tooltipText: '该对象绑定的数据表总数',
        values: [objDetail.tagTable],
      }, {
        title: '关系表总数',
        tooltipText: '该对象绑定的关系表总数',
        values: [objDetail.relTable],
      },
    ]

    return (
      <div className="object-detail">
        <Spin spinning={loading}>
          <div className="mb16 box-border">
            <DetailHeader 
              name={`对象名称：${objDetail.name}`}
              descr={objDetail.descr}
              btnMinWidth={160}
            />
            <div className="ml16 mr16">
              <OverviewCardWrap cards={cards} />
            </div>
          </div>
        </Spin>
        <div className="bgf box-border h-436">
          <Provider bigStore={this.store}>
            <Tabs className="h-428" defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane className="h-428" tab="标签维护" key="1">
                {
                  this.store.tabId === '1' ? <TagModel objId={objId} bigStore={this.store} /> : null
                }
              </TabPane>
              <TabPane className="h-428" tab="数据表管理" key="2">
                {
                  this.store.tabId === '2' ? <DateSheet objId={objId} bigStore={this.store} /> : null
                }
              </TabPane>
              <TabPane className="h-428" tab="关系表管理" key="3">
                {
                  this.store.tabId === '3' ? <RelationSheet objId={objId} bigStore={this.store} /> : null
                }
              </TabPane>
            </Tabs>
          </Provider>
        </div>
      </div>
    )
  }
}
