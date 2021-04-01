import React from 'react'
import {DtTree} from '@dtwave/uikit'
import {Loading} from '../component'
import Action from './tag-tree-action'

const {DtTreeBox, DtTreeNode} = DtTree

export default () => {
  const treeLoading = false

  const treeBoxConfig = {
    titleHeight: 34,
    title: <Action />,
    defaultWidth: 176,
    style: {minWidth: '176px'},
  }

  const treeConfig = {
    key: 'id',
    type: 'tree',
    selectExpand: true,
    // onSelect: this.onSelect,
    defaultExpandAll: true,
    // selectedKeys: expandKey ? [expandKey] : [-1], // 默认选中默认类目
    // expandWithParentKeys: expandKey ? [expandKey] : [-1], // 默认选中默认类目
    // defaultExpandedKeys: this.store.searchExpandedKeys.slice(),
    showDetail: true,
  }

  return (
    <div style={{height: '100%'}}>
      <DtTreeBox {...treeBoxConfig}>
        {treeLoading
          ? <Loading mode="block" height={100} />
          : (
            <DtTree {...treeConfig}>
              <DtTreeNode itemKey={2} title="12345678">
                <DtTreeNode itemKey="2-1" title="12345678">
                  <DtTreeNode selectable={false} itemKey="2-1-1" title="selectable=fasle12345678">
                    <DtTreeNode itemKey="2-1-1-2" title="打卡好的机会45678" />
                    <DtTreeNode itemKey="2-1-1-3" title="12345678" />
                  </DtTreeNode>
                  <DtTreeNode
                    onDragStart={() => console.log('dragStart........')}
                    onDraging={() => console.log('onDraging........')}
                    onDragEnd={() => console.log('onDragEnd........')}
                    itemKey="2-1-2"
                    title="12345678"
                    isLeaf={false}
                  />
                  <DtTreeNode itemKey="2-1-3" title="12345678" />
                </DtTreeNode>
              </DtTreeNode>
            </DtTree>
          )
        }
      </DtTreeBox>
    </div>
  )
}
