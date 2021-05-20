import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Select, Switch, Radio, Input} from 'antd'
import {OmitTooltip} from '../../../component'

const FormItem = Form.Item
const {Option} = Select

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
  colon: false,
}

@inject('bigStore')
@Form.create()
@observer
class ModalAddTable extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.bigStore = props.bigStore
  }

  @observable chooseEntity // 简单关系 从关联实体的数据表中选择的实体
  @observable chooseEntityMaJorKey // 简单关系 从关联实体的数据表中选择的实体 的主键

  @action.bound initData() {
    const {form: {resetFields}} = this.props
    this.store.majorKeyField = undefined
    this.store.entity1Key = undefined
    this.store.entity2Key = undefined
  }

  @action.bound onSwitchChange(checked) {
    const {form: {resetFields}} = this.props

    this.store.tableName = undefined
    resetFields(['dataTableName'])
  }
  
  /**
   * @description 选择数据表；请求数据表下字段列表
   * @param {*} tableName 数据表名
   */
  @action.bound selectDataSheet(tableName) {
    const t = this
    const {form: {resetFields}} = this.props
    if (tableName !== this.store.tableName) {
      this.store.tableName = tableName

      resetFields(['mappingKey'])

      // 实体
      this.store.getFieldList()
      
      this.initData()
    }
  }

  @action.bound selectMajorKey(field) {
    this.store.majorKeyField = field
  }

  @action handleSubmit = e => {
    const {
      form: {
        validateFields,
      },
    } = this.props
    const t = this

    validateFields((err, values) => {
      if (!err) {
        // 实体添加关系表
        this.store.saveEntityTable(values, () => {
          t.bigStore.getTreeData()
          t.store.getList({
            objId: t.store.objId,
            currentPage: 1,
          })
          t.handleCancel()
        })
      } 
    })
  }

  @action handleCancel = () => {
    const {store} = this.props
    this.chooseEntity = undefined
    this.chooseEntityMaJorKey = undefined
    store.closeModal()
    this.handleReset()
  }

  @action handleReset = () => {
    const {
      form: {
        resetFields,
      },
    } = this.props
    resetFields()
  }

  @action checkName = (rule, value, callback) => {
    this.store.checkTableName(value, callback)
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue,
      },

    } = this.props

    const {
      modalVisible,
      confirmLoading,
      dataSourceList,
      dataSheetList,
      fieldList,
      bothTypeCode,
      storageId,
    } = this.store

    return (
      <Modal
        width={525}
        visible={modalVisible}
        maskClosable={false}
        destroyOnClose
        title="添加关系表"
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        confirmLoading={confirmLoading}
        className="data-sheet-modal"
        okText="确定"
        cancelText="取消"
      >
        <Form>
          <FormItem {...formItemLayout} label="表中文名">
            {getFieldDecorator('dataTableNameAlias', {
              // initialValue: storageId,
              rules: [
                {required: true, message: '请输入表中文名'},
                {validator: this.checkName},
              ],
            })(
              <Input placeholder="请输出表中文名" />
            )}
          </FormItem>
          <FormItem 
            {...formItemLayout}
            label="关系表"
          >
            {getFieldDecorator('dataTableName', {
              rules: [{required: true, message: '请选择关系表'}],
            })(
              <Select placeholder="请选择关系表" onSelect={v => this.selectDataSheet(v)} showSearch optionFilterProp="children">
                {
                  dataSheetList.map(item => (
                    <Option key={item.dataTableNameAlias} value={item.dataTableNameAlias}>{item.dataTableNameAlias}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem 
            {...formItemLayout} 
            extra="主标签绑定的字段"
            label={<OmitTooltip text="字段" maxWidth={80} className="rel-entity-name" />}
          >
            {getFieldDecorator('dataFieldName', {
              rules: [{required: true, message: '请选择主标签绑定的字段'}],
            })(
              <Select placeholder="请选择主标签绑定的字段" onSelect={v => this.selectMajorKey(v)} showSearch optionFilterProp="children">
                {
                  fieldList.map(item => (
                    <Option key={item} value={item}>{item}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default ModalAddTable
