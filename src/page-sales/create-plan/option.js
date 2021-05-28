import {message} from 'antd'
import matchingIcon from './unit'

const beforeConnection = ({source, target}) => {
  console.log(source, target)
  if (source === target) {
    message.warning('输入源与输出源相同,连接失败')
    return false
  }
  if (source === '2' && (target === '0' || target === '0')) {
    message.warning('连接失败')
    return false
  }
  return true
}
// 构建菜单
const buildMenu = (e, instance, runDrawer, weServiceDrawer, changeChannelId) => [
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
      // changeChannelId(item.id)
    },
  },
]

const onFlowInit = (instance, nodeList) => {
  nodeList.map(node => {
    // instance.addTargetEndPoints(node.id, [{
    //   id: `target_${node.id}`,
    //   ioType: 'default',
    //   maxConnections: 1,
    //   // enabled: !disabled,
    // }])

    instance.addSourceEndPoints(node.id, [{
      // id: `source_${node.id}`,
      id: node.id,
      maxConnections: 1,
      // enabled: !disabled,
    }])

    return node
  })
}

const options = ({
  instance, 
  nodeList, 
  runDrawer, 
  weServiceDrawer, 
  changeChannelId,
}) => {
  return ({
    className: 'dag-style',
    // flowId: 1, // 任务流程id
    // vertical: false,
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
        name: <div className="dag-node">{nodeName}</div>,
        icon,
        status,
        position,
        maxConnections,
      }
    },
    buildMenu: e => buildMenu(e, instance, runDrawer, weServiceDrawer, changeChannelId),
    onFlowInit: v => onFlowInit(v, nodeList),
    // 拖入画布事件
    onDrop: (position, e) => {
      // position 拖拽位置
      // 获取setData添加的拖拽数据
      const item = JSON.parse(e.dataTransfer.getData('data'))
      changeChannelId(item.id) // 记录拖拽控件
      item.position = position
      console.log(item)
      item.icon = matchingIcon(item.icon)
      instance.addNode(item)
      setTimeout(() => {
        instance.addTargetEndPoints(item.id, [item])
        if (item.nodeName !== '结束') instance.addSourceEndPoints(item.id, [item])
      }, 0)
    },
    beforeConnection, // 连线前校验
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
