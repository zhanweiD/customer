import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {RightOutlined} from '@ant-design/icons'
import {Tree, Checkbox, Button} from 'antd'
import {
  observable, toJS, action, computed,
} from 'mobx'
import {NoBorderInput, Loading, OmitTooltip} from '../component'
import {IconChakan} from '../icon-comp'
import tagIcon from '../icon/new-tag.svg'

const {TreeNode} = Tree

@observer
export default class SyncTagTree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 全选操作
  @observable allChecked = false
  @observable indeterminate = false

  componentWillReceiveProps(next) {
    const {listRemoveItem, listRemoveAll} = this.props

    const {checkedKeys, disabledKeys, checkedTagData} = this.store

    if (!_.isEqual(listRemoveItem, next.listRemoveItem)) {
      this.store.checkedKeys = checkedKeys.filter(d => +d !== +next.listRemoveItem.id)
      this.store.disabledKeys = disabledKeys.filter(d => +d !== +next.listRemoveItem.id)

      this.store.checkedTagData = checkedTagData.filter(d => +d.id !== +next.listRemoveItem.id)

      this.allChecked = false
      if (this.store.checkedKeys.length) {
        this.indeterminate = true
      } else {
        this.indeterminate = false
      }
    }

    if (!_.isEqual(listRemoveAll, next.listRemoveAll)) {
      this.destroy()
    }
  }

  @action destroy() {
    const {majorTagList} = this.store

    const majorKeys = majorTagList.map(d => d.id)

    this.store.checkedKeys.replace(majorKeys)
    this.store.checkedTagData.replace(majorTagList)
    this.store.disabledKeys.replace(majorKeys)
    this.store.searchKey = undefined

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
    } else if (this.store.disabledKeys.length) {
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
    this.store.searchKey = data
    this.store.getTagTree({
      searchKey: data,
    })
  }

  // 获取所有标签列表数据和rowKeys
  @computed get getTagList() {
    const {originTreeData} = this.store
    // all keys
    const allKeys = originTreeData.map(d => d.id) || []

    // all tags
    const allTags = originTreeData.filter(item => !item.type) || []

    return {
      allTags,
      allKeys,
    }
  }


  renderTreeNodes = data => data.map(item => {
    // 0 标签 1 类目 2 对象
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
          // icon={<img src={tagIcon} alt="icon" style={{width: '14px'}} />}
        />
      )
    }

    if (item.isMajor || item.isUsed) {
      return (
        <TreeNode
          key={item.id}
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          selectable={false}
          tagData={item}
          disableCheckbox
          icon={<img src={tagIcon} alt="icon" style={{width: '14px'}} />}
        />
      )
    }

    return (
      <TreeNode
        key={item.id}
        title={<OmitTooltip maxWidth={120} text={item.name} />}
        selectable={false}
        tagData={item}
        disableCheckbox={this.store.disabledKeys.includes(item.id)}
        icon={<img src={tagIcon} alt="icon" style={{width: '14px'}} />}
      />
    )
  })

  render() {
    const {treeData, treeLoading, majorTagList, checkedTagData, checkedKeys} = this.store

    const keys = checkedKeys.length ? toJS(checkedKeys) : majorTagList.map(d => d.id)

    return (
      <div className="FBH">
        <div className="sync-tag-tree">
          <div className="select-tree-header">
            <NoBorderInput
              placeholder="请输入标签名称"
              value={this.store.searchKey}
              onChange={this.searchTree}
            />
            <IconChakan size="14" className="mr8" onClick={this.onSearch} />
          </div>
          {
            treeLoading ? <Loading mode="block" height={100} />
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
                    onCheck={this.onCheck}
                    checkedKeys={keys.map(String)}
                    showIcon
                  >
                    {this.renderTreeNodes(toJS(treeData))}
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
