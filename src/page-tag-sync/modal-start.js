import {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal} from 'antd'
import {CycleSelect} from '@dtwave/uikit'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}

@inject('bigStore')
@Form.create()
@observer
export default class ModalStart extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  @action handleCancel = () => {
    this.store.visibleStart = false
  }


  @action submit = () => {
    const {selectItem} = this.store
    const {form: {validateFields}} = this.props
    validateFields((err, values) => {
      if (err) {
        return 
      }

      const params = {
        id: selectItem.id,
        scheduleExpression: values.scheduleExpression,
      }

      this.store.startSync(params)
    })
  }

  render() {
    const {
      form: {
        getFieldDecorator,
      }} = this.props

    const {visibleStart} = this.store

    const modalConfig = {
      title: '启动周期调度',
      visible: visibleStart,
      onOk: this.submit,
      onCancel: this.handleCancel,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
    }

    return (
      <Modal {...modalConfig}>
        <Form>
          <FormItem
            className="period-item"
            label=""
            style={{marginBottom: 0}}
          >
            {getFieldDecorator('scheduleExpression', {
              initialValue: CycleSelect.formatCron({
                cycle: 'day',
              }),
              rules: [
                {required: true, message: '调度周期不能为空'},
              ],
            })(
              <CycleSelect
                cycleList={['day']}
                cycleText="调度"
                disabled={false}
                required
                layout="horizontal"
                formItemLayout={formItemLayout} 
              />
            )}
          </FormItem>
        </Form>
       
      </Modal>
    )
  }
}
