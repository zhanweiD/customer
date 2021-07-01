import {
  Form, DatePicker, TimePicker, Input, Select, Button, Table, Tag,
} from 'antd'

import Wechat from './wechat/wechat'

const {Item} = Form
const {Option} = Select
const dateFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm:ss'

const tailFormItemLayout = {
  wrapperCol: {
    span: 9,
    offset: 3,
  },
}

// step-three 设置模版
export const setTemplate = ({
  templateChange,
  templateList,
  templateKeyList,
  tagList,
  accountId,
  showDrawer,
  selectMedia,
}) => {
  // 发送图文消息
  if (accountId === 2002) {
    const {mediaData = {}} = selectMedia
    return (
      <div>
        {
          mediaData.title ? (
            <div>
              <div className="select-content">
                <div className="FBH content-item">
                  <div>
                    {mediaData.thumb_url ? <img className="mr16" height={88} src={mediaData.thumb_url} alt="" /> : ''}
                  </div>
                  <div>
                    <div className="item-title">{mediaData.title}</div>
                    <div className="c65">{mediaData.digest}</div>
                  </div>
                </div>
              </div>
              <a className="ml24" onClick={showDrawer}>重新选择</a>
            </div>
          ) : (
            <div className="select-content FBH FBJC FBAC">
              <a onClick={showDrawer}>+选择内容</a>
            </div>
          )
        }
        
        <div className="template-tip c45">
          <div className="fac">温馨提示</div>
          <div>
            <Tag color="orange">关于群发次数限制</Tag>
            {/* <Tag color="volcano">关于群发次数限制</Tag> */}
          </div>
          <p>
            微信公众平台为订阅号提供了每天1条的群发权限，为服务号提供每月（自然月）4条的群发权限。
          </p>
          <div>
            <Tag color="orange">关于营销动作建议</Tag>
          </div>
          <p>
            因【群发消息】动作受微信发送次数限制，建议【群发消息】在大量用户同时触达时作为目标动作进行使用，单次仅触达1个用户，当月的群发次数也会减少相应次数，请谨慎使用。
          </p>
        </div>
      </div>
    )
  }
  if (accountId === 2001) {
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
  // 发送微信模版消息
  return null
}

// step-two 设置时间dom
export const setTimeDom = ({
  period, cornTime, disabledDate,
}) => {
  // 根据重复方式生成触发时间组件
  const setMonth = () => {
    const monthData = []
    const dayCount = moment().daysInMonth()
    for (let i = 1; i <= dayCount; i++) {
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


export const setSMS = ({
  setIsSign,
  setDrawerVis,
}) => {
  const addSign = () => {
    setIsSign(true)
    setDrawerVis(true)
  }

  const addTpl = () => {
    setIsSign(false)
    setDrawerVis(true)
  }

  return (
    <div>
      <Item
        label="短信签名"
        name="aaaa"
        rules={[{required: true, message: '短信签名不能为空'}]}
        extra="注：只能选择添加短信平台已过审的签名，签名请前往第三方短信平台查看。"
      >
        <Select placeholder="请选择短信签名">
          <Option value={123}>123</Option>
        </Select>
      </Item>
      <Item
        {...tailFormItemLayout}
      >
        <a onClick={() => addSign()}>新增短信签名</a>
      </Item>
      <Item
        label="短信模版"
        name="bbbb"
        rules={[{required: true, message: '短信模版不能为空'}]}
        extra="注：只能选择添加短信平台已过审的短信模版，短信模版请前往第三方短信平台查看。"
      >
        <Select placeholder="请选择短信模版">
          <Option value={222}>222</Option>
        </Select>
      </Item>
      <Item
        {...tailFormItemLayout}
      >
        <a onClick={() => addTpl()}>新增短信模版</a>
      </Item>
    </div>
  )
}


const signColumns = [
  {
    key: 'name',
    title: '短信签名',
  }, {
    key: 'action',
    title: '操作',
    render: (text, record) => {
      return <a>删除</a>
    },
  },
]

export const setSmsSign = () => {
  return (
    <div>
      <Form
        name="sms-sign"
      >
        <Item
          label="短信签名"
        >
          <Input placeholder="请输入阿里云审核通过的短信签名" />
        </Item>
        <Button type="primary">
          添加
        </Button>
      </Form>
      <Table
        className="mt16"
        pagination={false}
        dataSource={[]}
        columns={signColumns}
      />
    </div>
  )
}

const signTpls = [
  {
    key: 'name',
    title: '模版名称', // hover 展示详情？
  }, {
    key: 'code',
    title: '模版code',
  }, {
    key: 'action',
    title: '操作',
    render: (text, record) => {
      return <a>删除</a>
    },
  },
]

export const setSmsTpl = () => {
  return (
    <div>
      <Form
        name="sms-tpl"
      >
        <Item
          label="短信模版"
        >
          <Input placeholder="请输入阿里云审核通过的短信模版code" />
        </Item>
        <Button type="primary">
          添加
        </Button>
      </Form>
      <Table
        className="mt16"
        pagination={false}
        dataSource={[]}
        columns={signTpls}
      />
    </div>
  )
}
