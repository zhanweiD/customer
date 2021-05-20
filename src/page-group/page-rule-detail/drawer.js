import React, {Component} from 'react'
import {Drawer, Button} from 'antd'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {RuleContent} from '../component'
// import {getRenderData, formatData} from '../component/util'

@observer
export default class SetRule extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.formRef = React.createRef()
    this.ruleContentRef = React.createRef()
  }

  // @action submit = () => {
  //   const {submit} = this.props

  //   this.formRef.current
  //     .validateFields()
  //     .then(values => {
  //       submit(getRenderData(values, this.ruleContentRef), formatData(values, this.ruleContentRef))
  //     })
  //     .catch(info => {
  //       console.log('Validate Failed:', info)
  //     })
  // }

  render() {
    const {visible, onClose, posList} = this.props
    const {configTagList, drawerConfigTagList, relList, otherEntity} = this.store

    const drawerConfig = {
      title: '设置筛选条件',
      visible,
      closable: true,
      width: 1120,
      maskClosable: false,
      destroyOnClose: true,
      onClose,
      className: 'detail-set-rule',
    }
  
    return (
      <Drawer
        {...drawerConfig}
      >
        <RuleContent 
          configTagList={toJS(configTagList)}
          drawerConfigTagList={toJS(drawerConfigTagList)}
          relList={toJS(relList)}
          otherEntity={toJS(otherEntity)}
          posList={posList}
          type="set-rule"
          page="detail"
        />
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => onClose()} type="primary">关闭</Button>
        </div>
      </Drawer>
    )
  }
}
