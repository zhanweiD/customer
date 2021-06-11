import {useState, useEffect} from 'react'
import {Modal, Form, Select, Button} from 'antd'
import {PlusOutlined, MinusCircleOutlined, DragOutlined} from '@ant-design/icons'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'

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

const SalesDetail = ({visible, setVisible}) => {
  const [dragItems, setDragItems] = useState([Date.now().toString()]) // dragId
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
    })
  }

  const handleCancel = () => {
    setVisible(false)
  }
  useEffect(() => {
    console.log(dragItems)
  }, [dragItems])

  return (
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
            initialValue="0"
          >
            <Select placeholder="请选择">
              <Option value="0">全部</Option>
            </Select>
          </Item>
          <Item
            label="结束事件"
            name="end"
            initialValue="0"
          >
            <Select placeholder="请选择">
              <Option value="0">全部</Option>
            </Select>
          </Item>
          <div className="config-title c65 fs12 mb24">过程配置</div>
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
                            initialValue="0"
                            {...layout1}
                          >
                            <Select placeholder="请选择" draggable="false">
                              <Option value="0">全部</Option>
                              <Option value="1">测试</Option>
                            </Select>
                          </Item>
                          {dragItems.length > 1 ? (
                            <div className="dynamic-delete-button">
                              <div>
                                <DragOutlined className="mr8" style={{cursor: 'grab'}} />
                              </div>
                              <div>
                                <MinusCircleOutlined
                                  draggable={false}
                                  onClick={() => removeItems(item)}
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Button
            type="primary"
            onClick={addItems}
            style={{width: '40%', marginBottom: '24px', marginLeft: '20px'}}
            icon={<PlusOutlined />}
          >
            添加分析
          </Button>
        </Form>
      </Modal>
    </DragDropContext>
  )
}

export default SalesDetail
