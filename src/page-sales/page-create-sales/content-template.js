import {Form, Select} from 'antd'
import Wechat from './wechat/wechat'

const {Item} = Form
const {Option} = Select

const setTemplate = ({
  templateChange,
  templateList,
  thumbMediaList,
  templateKeyList,
  tagList,
  isMass,
}) => {
  if (isMass) {
    return (
      <div className="template-tip c45">
        {/* <Item
          label="选择图文"
          name="thumb_media_id"
          rules={[{required: true, message: '图文不能为空'}]}
        >
          <Select onChange={templateChange} placeholder="请选择图文">
            {
              thumbMediaList.map(item => <Option value={item.thumb_media_id}>{item.title}</Option>)
            }
          </Select>
        </Item> */}
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

export default setTemplate
