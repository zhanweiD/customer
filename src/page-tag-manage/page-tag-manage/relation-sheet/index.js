/**
 * @description 对象配置 - 关系表
 */
import {Component} from 'react'
import {action, observable} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {
  Popconfirm, Button, Input,
} from 'antd'
import {ListContent, OmitTooltip, Authority} from '../../../component'

import ConfigField from './config-field'
import ModalAddTable from './modal-add-table'

import store from './store'
import './index.styl'

@inject('bigStore')
@observer
export default class RelationSheet extends Component {
  constructor(props) {
    super(props)
    const {bigStore} = props
    this.bigStore = bigStore
    store.objId = bigStore.objId
    // store.typeCode = bigStore.typeCode
    store.relationType = bigStore.objDetail.type
  }

  @observable tagConfigVisible = false

  columns = [
    {
      title: '表中文名',
      key: 'dataTableNameAlias',
      dataIndex: 'dataTableNameAlias',
      render: text => <OmitTooltip maxWidth={250} text={text} />,
    }, {
      title: '表名称',
      key: 'dataTableName',
      dataIndex: 'dataTableName',
      render: text => <OmitTooltip maxWidth={250} text={text} />,
    }, 
    // {
    //   title: '数据源（库）',
    //   key: 'dataStorageId',
    //   dataIndex: 'dataStorageId',
    //   render: text => <OmitTooltip maxWidth={250} text={text} />,
    // }, 
    {
      title: '已绑/字段总数',
      key: 'bindFields',
      dataIndex: 'bindFields',
      render: (t, record) => `${t}/${record.totalFields}`,
    }, {
    }, {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      render: t => moment(+t).format('YYYY-MM-DD'),
    }, {
      title: '描述',
      key: 'desrc',
      dataIndex: 'desrc',
      render: text => <OmitTooltip maxWidth={250} text={text} />,
    }, {
      key: 'action',
      title: '操作',
      dataIndex: 'action',
      width: 150,
      render: (text, record) => (
        <div>
          {
            (record.isUsed || record.status === 1 || record.configuredField) 
              ? (
                <Authority
                  authCode="tag-manage:add-relational"
                >
                  <span className="disabled">移除</span> 
                </Authority>
              ) : (
                <Authority
                  authCode="tag-manage:add-relational"
                >
                  <Popconfirm 
                    placement="topRight" 
                    title="你确定要移除该数据表吗？" 
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => this.removeList(record)}
                  >
                    <a href>移除</a>
                  </Popconfirm>
                </Authority>
              )
          }
          <Authority
            authCode="tag-manage:config-field"
          >
            <a href className="ml16" onClick={() => this.openTagConfig(record)}>配置字段</a>
          </Authority>
        </div>
      ),
    },
  ]

  componentDidUpdate(prevProps) {
    if (prevProps.objId !== this.props.objId) {
      store.objId = this.props.objId

      store.getList({objId: store.objId, currentPage: 1})
    }
  }

  @action removeList(data) {
    const t = this
    store.removeList(data, () => {
      t.bigStore.getTreeData()
      store.getList({
        objId: store.objId,
        currentPage: 1,
      })
    })
  }

  @action.bound openModal() {
    store.bothTypeCode = 2 // 实体
    store.modalVisible = true
    store.getEntityDataSource()
  }

  @action.bound openTagConfig(data) {
    store.editSelectedItem = data
    store.getConfigFields(data)
    this.tagConfigVisible = true
  }

  @action.bound closeTagConfig() {
    this.tagConfigVisible = false
  }

  @action.bound tagConfigSuccess() {
    store.getList({
      objId: store.objId,
      currentPage: 1,
    })
  }

  render() {
    const buttons = [
      <div className="dfjs">
        <Authority
          authCode="tag-manage:add-relational"
        >
          <Button 
            type="primary" 
            className="mr8"
            onClick={() => this.openModal()}
          >
            添加关系表
          </Button>
        </Authority>
        <Input 
          style={{width: '156px', marginRight: '24px'}} 
          placeHolder="请输入表中英文名称" 
          onChange={v => store.getList({keyWord: v.target.value, currentPage: 1})}
        />
      </div>,
      
      // <Popconfirm 
      //   placement="topRight" 
      //   title="标签被删除后不可恢复，确定删除？" 
      //   disabled
      //   onConfirm={() => this.remove(store.publishRowKeys)}
      // >
      //   <Button className="mr8" disabled>批量删除</Button>
      // </Popconfirm>,
    ]

    const listConfig = {
      columns: this.columns,
      initParams: {objId: store.objId},
      buttons: [buttons],
      // paginationConfig: {
      //   hideOnSinglePage: true, // 只有一页时隐藏
      // }, 
      store, // 必填属性
    }

    return (
      <Provider dataSheetStore={store}>
        <div>
          <ListContent {...listConfig} />
          <ModalAddTable store={store} />
          {
            this.tagConfigVisible && (
              <ConfigField 
                store={store}
                visible={this.tagConfigVisible} 
                onClose={this.closeTagConfig}
                onSuccess={this.tagConfigSuccess}
              />
            )
          }
        </div>
      </Provider>
    )
  }
}
