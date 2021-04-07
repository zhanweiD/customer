import React from 'react'
import {observer} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {
  Table, Badge, Divider, Alert, Spin, Button, Checkbox,
} from 'antd'
import {QuestionTooltip, OmitTooltip, Authority} from '../../component'
import ModalTagEdit from './config-field-modal-edit'
import ModalCateSelect from './config-field-modal-cate'
import {getDataTypeName} from '../../common/util'

// 标签配置 - 填写配置信息
@observer
export default class StepTwo extends React.Component {
  @observable tagModalVisible = false // 标签编辑弹框

  @observable cateModalVisible = false // 类目选择弹框

  @observable editingTagIndex = -1 // 被选中编辑的标签的索引

  componentDidMount() {
    const {store} = this.props
    // 加载所属类目列表 TODO: 类目需要随时更新吗
    store.getCateList()
  }

  @action.bound checked(e) {
    const {store} = this.props
    store.checkedPulish = e.target.checked
  }

  render() {
    const {store} = this.props
    const {secondTableList, secondSelectedRows} = store

    const {
      tagModalVisible, cateModalVisible, editingTagIndex,
    } = this

    // 被选中编辑的标签对象
    const editingTag = secondTableList[editingTagIndex] || {}

    // “批量设置类目”按钮
    const btnDisabled = !secondSelectedRows.length

    // 提示信息内容的数值
    const blueCount = secondTableList.filter(item => +item.isTrue === 1).length
    const redCount = secondTableList.filter(item => +item.isTrue !== 1).length

    // 表格列
    const columns = [
      {
        title: '标签名称',
        key: 'name',
        dataIndex: 'name',
        render: name => <OmitTooltip text={name} maxWidth={60} />,
      },
      {
        title: '标签标识',
        key: 'enName',
        dataIndex: 'enName',
        render: name => <OmitTooltip text={name} maxWidth={60} />,
      },
      {
        title: '数据类型',
        key: 'valueType',
        dataIndex: 'valueType',
        render: v => getDataTypeName(+v),
      },
      {
        title: '所属类目',
        key: 'parentId',
        dataIndex: 'parentId',
        render: (parentId, record) => {
          let cateName = ''
          if (parentId) {
            cateName = store.cateMap[parentId]
          } else {
            const pathIds = record.pathIds || []
            const cateId = pathIds[pathIds.length - 1] // 所属类目的id是倒数第1个
            cateName = store.cateMap[cateId]
          }
          
          return <OmitTooltip text={cateName} maxWidth={60} />
        },
      },
      {
        title: '是否枚举',
        key: 'isEnum',
        dataIndex: 'isEnum',
        render: v => (v ? '是' : '否'),
      },
      {
        title: '关联的字段',
        key: 'dataFieldName',
        dataIndex: 'dataFieldName',
        render: name => <OmitTooltip text={name} maxWidth={70} />,
      },
      {
        title: '确认结果',
        key: 'result',
        width: 200,
        dataIndex: 'result',
        render: (v, record) => (
          +record.isTrue === 1 
            ? <Badge color="#52C41A" text={v} /> 
            : <Badge color="#F5222D" text={v} />
        ),
      },
      {
        title: '操作',
        key: 'operation',
        // dataIndex: 'isUsed',
        width: 100,
        render: (v, record, index) => (
          <span>
            <a href onClick={() => this.removeItem(index, record)}>移除</a>
            <Divider type="vertical" />
            <a href onClick={() => this.showEditModal(index, record)}>编辑</a>
          </span>
        ),
      },
    ]

    return (
      <div>
        <Spin spinning={false}>
          <Alert 
            type="info"
            showIcon
            closable
            message={(
              <span className="fs12">
                选择结果：可新建标签
                <span style={{color: '#1890FF'}}>{blueCount}</span>
                个，新建失败
                <span style={{color: '#F5222D'}}>{redCount}</span>
                个
              </span>
            )}
          />

          {/* 标题和按钮 */}
          <div className="mb16 ml2 mt24">
            <div>
              <p className="fs16 mb12" style={{color: 'rgba(0,0,0,0.85)'}}>标签列表</p>
              <Authority
                authCode="tag-manage:set-cate"
              >
                <Button 
                  type="primary" 
                  className="mr4"
                  disabled={btnDisabled}
                  onClick={() => this.showCateModal()}
                >
                  批量设置类目
                </Button>
              </Authority>
              <QuestionTooltip tip="若您不选择标签所属类目，那么标签将被放在该对象的默认类目中" />
              <Checkbox style={{marginLeft: '8px'}} checked={store.checkedPulish} onChange={this.checked}>生成的标签是否直接发布</Checkbox>
            </div>
          </div>

          {/* 表格 */}
          <Table
            key={store.forceUpdateKey}
            rowKey="dataFieldName"
            columns={columns}
            dataSource={store.secondTableList}
            rowSelection={{
              // fixed: true,
              selectedRowKeys: store.secondSelectedRows.map(item => item.dataFieldName),
              onChange: this.onRowSelect,
            }}
            pagination={false}
            // scroll={{x: 1400}}
          />

          {/* 编辑标签弹框 */}
          {
            tagModalVisible && (
              <ModalTagEdit
                tagDetail={toJS(editingTag)} // 传进去时toJS一下
                visible={tagModalVisible}
                onCancel={this.closeEditModal}
                onOk={this.handleTagEditConfirm}
                cateList={store.cateList}
              />
            )
          }

          {/* 类目选择弹框 */}
          {
            cateModalVisible && (
              <ModalCateSelect
                visible={cateModalVisible}
                options={store.cateList}
                onCancel={this.closeCateModal}
                onOk={this.handleCateConfirm}
              />
            )
          }
        </Spin>
      </div>
    )
  }

