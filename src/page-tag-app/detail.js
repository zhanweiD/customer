/**
 * @description 标签管理详情信息
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {
  OmitTooltip, OverviewCardWrap,
} from '../component'
import VisualList from './visual-list'


@observer
export default class CateDetail extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  columns = [{
    key: 'name',
    title: '标签名称',
    dataIndex: 'name',
    render: (text, record) => <a href onClick={() => console.log(text)}>{text}</a>,
  }, {
    key: 'descr',
    title: '描述',
    dataIndex: 'descr',
    render: t => <OmitTooltip maxWidth={120} text={t} />,
  }, {
    key: 'status',
    title: '服务调用次数',
    dataIndex: 'status',
  }, {
    key: 'status',
    title: '覆盖客户数',
    dataIndex: 'status',
  }, {
    key: 'status',
    title: '创建人',
    dataIndex: 'status',
  }, {
    key: 'mtime',
    title: '更新日期',
    dataIndex: 'mtime',
    render: t => moment(+t).format('YYYY-MM-DD'),
  }]

  render() {
    const {
      cardDetail,
    } = this.store

    // 对象指标信息卡
    const cards = [
      {
        title: '标签总数',
        tooltipText: '该类目下的标签总数',
        values: [cardDetail.total || 0],
        valueTexts: [`近七日新增标签： ${cardDetail.nearly7 || 0}`],
      }, {
        title: '组合标签数',
        tooltipText: '该类目下的组合标签数',
        values: [cardDetail.derivation || 0],
        valueTexts: [`组合标签占比： ${cardDetail.derivationRate || '0.00%'}`],
      }, {
        title: 'API数',
        tooltipText: '该类目下的API数',
        values: [cardDetail.apiCount || 0],
        valueTexts: [`应用数： ${cardDetail.appCount || 0}`],
      }, {
        title: '今日服务引用次数',
        tooltipText: '今日服务引用次数',
        values: [cardDetail.todayInvoke || 0],
        valueTexts: [`累计服务引用次数： ${cardDetail.allInvoke || 0}`],
      },
    ]

    return (
      <div className="object-detail" style={{paddingTop: '16px', height: 'auto'}}>
        {/* <OverviewCardWrap cards={cards} /> */}
        <VisualList objId={this.store.objId} />
      </div>
    )
  }
}
