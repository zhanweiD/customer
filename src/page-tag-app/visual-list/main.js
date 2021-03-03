import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider, inject} from 'mobx-react'
import {Button, Popconfirm, Tooltip} from 'antd'
import {ListContent, Authority} from '../../component'
import {Time} from '../../common/util'
import seach from './search'
import ModalSubmitLog from './modal-submit-log'

import {
  geVisualStatus,
  getLastStatus,
} from '../util'

import store from './store'

@inject('objStore')
@observer
class VisualList extends Component {
  constructor(props) {
    super(props)
    store.objStore = props.objStore
    store.objId = props.objId
  }

  columns = [{
    title: '组合标签方案',
    dataIndex: 'name',
    // render: (text, record) => <Link to={`/tag-sync/${record.id}`}>{text}</Link>,
  }, 
  // {
  //   title: '对象',
  //   dataIndex: 'objName',
  // }, 
  {
    title: '创建时间',
    dataIndex: 'createTime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '方案状态',
    dataIndex: 'status',
    render: v => (v === null ? '-' : geVisualStatus({status: v})),
  }, {
    title: '最近运行状态',
    dataIndex: 'lastStatus',
    render: v => (v === null ? '-' : getLastStatus({status: v})),
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 180,
    render: (text, record) => (
      <div>
        {(() => {
          // 方案状态 未完成 0
          if (record.status === 0) {
            return (
              <Fragment>
                <a className="mr8" href onClick={() => this.viewVisual(record)}>查看</a>
                <Authority
                  authCode="tag-app:add-tag"
                >
                  <a className="mr8" href onClick={() => this.editScheme(record)}>编辑</a>
                  <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                    <a href>删除</a>
                  </Popconfirm>
                </Authority>
                {/* <a href onClick={() => this.clone(record.id)}>克隆</a> */}
              </Fragment>
            )
          }

          // 方案状态 提交失败  2
          if (record.status === 2) {
            return (
              <Fragment>
                <Authority
                  authCode="tag-app:add-tag"
                >
                  <a className="mr8" href onClick={() => this.editScheme(record)}>编辑</a>
                  <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                    <a className="mr8" href>删除</a>
                  </Popconfirm>
                </Authority>
                {/* <a href onClick={() => this.clone(record.id)}>克隆</a> */}
                <Authority
                  authCode="tag-app:add-tag"
                >
                  <a href onClick={() => this.getLog(record.id)}>提交日志</a>
                </Authority>
              </Fragment>
            )
          }

          // 方案状态 提交成功  1 运行中
          if (record.status === 1 && record.lastStatus === 0) {
            return (
              <Fragment>
                <a className="mr8" href onClick={() => this.viewVisual(record)}>查看</a>
                <Authority
                  authCode="tag-app:add-tag"
                >
                  <span className="disabled mr8">执行</span>
                </Authority>
                <Authority
                  authCode="tag-app:add-tag"
                >
                  <span className="disabled mr8">删除</span>
                </Authority>
                <Authority
                  authCode="tag-app:add-tag"
                >
                  <a href onClick={() => this.getLog(record.id)}>提交日志</a>
                </Authority>
               
                {/* <Dropdown overlay={() => this.menu(record)}>
                  <a href>
                      更多
                    <Icon type="down" />
                  </a>
                </Dropdown> */}
              </Fragment>
            )
          }


          // 方案状态 提交成功  1
          if (record.status === 1) {
            return (
              <Fragment>
                <a className="mr8" href onClick={() => this.viewVisual(record)}>查看</a>
                <Authority
                  authCode="tag-app:add-tag"
                >
                  <a className="mr8" href onClick={() => this.runVisual(record)}>执行</a>
                </Authority>
                {
                  !record.tagUsedCount
                    ? (
                      <Authority
                        authCode="tag-app:add-tag"
                      >
                        <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                          <a href>删除</a>
                        </Popconfirm>
                      </Authority>
                    ) : (
                      <Authority
                        authCode="tag-app:add-tag"
                      >
                        <span className="disabled">删除</span>
                      </Authority>
                    )
                }
                <Authority
                  authCode="tag-app:add-tag"
                >
                  <a className="ml8" href onClick={() => this.getLog(record.id)}>提交日志</a>
                </Authority>
              </Fragment>
            )
          }
        })()}
      </div>
    ),
  }]

  componentWillMount() {
    this.initData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.objId !== this.props.objId) {
      store.objId = this.props.objId
      store.getList({objId: store.objId, currentPage: 1})
    }
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  // 新增
  @action.bound addScheme() {
    window.open(`${window.__keeper.pathHrefPrefix}/tag/app-add/${store.objStore.objId}`)
  }

  // 编辑
  @action.bound editScheme(data) {
    window.open(`${window.__keeper.pathHrefPrefix}/tag/app-add/${store.objStore.objId}/${data.id}`)
  }

  // 查看
  @action.bound viewVisual(data) {
    window.open(`${window.__keeper.pathHrefPrefix}/tag/app/detail/${data.id}`)
  }

  // 克隆
  @action.bound clone(id) {
    store.clone(id)
  }

  // 执行
  @action.bound runVisual(data) {
    store.runVisual(data.id)
  }

  // 删除
  @action.bound delList(id) {
    store.delList(id)
  }

  // 提交日志
  @action.bound getLog(id) {
    store.visibleLog = true
    store.getLog(id)
  }

  render() {
    const {objStore, objId} = store
    const {cardDetail} = objStore
    const listConfig = {
      columns: this.columns,
      searchParams: seach(),
      buttons: cardDetail.total ? [
        <Authority
          authCode="tag-app:add-tag"
        >
          <Button type="primary" onClick={() => this.addScheme()}>新建组合标签方案</Button>
        </Authority>,
      ] : (
        [
          <Authority
            authCode="tag-app:add-tag"
          >
            <Tooltip title="该对象暂无可用标签，请去标签管理配置标签">
              <Button type="primary" disabled>新建组合标签方案</Button>
            </Tooltip>
          </Authority>,
        ]),
      store, // 必填属性
      initGetDataByParent: false,
    }

    return (
      <Provider bigStore={store}>
        <div className="page-visual-list">
          <ListContent {...listConfig} />
          <ModalSubmitLog store={store} />
        </div>
      </Provider>
    )
  }
}

export default VisualList
