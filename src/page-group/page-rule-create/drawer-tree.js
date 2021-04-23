import React from 'react'
import {action} from 'mobx'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import {Tree} from 'antd'

const {TreeNode} = Tree
export default inject('store')(
  ({store}) => {
    const onCheck = (checkedKeys, info) => {
      const tagList = info.checkedNodes.filter(item => !item.children) || []
      store.checkList = tagList.map(item => item.aid)
      store.getTagData()
    }

    const renderTreeNodes = data => data.map(item => {
      if (item.children) {
        return (
          <TreeNode className="parents" title={item.name} key={item.aid} {...item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }

      const isUse = store.useTagList.find(sitem => sitem === item.aid)
      return <TreeNode disabled={item.isCate || !isUse} className="childrens" title={item.name} key={item.aid} {...item} />
    })

    return useObserver(() => (
      <Tree
        checkable
        // defaultCheckedKeys={['0-0-0-0']}
        onCheck={onCheck}
        selectable={false}
        style={{width: 200}}
      >
        {renderTreeNodes(store.treeData)}
      </Tree>
    ))
  }
)
