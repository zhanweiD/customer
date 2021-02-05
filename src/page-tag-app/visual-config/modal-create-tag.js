import {Component} from 'react'
import {action, observable, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../component'
import {nameTypeMap} from './util'

import {changeToOptions, enNameReg, isJsonFormat} from '../../common/util'

@observer
export default class ModalCreateTag extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @observable isEnum = false
  @observable isAdd = true

  selectContent = () => {
    const {tagCateSelectList} = this.props
    const {tagDetail, derivativeTagList = [], tagTreeData} = this.store

    const tagListIds = toJS(tagTreeData).map(d => d.id || d.tagId) 

    const tagList = toJS(derivativeTagList).filter(d => !tagListIds.includes(d.value))

    const comp = [{
      label: '新建标签',
      key: 'isAdd',
      initialValue: 1,
      valuePropName: 'checked',
      component: 'switch',
      control: {
        checkedText: '是',
        unCheckedText: '否',
        onChange: e => this.changeIsAdd(e),
      },
    }]

    let other = []

    if (this.isAdd) {
      other = [{
        label: '标签名称',
        key: 'name',
        component: 'input',
        rules: [
          '@transformTrim',
          '@required',
          '@max32',
          {validator: this.checkName},
        ],
      }, {
        label: '标签标识',
        key: 'enName',
        component: 'input',
        rules: [
          '@transformTrim',
          '@required',
          '@max32',
          {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
          {validator: this.checkName},
        ],
      }, {
        label: '数据类型',
        key: 'valueType',
        component: 'select',
        rules: [
          '@requiredSelect',
        ],
        control: {
          options: changeToOptions(window.njkData.dict.dataType)('value', 'key'),
        },
      }, {
        label: '是否枚举',
        key: 'isEnum',
        valuePropName: 'checked',
        component: 'switch',
        control: {
          checkedText: '是',
          unCheckedText: '否',
          onChange: e => this.changeIsEnum(e),
        },
      }, {
        label: '所属类目',
        key: 'cateId',
        component: 'cascader',
        rules: [
          '@requiredSelect',
        ],
        control: {
          options: tagCateSelectList,
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        },
      }, {
        label: '业务逻辑',
        key: 'descr',
        component: 'textArea',
        rules: [
          '@max128',
        ],
      }]
    } else {
      other = [{
        label: '标签名称',
        key: 'name',
        component: 'select',
        // initialValue: derivativeTagList[0] && derivativeTagList[0].id,
        rules: [
          '@requiredSelect',
        ],
        control: {
          options: tagList,
          onSelect: e => this.onSelect(e),
        },
      }, {
        label: '唯一标识',
        key: 'enName',
        component: 'input',
        initialValue: tagDetail.enName,
        control: {
          disabled: true,
        },
      }, {
        label: '数据类型',
        key: 'valueType',
        component: 'select',
        initialValue: tagDetail.valueType,
        control: {
          disabled: true,
          options: changeToOptions(window.njkData.dict.dataType)('value', 'key'),
        },
      }, {
        label: '是否枚举',
        key: 'isEnum',
        initialValue: tagDetail.isEnum,
        valuePropName: 'checked',
        component: 'switch',
        control: {
          checkedText: '是',
          unCheckedText: '否',
          disabled: true,
        },
      }, {
        label: '所属类目',
        key: 'cateId',
        component: 'cascader',
        initialValue: tagDetail.pathIds && tagDetail.pathIds.length ? tagDetail.pathIds.slice(1) : undefined,
        control: {
          disabled: true,
          options: tagCateSelectList,
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        },
      }, {
        label: '业务逻辑',
        key: 'descr',
        component: 'textArea',
        initialValue: tagDetail.descr,
        control: {
          disabled: true,
        },
      }]
    }

    return comp.concat(other)
  }

  @action.bound onSelect(id) {
    this.store.getTagDetail({
      id,
    })
  }

  @action.bound changeIsEnum(e) {
    this.isEnum = e
  }

  // 校验枚举值输入
  handleEnumValueValidator(rule, value, callback) {
    if (value) {
      if (!isJsonFormat(value)) {
        callback('请输入正确的JSON格式')
      }
      callback()
    } else {
      callback()
    }
  }

  @action.bound changeIsAdd(e) {
    const {objId} = this.props

    this.form.resetFields()

    this.isAdd = e

    if (!e) {
      this.store.getDerivativeTagList({
        objId,
      })
    }
  }

  @action handleCancel = () => {
    this.isEnum = false
    this.isAdd = true
    this.store.confirmTagLoading = false
    this.store.visibleTag = false
    this.store.tagDetail = {}
  }

  submit = () => {
    const t = this
    this.form.validateFields((err, values) => {
      if (!err) {
        if (this.isAdd) {
          const params = {
            objId: this.props.objId,
            cateId: values.cateId[values.cateId.length - 1],
            configType: 1,
            descr: values.descr,
            enName: values.enName,
            name: values.name,
            isEnum: values.isEnum ? 1 : 0,
            valueType: values.valueType,
          }
          this.store.createTag(params, () => {
            t.handleCancel()
          })
        } else {
          const detail = {
            ...toJS(this.store.tagDetail),
            tagId: this.store.tagDetail.id,
          }
          this.store.addTag(detail, () => {
            t.handleCancel()
          })
        }
      }
    })
  }

  // 重名校验
  checkName = (rule, value, callback) => {
    const params = {
      name: value,
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名
      objId: this.props.objId,
    }

    this.store.checkTagName(params, callback)
  }

  render() {
    const {
      visibleTag, 
      confirmTagLoading, 
    } = this.store

    const modalConfig = {
      title: '新建组合标签',
      visible: visibleTag,
      onCancel: () => this.handleCancel(),
      onOk: () => this.submit(),
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      confirmLoading: confirmTagLoading,
    }
    
    const formConfig = {
      selectContent: visibleTag && this.selectContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }
    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }
}
