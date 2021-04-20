import {Form, Select, Input, Button} from 'antd'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import _ from 'lodash'
import {debounce, getNamePattern} from '../common/util'


const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
  colon: false,
}

export default inject('store')(({store}) => {
  const [form] = Form.useForm()

  let timer1 = null
  let timer2 = null


  const checkName = (rule, value, callback) => {
    if (value) {
      // 防抖设计
      if (timer1) {
        clearTimeout(timer1)
      }

      return new Promise((resolve, reject) => {
        timer1 = setTimeout(() => {
          if (store.isEdit) {
            store.checkSceneName(
              {
                bizName: value,
                id: store.formInitValue.id,
              },
              res => {
                if (res.isExist) {
                  reject('已存在')
                } else {
                  resolve()
                }
              }
            )
          } else {
            store.checkSceneName({bizName: value}, res => {
              if (res.isExist) {
                reject('已存在')
              } else {
                resolve()
              }
            })
          }
        }, 300)
      })
    } 
    callback()
  }

  const checkCode = (rule, value, callback) => {
    if (value) {
      if (timer2) {
        clearTimeout(timer2)
      }

      return new Promise((resolve, reject) => {
        timer2 = setTimeout(() => {
          if (store.isEdit) {
            store.checkSceneCode(
              {
                bizCode: value,
                id: store.formInitValue.id,
              },
              res => {
                if (res.isExist) {
                  reject('已存在')
                } else {
                  resolve()
                }
              }
            )
          } else {
            store.checkSceneCode({bizCode: value}, res => {
              if (res.isExist) {
                reject('已存在')
              } else {
                resolve()
              }
            })
          }
        }, 300)
      })
    } 
    callback()
  }

  const formatChange = e => {
    store.domainOption = _.filter(store.domainList, item => item.parentCode === e)
  }

  return useObserver(() => (
    <div>
      <Form 
        form={form} 
        name="scene" 
        {...formItemLayout}
        initialValues={store.formInitValue}
      >
        <Form.Item
          label="场景名称"
          name="bizName"
          rules={[
            ...getNamePattern(),
            {
              validator: (rule, value, callback) => checkName(rule, value, callback),
            },
          ]}
        >
          <Input placeHolder="请输入场景名称" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="场景Code"
          name="bizCode"
          rules={[
            {required: true, message: 'Code 不能为空'},
            {
              validator: (rule, value, callback) => checkCode(rule, value, callback),
            },
          ]}
        >
          <Input placeHolder="请输入场景Code" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="所属业态"
          name="pp_bizCode"
          rules={[{required: true, message: '请选择所属业态'}]}
        >
          <Select 
            placeHolder="请选择所属业态" 
            onChange={e => {
              formatChange(e)
              form.setFieldsValue({parentCode: undefined})
            }}
          >
            {
              store.formatList.map(item => <Select.Option value={item.bizCode}>{item.bizName}</Select.Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="所属业务域"
          name="parentCode"
          rules={[{required: true, message: '请选择所属业务域'}]}
        >
          <Select placeHolder="请选择所属业务域">
            {
              store.domainOption.map(item => <Select.Option value={item.bizCode}>{item.bizName}</Select.Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="场景描述"
          name="descr"
        >
          <Input.TextArea placeHolder="请输入场景描述" rows={4} />
        </Form.Item>
      </Form>
      <div className="bottom-button">
        <Button
          className="mr8"
          onClick={() => {
            store.drawerVis = false
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          loading={store.confirmLoading}
          onClick={() => {
            form.validateFields().then(value => {
              if (store.isEdit) {
                store.editScene(value)
              } else {
                store.addScene(value)
              }
            }).catch(err => {
              console.log(err)
            })
          }}
        >
          确定
        </Button>
      </div>
    </div>
  ))
})
