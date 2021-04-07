import React, {useContext} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {
  Table, Spin, Input, Form,
} from 'antd'
import {OmitTooltip} from '../../component'
// import {getNamePattern} from '../../common/util'

const EditableContext = React.createContext()

function getNamePattern(max = 32) {
  return [{
    transform: value => value && value.trim(),
  }, {
    max, 
    message: `不能超过${max}个字符`,
  }, {
    pattern: /^[a-zA-Z0-9_()\u4e00-\u9fa5]+$/, message: '格式不正确，允许输入中文/英文/数字/下划线',
  }, {
    pattern: /^(?!_)/, message: '不允许下划线开头',
  }, {
    pattern: /^(?!数栖)/, message: '不允许数栖开头',
  }]
}

const EditableRow = ({index, ...props}) => {
  const [form] = Form.useForm()

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  editable,
  children,
  dataIndex,
  record,
  configFieldList,
  compType,
  checkFieldName,
  ...restProps
}) => {
  const form = useContext(EditableContext)

  if (record) {
    form.setFieldsValue({dataFieldNameAlias: record[dataIndex]})
  }

  const save = async e => {
    try {
      const values = await form.validateFields()
      configFieldList.forEach(item => {
        if (item.id === record.id) item.dataFieldNameAlias = values.dataFieldNameAlias
      })
    } catch (errInfo) {
      console.log(errInfo)
    }
  }

  let childNode = children 

  if (editable && compType === 'input') {
    childNode = (
      <Form.Item
        name={dataIndex}
        rules={[
          ...getNamePattern(),
          {validator: (rule, value, callback) => checkFieldName(record, value, callback)},
        ]}
      >
        <Input size="small" onChange={save} />
      </Form.Item>
    )
  }
  return <td {...restProps}>{childNode}</td>
}

// 标签配置 - 填写配置信息
@observer
export default class StepTwo extends React.Component {
  @action.bound checked(e) {
    const {store} = this.props
    store.checkedPulish = e.target.checked
  }

  // 表格列
  columns = [
    {
      title: '字段名称',
      key: 'dataFieldName',
      dataIndex: 'dataFieldName',
      render: name => <OmitTooltip text={name} maxWidth={180} />,
    },
    {
      title: '字段类型',
      key: 'dataFieldType',
      dataIndex: 'dataFieldType',
    },
    {
      title: '字段描述',
      key: 'dataFiledDescr',
      dataIndex: 'dataFiledDescr',
      render: descr => (descr ? <OmitTooltip text={descr} maxWidth={60} /> : '-'),
    },
    {
      title: '字段中文名',
      key: 'dataFieldNameAlias',
      dataIndex: 'dataFieldNameAlias',
      editable: true,
      compType: 'input',
      width: '25%',
      render: t => t,
    },
  ]

  render() {
    const {store} = this.props
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    }
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          compType: col.compType,
          configFieldList: store.configFieldList,
          checkFieldName: store.checkFieldName,
        }),
      }
    })
    

    return (
      <div>
        <Spin spinning={false}>
          {/* 标题和按钮 */}
          {/* <div className="mb16 ml2">
            <p className="fs16 mb12" style={{color: 'rgba(0,0,0,0.85)'}}>字段列表</p>
          </div> */}

          {/* 表格 */}
          <Table
            key={store.forceUpdateKey}
            ref={this.props.ref} 
            components={components}
            rowKey="dataFieldName"
            rowClassName={() => 'editable-row'}
            columns={columns}
            dataSource={store.secondTableList}
            pagination={false}
          />
        </Spin>
      </div>
    )
  }
}
