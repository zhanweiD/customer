import {Button, Input, Table, Cascader, Drawer} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import MyForm from './scene-form'

const {Search} = Input
const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

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
      title: '场景名称',
      dataIndex: 'name',
    }, {
      title: '所属业态',
      dataIndex: 'qq',
    }, {
      title: '所属业务域',
      dataIndex: 'w',
    }, {
      title: '场景描述',
      dataIndex: 'e',
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
      <div className="FBH FBJB mb8">
        <div className="FBH">
          <Button type="primary" onClick={() => store.drawerVis = true}>
            添加场景
          </Button>
          <Button className="ml8">
            删除场景
          </Button>
        </div>
        <div className="FBH">
          <Cascader options={options} placeholder="请选择" />
          <Search placeholder="请输入标签名称" className="ml8" />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={[]}
        rowSelection={{
          ...rowSelection,
        }}
      />
      <Drawer
        title="添加场景"
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
