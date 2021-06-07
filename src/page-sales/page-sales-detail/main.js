import {Modal, Form, Select, Button} from 'antd'
import {PlusOutlined, MinusCircleOutlined} from '@ant-design/icons'

const {Option} = Select
const {Item, List} = Form
const layout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 23,
  },
}

const SalesDetail = () => {
  const [configForm] = Form.useForm()
  const handleOk = () => {
  }

  const handleCancel = () => {
  }
  return (
    <Modal 
      title="分析配置" 
      visible 
      onOk={handleOk} 
      onCancel={handleCancel}
    >
      <Form
        {...layout}
        name="savePlan"
        form={configForm}
      >
        <Item
          name="start"
          initialValue="0"
        >
          <Select placeholder="请选择">
            <Option value="0">全部</Option>
          </Select>
        </Item>
        <List
          name="config-list"
        >
          {(fields, {add, remove}, {errors}) => (
            <div>
              {fields.map((field, index) => (
                <Item
                  required={false}
                  key={field.key}
                >
                  <Item
                    {...field}
                    {...layout}
                    noStyle
                  >
                    <Select placeholder="请选择">
                      <Option value="0">全部</Option>
                    </Select>
                  </Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Item>
              ))}
              <Button
                type="primary"
                onClick={() => add()}
                style={{width: '40%', marginBottom: '24px'}}
                icon={<PlusOutlined />}
              >
                添加事件
              </Button>
            </div>
          )}
        </List>
        <Item
          name="end"
          initialValue="0"
        >
          <Select placeholder="请选择">
            <Option value="0">全部</Option>
          </Select>
        </Item>
      </Form>
    </Modal>
  )
}

export default SalesDetail
