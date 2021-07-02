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

export const comparisionList = [{
  value: 'in',
  name: '等于',
}, {
  value: 'gt',
  name: '大于',
}, {
  value: 'gte',
  name: '大于等于',
}, {
  value: 'lt',
  name: '小于',
}, {
  value: 'lte',
  name: '小于等于',
}, {
  value: 'not in',
  name: '不等于',
}]


export const listToTree = data => {
  const newData = _.cloneDeep(data)

  newData.forEach(item => {
    const children = newData.filter(sitem => sitem.parentId === item.id)
    if (children.length && !item.children) item.children = children
  })

  return newData.filter(item => item.parentId === -1)
}

// 0 未生效、1 已生效、2 已暂停 、3 已结束
export const tagMap = {
  0: <Tag status="default" text="未生效" />,
  1: <Tag status="green" text="已生效" />,
  2: <Tag status="orange" text="已暂停" />,
  3: <Tag status="blue" text="已结束" />,
}

export const matchTime = v => {
  if (v === 'MINUTES') {
    return '分钟'
  }
  if (v === 'HOURS') {
    return '小时'
  }
  return '天'
}

// step-three 设置模版
export const setTemplate = ({
  templateChange,
  templateList,
  templateKeyList,
  tagList,
  actionId,
  showDrawer,
  selectMedia,
}) => {
  // 发送图文消息
  if (actionId === 2002) {
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
  if (actionId === 2001) {
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
    dataIndex: 'name',
    title: '短信签名',
  }, {
    key: 'action',
    title: '操作',
    render: (text, record) => {
      return <a>删除</a>
    },
  },
]

export const setSmsSign = ({
  smsSignList,
}) => {
  return (
    <div>
      <Form
        name="sms-sign"
      >
        <Item
          label="短信签名"
          rules={[{required: true, message: '请输入短信签名'}]}
        >
          <div className="FBH">
            <Input placeholder="请输入阿里云审核通过的短信签名" />
            <Button 
              type="primary"
              style={{marginLeft: '16px'}}
            >
              添加
            </Button>
          </div>
        </Item>
      </Form>
      <Table
        className="mt16"
        pagination={false}
        dataSource={smsSignList}
        columns={signColumns}
      />
    </div>
  )
}

const signTpls = [
  {
    dataIndex: 'name',
    title: '模版名称', // hover 展示详情？
  }, {
    dataIndex: 'code',
    title: '模版',
    render: (text, record) => {
      return (
        <div
          style={{
            whiteSpace: 'pre-wrap',
            padding: '12px',
            backgroundColor: '#f5f8fc',
          }}
        >
          {text}
        </div>
      )
    },
  }, {
    key: 'action',
    title: '操作',
    render: (text, record) => {
      return <a>删除</a>
    },
  },
]

export const setSmsTpl = ({
  smsTplList,
}) => {
  return (
    <div>
      <Form
        name="sms-tpl"
      >
        <Item
          label="短信模版"
        >
          <div className="FBH">
            <Input placeholder="请输入阿里云审核通过的短信模版code" />
            <Button 
              type="primary"
              style={{marginLeft: '16px'}}
            >
              添加
            </Button>
          </div>
        </Item>
      </Form>
      <Table
        className="mt16"
        pagination={false}
        dataSource={smsTplList}
        columns={signTpls}
      />
    </div>
  )
}