  // 选择行
  @action.bound onRowSelect(selectedRowKeys, selectedRows) {
    const {store} = this.props

    store.secondSelectedRows = selectedRows
  }

  // 移除某个标签（某行）
  @action.bound removeItem(index, record) {
    const {store} = this.props

    // 删除元素
    store.secondTableList.splice(index, 1)

    // 如果是被选中的，还需要更新选中数组
    store.secondSelectedRows = store.secondSelectedRows.filter(item => item.dataFieldName !== record.dataFieldName)
    store.forceUpdateKey = Math.random() // 强制刷新表格
  }

  // 展开编辑弹框
  @action.bound showEditModal(index, record) {
    const {store} = this.props
    // store.getTagTypeList(record.dataFieldType)
    store.tagId = record.tagId
    this.tagModalVisible = true
    this.editingTagIndex = index
  }

  // 关闭编辑弹框
  @action.bound closeEditModal() {
    this.tagModalVisible = false
  }

  isValueTypeName = num => {
    switch (num) {
      case 2:
        return '整数型'
      case 3:
        return '小数型'
      case 4:
        return '文本型'
      default:
        return '日期型'
    }
  }

  // 编辑标签确定事件
  @action.bound handleTagEditConfirm(values, cb) {
    const {store} = this.props
    const index = this.editingTagIndex
    
    // 先不直接修改原列表数据，创建个副本拿去请求校验接口
    const tagListCopy = [...toJS(store.secondTableList)]

    // values的副本
    const valuesCopy = {}

    // 将undefined的值改成空字符串
    Object.keys(values).forEach(key => {
      valuesCopy[key] = values[key] === undefined ? '' : (typeof values[key] === 'string' ? values[key].trim() : values[key])
      valuesCopy.valueTypeName = this.isValueTypeName(values.valueType)
    })

    // 要更新parentId字段（对应当前所属类目的id）
    const {pathIds} = valuesCopy
    valuesCopy.pathIds = pathIds || [] // 貌似不能传空字符串
    valuesCopy.parentId = pathIds[pathIds.length - 1] || store.defaultCateId // 没有就取默认类目id

    // 替换掉编辑后的标签
    // （这里已知标签编辑弹框的表单fieldName和标签对象的字段一一对应，所以可以直接覆盖）
    tagListCopy[index] = {...tagListCopy[index], ...valuesCopy}

    // 确认时校验数据
    store.checkTagList(
      // 参数数据
      tagListCopy, 
      // 成功回调
      () => {
        if (cb) cb()
        this.closeEditModal()
      }, 
      // 失败回调，主要是有可能会出现接口本身有问题，这时需要错误回调以停止loading效果
      () => {
        if (cb) cb()
      },
    )
  }

  // 展开类目选择弹框
  @action.bound showCateModal = () => {
    this.cateModalVisible = true
  }

  // 关闭类目选择弹框
  @action.bound closeCateModal = () => {
    this.cateModalVisible = false
  }

  // 类目选择弹框确定事件
  @action.bound handleCateConfirm(values, cb) {
    const {store} = this.props

    store.secondSelectedRows.forEach(item => {
      const {pathIds} = values
      item.pathIds = pathIds
      // 还要更新parentId
      item.parentId = pathIds[pathIds.length - 1] || store.defaultCateId
    })

    // 更新类目后校验一遍
    store.checkTagList(() => {
      if (cb) cb()
      store.secondSelectedRows = []
      this.closeCateModal()
    })
  }
}
