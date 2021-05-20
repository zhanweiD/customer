import {useState} from 'react'
import {Button} from 'antd'
import {
  RedoOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  AimOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined,
} from '@ant-design/icons'
import DAG from '@dtwave/oner-dag'
import option from './option'
import {links, nodes, types} from './mock'
import './index.styl'

const Demo = () => {
  const [instance, setInstance] = useState(null)
  const [isRender, setIsRender] = useState(false)
  const [isRun, setIsRun] = useState(false)
  const [nodeList, setNodeList] = useState(nodes)
  const [linkList, setLinkList] = useState(links)
  const [typeList, setTypeList] = useState(types)

  const onFixView = () => {
    instance.fixView()
  }
  const onZoomIn = () => {
    instance.zoomIn()
  }
  const onZoomOut = () => {
    instance.zoomOut()
  }
  // 开始拖动
  const onDragStart = ({nodeName, status, icon, ioType}, e) => {
    console.log(nodeName)
    const newNode = {
      id: new Date().getTime(),
      nodeName,
      status,
      icon,
      ioType,
    }
    // 添加拖拽数据
    e.dataTransfer.setData('data', JSON.stringify(newNode))
    // const {target} = e
    // target.style.border = 'solid 1px #eecaa4'
  }
  
  // 拖动中
  const onDrag = () => {
    // console.log('drag ing')
  }
  
  // 拖动结束
  const onDragEnd = e => {
    console.log(e)
    // const {target} = e
    // target.style.border = 'solid 1px #49aede'
    // target.style.margin = '8px'
  }
  
  // 获取节点
  const getNodes = () => {
    console.log(instance.getNodes())
  }
  
  // 获取连线信息
  const getLinks = () => {
    console.log(instance.getLinks())
  }

  // 运行
  const runDag = () => {
    setIsRun(true)
    instance.getNodes().forEach(item => {
      instance.setNodeStatus(1, 3)
      setTimeout(() => {
        instance.setNodeStatus(item.id, 3)
      }, 2000)
    })
  }

  // 停止
  const stopDag = () => {
    setIsRun(false)
    instance.getNodes().forEach(item => instance.setNodeStatus(item.id, 2))
  }

  return (
    <div className="dag-process">
      <div className="dag-cate">
        <h2>事件</h2>
        <div className="mb12">
          <Button className="containerStyle mr8 mb8" onClick={getNodes}>获取所有节点</Button>
          <Button className="containerStyle mb8" onClick={getLinks}>获取所有连线的信息</Button>
        </div>
        <h2>组件</h2>
        <div>
          {
            typeList.map(item => (
              <Button
                className="dag-drag-box mr8 mb8"
                onDrag={onDrag}
                onDragStart={e => onDragStart(item, e)}
                onDragEnd={onDragEnd}
                draggable
              >
                {item.nodeName}
              </Button>
            ))
          }
        </div>
      </div>
      <div>
        {
          isRender ? <div /> : (
            <DAG
              ref={e => setInstance(e)}
              {...option({instance, nodeList, setIsRender, setLinkList})}
              links={linkList}
              nodeList={nodeList}
            />
          )
        }
        
      </div>
      <div className="pa rt16 tp24 dag-right">
        <span className="hand mr8">
          <RedoOutlined className="icon-style" />
        </span>
        {
          !isRun ? (
            <span onClick={runDag} className="hand mr8">
              <PlayCircleOutlined className="icon-style" />
            </span>
          ) : (
            <span onClick={stopDag} className="hand mr8">
              <PauseCircleOutlined className="icon-style" />
            </span>
          )
        }
        <span onClick={onFixView} className="hand mr8">
          <AimOutlined className="icon-style" />
        </span>
        <span onClick={onZoomIn} className="hand mr8">
          <ZoomInOutlined className="icon-style" />
        </span>
        <span onClick={onZoomOut} className="hand">
          <ZoomOutOutlined className="icon-style" />
        </span>
      </div>
    </div>
  )
}
export default Demo
