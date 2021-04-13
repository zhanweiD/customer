import {Button, Input, Table, Cascader, Drawer} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import MyForm from './format-form'

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
}

export default inject('store')(({store}) => {
  const columns = [
    {
      title: '业态名称',
      dataIndex: 'name',
    }, {
      title: '业务描述',
      dataIndex: 'qq',
    }, {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <span>编辑</span>
            <span>删除</span>
          </div>
        )
      },
    },
  ]

  return useObserver(() => (
    <div className="tab-box">
      <div className="FBH mb8">
        <Button type="primary" onClick={() => store.drawerVis = true}>
          添加业态
        </Button>
        <Button className="ml8">
          删除业态
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={[]}
        rowSelection={{
          ...rowSelection,
        }}
      />
      <Drawer
        title="添加业务域"
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
