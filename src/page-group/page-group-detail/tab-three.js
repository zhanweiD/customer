import React, {useEffect} from 'react'
import {Table, Button} from 'antd'
import {toJS} from 'mobx'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'

import {downloadResult, userLog} from '../../common/util'
import {Authority, Search} from '../../component'
import search from './search'

export default inject('store')(
  ({store}) => {
    useEffect(() => {
      // store.getUnitList()
    }, [])

    return useObserver(() => (
      <div className="p16 custom-border" style={{minHeight: 'calc(100vh - 204px)'}}>
        <Search 
          onReset={() => console.log('重置')}
          onSearch={store.getUnitList}
          params={search(store.outputTags)}
        />
        <Authority
          authCode="group-manage:export-group"
        >
          <Button 
            type="primary" 
            style={{marginBottom: '8px'}}
            onClick={async () => {
              await downloadResult({id: store.id, queryDate: store.queryDate, userAccount: localStorage.getItem('userAccount')}, 'group/individuals/'); userLog('客群管理/导出客群')
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
