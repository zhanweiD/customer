import React, {Component} from 'react'
import {observer, useLocalStore} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Tree, Drawer, Button, Form, Input} from 'antd'
import {errorTip, getNamePattern, debounce} from '../../common/util'

const {TreeNode} = Tree
@observer
class AddDrawer extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  formRef = React.createRef()
  
  onExpand = expandedKey => {
    this.store.expandedKeys = expandedKey
    this.store.autoExpandParent = false
  }

  menuOnCheck = checkedKey => {
    this.store.menuCheckedKeys = checkedKey
  }

  dataOnCheck = checkedKey => {
    this.store.dataCheckedKeys = checkedKey
  }

  onClose = () => {
    this.store.drawerVisible = false
  }
  checkName = (rule, name, callback) => {
    debounce(() => this.store.checkName(name, callback))
  }

  submit = () => {
    this.formRef.current.validateFields().then(values => {
      values.menuIds = this.store.menuCheckedKeys.map(Number)
      if (this.store.roleStatus === 3) {
        this.store.addRole(values, this.onClose)
      } else if (this.store.roleStatus !== 0) {
        this.store.putRole(values, this.onClose)
      } else {
        this.store.addRole(values, this.onClose)
      }
    }).catch(e => {
      errorTip(e)
    })
  }

  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode className="parents" title={item.name} key={item.id.toString()} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode className="childrens" title={item.name} key={item.id.toString()} {...item} />
  })

  render() {
    const {
      menuTree, 
      confirmLoading, 
      dataTree, 
      expandedKeys,
      menuCheckedKeys, 
      autoExpandParent,
      roleStatus,
      infoRole,
    } = this.store
    const drawerProps = {
      visible: this.store.drawerVisible,
      title: roleStatus === 0 ? '新建角色' : (roleStatus === 1 ? '编辑角色' : '角色详情'),
      width: 960,
      className: 'role-drawer',
      maskClosable: false,
      destroyOnClose: true,
      onClose: () => this.onClose(),
    }
    const layout = {
      labelCol: {span: 3},
      wrapperCol: {span: 11},
    }
    
    return (
      <Drawer {...drawerProps}>
        <Form {...layout} ref={this.formRef}>
          <Form.Item
            label="角色名称"
            name="name"
            initialValue={infoRole.name}
            rules={[
              {
                required: true,
                message: '请输入角色名',
              },
              {...getNamePattern},
              {validator: this.checkName},
            ]}
          >
            <Input placeHolder="请输入用户名" size="small" />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            initialValue={infoRole.description}
            rules={[
              {max: 128, message: '描述不能超过128个字符'},
            ]}
          >
            <Input.TextArea placeHolder="请输入描述" size="small" autoSize={{minRows: 3}} />
          </Form.Item>
        </Form>
        <div className="ml32 mb24">
          <div className="mb16 fs12">功能权限</div>
          {menuTree.length ? (
            <Tree
              checkable
              // onExpand={this.onExpand}
              selectable={false}
              // autoExpandParent={autoExpandParent} // 展开父节点
              defaultExpandedKeys={expandedKeys} // 展开制定节点
              onCheck={this.menuOnCheck}
              checkedKeys={menuCheckedKeys}
              // defaultExpandAll
              // treeData={menuTree}
              style={{fontSize: '12px'}}
              className="roleTree"
            >
              {this.renderTreeNodes(menuTree)}
            </Tree>
          ) : null}
        </div>
        
        <div className="bottom-button">
          <Button className="mr8" onClick={() => this.onClose()}>取消</Button>
          <Button
            onClick={() => this.submit()}
            confirmLoading={confirmLoading}
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
