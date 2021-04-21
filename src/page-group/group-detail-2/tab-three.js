import React, {useEffect} from 'react'
import {Table, Button} from 'antd'
import {toJS} from 'mobx'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'

import {downloadResult, userLog} from '../../common/util'
import {Authority} from '../../component'

const columns = [
  {
    title: '客户ID',
    dataIndex: 'id',
    key: 'id',
    render: text => <a>{text}</a>,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
]

const data = [
  {
    id: '13423',
    name: '卡卡',
    sex: 'male',
    age: 88,
  },
]

export default inject('store')(
  ({store}) => {
    useEffect(() => {
      store.getUnitList()
    }, [])

    return useObserver(() => (
      <div className="pl16 pr16" style={{minHeight: 'calc(100vh - 204px)'}}>
        <Authority
          authCode="group-manage:export-group"
        >
          <Button 
            type="primary" 
            style={{marginBottom: '8px'}}
            onClick={async () => {
              await downloadResult({id: store.id, queryDate: store.queryDate}, 'group/individuals'); userLog('群体管理/导出群体')
            }}
          >
            导出个体列表
          </Button>
        </Authority>
        <Table
          loading={store.clientTableLoading}
          columns={toJS(store.titleList)}
          dataSource={store.clientList}
          pagination={{
            totalCount: store.totalCount,
            currentPage: 1,
          }}
        />
      </div>
    ))
  }
)
