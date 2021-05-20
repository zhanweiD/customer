// mock数据
const types = [
  {
    nodeName: '微信事件',
    value: 'weixin',
    status: 2,
    icon: 'wp',
  },
  {
    nodeName: '抖音事件',
    value: 'douyin',
    status: 4,
    icon: 'dy',
  },
]

// 节点列表
const nodes = [
  {
    id: 1,
    nodeName: '短信',
    status: 2,
    icon: 1,
  }, {
    id: 2,
    nodeName: '发消息',
    status: 2,
    icon: 2,
  }, {
    id: 4,
    nodeName: '扫码',
    status: 5,
    icon: 4,
  }, 
  {
    id: 5,
    nodeName: '推文本',
    status: 2,
    icon: 5,
  },
]
  
// 连线数据
const links = [
  {
    sourceId: 1,
    targetId: 2,
  },
  {
    sourceId: 1,
    targetId: 4,
  },
  {
    sourceId: 2,
    targetId: 5,
  },
  {
    sourceId: 4,
    targetId: 5,
  },
]
export {types, nodes, links}
