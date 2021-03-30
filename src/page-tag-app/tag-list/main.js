import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider, inject} from 'mobx-react'
import {ListContent} from '../../component'
import seach from './search'

import {
  getTagStatus,
} from '../util'

import store from './store'

@inject()
@observer
class tagList extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.visualId = match.params && match.params.id // 方案id
  }

  columns = [{
    title: '标签名称',
    dataIndex: 'name',
  }, {
    title: '标签标识',
    dataIndex: 'enName',
  }, {
    title: '数据类型',
    dataIndex: 'objName',
  }, {
    title: '对象名称',
    dataIndex: 'objName',
  }, {
    title: '衍生标签方案',
    dataIndex: 'tagUsedCount',
  }, {
    title: '使用状态',
    dataIndex: 'status',
    render: v => (v === null ? '' : getTagStatus({status: v})),
  }]

  componentWillMount() {
    store.getObjList()
    store.getSchemeList()
    this.initData()
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  render() {
    const {objList, schemeList} = store

    const listConfig = {
      columns: this.columns,
      // initParams: {projectId},
      searchParams: seach({
        objList: toJS(objList),
        schemeList: toJS(schemeList),
      }),
      store, // 必填属性
    }

    return (
      <Provider bigStore={store}>
        <div className="page-visual-tag">
          <Fragment>
            <div className="list-content">
              <ListContent {...listConfig} />
            </div>
          </Fragment>
        </div>
      </Provider>
    )
  }
}

export default tagList
