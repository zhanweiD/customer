import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {PlusCircleFilled} from '@ant-design/icons'
import {Modal, Spin, Button} from 'antd' 
import newGroup1 from '../../../icon/new-group1.svg'
import newGroup2 from '../../../icon/new-group2.svg'
import newGroup3 from '../../../icon/new-group3.svg'

@observer
export default class ModalGroup extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action handleCancel = () => {
    this.store.visible = false
    this.store.isCreate = 0
  }

  @action createGroup = () => {
    const {
      type, 
      // recordObj,
    } = this.store
    // const id = recordObj.id || 0
    if (this.store.mode === 2) {
      this.store.drawerVisible = true
    } else if (this.store.mode === 1) {
      window.location.href = `${window.__keeper.pathHrefPrefix}/group/rule-create/${type}/${this.store.projectId}`
    }
    this.store.isCreate = 0
    this.store.visible = false
  }

  @action createType = (mode, type) => {
    this.store.mode = mode
    this.store.type = type
    this.store.isCreate = 1
  }

  render() {
    const {
      visible,
      isCreate,
    } = this.store
    const modalConfig = {
      title: '群体创建方式',
      visible,
      maskClosable: false,
      closable: true,
      onCancel: this.handleCancel,
      onOk: this.createGroup,
      width: 520,
      destroyOnClose: true,
      footer: [
        <Button onClick={this.handleCancel} style={{fontSize: '12px'}}>
          取消
        </Button>,
        <Button 
          type="primary" 
          style={{color: isCreate ? '#fff' : 'rgba(0,0,0,.25)', fontSize: '12px'}} 
          disabled={!isCreate} 
          onClick={this.createGroup}
        >
          确定
        </Button>,
      ],
    }
    
    return (
      <Modal {...modalConfig} className="add-group">
        <Fragment>
          <Button className="create-flex" onClick={() => this.createType(1, 1)}>
            <div className="mr8">
              <img alt="新建群体" height="24px" width="24px" src={newGroup1} />
              {/* <PlusCircleFilled style={{fontSize: '24px', color: '#5acbaa'}} /> */}
            </div>
            <div className="create-type">
              <p className="create-group">
                标签规则创建离线群体
              </p>
              <div className="create-descr">
                使用群体的标签及群体关系的标签，离线筛选出符合条件的群体。如：“按天取出过去7天有刷卡记录的女性用户作为每日营销的人群”，则需要根据标签规则设置一个按日更新的离线群体。
              </div>
            </div>
          </Button>
          <Button className="create-flex" onClick={() => this.createType(1, 2)}>
            <div className="mr8">
              <img alt="新建群体" height="24px" width="24px" src={newGroup2} />
              {/* <PlusCircleFilled style={{fontSize: '24px', color: '#3385f6'}} /> */}
            </div>
            <div className="create-type">
              <p className="create-group">
                标签规则创建实时群体
              </p>
              <div className="create-descr">
                使用群体属性及群体关系数据，实时筛选出符合条件的群体。如：“有个不定期营销活动，有活动了才产生人群”，则需要根据标签规则设置实时群体，触发一次产出一批群体。
              </div>
            </div>
          </Button>
          <Button className="create-flex" onClick={() => this.createType(2, 1)}>
            <div className="mr8">
              <img alt="新建群体" height="24px" width="24px" src={newGroup3} />
              {/* <PlusCircleFilled style={{fontSize: '24px', color: '#586df6'}} /> */}
            </div>
            <div className="create-type">
              <p className="create-group">
                ID集合创建离线群体
              </p>
              <div className="create-descr">
                通过已有的实体ID集合，创建为一个群体。如“将业务人员线下梳理的白名单用户”的ID存放在一个文件中，将文件上传为“白名单”的群体。
              </div>
            </div>
          </Button>
        </Fragment>
      </Modal>
    )
  }
}
