/**
 * @description 群体详情
 */
import {Component, Fragment, useEffect} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Tabs} from 'antd'
import {Time} from '../../common/util'
import {Tag, DetailHeader, Authority} from '../../component'
import TagHistory from './tab-history'
import TabApi from './tab-api'
import CustomList from './custom-list'
import RunLog from './run-log'
import PushLog from './push-log'
import store from './store'

const {TabPane} = Tabs

@observer
export default class GroupDetail extends Component {
  defStartTime = moment().subtract(7, 'day').format('YYYY-MM-DD')
  defEndTime = moment().subtract(1, 'day').format('YYYY-MM-DD')

  constructor(props) {
    super(props)
    // store.projectId = props.projectId
    const {match: {params}} = props
    store.id = +params.id
    store.objId = +params.objId
  }

  componentWillMount() {
    // store.getDetail()
  }

  @action.bound viewRule() {
    window.location.href = `${window.__keeper.pathHrefPrefix}/group/manage/rule/${store.id}/${store.objId}`
  }

  render() {
    const {modeType, groupDetial} = store
    const {
      name,
      type,
      ctime,
      objName,
      mode,
      cuserName,
      descr,
      lastCount,
      status,
    } = groupDetial
    // 详情信息
    const baseInfo = [
      {
        title: '实体',
        value: objName,
      },
      {
        title: '群体类型',
        value: type === 1 ? '离线群体' : '实时群体',
      },
      {
        title: '创建方式',
        value: mode === 1 ? '规则创建' : 'ID集合创建',
      },
      {
        title: '创建人',
        value: cuserName,
      },
      {
        title: '创建时间',
        value: <Time timestamp={ctime} />,
      },
      // {
      //   title: '描述',
      //   value: descr,
      // },
    ]

    // 不同状态的相应map
    const tagMap = {
      1: <Tag status="success" text="正常" />,
      2: <Tag status="error" text="失败" />,
      3: <Tag status="process" text="计算中" />,
    }

    const actions = [
      // <Authority
      //   authCode="tag_app:group_rule[r]"
      // >
      <a className="mr8" target="_blank" href={`${window.__keeper.pathHrefPrefix}/group/manage/rule/${store.id}/${store.objId}`}>查看规则</a>,
      // </Authority>,
    ]
    return (
      <div className="group-detail">
        <div className="detail-h">
          <DetailHeader
            name={(
              <Fragment>
                <span style={{marginRight: '16px'}}>{name}</span>
              </Fragment>
            )}
            descr={descr}
            btnMinWidth={230}
            baseInfo={baseInfo}
            tag={tagMap[status]}
            actions={modeType === 0 ? [] : actions}
          />
          <div className="detail-action">
            <span className="fz24">{lastCount}</span>
            <span>人</span>
            <div className="detail-time"><Time timestamp={ctime} /></div>
          </div>
        </div>
        <div className="m16 header-page h-272">
          <Tabs size="small" defaultActiveKey="1" animated={false}>
            <TabPane tab="客户列表" key="1">
              <CustomList store={store} />
            </TabPane>
            <TabPane tab="运行日志" key="2">
              <RunLog />
            </TabPane>
            <TabPane tab="推送日志" key="3">
              <PushLog />
            </TabPane>
            {/* <TabPane tab="客户列表" key="1">
              <TagHistory store={store} />
            </TabPane>
            <TabPane tab="API列表" key="2">
              <TabApi store={store} />
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    )
  }
}
