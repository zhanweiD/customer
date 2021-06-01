import {message} from 'antd'
import {CloseOutlined, MinusCircleOutlined} from '@ant-design/icons'
import matchingIcon from './unit'

const beforeConnection = ({source, target}) => {
  if (source === target) {
    message.warning('连接失败')
    return false
  }
  if (source === 'start' && (target === 'end' || target === 'wait')) {
    message.warning('连接失败')
    return false
  }
  return true
}
const edit = (name, runDrawer, weServiceDrawer) => {
  let typeDrawer = runDrawer
  switch (name) {
    case '开始':
      typeDrawer = runDrawer
      break
    case '微信服务号':
      typeDrawer = weServiceDrawer
      break
    default:
      typeDrawer = () => console.log('功能暂未开发')
      break
  }
  typeDrawer(true)
}
const deleteNode = (instance, nodeId, nodeName, setWeSFormData) => {
  if (!instance) return 
  instance.removeNode(nodeId)
  switch (nodeName) {
    case '微信服务号':
      setWeSFormData({})
      break
    default:
      break
  }
  // changeChannelId(item.id)
}
const dragEnd = (position, e, instance, changeChannelId, setShowWeService) => {
  const item = JSON.parse(e.dataTransfer.getData('data'))
  switch (item.nodeName) {
    case '微信服务号':
      setShowWeService(true)
      break
    default:
      break
  }
  // changeChannelId(item.id) // 记录拖拽控件
  item.position = position
  item.ioType = '2'
  instance.addNode(item)
  setTimeout(() => {
    instance.addTargetEndPoints(item.id, [item])
    if (item.nodeName !== '结束') instance.addSourceEndPoints(item.id, [item])
  }, 0)
}
// 构建菜单
const buildMenu = (e, instance, runDrawer, weServiceDrawer, setWeSFormData) => [
  {
    label: '配置',
    icon: 'edit',
    disabled: e.name.props ? e.name.props.children === '结束' : true,
    action: (domEvent, item) => {
      domEvent.stopPropagation()
      const {children} = item.name.props
      let typeDrawer = runDrawer
      switch (children) {
        case '开始':
          typeDrawer = runDrawer
          break
        case '微信服务号':
          typeDrawer = weServiceDrawer
          break
        default:
          typeDrawer = () => console.log('功能暂未开发')
          break
      }
      typeDrawer(true)
    },
  },
  {
    label: '删除',
    icon: 'del',
    disabled: e.name.props ? e.name.props.children === '开始' : true,
    action: (domEvent, item) => {
      domEvent.stopPropagation()
      instance.removeNode(item.id)
      const {children} = item.name.props
      switch (children) {
        case '微信服务号':
          setWeSFormData({})
          break
        default:
          break
      }
      // changeChannelId(item.id)
    },
  },
]

const onFlowInit = (instance, nodeList) => {
  nodeList.map(node => {
    const {nodeName} = node
    if (nodeName === '开始') {
      instance.addSourceEndPoints(node.id, [{
        id: `source_${node.id}`,
        ioType: '2',
        maxConnections: 1,
      }])
    } else if (nodeName === '结束') {
      instance.addTargetEndPoints(node.id, [{
        id: `target_${node.id}`,
        ioType: '2',
        maxConnections: 1,
      }])
    } else {
      instance.addTargetEndPoints(node.id, [{
        id: `target_${node.id}`,
        ioType: '2',
        maxConnections: 1,
      }])
  
      instance.addSourceEndPoints(node.id, [{
        id: `source_${node.id}`,
        ioType: '2',
        maxConnections: 1,
      }])
    }
    return node
  })
}

const options = ({
  instance, 
  nodeList, 
  links,
  runDrawer, 
  weServiceDrawer, 
  changeChannelId,
  setShowWeService,
  setWeSFormData,
}) => {
  return ({
    className: 'dag-style',
    // flowId: 1, // 任务流程id
    // vertical: false, // false横向
    allowLinkRemove: false,
    connectionsDetachable: true, // false会导致无法多输出
    autoLayout: true, // 自动布局
    autoFix: true, // 初始定位
    nodeParse: ({
      id, 
      nodeName, 
      icon, 
      status, 
      position, 
      maxConnections,
    }) => {
      return {
        id,
        name: (
          <div 
            className="dag-node"
            onDragStart={() => {
              console.log(111)
            }}
            onDrag={() => console.log(333)}
            onDragEnd={() => console.log(222)}
            draggable
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              edit(nodeName, runDrawer, weServiceDrawer)
            }
            }
          >
            <span>{nodeName}</span>
            <span
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                deleteNode(instance, id, nodeName, setWeSFormData)
              }}
              className="dag-node-del"
            >
              <CloseOutlined />
            </span>
          </div>
        ),
        icon: matchingIcon(icon),
        status,
        position,
        maxConnections,
      }
    },
    onClick: () => console.log(222),
    // buildMenu: e => buildMenu(e, instance, runDrawer, weServiceDrawer, setWeSFormData),
    onFlowInit: v => onFlowInit(v, nodeList),
    // 拖入画布事件
    onDrop: (position, e) => dragEnd(position, e, instance, changeChannelId, setShowWeService),
    beforeConnection, // 连线前校验
    showCenter: false,
    // 双击节点触发事件
    // onDoubleClick: node => {
    //   console.log(node)
    // },
    // onNodeSelect: (node, index) => edit(node, runDrawer, weServiceDrawer),

    // 用于构造连线数据，需要返回如下格式：{id,source,target}，字段详情查看下的数据格式参考
    links,
    linkParse: ({sourceId, targetId}) => {
      return {
        id: `${sourceId}-${targetId}`,
        source: `source_${sourceId}`,
        target: `target_${targetId}`,
      }
    },
    // 删除连线前
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
