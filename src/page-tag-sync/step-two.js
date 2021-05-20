import {Component} from 'react'
import {observer} from 'mobx-react'
import {Button} from 'antd'
import {observable, action} from 'mobx'
import Tree from './step-two-tree'
import List from './step-two-list'

@observer
export default class StepTwo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @observable listRemoveItem
  @observable listRemoveAll // 全部清空列表数据

  @action.bound nextStep() {
    this.store.nextStep()
  }

  @action.bound rightToTable(tagData) {
    const nextKeys = tagData.map(d => d.id)
    const keys = this.store.tableData.map(d => d.id)
  
    if (!_.isEqual(nextKeys, keys)) {
      const addArr = []

      nextKeys.forEach((d, i) => {
        if (!keys.includes(d)) {
          addArr.push(tagData[i])
        }
      })  
      this.store.tableData = this.store.tableData.concat(addArr)  
    } 
  }

  @action.bound removeList(item) {
    this.store.tableData = this.store.tableData.filter(d => +d.id !== +item.id)
    this.listRemoveItem = item
  }

  @action.bound removeListAll(d) {
    const {majorTagList} = this.store
    this.listRemoveAll = d
    this.store.tableData.replace(majorTagList)
  }

  render() {
    const {
      show,
    } = this.props
    const {isEdit} = this.store
    
    const treeConfig = {
      listRemoveAll: this.listRemoveAll,
      listRemoveItem: this.listRemoveItem,
      rightToTable: this.rightToTable,
      store: this.store,
    }

    const listConfig = {
      removeAll: this.removeListAll,
      remove: this.removeList,
      store: this.store,
    }
    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="config-sync-tag">
          <Tree {...treeConfig} />
          <List {...listConfig} />
        </div>
        <div className="bottom-button">
          <Button disabled={isEdit} style={{marginRight: 8}} onClick={() => this.store.lastStep()}>上一步</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.nextStep}
            disabled={isEdit}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
