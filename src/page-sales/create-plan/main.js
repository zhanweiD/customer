import {useState, useEffect} from 'react'
import {Button, Collapse, Input, Space} from 'antd'
import {
  RedoOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  AimOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined,
} from '@ant-design/icons'
import DAG from '@dtwave/oner-dag'

import {save, all, clear} from '../icon'
import RunDrawer from './run-drawer'
import WechatDrawer from './wechat-drawer'
import option from './option'
import matchingIcon from './unit'
import {links, nodes, types, conditions, process} from './mock'
import './index.styl'

const {Panel} = Collapse

const Demo = () => {
  const [instance, setInstance] = useState(null)
  const [isRender, setIsRender] = useState(false)
  const [isRun, setIsRun] = useState(false)
  const [nodeList, setNodeList] = useState(nodes)
  const [linkList, setLinkList] = useState(links)
  const [showRun, setShowRun] = useState(false)
  const [showWeService, setShowWeService] = useState(false)
  const [isAll, setIsAll] = useState(false)

  // 开始抽屉
  const runDrawer = v => {
    setShowRun(v)
  }
  // 微信服务号抽屉
  const weServiceDrawer = v => {
    setShowWeService(v)
  }
  // 全屏
  const setAll = () => {
    setIsAll(!isAll)
  }
  // 清除画布
  const clearCanvas = () => {
    setIsRender(true)
    setTimeout(() => setIsRender(false), 10)
  }

  // 画布相关
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

  useEffect(() => {
    if (instance) onFixView()
  }, [isAll])

  return (
    <div className="dag-process oa">
      <div className="dag-header">
        <Button className="header-but" onClick={setAll}>
          <span className="radio-span"><img className="mb1" src={all} alt="" /></span>
          <span>{isAll ? '缩放' : '全屏'}</span>
        </Button>
        <Button className="header-but" onClick={clearCanvas}>
          <span className="radio-span"><img className="mb1" src={clear} alt="" /></span>
          <span>清空画布</span>
        </Button>
        <Button className="header-but">
          <span className="radio-span"><img className="mb1" src={save} alt="" /></span>
          <span>保存</span>
        </Button>
      </div>
      <div className="dag-cate" style={{display: isAll ? 'none' : 'inline-block'}}>
        <Space direction="vertical" size={24}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="营销动作" key="1">
              <div>
                {
                  types.map(item => (
                    <div
                      className="dag-drag-box hand mr8 mb8"
                      onDrag={onDrag}
                      onDragStart={e => onDragStart(item, e)}
                      onDragEnd={onDragEnd}
                      draggable
                    >
                      <span className="ml8 mr4">{matchingIcon(item.icon)}</span>
                      <span>{item.nodeName}</span>
                    </div>
                  ))
                }
              </div>
            </Panel>
          </Collapse>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="条件控制" key="1">
              <div>
                {
                  conditions.map(item => (
                    <div
                      className="dag-drag-box hand mr8 mb8"
                      onDrag={onDrag}
                      onDragStart={e => onDragStart(item, e)}
                      onDragEnd={onDragEnd}
                      draggable
                    >
                      <span className="ml4 mr4">{matchingIcon(item.icon)}</span>
                      <span>{item.nodeName}</span>
                    </div>
                  ))
                }
              </div>
            </Panel>
          </Collapse>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="流程控制" key="1">
              <div>
                {
                  process.map(item => (
                    <div
                      className="dag-drag-box hand mr8 mb8"
                      onDrag={onDrag}
                      onDragStart={e => onDragStart(item, e)}
                      onDragEnd={onDragEnd}
                      draggable
                    >
                      <span className="ml4 mr4">{matchingIcon(item.icon)}</span>
                      <span>{item.nodeName}</span>
                    </div>
                  ))
                }
              </div>
            </Panel>
          </Collapse>
        </Space>
      </div>
      <div className="dag-content w80">
        {
          isRender ? <div /> : (
            <DAG
              ref={e => setInstance(e)}
              {...option({instance, nodeList, setIsRender, setLinkList, runDrawer})}
              links={linkList}
              nodeList={nodeList}
            />
          )
        }
        
      </div>
      <div className="pa rt16 tp24 dag-right">
        {/* <span className="hand mr8">
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
        } */}
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
      <RunDrawer showRun={showRun} runDrawer={runDrawer} />
      <WechatDrawer />
    </div>
  )
}
export default Demo
