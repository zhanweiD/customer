import {Component, useEffect} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Table, Badge, Input} from 'antd'
import {debounce} from '../../common/util'

import store from './store-scene-tags'

@observer
class TagList extends Component {
  constructor(props) {
    super(props)
    
    store.sceneId = +props.sceneId
    props.getTagList && props.getTagList(store.getList)
  }

  searchForm = null
  searchStr = '{}' 

  columns = [{
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '数据类型',
    dataIndex: 'type',
  }, {
    title: '对象',
    dataIndex: 'objName',
  }, {
    title: '创建人',
    dataIndex: 'cuser',
  }, 
  // {
  //   title: '使用状态',
  //   dataIndex: 'used',
  //   // render: text => (text ? '使用中' : '未使用'),
  //   render: text => (text ? <Badge color="green" text="使用中" />
  //     : <Badge color="blue" text="未使用" />),
  // }, {
  //   title: '被API调用次数 ',
  //   dataIndex: 'apiInvokeCount',
  //   sorter: true,
  // }
  ]

  componentWillMount() {
    store.getList()
    store.getObjList()
  }

  @action handleChange(e) {
    this.searchStr = JSON.stringify(e)
  }

  @action handleTableChange = (pagination, filters, sorter) => {
    store.params.currentPage = pagination.current
    store.params.pageSize = pagination.pageSize
    store.params.order = sorter.order === 'descend' ? 'DESC' : 'ASC'
    store.params.sort = sorter.columnKey
    store.getList()
  }


  // 搜索
  @action handleSearch() {
    const values = JSON.parse(this.searchStr)

    // 筛选条件
    store.params = {
      ...values,
    }
    // 列表
    store.params.currentPage = 1
    store.params.pageSize = 10
    store.getList()
  }

  // 重置
  @action handleReset() {
    if (this.searchForm) this.searchForm.resetFields()
    this.searchStr = '{}' 
    Object.keys(store.params).forEach(key => store.params[key] = '')
    store.params.currentPage = 1
    store.params.pageSize = 10
    store.getList()
  }

  componentWillUnmount() {
    this.handleReset()
  }

  @action searchTag(v) {
    const tagName = {tagName: v.target.value}
    debounce(() => {
      console.log(tagName)
      store.getList(tagName)
    })
  }

  render() {
    const {
      tagInfo: {
        data,
        pagination,
        loading,
      },
      objList,
    } = store
    return (
      <div className="scene-tags box-border">
        {/* <SearchForm 
          ref={form => this.searchForm = form}
          onChange={() => this.handleChange(this.searchForm.getFieldsValue())}
          onSearch={() => this.handleSearch()}
          onReset={() => this.handleReset()}
          objList={toJS(objList)}
        /> */}
        <div className="mb8 ta-r">
          <Input placeholder="请输入标签名称" style={{width: '180px'}} onChange={this.searchTag} />
        </div>
        <Table 
          className="bgf"
          loading={loading}
          columns={this.columns} 
          dataSource={data.slice()} 
          onChange={this.handleTableChange}
          pagination={{
            pageSize: pagination.pageSize,
            current: pagination.current,
            total: pagination.total,
            showTotal: () => `合计${pagination.total}条记录`,
          }}
        />
      </div>
    )
  }
}

export default props => {
  // const ctx = OnerFrame.useFrame()

  // useEffect(() => {
  //   ctx.useProject(true, null, {visible: false})
  // }, [])

  return (
    <TagList {...props} />
  )
}
