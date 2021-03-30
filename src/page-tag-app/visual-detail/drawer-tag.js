
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {Drawer, Button, Spin} from 'antd'
import cls from 'classnames'
import {action, toJS} from 'mobx'
import {RuleIfBox, FixedValue} from '../component'

@observer
export default class DrawerTagConfig extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound closeDrawer() {
    this.store.tagTreeData.clear()
    this.store.currentTagData = {}
    this.store.ruleList.clear()
    this.store.currentTag = undefined
    this.store.drawerTagVisible = false
  }


  renderRule = () => {
    const {
      // configFuntionList, 
      configTagList,
      ruleList,
      currentTag,
    } = this.store

    const currentTagData = toJS(this.store.currentTagData) 

    const elseCondition = currentTagData.visualWhenThenElse && currentTagData.visualWhenThenElse.elseCondition

    return (
      <Fragment>
        {ruleList.map(d => (
          // <div key={d.id}>
          <div key={d.id} className="condition-item-box">
            <h3>如果</h3> 
            <RuleIfBox 
              key={`config${d.id}${+currentTag}`}
              id={`config${d.id}`}
              ruleId={d.id}
              tagList={configTagList}
              detail={d.when && toJS(d.when.posInfoList)}
              type="detail"
            />
            <div>
              <h3>那么</h3>
              <FixedValue
                id={`then${d.id}`}
                ruleId={d.id}
                detail={toJS(d.then)}
                tagList={toJS(configTagList)}
              />
            </div>
          </div>
           
          // </div>
        ))}
        <div className="condition-item-box">
          {
            ruleList.length ? <h3>否则</h3> : null
          }
          <FixedValue 
            detail={elseCondition}
            clearActionKey={this.clearActionKey}
            tagList={toJS(configTagList)}
          />
        </div>
      </Fragment>
    )
  }


  render() {
    const {
      drawerTagVisible, 
      detailLoading, 
      tagTreeData,
      currentTag,
    } = this.store

    const drawerConfig = {
      width: 1120,
      title: '组合标签查看',
      maskClosable: false,
      destroyOnClose: true,
      visible: drawerTagVisible,
      onClose: this.closeDrawer,
    }

    return (
      <Drawer {...drawerConfig}>
        <Spin spinning={detailLoading}>
          <div className="logic-config-content1">
            <div className="tree">
              <h4 className="p8 mb0">组合标签</h4>
              {
                tagTreeData.map((d, i) => (
                  <div
                    className={
                      cls({
                        'tree-item': true,
                        'tree-item-current': true,
                        'tree-item-select': +currentTag === d.id,
                      })} 
                    onClick={() => this.store.selectTag(d)}
                  >
                    <span> 
                      {d.name}
                    </span>

                  </div>
                ))
              }
            </div>
           
            <div className="logic-config-box">

              <div className="logic-condition-box" key={+currentTag}>
                {
                  tagTreeData.length ? this.renderRule() : null
                }
                <div className="logic-condition-mask" />
              
              </div>
            </div>  
          </div>

        </Spin>
        <div 
          style={{
            width: '100%',
            position: 'absolute',
            left: 0,
            bottom: 0,
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button
            type="primary"
            onClick={this.closeDrawer}
          >
            关闭
          </Button>
        </div>
      </Drawer>
    )
  }
}
