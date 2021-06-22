import React, {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {UploadOutlined} from '@ant-design/icons'
import {Drawer, Form, Select, Input, Upload, Button, Modal, Alert} from 'antd'

import {errorTip, baseApi, debounce, failureTip, getNamePattern} from '../../../common/util'

const {Item} = Form
const {TextArea} = Input

@observer
export default class IdCreate extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }
  formRef = React.createRef()
  componentWillMount() {
    this.props.onRef(this)
  }

  // 设置输出标签
  setOutputTags = value => {
    this.formRef.current.setFieldsValue({
      outputTags: value,
    })
  }

  // 自定义验证上传
  validateUpload = (rule, value, callback) => {
    const {uploadData} = this.store
    if (!uploadData) {
      callback('请上传文件')
    }
    callback()
  }

  // 上传状态发生变化
  uploadChange = ({file, fileList}) => {
    if (fileList.length === 0) return
    this.store.uploadList = fileList.slice(-1)

    if (file.status !== 'uploading') {
      const {success, content} = file.response

      if (success) {
        // 返回正确
        if (!content.importKey) {
          failureTip('请上传有效文件')
          this.store.uploadList = []
          return
        }
        
        this.store.uploadData = true
        this.formRef.current.validateFields(['excel'])
        this.store.fileRes = file.response.content
        this.store.modalVisible = true
      } else {
        this.store.uploadList = []
        errorTip(file.response.message)
      }
    }
  }

  // 文件大小限制
  @action beforeUpload = file => {
    const isLt10M = file.size / 1024 / 1024 < 100
    if (!isLt10M) {
      errorTip('文件不能大于100MB!')
    }
    return isLt10M
  }

  @action removeFile = file => {
    this.store.uploadList = []
  }

  @action checkName = (rule, value, callback) => {
    if (value) {
      // 防抖设计
      debounce(() => this.store.checkName(value, callback), 500)
    } else {
      callback()
    }
  }

  @action onOK = () => {
    const {isAdd, mode, type, fileRes, recordObj} = this.store

    this.formRef.current.validateFields().then(value => {
      this.store.confirmLoading = true

      // 请求前处理参数
      value.outputTags = value.outputTags.map(Number)
      value.objId = parseInt(value.objId)
      value.mode = mode || recordObj.mode
      value.type = type || recordObj.type
      value.importKey = fileRes.importKey || ''

      if (isAdd) {
        this.store.addIdGroup(value)
      } else {
        this.store.editIdGroup(value)
      }
    }).catch(err => {
      this.store.confirmLoading = false
      errorTip(err)
    })
  }

  @action uploadCancel = () => {
    this.store.modalVisible = false
  }
  
  // 实体改变重置选项
  @action selectEntity = objId => {
    this.store.objId = objId
    this.store.getTagList()
    this.formRef.current.resetFields(['outputTags', 'name'])
  }

  render() {
    const {
      drawerVisible,
      modalVisible,
      entityOptions,
      recordObj,
      objId,
      tagOptions,
      uploadList,
      projectId,
      fileRes,
      isAdd,
      confirmLoading,
      handleCancel,
    } = this.store

    // const {tenantId, userId} = window.frameInfo.sessioninfo.userInfoVO
    const props = {
      accept: '.xls, .xlsx',
      method: 'post',
      data: file => ({
        fileName: file.name,
        fileData: file,
        projectId,
        objId,
        // tenantId,
        // userId,
      }),
      fileList: uploadList,
      action: `${baseApi}/import/import_id_collection`,
      onChange: this.uploadChange,
      onRemove: file => this.removeFile(file),
      beforeUpload: file => this.beforeUpload(file),
    }

    const drawerConfig = {
      title: '主标签上传列表',
      visible: drawerVisible,
      placement: 'right',
      maskClosable: false,
      closable: true,
      width: 560,
      destroyOnClose: true,
      onClose: handleCancel,
      footer: (
        <div className="drawer-footer">
          <Button onClick={handleCancel}>取消</Button>
          <Button loading={confirmLoading} type="primary" className="footer-btn" onClick={this.onOK}>确定</Button>
        </div>
      ),
    }

    const modalConfig = {
      title: '文件解析结果',
      visible: modalVisible,
      maskClosable: false,
      closable: false,
      footer: (
        <Button type="primary" className="footer-btn" onClick={this.uploadCancel}>知道了</Button>
      ),
      width: 525,
      destroyOnClose: true,
    }

    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 20},
    }
    return (
      <Fragment>
        <Drawer {...drawerConfig} className="drawer-create">
          {/* {
            isPerform ? (
              <Alert style={{marginBottom: '16px'}} message="请重新上传文件" type="info" showIcon />
            ) : null
          } */}
          <Form 
            {...formItemLayout} 
            ref={this.formRef} 
            labelAlign="right"
          >
            <Item
              name="objId"
              label="所属实体"
              initialValue={recordObj.objId}
              rules={[
                {required: true, message: '请选择实体'},
              ]}
            >
              <Select 
                disabled={!isAdd} 
                placeholder="请选择实体" 
                onChange={value => this.selectEntity(value)} 
                showSearch
                optionFilterProp="children"
              >
                {entityOptions}
              </Select>
            </Item>

            <Item
              name="name"
              label="客群名称"
              initialValue={recordObj.name}
              // 去除前后空格
              getValueFromEvent={e => {
                return e.target.value.trim()
              }}
              rules={[
                // {required: true, message: '请输入名称'},
                // {max: 32, message: '名称不能超过32字'},
                ...getNamePattern(),
                {validator: this.checkName},
              ]}
            >
              <Input  disabled={!isAdd || !objId} placeholder="请输入名称" />
            </Item>
            
            <Item
              label="描述"
              name="descr"
              initialValue={recordObj.descr}
              rules={[
                {max: 128, message: '输入不超过128个字符'},
              ]}
            >
              <TextArea style={{minHeight: '6em'}} placeholder="请输入" />
            </Item>
            
            <Item
              label="上传"
              name="excel"
              rules={[
                {validator: this.validateUpload},
              ]}
            >
              <Upload {...props}>
                <Button disabled={!objId}>
                  <UploadOutlined /> 
                  Upload
                </Button>
              </Upload>
              <a 
                style={{marginTop: '4px', display: 'block'}}
                onClick={() => {
                  if (objId) {
                    window.open(`${baseApi}/export/example?objId=${objId}&projectId=${projectId}`)
                  } else {
                    this.formRef.current.validateFields(['objId'])
                  }
                }}
              >
                下载模版
              </a>
            </Item>

            <Item
              name="outputTags"
              label="输出标签"
              rules={[
                {required: true, message: '请选择标签'},
              ]}
            >
              <Select  placeholder="请选择标签" mode="multiple" showSearch optionFilterProp="children">
                {tagOptions}
              </Select>
            </Item>
          </Form>
        </Drawer>
        <Modal {...modalConfig}>
          <p style={{marginTop: '1em'}}>
            {`总记录${fileRes.total}条，重复记录${fileRes.duplicateCount}条，入库记录数${fileRes.successCount}条，无效记录${fileRes.failedCount}条`}
            {
              fileRes.failedCount ? (
                <span>
                  (
                  <a onClick={() => window.open(`${baseApi}/export/failed?failedKey=${fileRes.failedKey}`)}>下载</a>
                  )
                </span>
              ) : null
            }
          </p>
        </Modal>
      </Fragment>
    )
  }
}
