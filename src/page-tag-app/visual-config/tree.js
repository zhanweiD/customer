
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Menu, Popconfirm} from 'antd'
import cls from 'classnames'
import {successTip} from '../../common/util'
import Action from './tree-action'
import {IconDel} from '../../icon-comp'

@observer
export default class Tree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound del(d, i) {
    const t = this
    if (d.canSubmit && this.store.configIdInfo && this.store.configIdInfo[d.tagId || d.id]) {
      const id = this.store.configIdInfo[d.tagId || d.id]
      this.store.deleteVisualExt(id, () => {
        const tagTreeData = _.cloneDeep(toJS(t.store.tagTreeData))
        tagTreeData.splice(i, 1)

        const [nextTag] = tagTreeData

        if (nextTag) {
          nextTag.canEdit = 1
        }
        delete t.store.relVisualExtRspList[d.tagId || d.id]
        delete t.store.configIdInfo[d.tagId || d.id]
        t.store.tagTreeData.replace(tagTreeData)
        t.props.selectTag(nextTag)
      })
    } else {
      successTip('删除成功')
      
      const tagTreeData = _.cloneDeep(toJS(t.store.tagTreeData))

      tagTreeData.splice(i, 1)

      const [nextTag] = tagTreeData

      if (nextTag) {
        nextTag.canEdit = 1
      }
      delete t.store.relVisualExtRspList[d.tagId || d.id]
      t.store.tagTreeData.replace(tagTreeData)
      t.props.selectTag(nextTag)
    }
  }

  @action.bound onClick(data) {
    if ((+data.tagId || +data.id) !== +this.store.currentTag && data.canEdit) {
      this.props.selectTag(data)
    }
  }

  menu = (d, i) => (
    <Menu>
      <Menu.Item key="2" onClick={() => this.del(d, i)}>
        删除
      </Menu.Item>
    </Menu>
  )

  render() {
    const {tagTreeData, currentTag, canEditCondition} = this.store

    return (
      <div className="tree">
        <Action store={this.store} />
        {
          tagTreeData.map((d, i) => (
            <div style={{position: 'relative'}}>
              <div
                onClick={() => this.onClick(d)}
                className={
                  cls({
                    'tree-item': true,
                    'tree-item-select': +currentTag === (d.tagId || d.id),
                    'tree-item-current': d.canEdit && canEditCondition,
                    'tree-item-disabled': +currentTag !== (d.tagId || d.id) && !d.canEdit,
                  })}
              >
                <span> 
                  {d.name}
                </span>
              </div>
              <Popconfirm
                placement="topRight"
                title="确认删除标签？"
                onConfirm={() => this.del(d, i)}
                okText="确认"
                cancelText="取消"
              >
                <IconDel size="16" className="tree-action" />
              </Popconfirm>
            </div>
            
          ))
        }
      </div>
    )
  }
}
