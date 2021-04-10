/**
 * @description 画像配置的编辑部分
 */
import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Spin, Drawer, Button, Form, Select, Space, Tree} from 'antd'
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons'
import {errorTip} from '../../common/util'
import {Loading} from '../../component'

const {Option} = Select
const onSelect = (selectedKeys, info) => {
  console.log('selected', selectedKeys, info)
}

const onCheck = (checkedKeys, info) => {
  console.log('onCheck', checkedKeys, info)
}
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    isCate: true,
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        isCate: true,
        children: [
          {
            title: '0-0-0-0',
            key: '0-0-0-0',
            isCate: false,
          },
          {
            title: '0-0-0-1',
            key: '0-0-0-1',
            isCate: false,
          },
        ],
      },
      
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    isCate: true,
    children: [
      {
        title: '0-1-0-0',
        key: '0-1-0-0',
        isCate: false,
      },
      {
        title: '0-1-0-1',
        key: '0-1-0-1',
        isCate: false,
      },
    ],
  },
]
@observer
class AddDrawer extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  componentDidMount() {
    // 获取对象，标签，类目列表
    this.store.getObjList()
  }
  formRef = React.createRef()

  @action onClose = () => {
    this.store.drawerVisible = false
    this.store.addstatus = false
    this.store.existTablesList = []
    this.store.resetValue()
  }

  // 提交
  submit = () => {
    this.formRef.current.validateFields().then(values => {
      console.log(values)
      if (this.store.addstatus) {
        // values.objId = this.store.objId
        this.store.getAdd(values)
      } else {
        values.id = this.store.detailObj.id
        this.store.getUpdate(values)
      }
    }).catch(e => {
      errorTip(e)
    })
  }

  // 下拉发生改变
  @action onOptionChange = option => {
    if (option.name === 'objId') {
      this.store.objId = option.id
      this.store.resetValue()
      
      this.formRef.current.resetFields(['search', 'name', 'identification', 'basic', 'portrait', 'eventTableInfo'])
      this.store.getTagList({id: option.id})
      this.store.getCatList({id: option.id})
      // 添加触点
      this.store.getRelTables({objId: option.id})
    }
  }

  // 触点列表改变
  @action onCatChange = option => {
    this.store.getRelTableFields({objId: this.store.objId, tableName: option})
  }

  render() {
    const {
      confirmLoading,
      formLoading,
      addstatus,
      drawerVisible,
      detailObj,
    } = this.store

    const {
      objId,
      search,
      name,
      identification,
      basic,
      portrait,
      eventTableInfo,
      type,
    } = detailObj

    // drawer设施项
    const drawerProps = {
      visible: drawerVisible,
      title: addstatus ? '添加画像' : '编辑画像',
      width: 512,
      placement: 'right',
      maskClosable: false,
      destroyOnClose: true,
      onClose: () => this.onClose(),
    }

    const layout = {
      labelCol: {span: 5},
      wrapperCol: {span: 17},
      initialValues: {
        objId,
        search,
        name,
        identification,
        basic,
        portrait,
        eventTableInfo,
        type,
      },
    }

    // 不建议遍历生成，对单项表单控制会变复杂
    const selectConfig = [
      {
        name: 'objId',
        label: '实体名称',
        placeholder: '请选择实体名称',
        option: this.store.objList,
      }, {
        name: 'search',
        label: '搜索条件',
        placeholder: '请选择可搜索条件，最多两个',
        option: this.store.tagList,
        mode: 'multiple',
      }, {
        name: 'name',
        label: '个体名称',
        placeholder: '请选择个体名称',
        option: this.store.tagList,
      }, {
        name: 'identification',
        label: '个体标识',
        placeholder: '请选择个体标识',
        option: this.store.tagList,
      }, 
      // {
      //   name: 'basic',
      //   label: '基础模块',
      //   placeholder: '请选择基础模块',
      //   option: this.store.catList,
      //   mode: 'multiple',
      //   allowClear: true,
      // }, {
      //   name: 'portrait',
      //   label: '画像模块',
      //   placeholder: '请选择画像模块',
      //   option: this.store.catList,
      //   mode: 'multiple',
      //   allowClear: true,
      // },
    ]

    return (
      <Drawer {...drawerProps}>
        {
          formLoading ? <Loading /> : (
            <Form {...layout} ref={this.formRef}>
              {selectConfig.map(item => {
                return (
                  <Form.Item 
                    key={item.name} 
                    name={item.name} 
                    label={item.label} 
                    rules={item.name === 'search' ? [{type: 'array', max: 2, message: '请选择搜索条件，并最多选择两个', required: true}] : [{required: true, message: `请选择${item.label}`}]} 
                    style={{minHeight: '24px'}}
                  >
                    <Select
                      mode={item.mode}
                      allowClear={item.allowClear}
                      placeholder={item.placeholder}
                      onChange={(value, option) => this.onOptionChange(option)}
                      className="select-item"
                      showArrow
                      disabled={item.name === 'objId' && !addstatus}
                    >
                      {
                        item.option && item.option.map(content => {
                          return (
                            <Option
                              key={content.id}
                              disabled={item.name === 'objId' ? content.status : false}
                              name={item.name}
                              id={content.id}
                              value={content.id}
                            >
                              {content.name}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>
                )
              })}
              <Form.Item
                key="basic" 
                name="basic"
                label="客户档案"
              >
                <Tree
                  checkable
                  defaultCheckedKeys={['0-0-0-0']}
                  // onExpand={onExpand}
                  // expandedKeys={expandedKeys}
                  // autoExpandParent={autoExpandParent}
                  onCheck={onCheck}
                  // checkedKeys={on}
                  onSelect={onSelect}
                  // selectedKeys={selectedKeys}
                  treeData={treeData}
                />

              </Form.Item>
              <Form.Item
                key="portrait" 
                name="portrait"
                label="标签描摹"
              >
                <Tree
                  checkable
                  // onExpand={onExpand}
                  // expandedKeys={expandedKeys}
                  // autoExpandParent={autoExpandParent}
                  onCheck={onCheck}
                  // checkedKeys={on}
                  onSelect={onSelect}
                  // selectedKeys={selectedKeys}
                  treeData={treeData}
                />

              </Form.Item>
            </Form>
          )
        }

        <div className="bottom-button">
          <Button className="mr8" onClick={() => this.onClose()}>取消</Button>
          <Button
            onClick={() => this.submit()}
            loading={confirmLoading}
            type="primary"
          >
            确认
          </Button>
        </div>
      </Drawer>
    )
  }
}

export default AddDrawer
