import newGroup1 from '../../icon/new-group1.svg'
// mock数据
const types = [
  {
    nodeName: '微信服务号',
    value: 'weixin',
    status: 2,
    icon: <img alt="服务号" height={24} width={24} src={newGroup1} />,
  },
  {
    nodeName: '微信小程序',
    value: 'app',
    status: 4,
    icon: '',
  },
  {
    nodeName: '邮箱',
    value: 'email',
    status: 4,
    icon: 'dy',
  },
  {
    nodeName: '短信',
    value: 'duanxin',
    status: 4,
    icon: 'dy',
  },
]

// 节点列表
const nodes = [
  {
    id: 1,
    nodeName: '开始',
    status: 2,
    icon: <img alt="短信" height={24} width={24} src={newGroup1} />,
  },
]
  
// 连线数据
const links = [
  
]
export {types, nodes, links}
