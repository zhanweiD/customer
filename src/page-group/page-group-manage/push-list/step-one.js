import React, {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Form, Button, Select, Input, DatePicker, TimePicker} from 'antd'

import {CycleSelect} from '@dtwave/uikit'
import {Loading} from '../../../component'

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
    const {detail, sourceList, groupList, tableList, current, formLoading} = this.store
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
                label="客群"
                name="groupId"
                rules={[{required: true, message: '请选择客群'}]}
                initialValue={toJS(detail.groupId)}
              >
                <Select
                  
                  placeholder="请选择客群"
                  onChange={v => this.store.groupId = v}
                >
                  {
                    groupList.map(d => <Option value={d.value}>{d.name}</Option>)
                  }
                </Select>
              </Form.Item>

              <Form.Item
                label="目的源"
                name="storageId"
                rules={[{required: true, message: '请选择目的源'}]}
                initialValue={toJS(detail.toStorageId)}
              >
                <Select
                  
                  placeholder="请选择目的源"
                  onChange={this.changeStorage}
                >
                  {
                    sourceList.map(d => <Option name={d.name} value={d.value}>{d.name}</Option>)
                  }
                </Select>
              </Form.Item>

              <Form.Item
                label="数据表"
                name="tableName"
                rules={[{required: true, message: '请选择数据表'}]}
                initialValue={toJS(detail.toTableName)}
              >
                <Select
                  
                  placeholder="请选择数据表"
                  onChange={v => this.store.tableName = v}
                >
                  {
                    tableList.map(d => <Option disabled={d.status} value={d.name}>{d.name}</Option>)
                  }
                </Select>
              </Form.Item>

              <Form.Item
                label="推送时间"
                name="scheduleExpression"
                rules={[{required: true, message: '请选择时间'}]}
                initialValue={moment(detail.scheduleExpression || CycleSelect.cronSrialize('0 10 0 * * ? *').time, format)}
              >
                <TimePicker format={format} />
              </Form.Item>

              <Form.Item
                label="推送周期"
                name="time"
                rules={[{required: true, message: '请选择时间'}]}
                initialValue={detail.startTime ? [moment(moment(detail.startTime).format(dateFormat), dateFormat), moment(moment(detail.endTime).format(dateFormat), dateFormat)] : undefined}
              >
                <RangePicker />
              </Form.Item>

              <Form.Item
                label="请输入描述"
                name="descr"
                initialValue={detail.descr}
              >
                <Input.TextArea placeholder="请选择描述" />
              </Form.Item>
            </Form>
          )
        }

        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={this.onClose}>关闭</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.next}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
