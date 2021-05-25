import newGroup1 from '../../icon/new-group1.svg'
// mock数据
const types = [
  {
    nodeName: '微信服务号',
    value: 'weixin',
    // status: 2,
    icon: 'fuwu',
  },
  {
    nodeName: '微信小程序',
    value: 'app',
    // status: 4,
    icon: 'weapp',
  },
  {
    nodeName: '邮箱',
    value: 'email',
    // status: 4,
    icon: 'email',
  },
  {
    nodeName: '短信',
    value: 'duanxin',
    // status: 4,
    icon: 'dy',
  },
]
const conditions = [
  {
    nodeName: '事件多分支',
    value: 'weixin',
    // status: 2,
    icon: 'shijian',
  },
  {
    nodeName: '标签多分支',
    value: 'app',
    // status: 4,
    icon: 'biaoqian',
  },
  {
    nodeName: '复制多分支',
    value: 'email',
    // status: 4,
    icon: 'fuzhi',
  },
]
// 流程控制
const process = [
  {
    nodeName: '等待',
    value: 'wite',
    // status: 2,
    icon: 'dengdai',
  },
  {
    nodeName: '结束',
    value: 'end',
    // status: 4,
    icon: 'jieshu',
  },
]

// 节点列表
const nodes = [
  {
    id: 1,
    nodeName: '开始',
    // status: 2,
    icon: <img alt="服务号" height={24} width={24} src={newGroup1} />,
  },
]
  
// 连线数据
const links = [
  
]
export {types, nodes, links, conditions, process}
