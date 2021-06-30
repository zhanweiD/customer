import {
  Form, DatePicker, TimePicker, Input, Select,
} from 'antd'

import Wechat from './wechat/wechat'

const {Item} = Form
const {Option} = Select
const dateFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm:ss'

// step-three 设置模版
export const setTemplate = ({
  templateChange,
  templateList,
  thumbMediaList,
  templateKeyList,
  tagList,
  accountId,
}) => {
  // 发送图文消息
  if (accountId === 2002) {
    return (
      <div className="template-tip c45">
        <Item
          label="选择图文"
          name="thumb_media_id"
          rules={[{required: true, message: '图文不能为空'}]}
        >
          <Select onChange={templateChange} placeholder="请选择图文">
            {
              thumbMediaList.map(item => <Option value={item.thumb_media_id}>{item.title}</Option>)
            }
          </Select>
        </Item>
        <div className="fac">温馨提示</div>
        <div>关于群发次数限制</div>
        <p>
          微信公众平台为订阅号提供了每天1条的群发权限，为服务号提供每月（自然月）4条的群发权限。
        </p>
        <div>关于营销动作建议</div>
        <p>
          因【群发消息】动作受微信发送次数限制，建议【群发消息】在大量用户同时触达时作为目标动作进行使用，单次仅触达1个用户，当月的群发次数也会减少相应次数，请谨慎使用。
        </p>
      </div>
    )
  }
  // 发送微信模版消息
  return (
    <div>
      <Item
        label="内容模板"
        name="templateId"
        rules={[{required: true, message: '模板不能为空'}]}
      >
        <Select onChange={templateChange} placeholder="请选择模版">
          {
            templateList.map(item => <Option value={item.template_id}>{item.title}</Option>)
          }
        </Select>
      </Item>
      <Item
        label="内容设置"
        name="templateJson"
      >
        <span className="c-primary">样式预览</span>
      </Item>
        
      {
        templateKeyList.map(item => (
          <Item
            name={item}
            label={item}
            rules={[{required: true, message: '输入不能为空'}]}
          >
            <Wechat id={item} tagList={tagList} />
          </Item>
        ))
      }
    </div>
  )
}

// step-two 设置时间dom
export const setTimeDom = ({
  period, cornTime, disabledDate,
}) => {
  // 根据重复方式生成触发时间组件
  const setMonth = () => {
    const monthData = []
    for (let i = 1; i <= 31; i++) {
      monthData.push(<Option value={i}>{`${i}号`}</Option>)
    }
    return monthData
  }
  if (period === '1') {
    return (
      <Item
        noStyle 
        name="time"
        rules={[{required: true, message: '请选择时间'}]}
        initialValue={cornTime.time ? moment(cornTime.time, timeFormat) : undefined}
      >
        <TimePicker format={timeFormat} style={{width: '40%'}} />
      </Item>
    )
  } 
  if (period === '2') {
    return (
      <Input.Group compact>
        <Item 
          noStyle 
          name="interval" 
          rules={[{required: true, message: '请选择日期'}]}
          initialValue={cornTime.interval}
        >
          <Select style={{width: '60%'}} placeholder="请选择日期">
            <Option value={1}>星期一</Option>
            <Option value={2}>星期二</Option>
            <Option value={3}>星期三</Option>
            <Option value={4}>星期四</Option>
            <Option value={5}>星期五</Option>
            <Option value={6}>星期六</Option>
            <Option value={7}>星期日</Option>
          </Select>
        </Item>
        <Item 
          noStyle 
          name="time" 
          rules={[{required: true, message: '请选择时间'}]}
          initialValue={cornTime.time ? moment(cornTime.time, timeFormat) : undefined}
        >
          <TimePicker format={timeFormat} style={{width: '40%'}} />
        </Item>
      </Input.Group>
    )
  } 
  if (period === '3') {
    return (
      <Input.Group compact>
        <Item 
          noStyle 
          name="interval" 
          rules={[{required: true, message: '请选择日期'}]}
          initialValue={cornTime.interval}
        >
          <Select style={{width: '60%'}} placeholder="请选择日期">
            {
              setMonth()
            }
          </Select>
        </Item>
        <Item 
          noStyle 
          name="time" 
          initialValue={cornTime.time ? moment(cornTime.time, timeFormat) : undefined}
          rules={[{required: true, message: '请选择时间'}]}
        >
          <TimePicker format={timeFormat} style={{width: '40%'}} />
        </Item>
      </Input.Group>
    )
  }
  return (
    <Input.Group compact>
      <Item 
        noStyle 
        name="interval" 
        rules={[{required: true, message: '请选择日期'}]}
        initialValue={cornTime.date ? moment(cornTime.date, dateFormat) : undefined}
      >
        <DatePicker disabledDate={disabledDate} format={dateFormat} style={{width: '60%'}} />
      </Item>
      <Item 
        noStyle 
        name="time" 
        rules={[{required: true, message: '请选择时间'}]}
        initialValue={cornTime.time ? moment(cornTime.time, timeFormat) : undefined}
      >
        <TimePicker format={timeFormat} style={{width: '40%'}} />
      </Item>
    </Input.Group>
  )
}
