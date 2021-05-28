import {start} from '../icon'
// mock数据
const types = [
  {
    id: 10,
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
    nodeName: '事件多分支',
    value: 'weixin',
    // status: 2,
    // maxConnections: 1,
    icon: 'eventBranch',
  },
  {
    nodeName: '标签多分支',
    value: 'app',
    // status: 4,
    icon: 'tagBranch',
  },
  {
    nodeName: '复制多分支',
    value: 'email',
    // status: 4,
    icon: 'copyBranch',
  },
]
// 流程控制
const process = [
  {
    id: 1,
    nodeName: '等待',
    value: 'wite',
    // status: 2,
    maxConnections: 1,
    icon: 'waite',
  },
  {
    id: 0,
    nodeName: '结束',
    value: 'end',
    // status: 4,
    icon: 'end',
  },
]

// 节点列表
const nodes = [
  {
    id: 2,
    nodeName: '开始',
    // status: 2,
    icon: <img alt="" height={24} width={24} src={start} />,
  },
]
  
// 连线数据
const links = [
  
]
export {types, nodes, links, conditions, process}
