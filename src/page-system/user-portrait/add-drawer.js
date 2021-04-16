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
const {TreeNode} = Tree

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

  findParent = (parentId, parentIds = []) => {
    if (parentId === 0) {
      return parentIds
    }

    const {cates} = this.store
    const parentObj = cates.filter(item => item.id === parentId)[0]
    parentIds.push(parentObj.id)
 
    return this.findParent(parentObj.parentId, parentIds)
  }

  @action basisCheck = (keys, item) => {
    const {cates, basic} = this.store
    this.store.basic = []
    const tags = item.checkedNodes.filter(sitem => !sitem.children)
    cates.forEach(sitem => {
      const childs = tags.filter(citem => sitem.id === citem.parentId)
      this.store.basic.push({catIdList: [sitem.id], tagIdList: childs.map(citem => citem.aid)})
    })
    console.log(basic)
  }

  @action portraitCheck = (keys, item) => {
    const {cates, portrait} = this.store
    this.store.portrait = []
    console.log(111)
    const tags = item.checkedNodes.filter(sitem => !sitem.children)
    cates.forEach(sitem => {
      const childs = tags.filter(citem => sitem.id === citem.parentId)
      this.store.portrait.push({catIdList: [sitem.id], tagIdList: childs.map(citem => citem.aid)})
    })
    console.log(portrait)
  }

  // 提交
  submit = () => {
    const {basic, portrait, addstatus, getAdd, getUpdate, detailObj} = this.store
    this.formRef.current.validateFields().then(values => {
      values.basic = toJS(basic)
      values.portrait = toJS(portrait)
      if (addstatus) {
        // values.objId = this.store.objId
        getAdd(values)
      } else {
        values.id = detailObj.id
        getUpdate(values)
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
      this.store.getTagTree({objId: option.id})

      // this.store.getCatList({id: option.id})
    }
  }

  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode className="parents" title={item.name} key={item.aid} {...item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode disabled={item.isCate} className="childrens" title={item.name} key={item.aid} {...item} />
  })

  render() {
    const {
      confirmLoading,
      formLoading,
      addstatus,
      drawerVisible,
      detailObj,
      catList,
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
                  // defaultCheckedKeys={['0-0-0-0']}
                  onCheck={this.basisCheck}
                  selectable={false}
                  // treeData={catList}
                >
                  {this.renderTreeNodes(catList)}
                </Tree>

              </Form.Item>
              <Form.Item
                key="portrait" 
                name="portrait"
                label="标签描摹"
              >
                <Tree
                  checkable
                  onCheck={this.portraitCheck}
                  selectable={false}
                >
                  {this.renderTreeNodes(catList)}
                </Tree>

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
