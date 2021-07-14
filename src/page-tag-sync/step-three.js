import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Button, Tag, Popconfirm} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'

@inject('bigStore')
@observer
export default class StepThree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.bigStore = props.bigStore
  }

  @action.bound submit() {
    const {previewData, tableData} = this.store
    const {closeDrawer} = this.props
    const t = this
    const mainTagMappingKeys = tableData.filter(d => d.isMajor).map(s => ({
      tagId: s.aid,
      columnName: s.columnName || s.enName, 
      columnType: s.columnType,
    }))

    const source = tableData.filter(d => !d.isMajor).map(s => ({
      tagId: s.aid,
      columnName: s.columnName || s.enName, 
      columnType: s.columnType,
    }))
    const params = {
      name: previewData.name,
      objId: previewData.objId && previewData.objId.key,
      descr: previewData.descr,
      dataDbType: previewData.dataDbType && previewData.dataDbType.key,
      dataStorageId: previewData.dataStorageId && previewData.dataStorageId.key,
      isDefineTable: previewData.isDefineTable ? 1 : 0,
      source,
      mainTagMappingKeys,
    }

    if (previewData.isDefineTable) {
      params.tableName = previewData.tableName
    }

    this.store.addSync(params, () => {
      closeDrawer()
      t.bigStore.getList({currentPage: 1})
    })
  }

  render() {
    const {show} = this.props
    const {previewData, tableData, confirmLoading} = this.store

    const {
      name,
      objId = {},
      descr,
      dataDbType = {},
      dataStorageId = {},
      tableName,
    } = previewData

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="preview-box">
          <div className="info-title ">基本信息</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '方案名称',
              value: name,
            }, {
              title: '同步对象',
              value: objId.label,
            }, {
              title: '方案描述',
              value: descr,
            }]}
            className="mb24"
          />
          {/* <div className="info-title ">配置目的源</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '数据源类型',
              value: dataDbType.label,
            }, {
              title: '数据源',
              value: dataStorageId.label,
            }, {
              title: '表',
              value: `tbjh_${tableName}`,
            }]}
            className="mb24"
          /> */}
          <div className="info-title ">主标签配置</div>
          <NemoBaseInfo 
            dataSource={tableData.filter(d => d.isMajor).map(d => ({
              title: d.name,
              value: d.columnName,
            }))}
            className="mb24"
          />
          <div className="info-title ">配置同步标签</div>
          <div className="FBH mb24">
            <div className="c45">
              <span>同步标签总数：</span>
              {tableData.length}
            </div>
            <div>{previewData.tagTotalCount}</div>
          </div>
          <div className="FBH mb24">
            <div className="c45">同步标签：</div>
            <div>{tableData.map(d => <Tag>{d.name}</Tag>)}</div>
          </div>
        </div>
       
        <div className="bottom-button">
          <Popconfirm
            title="您确定要提交该同步计划吗?"
            placement="topRight"
            onConfirm={this.submit}
            // onCancel={cancel}
            okText="是的"
            cancelText="取消"
          >
            <Button
              type="primary"
              // onClick={this.submit}
              loading={confirmLoading}
            >
              提交
            </Button>
          </Popconfirm>
          
        </div>
      </div>
    )
  }
}
