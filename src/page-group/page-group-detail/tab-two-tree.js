import React from 'react'
import {Tree} from 'antd'
import {toJS} from 'mobx'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1-1-1-1-1-1',
        key: '0-0-1',
        children: [
          {
            title: (
              <span
                style={{
                  color: '#1890ff',
                }}
              >
                sss
              </span>
            ),
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
]

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
          />
        )
        : <div />
    ))
  }
)
