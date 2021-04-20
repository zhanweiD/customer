import React, {useEffect} from 'react'
import {Button, Input, Table, Cascader, Drawer, Popconfirm} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import _ from 'lodash'
import MyForm from './domain-form'


export default inject('store')(({store}) => {
  const showEdit = record => {
    // store.editId = record.id
    store.isEdit = true
    store.formInitValue = record
    store.drawerVis = true
  }

  const columns = [
    {
      title: '业务域名称',
      dataIndex: 'bizName',
    }, {
      title: '业务域Code',
      dataIndex: 'bizCode',
    }, {
      title: '所属业态',
      dataIndex: 'p_bizName',
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <span className="ac hand mr8" onClick={() => showEdit(record)}>编辑</span>
            <Popconfirm
              title="你确定要删除该业务域吗？"
              onConfirm={() => store.deleteDomain([record.bizCode])}
            >
              <span className="ac hand">删除</span>
            </Popconfirm>
          </div>
        )
      },
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      store.selectedRows = selectedRows
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  }

  const multiDelete = () => {
    store.deleteDomain(_.map(store.selectedRows, 'bizCode'))
  }

  const handlePageChange = (curPage, pageSize) => {
    store.pagination.pageSize = pageSize
    store.pagination.currentPage = curPage
    store.getList()
  }

  useEffect(() => {
    store.getList()
    store.getFormatList()
  }, [])

  return useObserver(() => (
    <div className="tab-box">
      <div className="FBH mb8">
        <Button 
          type="primary" 
          onClick={() => {
            store.formInitValue = {}
            store.isEdit = false
            store.drawerVis = true
          }}
        >
          添加业务域
        </Button>
        <Popconfirm
          title="你确定要删除该业务域吗？"
          onConfirm={() => multiDelete()}
        >
          <Button
            className="ml8"
            disabled={store.selectedRows.length === 0}
          >
            {`删除业务域(${store.selectedRows.length})`}
          </Button>
        </Popconfirm>
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
        title={store.isEdit ? '编辑业务域' : '添加业务域'}
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
