import React, {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Form, Button, Select, Input, DatePicker, TimePicker} from 'antd'

import {CycleSelect} from '@dtwave/uikit'
import {Loading} from '../../../component'
import dropdown from '../../../icon/dropdown.svg'

const {Option} = Select
const {RangePicker} = DatePicker

const format = 'HH:mm'
const dateFormat = 'YYYY/MM/DD'
@observer
export default class StepOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  formRef = React.createRef()

  @action next = () => {
    this.formRef.current.validateFields().then(value => {
      this.store.current += 1
      this.store.formValue = {
        groupId: value.groupId,
        storageId: value.storageId,
        tableName: value.tableName,
        name: this.store.storageName,
        scheduleExpression: CycleSelect.formatCron({cycle: 'day', time: value.scheduleExpression.format(format)}),
        startTime: new Date(value.time[0].format('YYYY-MM-DD')).getTime(),
        endTime: new Date(value.time[1].format('YYYY-MM-DD')).getTime(),
        descr: value.descr,
      }
    }).catch(err => {
      console.log(err)
    })
  }

  @action onClose = () => {
    this.store.detail = {}
    this.store.drawerVisible = false
    this.formRef.current.resetFields()
  }

  @action changeStorage = (v, item) => {
    this.formRef.current.resetFields(['tableName'])
    this.store.storageName = item.name
    this.store.storageId = v
    this.store.getTables()
  }

  render() {
    const {detail, sourceList, groupList, tableList, current, formLoading, groupId} = this.store
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 9},
      colon: false,
    }

    return (
      <div className="mt48" style={{display: current ? 'none' : 'block'}}>
        {
          formLoading ? <Loading /> : (
            <Form
              name="one"
              ref={this.formRef}
              {...formItemLayout}
            >
              <Form.Item
                label="??????"
                name="groupId"
                rules={[{required: true, message: '???????????????'}]}
                initialValue={toJS(detail.groupId || groupId)}
              >
                <Select
                  suffixIcon={<img src={dropdown} alt="dropdown" />}
                  placeholder="???????????????"
                  onChange={v => this.store.groupId = v}
                >
                  {
                    groupList.map(d => <Option value={d.value}>{d.name}</Option>)
                  }
                </Select>
              </Form.Item>

              <Form.Item
                label="?????????"
                name="storageId"
                rules={[{required: true, message: '??????????????????'}]}
                initialValue={toJS(detail.toStorageId)}
              >
                <Select
                  suffixIcon={<img src={dropdown} alt="dropdown" />}
                  placeholder="??????????????????"
                  onChange={this.changeStorage}
                >
                  {
                    sourceList.map(d => <Option name={d.name} value={d.value}>{d.name}</Option>)
                  }
                </Select>
              </Form.Item>

              <Form.Item
                label="?????????"
                name="tableName"
                rules={[{required: true, message: '??????????????????'}]}
                initialValue={toJS(detail.toTableName)}
              >
                <Select
                  suffixIcon={<img src={dropdown} alt="dropdown" />}
                  placeholder="??????????????????"
                  onChange={v => this.store.tableName = v}
                >
                  {
                    tableList.map(d => <Option disabled={d.status} value={d.name}>{d.name}</Option>)
                  }
                </Select>
              </Form.Item>

              <Form.Item
                label="????????????"
                name="scheduleExpression"
                rules={[{required: true, message: '???????????????'}]}
                initialValue={moment(detail.scheduleExpression || CycleSelect.cronSrialize('0 10 0 * * ? *').time, format)}
              >
                <TimePicker format={format} />
              </Form.Item>

              <Form.Item
                label="????????????"
                name="time"
                rules={[{required: true, message: '???????????????'}]}
                initialValue={detail.startTime ? [moment(moment(detail.startTime).format(dateFormat), dateFormat), moment(moment(detail.endTime).format(dateFormat), dateFormat)] : undefined}
              >
                <RangePicker />
              </Form.Item>

              <Form.Item
                label="???????????????"
                name="descr"
                initialValue={detail.descr}
              >
                <Input.TextArea placeholder="???????????????" />
              </Form.Item>
            </Form>
          )
        }

        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={this.onClose}>??????</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.next}
          >
            ?????????
          </Button>
        </div>
      </div>
    )
  }
}
