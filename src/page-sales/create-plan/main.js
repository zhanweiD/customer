import {useState, useEffect} from 'react'
import {Button, Collapse, Input, message, Space} from 'antd'
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
import SaveModal from './save-modal'
import option from './option'
import matchingIcon from './unit'
import {links, nodes, types, conditions, process} from './mock'
import io from './io'
import './index.styl'

const {Panel} = Collapse

const Demo = () => {
  const [instance, setInstance] = useState(null) // dag实例
  const [isRender, setIsRender] = useState(false) // 用于刷新画布
  const [isRun, setIsRun] = useState(false) // 运行
  const [nodeList, setNodeList] = useState(nodes) // 初始化节点
  const [linkList, setLinkList] = useState(links) // 初始化连线
  const [showRun, setShowRun] = useState(false) // 开始抽屉
  const [showWeService, setShowWeService] = useState(false) // 微信服务号抽屉
  const [showSaveModal, setShowSaveModal] = useState(false) // 保存计划
  const [saveLoading, setSaveLoading] = useState(false) // 保存计划

  const [runFormData, setRunFormData] = useState({}) // 开始控件表单值
  const [weSFormData, setWeSFormData] = useState({}) // 微信服务号控件表单值
  const [isAll, setIsAll] = useState(false) // 全屏
  const [groupList, setGroupList] = useState([]) // 人群列表
  const [eventList, setEventList] = useState([]) // 事件列表
  const [planInfo, setPlanInfo] = useState({}) // 计划详情
  const [channelId, setChannelId] = useState(null) // 渠道id

  // 获取人群
  const getGroupList = async () => {
    try {
      const res = await io.getGroupList()
      setGroupList(res)
    } catch (error) {
      console.log(error)
    }
  }
  // 获取事件
  const getEventList = async () => {
    try {
      const res = await io.getEventList()
      setEventList(res)
    } catch (error) {
      console.log(error)
    }
  }
  // 获取计划详情
  const getPlanInfo = async () => {
    try {
      const res = await io.getPlanInfo()
    } catch (error) {
      console.log(error)
    }
  }

  // 开始抽屉
  const runDrawer = v => {
    setShowRun(v)
  }
  // 微信服务号抽屉
  const weServiceDrawer = v => {
    setShowWeService(v)
  }
  // 保存
  const saveModal = v => {
    setShowSaveModal(v)
  }
  // 保存loading
  const setLoading = v => {
    setSaveLoading(v)
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
  // 保存
  const planData = {
    // if (Object.keys(runFormData).length === 0) return message.warning('请配置开始控件')
    // if (Object.keys(weSFormData).length === 0) return message.warning('请配置微信服务号控件')
    // setShowSaveModal(true)
    ...runFormData,
    ...weSFormData,
    channelId,
  }
  const changeChannelId = v => {
    setChannelId(v)
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
  const onDragStart = ({
    id = new Date().getTime(), 
    nodeName, 
    status, 
    icon, 
    ioType, 
    maxConnections,
  }, e) => {
    const newNode = {
      id,
      nodeName,
      status,
      icon,
      ioType,
      maxConnections,
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
        <Button className="header-but" onClick={() => setShowSaveModal(true)}>
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
              {...option({
                instance, 
                nodeList, 
                setIsRender, 
                setLinkList, 
                runDrawer, 
                weServiceDrawer,
                changeChannelId,
              })}
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
      <RunDrawer 
        showRun={showRun} 
        runDrawer={runDrawer} 
        setRunForm={setRunFormData} 
        runFormData={runFormData}
        groupList={groupList}
        eventList={eventList}
      />
      <WechatDrawer 
        showWeService={showWeService} 
        weServiceDrawer={weServiceDrawer}
        weSFormData={weSFormData}
        setWeSFormData={setWeSFormData}
      />
      <SaveModal 
        visible={showSaveModal} 
        saveModal={saveModal} 
        planData={planData}
      />
    </div>
  )
}
export default Demo
