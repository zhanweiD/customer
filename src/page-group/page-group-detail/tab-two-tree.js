import React from 'react'
import {Tree} from 'antd'
import {toJS} from 'mobx'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'

export default inject('store')(
  ({store}) => {
    const onSelect = (selectedKeys, info) => {
      console.log('selected', selectedKeys, info)
    }

    const onCheck = (checkedKeys, info) => {
      const keys = []
      info.checkedNodes.forEach(item => {
        if (!item.children) {
          keys.push(item.key)
        }
      })

      if (keys.length > 0) {
        store.getDistributionByTagTabTwo(keys)
      } else {
        store.tabTwoChartDatas = []
      }
    }

    return useObserver(() => (
      (store.treeData && store.treeData.length > 0)
        ? (
          <Tree
            checkable
            defaultExpandAll
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={store.treeData}
            style={{paddingTop: 12}}
          />
        )
        : <div />
    ))
  }
)
