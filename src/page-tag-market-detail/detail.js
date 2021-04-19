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
      objId, objDetail, loading, objDetailNew,
    } = this.store

    // 对象指标信息卡
    const cards = [
      {
        title: '总标签数',
        tooltipText: '该对象下的标签总数',
        values: [objDetailNew.tag],
        valueTexts: [`近7日新增标签${objDetailNew.last7dayTag}个`],
      }, {
        title: '一级标签类目数',
        tooltipText: '该对象的一级标签类目数',
        values: [objDetailNew.tagCatalog],
        valueTexts: [`二级标签类目数${objDetailNew.tagSecondCatalog}个`],
      }, {
        title: '覆盖业态数',
        tooltipText: '该对象覆盖的业态数',
        values: [objDetailNew.tagBiz],
        valueTexts: [`覆盖场景数${objDetailNew.tagEvent}个`],
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
