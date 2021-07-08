import React, {useState, useEffect} from 'react'
import {Form, Select, Input, Drawer, Modal, Button, message, Col} from 'antd'
import {PlaySquareOutlined} from '@ant-design/icons'
import _ from 'lodash'

import {setSmsSign, setSmsTpl} from './unit'
import Wechat from './wechat/wechat'
import io from './io'
import dropdown from '../../../icon/dropdown.svg'

const {Item} = Form
const {Option} = Select
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}

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
  smsForm,
}) => {
  // const [smsForm] = Form.useForm()
  // const [keywordForm] = Form.useForm()
  const [modalForm] = Form.useForm()
  const [drawerSignVis, setDrawerSignVis] = useState(false)
  const [drawerTplVis, setDrawerTplVis] = useState(false)
  const [modalVis, setModalVis] = useState(false)
  const [drawerTitle, setDrawerTitle] = useState('短信签名')
  const [keywordList, setKeyworkList] = useState([])
  const [isSign, setIsSign] = useState(false) // 判断是 新增签名 还是 新增模版
  const [smsContent, setSmsContent] = useState(null)
  const [templateParam, setTemplateParam] = useState({})
  const [btnLoading, setBtnLoading] = useState(false)
  const [showTestSMS, setShowTestSMS] = useState(false)

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
  const tplSelect = code => {
    // 提取关键词
    const target = _.find(smsTplList, e => e.code === code)
    
    const keywords = []
    const {content} = target
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
    setShowTestSMS(true)
  }

  const showSendSMS = () => {
    const formValues = smsForm.getFieldsValue()
    const target = _.find(smsTplList, e => e.code === formValues.templateCode)
    let {content} = target

    const templateParamObj = {}

    smsTplKeyList.forEach(item => {
      let itemValue = formValues[item]

      itemValue = itemValue.replace(/<span[^>]+">/g, '${').replace(/<\/span>/g, '}').replace(/&nbsp;/g, '')
      templateParamObj[item] = itemValue

      // eslint-disable-next-line no-useless-escape
      content = content.replace(`\$\{${item}\}`, itemValue)
    })

    setTemplateParam(templateParamObj)
    content = content.replace(/$/g, '')
    setSmsContent(content)
    // const targetTpl = _.find(smsTplList, e => e.id === value.templateCode)
    setModalVis(true)
  }

  // 测试发送短信
  const sendSMS = () => {
    modalForm.validateFields().then(value => {
      const formValues = smsForm.getFieldsValue()

      const targetTpl = _.find(smsTplList, e => e.id === formValues.templateCode)

      sendSMSIO({
        accountId,
        phoneNumbers: +value.phoneNumbers,
        signName: formValues.signName,
        templateCode: formValues.templateCode,
        templateParam,
      })
    }).catch(err => console.log(err))
  }

  const sendSMSIO = async params => {
    setBtnLoading(true)
    try {
      const res = await io.sendSms({
        ...params,
      })

      setModalVis(false)
      modalForm.resetFields()
      message.success('发送成功')
    } catch (e) {
      message.error(e.message)
    } finally {
      setBtnLoading(false)
    }
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
          suffixIcon={<img src={dropdown} alt="dropdown" />}
        >
          {
            smsSignList.map(item => <Option value={item.name}>{item.name}</Option>)
          }
        </Select>
      </Item>
      <Col offset={4} span={9}>
        <div className="mb4">
          <a onClick={showSign}>新增签名</a>
        </div>
      </Col>
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
          suffixIcon={<img src={dropdown} alt="dropdown" />}
        >
          {
            smsTplList.map(item => <Option value={item.code}>{item.name}</Option>)
          }
        </Select>
        
      </Item>
      <Col offset={4} span={9}>
        <div className="mb4">
          <a onClick={showTpl}>新增模版</a>
        </div>
      </Col>
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
      {
        showTestSMS && (
          <Col offset={4} span={9}>
            <span className="hand" onClick={showSendSMS}>
              <PlaySquareOutlined style={{color: '#3f5ff4'}} />
              <a className="ml8">测试发送</a>
            </span>
          </Col>
        )
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
      <Modal
        title="测试发送"
        visible={modalVis}
        destroyOnClose
        maskClosable={false}
        forceRender
        footer={(
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button 
              className="mr8" 
              onClick={() => {
                setModalVis(false)
                modalForm.resetFields()
              }}
            >
              取消
            </Button>
            <Button type="primary" onClick={() => sendSMS()} loading={btnLoading}>
              发送
            </Button>
          </div>
        )}
        onCancel={() => {
          setModalVis(false)
          modalForm.resetFields()
        }}
      >
        <Form
          form={modalForm}
          {...layout}
        >
          <Item
            label="短信内容"
          >
            <div
              style={{
                whiteSpace: 'pre-wrap',
                padding: '12px',
                backgroundColor: '#f5f8fc',
              }}
            >
              {smsContent}
            </div>
          </Item>
          <Item
            name="phoneNumbers"
            label="测试手机号"
            rules={[{required: true, message: '手机号不能为空'}]}
          >
            <Input prefix="+86" placeholder="请输入测试手机号" />
          </Item>
        </Form>
      </Modal>
    </div>
  )
}
