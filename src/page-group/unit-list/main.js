/**
 * @description 个体列表
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Button, Spin} from 'antd'
import moment from 'moment'

import {NoData, ListContent, Authority} from '../../component'
import {baseApi, downloadResult, userLog} from '../../common/util'
import GroupModal from './group-modal'

import store from './store'

@observer
export default class UnitList extends Component {
  constructor(props) {
    super(props)
    // store.projectId = props.projectId
    const {match: {params}} = props
    store.id = +params.id
    store.objId = null
    store.queryDate = moment(parseInt(params.queryDate)).format('YYYY-MM-DD')
    store.getUnitList()
  }

  @action openModal = () => {
    store.visible = true
  }
  @action outputUnitList = () => {
    const {id, projectId, queryDate} = store
    window.open(`${baseApi}/export/individuals?groupId=${id}&projectId=${projectId}&queryDate=${queryDate}`)
  }

  render() {
    const {
      list, tableLoading, titleList, totalCount,
    } = store

    const noDataConfig = {
      btnText: '暂无个体',
      code: 'asset_tag_project_add',
      noAuthText: '暂无个体',
    }

    const listConfig = {
      columns: toJS(titleList),
      tableLoading,
      hasPaging: false,
      initGetDataByParent: true,
      buttons: [
        <Authority
          authCode="group-manage:export-group"
        >
          <Button 
            type="primary" 
            onClick={async () => {
              await downloadResult({id: store.id, queryDate: store.queryDate}, 'group/individuals'); userLog('群体管理/导出群体')
            }}
          >
            导出个体列表
          </Button>
        </Authority>,
        // <Authority
        //   authCode="tag_app:create_individuals_group[c]"
        // >
        //   <Button type="primary" onClick={this.openModal}>保存群体</Button>
        // </Authority>,
      ],
      store, // 必填属性
      pagination: {
        totalCount,
        currentPage: 1,
        // pageSize: 10,
      },
    }

    return (
      <div className="page-unit">
        <div className="content-header">个体列表</div>
        <Spin spinning={tableLoading}>
          {
            list.length ? (
              <div className="header-page list-content">
                <ListContent {...listConfig} />
              </div>
            ) : (
              <div className="header-page mt64" style={{paddingTop: '15%'}}>
                <NoData {...noDataConfig} />
              </div>
            )
          }
        </Spin>
        <GroupModal store={store} />
      </div>
    )
  }
}
