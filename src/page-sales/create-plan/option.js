// 构建菜单
const buildMenu = instance => [{
  label: '删除',
  icon: 'del',
  action: (domEvent, item) => {
    domEvent.stopPropagation()
    instance.removeNode(item.id)
  },
}, {
  label: '查看日志',
  icon: 'log',
  action: domEvent => {
    domEvent.stopPropagation()
  },
}]

const onFlowInit = (instance, nodeList) => {
  nodeList.map(node => {
    instance.addTargetEndPoints(node.id, [{
      id: `target_${node.id}`,
      // ioType: 'default',
      maxConnections: 5,
      // enabled: !disabled,
    }])

    instance.addSourceEndPoints(node.id, [{
      id: `source_${node.id}`,
      // ioType: 'default',
      maxConnections: 5,
      // enabled: !disabled,
    }])

    return node
  })
}

const options = ({instance, nodeList}) => {
  return ({
    className: 'dag-style',
    flowId: 1, // 任务流程id
    connectionsDetachable: true, // false会导致无法多输出
    autoLayout: true, // 自动布局
    autoFix: true, // 初始定位
    nodeParse: ({id, nodeName, icon, status, position}) => {
      return {
        id,
        name: <div className="dag-node">{nodeName}</div>,
        icon,
        status,
        position,
      }
    },
    buildMenu: () => buildMenu(instance),
    onFlowInit: v => onFlowInit(v, nodeList),
    // 拖入画布事件
    onDrop: (position, e) => {
      // position 拖拽位置
      // 获取setData添加的拖拽数据
      const item = JSON.parse(e.dataTransfer.getData('data'))
      item.position = position
      instance.addNode(item)
      console.log('配置model', item)
      setTimeout(() => {
        instance.addTargetEndPoints(item.id, [item])
        instance.addSourceEndPoints(item.id, [item])
      }, 0)
    },
    showCenter: false,
    // 双击节点触发事件
    // onDoubleClick: node => {
    //   console.log(node)
    // },
    // onNodeSelect: (node, index) => console.log(node, index),

    // 用于构造连线数据，需要返回如下格式：{id,source,target}，字段详情查看下的数据格式参考
    linkParse: ({sourceId, targetId}) => {
      return {
        id: `${sourceId}-${targetId}`,
        source: `source_${sourceId}`,
        target: `target_${targetId}`,
      }
    },
    // onConnectionRemove: link => new Promise((resolve, reject) => {
    //   console.log(link)
    //   setTimeout(() => resolve(), 100)
    // }),

    // 自动布局时需要将输入源和输出源转换为节点的id, 可以用这个来做映射
    endpointToNode: v => {
      const {source, target} = v
      return {
        source: source.split('_')[1],
        target: target.split('_')[1],
      }
    },
  })
}
export default options
