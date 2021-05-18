import React, {useEffect} from 'react'
import {Button, Input, Table, Cascader, Drawer, Popconfirm, Tooltip} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import _ from 'lodash'
import {codeInProduct} from '@util'
import MyForm from './format-form'


export default inject('store')(({store}) => {
  const showEdit = record => {
    // store.editId = record.id
    store.isEdit = true
    store.formInitValue = record
    store.drawerVis = true
  }

  const columns = [
    {
      title: '业态名称',
      dataIndex: 'bizName',
    }, {
      title: '业态Code',
      dataIndex: 'bizCode',
    }, {
      title: '业务描述',
      dataIndex: 'descr',
    }, {
      title: '操作',
      render: (text, record) => {
        return codeInProduct('system-business:add') ? (
          <div>
            <span className="ac hand mr8" onClick={() => showEdit(record)}>编辑</span>
            {
              record.canDel === 0
                ? (
                  <Tooltip>
                    <span className="disabled">删除</span>
                  </Tooltip>
                )
                : (
                  <Popconfirm
                    title="你确定要删除该业态吗？"
                    onConfirm={() => store.deleteFormat([record.bizCode])}
                  >
                    <span className="ac hand">删除</span>
                  </Popconfirm>
                )
            }
            
          </div>
        ) : null
      },
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      store.selectedRows = selectedRows
    },
    getCheckboxProps: record => ({
      disabled: record.canDel === 0,
      // Column configuration not to be checked
      name: record.name,
    }),
  }

  const multiDelete = () => {
    store.deleteFormat(_.map(store.selectedRows, 'bizCode'))
  }

  const handlePageChange = (curPage, pageSize) => {
    store.pagination.pageSize = pageSize
    store.pagination.currentPage = curPage
    store.getList()
  }

  useEffect(() => {
    store.getList()
  }, [])

  return useObserver(() => (
    <div className="tab-box">
      <div className="FBH mb8">
        {
          codeInProduct('system-business:add') && (
            <div>
              <Button 
                type="primary" 
                onClick={() => {
                  store.formInitValue = {}
                  store.isEdit = false
                  store.drawerVis = true
                }}
              >
                添加业态
              </Button>
              <Popconfirm
                title="你确定要删除该业态吗？"
                onConfirm={() => multiDelete()}
              >
                <Button
                  className="ml8"
                  disabled={store.selectedRows.length === 0}
                >
                  {`删除业态(${store.selectedRows.length})`}
                </Button>
              </Popconfirm>
            </div>
          )
        }
      </div>
      <Table
        columns={columns}
        dataSource={store.tableData}
        loading={store.tableLoading}
        rowSelection={{
          ...rowSelection,
        }}
        pagination={{
          pageSize: store.pagination.pageSize,
          current: store.pagination.currentPage,
          total: store.pagination.totalCount,
          onChange: handlePageChange,
          // onChange={() => console.log(111)}
          showTotal: () => `合计${store.pagination.totalCount}条记录`,
        }}
      />
      <Drawer
        title={store.isEdit ? '编辑业态' : '添加业态'}
        width={560}
        visible={store.drawerVis}
        onClose={() => store.drawerVis = false}
        maskClosable={false}
        destroyOnClose
      >
        <MyForm />
      </Drawer>
    </div>
  ))
})
