import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form, Select, Input, Button, Spin} from 'antd'

import {debounce} from '../../common/util'


const formItemLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 10},
  colon: false,
}
const {Option} = Select
const {TextArea} = Input

@inject('store')
@observer
export default class StepOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  
  formRef = React.createRef()
  @action.bound selectEntity(e) {
    this.store.objId = e
    this.form.resetFields(['name'])
  } 

  @action close = () => {
    window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/group/manage`
  }

  @action next = () => {
    this.formRef.current.validateFields().then(value => {
      this.store.current += 1
      this.store.getConfigTagList()
      this.store.getRelList()
      this.store.oneForm = value
    }).catch(err => {
      console.log(err)
    })
  }

  @action checkName = (rule, value, callback) => {
    if (!value) return callback('')
    const {objId, isCopy, detail} = this.store
    const params = {
      name: value,
      objId,
    }

    if (detail.id) {
      params.id = isCopy ? null : detail.id
    }
    
    // 防抖
    debounce(() => this.store.checkName(params, callback), 500)
  }

  @action changeObj = v => {
    this.store.objId = v
    this.formRef.current.resetFields(['name', 'outputTags', 'descr'])
    this.store.getOutputTags(v)
  }

  render() {
    const {
      current, detail, groupId, entityList, isCopy, objId, loading, outputTags, editLoading,
    } = this.store

    if (editLoading) {
      return <Spin spinning />
    }

    return (
      <div className="step-one" style={{display: current === 0 ? 'block' : 'none'}}>
        <Form
          name="three"
          // onFinish={onFinish}
          // form={form}
          ref={this.formRef}
          {...formItemLayout}
        >
          <Form.Item
            label="所属实体"
            name="objId"
            initialValue={toJS(detail.objId)}
            rules={[{
              required: true,
              message: '请选择对象',
            }]}
          >
            <Select
              size="small"
              disabled={groupId}
              placeholder="请选择对象"
              onChange={this.changeObj}
            >
              {
                entityList.map(d => <Option value={d.value}>{d.name}</Option>)
              }
            </Select>
          </Form.Item>       
          <Form.Item
            label="客群名称"
            name="name"
            rules={[{
              required: true,
              message: '请输入名称',
            }, {
              validator: this.checkName,
            }]}
            initialValue={isCopy ? undefined : detail.name}
          >
            <Input disabled={!objId || (groupId && !isCopy)} placeholder="请输入名称" />
          </Form.Item>       
          <Form.Item
            label="输出标签设置"
            name="outputTags"
            // validateFirst
            rules={[{
              required: true,
              message: '请选择标签',
            }, 
            {
              validator: (rule, value) => {
                if (value && value.length < 10) {
                  return Promise.resolve()
                }
                return Promise.reject('最多可选择10个标签')
              },
            },
            ]}
            initialValue={toJS(detail.outputTags)}
          >
            <Select
              mode="multiple"
              size="small"
              showSearch
              // optionFilterProp="children"
              placeholder="请选择标签"
            >
              {
                outputTags.map(d => <Option value={d.tagId}>{d.tagName}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="描述"
            name="descr"
            initialValue={detail.name}
          >
            <TextArea placeholder="请输入名称" />
          </Form.Item>       

          <div className="steps-action">
            <Button 
              style={{marginRight: 16}}
              onClick={() => window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/group/manage`}
            >
              返回
            </Button>
            <Button
              type="primary"
              onClick={this.next}
            >
              下一步
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}
