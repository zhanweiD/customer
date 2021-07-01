/**
 * @description 对象管理 - 对象详情信息
 */
import {Component, Fragment} from 'react'
import {observer, Provider} from 'mobx-react'
import {Spin, Tabs} from 'antd'
import {action} from 'mobx'
import {
  DetailHeader, OverviewCardWrap, 
} from '../../component'
import TagModel from './tag-model'
import DateSheet from './data-sheet'
import RelationSheet from './relation-sheet'
import cardIcon1 from '../../icon/card-icon-1.svg'
import cardIcon2 from '../../icon/card-icon-2.svg'
import cardIcon3 from '../../icon/card-icon-3.svg'

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
        title: '标签总数',
        tooltipText: '该对象下的标签总数',
        values: [objDetailNew.tag],
        icon: cardIcon1,
      }, {
        title: '已绑定字段数',
        tooltipText: '该对象绑定的字段总数',
        values: [objDetailNew.bindDbFieldCnt],
        icon: cardIcon2,
      }, {
        title: '字段总数',
        tooltipText: '该对象下的字段总数',
        values: [objDetailNew.dbFieldCnt],
        icon: cardIcon3,
      },
    ]

    return (
      <Fragment>
        <Spin spinning={loading}>
          <div>
            <div className="FBV">
              <div className="content-header">{`对象名称：${objDetail.name}`}</div>
              <div className="ml16">
                <span className="c85">描述：</span>
                <span className="c85">{objDetail.descr || '-'}</span>
              </div>
            </div>
            <div className="ml16 mr16">
              <OverviewCardWrap cards={cards} />
            </div>
          </div>
        </Spin>
        <div 
          className="FB1 custom-border"
          style={{
            margin: '0 16px 16px 16px',
          }}
        >
          <Provider bigStore={this.store}>
            <Tabs className="h-100" defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab="标签维护" key="1" style={{height: '100%'}}>
                {
                  this.store.tabId === '1' ? <TagModel objId={objId} bigStore={this.store} /> : null
                }
              </TabPane>
              <TabPane tab="数据表管理" key="2">
                {
                  this.store.tabId === '2' ? <DateSheet objId={objId} bigStore={this.store} /> : null
                }
              </TabPane>
              {/* <TabPane tab="关系表管理" key="3">
                {
                  this.store.tabId === '3' ? <RelationSheet objId={objId} bigStore={this.store} /> : null
                }
              </TabPane> */}
            </Tabs>
          </Provider>
        </div>
      </Fragment>
    )
  }
}
