import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Modal, Button, Spin} from 'antd'
import {ModalForm} from '../../../component'
import {changeToOptions, enNameReg, isJsonFormat, debounce} from '../../../common/util'
import {tagConfigMethodMap, nameTypeMap, modalDefaultConfig} from '../util'

@observer
export default class DrawerCreate extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.treeStore = props.treeStore
  }

  @action.bound selectObject(id) {
    this.store.ownObject = id
    this.form.resetFields(['cateId', 'name', 'enName'])

    this.store.drawerTagInfo.pathIds = []
    this.store.drawerTagInfo.parentId = undefined
    this.store.drawerTagInfo.name = undefined
    this.store.drawerTagInfo.enName = undefined

    this.store.getTagCateSelectList({
      id,
    })
  }

  selectContent = () => {
    const {
      drawerTagInfo, 
      tagCateSelectList, 
    } = this.store
    const {nowCateIds} = this.treeStore
    return [{
      label: '标签名称',
      key: 'name',
      initialValue: drawerTagInfo.name,
      component: 'input',
      rules: [
        '@namePattern',
        '@nameUnderline',
        '@nameShuQi',
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.checkName},
      ],
    }, {
      label: '标签标识',
      key: 'enName',
      initialValue: drawerTagInfo.enName,
      component: 'input',
      rules: [
        '@enNamePattern',
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.checkName},
      ],
    }, {
      label: '是否枚举',
      key: 'isEnum',
      initialValue: drawerTagInfo.isEnum,
      valuePropName: 'checked',
      component: 'switch',
    }, {
      label: '数据类型',
      key: 'valueType',
      initialValue: drawerTagInfo.valueType,
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: changeToOptions(window.njkData.dict.dataType)('value', 'key'),
      },
    }, {
      label: '所属类目',
      key: 'cateId',
      initialValue: drawerTagInfo.pathIds && drawerTagInfo.pathIds.length ? drawerTagInfo.pathIds.slice(1) : nowCateIds,
      component: 'cascader',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: tagCateSelectList,
        // valueName: 'id',
        // selectCon: ['isLeaf', 2],
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },
    }, {
      label: '描述',
      key: 'descr',
      initialValue: drawerTagInfo.descr,
      component: 'textArea',
      rules: [
        '@max128',
      ],
    }]
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


  @action.bound changeIsEnum(e) {
    this.store.isEnum = e
  }

  @action handleCancel = () => {
    this.store.drawerTagInfo = {}
    this.store.drawerTagVisible = false
    this.store.isEnum = false
    this.store.tagCateSelectList.clear()
    // this.store.resetModal()
  }

  submit = () => {
    const t = this
    const {store} = t
    
    this.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          cateId: values.cateId[values.cateId.length - 1],
          isEnum: values.isEnum ? 1 : 0,
          configType: 0,
          objTypeCode: 3,
          objId: this.store.objId,
        }

        if (store.drawerTagType === 'edit') {
          params.id = store.drawerTagInfo.id

          store.updateTag(params, () => {
            t.handleCancel()
            this.treeStore.getTagCateTree()
            // this.treeStore.getList()
          })
        } else {
          store.createTag(params, () => {
            t.handleCancel()
            this.treeStore.getTagCateTree()
            // this.treeStore.getList({currentPage: 1})
          })
        }
      }
    })
  }

  /**
   * @description 重名校验
   */
  checkName = (rule, value, callback) => {
    const params = {
      name: value,
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名
    }
    
    if (this.store.drawerTagInfo.id) {
      params.id = this.store.drawerTagInfo.id
    }
    // debounce(() => this.store.checkName(params, callback), 500)
    this.store.checkName(params, callback)
  }

  render() {
    const {
      drawerTagVisible, drawerTagType, confirmLoading, detailLoading,
    } = this.store

    const modalConfig = {
      width: 525,
      title: drawerTagType === 'edit' ? '编辑标签' : '新建标签',
      visible: drawerTagVisible,
      confirmLoading,
      ...modalDefaultConfig,
      okText: '确定',
      cancelText: '取消',
      onCancel: () => this.store.closeDrawer(),
      onOk: this.submit,
    }

    const formConfig = {
      selectContent: drawerTagVisible && this.selectContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }
    return (
      <Modal {...modalConfig}>
        <Spin spinning={detailLoading}>
          <ModalForm {...formConfig} />
        </Spin>
        
        {/* <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.store.closeDrawer()}>取消</Button>
          <Button type="primary" loading={confirmLoading} onClick={this.submit}>确定</Button>
        </div> */}
      </Modal>
    )
  }
}
