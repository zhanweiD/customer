/**
 * @description 对象配置 - 数据表
 */
import {Component} from 'react'
import {action, observable} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {
  Popconfirm, Button, Input,
} from 'antd'
import {ListContent, Authority, OmitTooltip} from '../../../component'

import ConfigField from './config-field'
import ModalAddTable from './modal-add-table'

import store from './store'
import './index.styl'

@inject('bigStore')
@observer
export default class DataSheet extends Component {
  constructor(props) {
    super(props)
    const {bigStore} = props
    this.bigStore = bigStore
    store.objId = props.objId
    // store.typeCode = bigStore.typeCode
    store.relationType = bigStore.objDetail.type
  }

  @observable tagConfigVisible = false

  columns = [
    {
      title: '数据表名称',
      key: 'dataTableName',
      dataIndex: 'dataTableName',
      render: text => <OmitTooltip maxWidth={250} text={text} />,
    }, {
      title: '主标签字段名',
      key: 'mappingKey',
      dataIndex: 'mappingKey',
    }, {
      title: '已配置/字段数',
      key: 'configuredField',
      dataIndex: 'configuredField',
      render: (text, record) => (
        <div>{`${text}/${record.associatedField}`}</div>
      ),
    }, {
      title: '已有标签被使用',
      key: 'isUsed',
      dataIndex: 'isUsed',
      render: text => <div>{text ? '是' : '否'}</div>,
    }, {
    }, {
      title: '更新时间',
      key: 'mtime',
      dataIndex: 'mtime',
      render: t => moment(+t).format('YYYY-MM-DD'),
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
                  authCode="tag-manage:add-data"
                >
                  <span className="disabled">移除</span> 
                </Authority>
              )
              : (
                <Authority
                  authCode="tag-manage:add-data"
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
          {
            this.bigStore.objDetail && this.bigStore.objDetail.type !== 0 ? (
              <Authority
                authCode="tag-manage:add-tag"
              >
                <a href className="ml16" onClick={() => this.openTagConfig(record)}>生成标签</a>
              </Authority>
            ) : null
          }
        
        </div>
      ),
    },
  ]

  componentDidUpdate(prevProps) {
    if (prevProps.objId !== this.props.objId) {
      store.objId = this.props.objId

      // store.getValueTrend(pieData => {
      //   this.drawSaveTrend(pieData)
      // })
      store.getList({objId: store.objId, currentPage: 1})
    }
  }

  @action removeList(data) {
    const t = this
    const params = {
      storageId: window.defaultParams.hiveStorageId,
      tableName: data.dataTableName,
    }
    store.removeList(params, () => {
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
    store.getEntityDataSource(this.bigStore.getTreeData)
  }

  @action.bound openTagConfig(data) {
    store.editSelectedItem = data
    this.tagConfigVisible = true
  }

  @action.bound closeTagConfig() {
    this.tagConfigVisible = false
  }

  @action.bound tagConfigSuccess() {
    this.bigStore.getTreeData()
    store.getList({
      objId: store.objId,
      currentPage: 1,
    })
  }

  @action.bound onTableCheck(selectedRowKeys) {
    // // 表格 - 已选项
    // store.selectedRows = selectedRows

    // 表格 - 已选项key数组
    store.publishRowKeys = selectedRowKeys
  }

  render() {
    const buttons = [
      <div className="dfjs">
        <Authority
          authCode="tag-manage:add-data"
        >
          <Button 
            type="primary" 
            className="mr8"
            onClick={() => this.openModal()}
          >
            添加数据表
          </Button>
        </Authority>
        {/* <Input 
          style={{width: '128px', marginRight: '24px'}} 
          placeHolder="请输入数据表名称" 
          onChange={v => store.getDataSheet({})}
        /> */}
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

    const rowSelection = {
      selectedRowKeys: store.publishRowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        // disabled: record.status !== 1, // 权限审批中的，不可进行申请、批量申请，且显示审批中
      }),
    }

    const listConfig = {
      columns: this.columns,
      initParams: {objId: store.objId},
      // rowSelection: rowSelection || null,
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
                objId={store.objId}
                tableName={store.tableName}
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
