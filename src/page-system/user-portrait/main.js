/**
 * @description 画像配置
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Popconfirm, Button} from 'antd'

import {
  ListContent, OmitTooltip, Authority,
} from '../../component'
import AddDrawer from './add-drawer'
import store from './store'

@observer
export default class Portrait extends Component {
  columns = [{
    key: 'objName',
    title: '所属实体',
    dataIndex: 'objName',
  }, {
    key: 'nameStr',
    title: '个体名称',
    dataIndex: 'nameStr',
  }, {
    key: 'identificationStr',
    title: '标识',
    dataIndex: 'identificationStr',
  }, {
    key: 'searchStr',
    title: '搜索条件',
    dataIndex: 'searchStr',
    // width: 120,
    render: t => {
      if (t) {
        t = t.map((item, index) => {
          return index > 0 ? `、${item}` : item
        })
      }
      return t ? <OmitTooltip maxWidth={300} text={t} /> : '-'
    },
  }, {
    key: 'basicStr',
    title: '基础模块',
    dataIndex: 'basicStr',
    ellipsis: true,
    width: 200,
    render: t => {
      if (t) {
        t = t.map((item, index) => {
          return index > 0 ? `、${item}` : item
        })
      }
      return t ? <OmitTooltip maxWidth={400} text={t} /> : '-'
    },
  }, {
    key: 'portraitStr',
    title: '画像模块',
    dataIndex: 'portraitStr',
    ellipsis: true,
    width: 200,
    render: t => {
      if (t) {
        t = t.map((item, index) => {
          return index > 0 ? `、${item}` : item
        })
      }
      return t ? <OmitTooltip maxWidth={400} text={t} /> : '-'
    },
  }, {
    key: 'action',
    title: '操作',
    width: 140,
    render: (text, record) => (
      <div className="FBH FBAC">
        <Authority
          authCode="system:portrait:run"
        >
          <a href onClick={() => this.openDrawer(0, record)} className="mr16">{record.status ? '启用' : '禁用'}</a>
        </Authority>
        <Authority
          authCode="system:portrait:run"
        >
          <a href onClick={() => this.openDrawer(1, record)} className="mr16">配置</a>
        </Authority>
        <Authority
          authCode="system:portrait:run"
        >
          <Popconfirm
            title="你确定要删除该配置吗?"
            onConfirm={() => this.openDrawer(2, record)}
            onCancel={() => {}}
            okText="确定"
            cancelText="取消"
          >
            <a href className="mr16">删除</a>
          </Popconfirm>
        </Authority>
      </div>
    ),
  }]

  @action openDrawer = (v, record) => {
    // 1编辑 0禁用 2删除
    if (v === 0) {
      const status = record.status ? 0 : 1
      const configId = [record.id]
      store.disable(configId, status)
    } else if (v === 1) {
      store.showDrawer({id: record.id})
    } else {
      store.getDel({id: record.id})
    }
  }

  @action.bound addButton() {
    store.resetValue()
    store.drawerVisible = true
    store.addstatus = true
  }
  render() {
    const {tableLoading, list} = store

    const listContentConfig = {
      key: 'id',
      rowKey: 'id',
      columns: this.columns,
      tableLoading,
      store,
      initParams: {},
      initGetDataByParent: false,
      scroll: {x: 1000},
      buttons: [<Button type="primary" disabled={list.length === 2} onClick={this.addButton}>添加画像</Button>],
    }

    return (
      <div>
        <div className="content-header">画像配置</div>
        <div className="m16 bgf pt16 config-content">
          <ListContent {...listContentConfig} />
        </div>
        {store.drawerVisible ? <AddDrawer store={store} /> : null}
      </div>
    )
  }
}