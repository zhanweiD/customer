import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Tree, Drawer, Button} from 'antd'
import {errorTip, debounce} from '../../common/util'
import {Loading} from '../../component'

const {TreeNode} = Tree

@observer
class AddDrawer extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  onExpand = expandedKey => {
    this.store.expandedKeys = expandedKey
    this.store.autoExpandParent = false
  }

  dataOnCheck = checkedKey => {
    this.store.dataCheckedKeys = checkedKey
  }

  onClose = () => {
    this.store.drawerVisible = false
  }

  submit = () => {
    const {projectList, dataCheckedKeys} = this.store
    let param = dataCheckedKeys
    if (projectList.length === dataCheckedKeys.length) {
      param = ['100']
    } else if (dataCheckedKeys.length === 0) {
      param = ['-101']
    }
    this.store.updateData(param, this.onClose)
  }

  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode className="parents" title={item.name} key={item.name} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode className="childrens" title={item.name} key={item.projectId} {...item} />
  })

  render() {
    const {
      confirmLoading, 
      expandedKeys,
      dataCheckedKeys, 
      drawerVisible,
      projectList,
      detailLoading,
    } = this.store

    const drawerProps = {
      visible: drawerVisible,
      title: '数据权限',
      width: 560,
      maskClosable: false,
      destroyOnClose: true,
      onClose: () => this.onClose(),
    }
    
    return (
      <Drawer {...drawerProps}>
        {
          detailLoading ? <Loading /> : (
            <div>
              {projectList.length ? (
                <Tree
                  checkable
                  // onExpand={this.onExpand}
                  selectable={false}
                  // autoExpandParent={autoExpandParent} // 展开父节点
                  defaultExpandedKeys={expandedKeys} // 展开制定节点
                  onCheck={this.dataOnCheck}
                  checkedKeys={dataCheckedKeys}
                  // defaultExpandAll
                  // treeData={menuTree}
                  style={{fontSize: '12px'}}
                  className="roleTree"
                >
                  {this.renderTreeNodes(projectList)}
                </Tree>
              ) : null}
            </div>
          )
        }
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
