import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import _ from 'lodash'

import {NoBorderInput} from '../../../component'
import {
  IconExtend, 
  IconUnExtend, 
  IconRefresh, 
} from '../../../icon-comp'

@inject('bigStore')
@observer
class Action extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = this.bigStore.categoryStore
  }

  @action.bound handleEditCategory() {
    const {treeData} = this.store 
    if (toJS(treeData).length) return 
     
    // 获取选择对象
    this.store.getSelectObj()
    
    this.store.currentTreeItemKey = 0
    this.store.eStatus.editObject = false
    this.store.modalVisible.editObject = true
  }

  @action.bound handleRefresh() {
    this.store.getCategoryList()
  }

  @action.bound handleSearch(e) {
    this.store.searchKey = e
    this.store.getCategoryList()
  }

  @action.bound handleExpandAll() {
    this.store.treeLoading = true
    _.delay(() => {
      this.store.expandAll = !this.store.expandAll
      this.store.treeLoading = false
    }, 100)
  }

  render() {
    return (
      <div className="category-manager-action pl8 FBH FBAC">
        <div className="FB1">
          <NoBorderInput onChange={this.handleSearch} />
        </div>

        <div className="FBH pr6 pl6" style={{maxWidth: 70}}>
          <IconRefresh size="14" onClick={this.handleRefresh} className="mr8 hand" />
          { this.store.expandAll ? (
            <IconUnExtend size="14" className="hand" onClick={this.handleExpandAll} /> 
          ) : (
            <IconExtend size="14" className="hand" onClick={this.handleExpandAll} />
          )}
        </div>
      </div>
    )
  }
}

export default Action
