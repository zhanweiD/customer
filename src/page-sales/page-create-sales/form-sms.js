import React, {useState, useEffect} from 'react'
import {Form, Select, Input, Drawer} from 'antd'
import _ from 'lodash'

import {setSmsSign, setSmsTpl} from './unit'
import Wechat from './wechat/wechat'

const {Item} = Form
const {Option} = Select
const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 9,
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 9,
    offset: 3,
  },
}

const data = [
  'tenantName',
  'userName',
  'password',
]

export default ({
  getValues,
  smsSignList,
  smsTplList,
  smsTplId,
  accountId,
  getAllSign,
  getAllTpl,
  tagList,
  smsDefaultValues,
  onDefaultValChange,
  smsTplKeyList,
  setSmsTplKeyList,
  setVis,
  setPreviewData,
}) => {
  // const [smsForm] = Form.useForm()
  // const [keywordForm] = Form.useForm()
  const [drawerSignVis, setDrawerSignVis] = useState(false)
  const [drawerTplVis, setDrawerTplVis] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState('短信签名')
  const [keywordList, setKeyworkList] = useState([])
  const [isSign, setIsSign] = useState(false) // 判断是 新增签名 还是 新增模版

  const showSign = () => {
    setIsSign(true)
    setDrawerTitle('短信签名')
    setDrawerSignVis(true)
  }

  const showTpl = () => {
    setIsSign(false)
    setDrawerTitle('短信模版')
    setDrawerTplVis(true)
  }

  const drawerSignClose = () => {
    setDrawerSignVis(false)
  }

  const drawerTplClose = () => {
    setDrawerTplVis(false)
  }

  // 模版的选择
  const tplSelect = id => {
    // 提取关键词
    const target = _.find(smsTplList, e => e.id === id)
    
    const keywords = []
    const {content} = target
    // debugger
    const contentSplit = content.split('${')
    contentSplit.forEach(item => {
      if (item.indexOf('}') > -1) {
        keywords.push(item.split('}')[0])
      }
    })

    setKeyworkList(keywords)
    setSmsTplKeyList(keywords)
    // keywordForm.resetFields()
    
    // 手机模版预览
    setPreviewData(content)
    setVis(true)
  }

  useEffect(() => {
    if (smsTplId && smsTplList.length > 0) {
      tplSelect(smsTplId)
    }
  }, [smsTplId, smsTplList])

  useEffect(() => {
    setKeyworkList(smsTplKeyList)
  }, [smsTplKeyList])

  return (
    <div>

      <Item
        name="signName"
        label="短信签名"
        rules={[{required: true, message: '请选择短信签名'}]}
        extra="注：只能选择添加短信平台已过审的短信签名，签名请前往第三方短信平台查看。"
      >
        <Select
          placeholder="请选择短信签名"
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          {
            smsSignList.map(item => <Option value={item.name}>{item.name}</Option>)
          }
        </Select>
      </Item>
      <Item
        {...tailFormItemLayout}
      >
        <span>
          <a onClick={showSign}>新增签名</a>
        </span>
      </Item>
      <Item
        name="templateCode"
        label="短信模版"
        rules={[{required: true, message: '请选择短信模版'}]}
        extra="注：只能选择添加短信平台已过审的短信模版，模版请前往第三方短信平台查看。"
      >
        <Select
          placeholder="请选择短信模版"
          onChange={tplSelect}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          {
            smsTplList.map(item => <Option value={item.id}>{item.name}</Option>)
          }
        </Select>
        
      </Item>
      <Item
        {...tailFormItemLayout}
      >
        <span>
          <a onClick={showTpl}>新增模版</a>
        </span>
      </Item>
      {
        keywordList.map((item, index) => (
          <Item
            name={item}
            label={item}
            rules={[{required: true, message: '输入不能为空'}]}
          >
            <Wechat 
              id={item} 
              tagList={tagList} 
              type="sms"
              onDefaultValChange={e => onDefaultValChange(e, index)}
              defaultValues={smsDefaultValues[index]}
            />
          </Item>
        ))
      }
      
      {/* <div 
        className="mb24"
        style={{
          padding: '12px',
          backgroundColor: '#f5f8fc',
        }}
      >
        <div className="FBH" style={{lineHeight: '32px'}}>
          <div style={{width: '150px'}}>
            变量名称
          </div>
          <div className="require-word" style={{width: '162px'}}>
            选择变量
          </div>
          <div style={{width: '150px'}}>
            默认值
          </div>
        </div>
        <Form
          form={keywordForm}
        >
          {
            keywordList.map((item, index) => {
              return (
                <div className="FBH">
                  <div style={{width: '150px'}}>
                    {item}
                  </div>
                  <Item
                    name={`select-${index}`}
                  >
                    <Select style={{width: '150px'}}>
                      {
                        tagList.map(e => <Option value={e.objIdTagId}>{e.objNameTagName}</Option>)
                      }
                    </Select>
                  </Item>
                  <Item
                    name={`input-${index}`}
                  >
                    <Input style={{marginLeft: '12px', width: '150px'}} />
                  </Item>
                </div>
              )
            })
          }
        </Form>
      </div> */}
      
      <Drawer
        title={drawerTitle}
        width={525}
        visible={drawerSignVis}
        onClose={drawerSignClose}
        forceRender
        getContainer={false}
      >
        {
          setSmsSign({
            smsSignList,
            accountId,
            getAllSign,
          })
        }
      </Drawer>
      <Drawer
        title={drawerTitle}
        width={525}
        visible={drawerTplVis}
        onClose={drawerTplClose}
        forceRender
        getContainer={false}
      >
        {
          setSmsTpl({
            smsTplList,
            accountId,
            getAllTpl,
          })
        }
      </Drawer>
    </div>
  )
}
