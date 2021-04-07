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
        <div className="bgf box-border">
          <Provider bigStore={this.store}>
            <TagModel objId={objId} bigStore={this.store} />
          </Provider>
        </div>
      </div>
    )
  }
}
