import {useState, useEffect} from 'react'
import {Modal, Form, Select, Button, Input} from 'antd'
import {PlusOutlined, MinusCircleOutlined, DragOutlined} from '@ant-design/icons'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import {autorun} from 'mobx'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  marginBottom: '24px',
  ...draggableStyle,
})

const {Option} = Select
const {Item} = Form
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
}
const layout1 = {
  wrapperCol: {
    span: 18,
    offset: 4,
  },
}

const SalesDetail = ({visible, setVisible, store}) => {
  // const [dragItems, setDragItems] = useState([Date.now().toString()]) // dragId
  // const [dragItems, setDragItems] = useState(['aaa-bbb-ccc']) // dragId
  const [dragItems, setDragItems] = useState([]) // dragId
  const [configForm] = Form.useForm()

  const onDragEnd = result => {
    if (!result.destination) {
      return
    }
    const items = reorder(
      dragItems,
      result.source.index,
      result.destination.index
    )
    setDragItems(items)
  }

  const addItems = () => {
    setDragItems([...dragItems, Date.now().toString()])
  }

  const removeItems = itemId => {
    const newDate = dragItems.filter(id => id !== itemId)
    setDragItems(newDate)
  }

  const handleOk = () => {
    configForm.validateFields().then(value => {
      console.log(value)

      const {start, end, ...rest} = value
      // 获取过程配置的数据
      const analysisValues = _.values(rest)

      /*
        {
          "eventId": 1,
          "eventCode": "MSG_TEXT",
          "channelId": 1,
          "channelCode": "wxe2b3f176ba1a4f33",
          "accountId": 8207207676424,
          "accountCode": "wxe2b3f176ba1a4f33"
        }
      */
      const resultValues = []
      resultValues.push(store.analysisedEventList[0])
      analysisValues.forEach(item => {
        // 处理数据
        const splitValues = item.split('-')

        resultValues.push({
          channelCode: _.find(store.eventList, e => e.name === splitValues[0]).code,
          channelId: _.find(store.eventList, e => e.name === splitValues[0]).id,
          accountCode: _.find(store.eventList, e => e.name === splitValues[1]).code,
          accountId: _.find(store.eventList, e => e.name === splitValues[1]).id,
          eventCode: _.find(store.eventList, e => e.name === splitValues[2]).code,
          eventId: _.find(store.eventList, e => e.name === splitValues[2]).id,
        })
      })

      resultValues.push(store.analysisedEventList[store.analysisedEventList.length - 1])

      store.editAnalysis({
        events: resultValues,
        id: store.id,
      }, () => {
        setVisible(false)
        // 要获取详情数据
      })
    })
  }

  const handleCancel = () => {
    setVisible(false)
  }
  useEffect(() => {
    console.log(dragItems)
  }, [dragItems])

  useEffect(() => {
    store.getAllAnalysisEvents(() => {
      store.getConfiguredAnalysisEvents(() => {
        // 初始化过程配置的数据
        const initV = []

        store.initAnalisysValue.forEach(item => {
          initV.push(Date.now().toString())
        })

        setDragItems(initV)
      })
    })
  }, [])

  return useObserver(() => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Modal 
        title="分析配置" 
        visible={visible}
        onOk={handleOk} 
        onCancel={handleCancel}
        maskClosable={false}
      >
        <Form
          {...layout}
          name="savePlan"
          form={configForm}
          className="analysis-form"
        >
          <Item
            label="开始事件"
            name="start"
          >
            <span>{store.analysisStart}</span>
          </Item>
          <div className="FBH" style={{marginLeft: '21px'}}>
            <div className="fs12" style={{color: 'rgba(0,0,0,0.65)'}}>过程配置</div>
            <Button
              type="primary"
              onClick={addItems}
              style={{width: '40%', marginBottom: '24px', marginLeft: '10px'}}
              icon={<PlusOutlined />}
              disabled={store.eventListFormatter.length === dragItems.length}
            >
              添加分析
            </Button>
          </div>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                // style={{width: '75%', marginLeft: 78}}
              >
                {dragItems.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <div className="pr">
                          <Item
                            name={item}
                            initialValue={store.initAnalisysValue[index]}
                            {...layout1}
                          >
                            <Select placeholder="请选择" draggable="false">
                              {
                                store.eventListFormatter.map(e => <Option value={e.name}>{e.name}</Option>)
                              }
                            </Select>
                          </Item>
                          <div className="dynamic-delete-button">
                            {
                              dragItems.length > 1 && (
                                <div>
                                  <DragOutlined className="mr8" style={{cursor: 'grab'}} />
                                </div>
                              )
                            }
                            {
                              dragItems.length > 0 && (
                                <div>
                                  <MinusCircleOutlined
                                    draggable={false}
                                    onClick={() => removeItems(item)}
                                  />
                                </div>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Item
            label="结束事件"
            name="end"
          >
            <div>{store.analysisEnd}</div>
          </Item>
        </Form>
      </Modal>
    </DragDropContext>
  ))
}

export default inject('store')(SalesDetail)
