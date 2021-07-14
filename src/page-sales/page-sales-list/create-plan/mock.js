// mock数据
const types = [
  {
    id: 'weixin',
    nodeName: '微信服务号',
    value: 'weixin',
    // status: 2,
    maxConnections: 1,
    icon: 'weService',
  },
  {
    nodeName: '微信小程序',
    value: 'app',
    // status: 4,
    maxConnections: 1,
    icon: 'weapp',
  },
  {
    nodeName: '邮箱',
    value: 'email',
    // status: 4,
    maxConnections: 1,
    icon: 'email',
  },
  {
    nodeName: '短信',
    value: 'duanxin',
    // status: 4,
    maxConnections: 1,
    icon: 'sms',
  },
]
const conditions = [
  {
    id: 'eventBranch',
    nodeName: '事件多分支',
    value: 'eventBranch',
    // status: 2,
    // maxConnections: 1,
    icon: 'eventBranch',
  },
  {
    id: 'tagBranch',
    nodeName: '标签多分支',
    value: 'tagBranch',
    // status: 4,
    icon: 'tagBranch',
  },
  {
    id: 'copyBranch',
    nodeName: '复制多分支',
    value: 'copyBranch',
    // status: 4,
    icon: 'copyBranch',
  },
]
// 流程控制
const process = [
  {
    id: 'wait',
    nodeName: '等待',
    value: 'wite',
    // status: 2,
    maxConnections: 1,
    icon: 'waite',
  },
  {
    id: 'end',
    nodeName: '结束',
    value: 'end',
    // status: 4,
    icon: 'end',
  },
]

// 节点列表
const nodes = [
  {
    id: 'start',
    nodeName: '开始',
    // status: 2,
    icon: 'start',
  },
]
  
// 连线数据
const links = [
  // {
  //   sourceId: '2',
  //   targetId: 'weixin',
  // }, {
  //   sourceId: 'weixin',
  //   targetId: '0',
  // },
]
export {types, nodes, links, conditions, process}
