/**
 * @description 场景 - 选择标签 - 标签树
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {
  observable, action, computed, toJS,
} from 'mobx'
import {Tree, Checkbox, Button} from 'antd'
import {RightOutlined} from '@ant-design/icons'

import {NoBorderInput, Loading, OmitTooltip} from '../../../component'
import {IconChakan} from '../../../icon-comp'
import tagIcon from '../../../icon/new-tag.svg'

const {TreeNode} = Tree

@observer
export default class TagTree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  @observable searchKey = undefined

  // 全选操作
  @observable allChecked = false
  @observable indeterminate = false

  componentWillReceiveProps(next) {
    // const {listRemoveItem} = this.props
    
    if (next.listRemoveItem) {
      this.store.checkedKeys = this.store.checkedKeys.filter(d => +d !== +next.listRemoveItem.id)
      this.store.disabledKeys = this.store.disabledKeys.filter(d => +d !== +next.listRemoveItem.id)

      this.store.checkedTagData = this.store.checkedTagData.filter(d => +d.id !== +next.listRemoveItem.id)

      this.allChecked = false
      if (this.store.checkedKeys.length) {
        this.indeterminate = true
      } else {
        this.indeterminate = false
      }
    }
  }

  @action destroy() {
    this.store.checkedKeys.clear()
    this.store.checkedTagData.clear()
    this.store.disabledKeys.clear()
    this.store.disabledTagKeys.clear()

    this.searchKey = undefined
    this.allChecked = false
    this.indeterminate = false
  }

  // 全选操作
  @action.bound handleAllSelect(e) {
    this.allChecked = e.target.checked

    if (e.target.checked) {
      this.indeterminate = false
      this.allChecked = true
      this.store.checkedKeys.replace(this.getTagList.allKeys)
      this.store.checkedTagData.replace(this.getTagList.allTags)
    } else if (this.store.disabledKeys.length || this.store.disabledTagKeys.length) {
      this.indeterminate = true
      this.allChecked = false
      this.store.checkedKeys.replace(this.store.disabledKeys)
    } else {
      this.destroy()
    }
  }

  @action.bound onCheck(checkedKeys, e) {
    const {checkedNodes} = e

    // 全选操作
    if (checkedKeys.length === this.getTagList.allKeys.length) {
      this.allChecked = true
      this.indeterminate = false
    } else if (checkedKeys.length) {
      this.indeterminate = true
    } else {
      this.allChecked = false
      this.indeterminate = false
    }

    // 选择的标签数据
    this.store.checkedTagData = checkedNodes.filter(d => d.tagData).map(d => d.tagData)
    this.store.checkedKeys.replace(checkedKeys)
  }

  @action.bound rightToTable() {
    const {rightToTable} = this.props
    const disabledKeys = this.store.checkedTagData.map(d => d.id)

    this.store.disabledKeys.replace(disabledKeys)
    this.store.checkedKeys.replace(disabledKeys)

    if (disabledKeys.length) {
      this.allChecked = false
      this.indeterminate = true
    }

    rightToTable(toJS(this.store.checkedTagData))
  }

  // 查询树节点
  @action.bound searchTree(data) {
    this.searchKey = data
    this.store.getSelectTag({
      searchKey: data,
    })
  }

  // 获取所有标签列表数据和rowKeys
  @computed get getTagList() {
    const {selectTagData, disabledTagKeys} = this.store
    // all keys
    const allKeys = selectTagData.filter(d => !disabledTagKeys.includes(d.id)).map(d => d.id) || []

    // all tags
    const allTags = selectTagData.filter(d => !d.type && !disabledTagKeys.includes(d.id)).map(d => d && d.tag)

    return {
      allTags,
      allKeys,
    }
  }

  renderTreeNodes = data => data.map(item => {
    // 0 标签 1 类目
    if (item.children) {
      return (
        <TreeNode
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          key={item.id}
          dataRef={item}
          selectable={false}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }

    if (item.type) {
      return (
        <TreeNode
          key={item.id}
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          selectable={false}
        />
      )
    }

    return (
      <TreeNode
        key={item.id}
        title={<OmitTooltip maxWidth={120} text={item.name} />}
        selectable={false}
        tagData={{
          parentId: item.parentId,
          ...item.tag,
        }}
        icon={<img src={tagIcon} alt="icon" style={{width: '14px'}} />}
        disableCheckbox={this.store.disabledKeys.includes(item.id) || this.store.disabledTagKeys.includes(item.id)}
      />
    )
  })

  render() {
    const {selectTagLoading, selectTagTreeData, checkedKeys, checkedTagData} = this.store

    return (
      <div className="FBH" style={{height: 'calc(100vh - 178px)'}}>
        <div className="select-tree pb16">
          <div className="select-tree-header">
            <NoBorderInput
              placeholder="请输入标签名称"
              value={this.searchKey}
              onChange={this.searchTree}
            />
            <IconChakan size="14" className="mr8" onClick={this.onSearch} />
          </div>
          {
            selectTagLoading ? <Loading mode="block" height={100} />
              : (
                <Fragment>
                  <Checkbox
                    checked={this.allChecked}
                    indeterminate={this.indeterminate}
                    onChange={this.handleAllSelect}
                    className="all"
                  >
                    全选
                  </Checkbox>
                  <Tree
                    checkable
                    checkStrictly={false}
                    defaultExpandAll
                    showIcon
                    onCheck={this.onCheck}
                    checkedKeys={toJS(checkedKeys).map(String)}
                  >
                    {this.renderTreeNodes(selectTagTreeData)}
                  </Tree>
                </Fragment>
              )
          }
        </div>
        <div className="select-tag-btn">
          <Button
            type="primary"
            icon={<RightOutlined />}
            size="small"
            style={{display: 'block'}}
            className="mb4"
            disabled={!checkedTagData.length}
            onClick={this.rightToTable}
          />
        </div>
      </div>

    )
  }
}
