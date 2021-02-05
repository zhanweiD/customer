// 逻辑配置
import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Button, Popconfirm} from 'antd'
import Tree from './tree'
import ModalCreateTag from './modal-create-tag'
import DrewerSetRule from './drewer-set-rule'
import {IconDel} from '../../icon-comp'
import {
  RuleIfBox, 
  FixedValue,
} from '../component'

import {getWhenData} from './util'

import store from './store-config'

import './login-config-style.styl'

const elseId = 'config-else'

@inject('bigStore')
@observer
export default class LogicConfig extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    store.visualId = props.bigStore.visualId
    store.objId = props.bigStore.objId
  }

  @observable clearActionKey = 0
  @observable submitActionKey = 0

  thenData={}
  whenData={}
  elseData={}
  allData={}

  componentWillReceiveProps(next) {
    const {visualId, detailLoading} = this.props
    if (visualId !== next.visualId) {
      store.visualId = next.visualId
      // store.objId = next.objId
    }

    if (detailLoading !== next.detailLoading) {
      const {tagTreeData, configInfo, configIdInfo} = this.bigStore
      if (tagTreeData.length) {
        store.tagTreeData.replace(tagTreeData)
        const [firstTag] = tagTreeData
        store.relVisualExtRspList = configInfo
        store.configIdInfo = configIdInfo
        this.selectTag(firstTag)
      }
    }
  }

  componentWillUnmount() {
    store.tagTreeData.clear()
    store.currentTagData = {}
    store.ruleList.clear()
    store.currentTag = undefined
    store.configIdInfo = {}
    store.relVisualExtRspList = {}
    store.canEditCondition = true
    store.ruleDetail = {}
  }

  @action.bound setRule() {
    store.drawerRuleVisible = true
    store.getVisualRuleDetail()
  }

  @action.bound lastStep() {
    this.bigStore.currentStep = this.bigStore.currentStep - 1
  }

  @action.bound nextStep() {
    store.updateBaseInfo()
    this.bigStore.currentStep = this.bigStore.currentStep + 1
  }

  @action.bound addRule() {
    const len = store.ruleList.length

    if (len === 0) {
      store.ruleList.push({
        id: `rule${len}`,
      })
    } else {
      const lastRule = toJS(store.ruleList[len - 1])
      store.ruleList.push({
        id: `rule${+lastRule.id.slice(4) + 1}`,
      })
    }
  }

  @action.bound delRule(item) {
    const newArr = store.ruleList.filter(d => d.id !== item.id)
    store.ruleList.replace(newArr)
  }

  @action.bound clear() {
    this.clearActionKey = Math.random()
  }

  @action.bound selectTag(data) {
    if (!data) {
      store.ruleList.clear()
      store.currentTagData = {}
      store.currentTag = undefined
      return 
    }

    const tagId = data.tagId || data.id
    const currentTagData = toJS(store.relVisualExtRspList[tagId]) || {}
    const whenThenList = (currentTagData.visualWhenThenElse && currentTagData.visualWhenThenElse.whenThenList) || []

    const ruleList = []
    if (whenThenList.length) {
      for (let i = 0; i < whenThenList.length; i += 1) {
        const current = whenThenList[i]
        const when = {
          posInfoList: current.when.posInfoList,
          ...current.when,
        }
        const obj = {
          id: `rule${i}`,
          when,
          then: current.then,
        }
        ruleList.push(obj)
      }
    } 
    store.ruleList.replace(ruleList)


    if (currentTagData) {
      store.currentTagData = currentTagData
    } else {
      store.currentTagData = {}
    }

    if (data.canSubmit) {
      store.canEditCondition = false
    } else {
      store.canEditCondition = true
    }

    store.currentTag = tagId
    
    this.thenData = {}
    this.whenData = {}
    this.elseData = {}
    this.allData = {}
    // this.clear()
  }

  @action.bound confirm() {
    if (store.ruleList.length) {
      this.submitActionKey = Math.random()
    } else {
      this.validateElse()
    }
  }

  @action.bound validateThen() {
    const t = this
    const {ruleList} = store

    for (let i = 0; i < ruleList.length; i += 1) {
      const {id} = ruleList[i]
      // eslint-disable-next-line no-loop-func
      this[`then${id}`].validateFields((err, values) => {
        if (!err) {
          const sData = {
            function: values.thenFunction,
            params: [values.thenParams],
          }

          this.thenData[id] = sData
          t.validateElse()
        }
      })
    }
  }

  @action.bound validateElse() {
    const t = this

    this.else.validateFields((err, values) => {
      if (!err) {
        const sData = {
          function: values.thenFunction,
          params: [values.thenParams],
        }
        t.elseData = sData

        t.getSubmitData()
      }
    })
  }

  @action.bound submitCondition(conditionData, allData, ruleId) {
    this.allData[ruleId] = allData

    const andOr = allData.filter(d => d.type === 1)

    this.whenData[ruleId] = getWhenData(conditionData.concat(andOr))
    this.validateThen()
  }

  @action.bound getSubmitData() {
    const {ruleList} = store
    if (!ruleList.length) {
      // 没有添加条件
      const result = {
        type: 0,
        tagId: +store.currentTag,
      }

      const visualWhenThenElse = {
        whenThenList: [],
        elseCondition: this.elseData,
      }
      result.visualWhenThenElse = visualWhenThenElse
      this.submit(result)
    }

    if (ruleList.length && Object.keys(this.whenData).length === ruleList.length) {
      const result = {
        type: 0,
        tagId: +store.currentTag,
      }

      const whenThenList = []
  
      for (let i = 0; i < ruleList.length; i += 1) {
        const {id} = ruleList[i]
  
        const when = {
          posInfoList: this.allData[id],
          ...this.whenData[id] && this.whenData[id][0],
        }
        const obj = {
          when,
          then: this.thenData[id],
        }
        whenThenList.push(obj)
      }
  
      const visualWhenThenElse = {
        whenThenList,
        elseCondition: this.elseData,
      }
      result.visualWhenThenElse = visualWhenThenElse
      this.submit(result)
    }
  }

  @action.bound submit(data) {
    store.saveVisualExt(data)
  }

  @action.bound editCondition() {
    store.canEditCondition = true
  }

  // getNameByObjId = () => {
  //   const {objList, objId} = this.bigStore 
  //   const arr = objList.filter(d => +d.objId === +objId) 
  //   const name = arr[0] && arr[0].name
  //   return name
  // }

  getNameByAssObjId = () => {
    const {assObjList, assObjId} = this.bigStore
    const arr = assObjList.filter(d => d.assObjId === assObjId)
    const name = arr[0] && arr[0].assObjName
    return name
  }

  renderRule = () => {
    const {
      // configFuntionList, 
      configTagList,
    } = this.bigStore

    const currentTagData = toJS(store.currentTagData) 

    const elseCondition = currentTagData.visualWhenThenElse && currentTagData.visualWhenThenElse.elseCondition

    return (
      <Fragment>
        {store.ruleList.map(d => (
          <div key={d.id} className="condition-item-box">
            <Popconfirm
              placement="topRight"
              title="确认删除此条规则？"
              onConfirm={() => this.delRule(d)}
              okText="确认"
              cancelText="取消"
            >
              <IconDel size="16" className="if-action-btn" />
            </Popconfirm>
            <h3>如果</h3> 
            <RuleIfBox 
              key={`config${d.id}${+store.currentTag}`}
              id={`config${d.id}`}
              ruleId={d.id}
              submitActionKey={this.submitActionKey}
              // funcList={configFuntionList}
              tagList={configTagList}
              submit={this.submitCondition}
              detail={d.when && toJS(d.when.posInfoList)}
            />
            <div>
              <h3>那么</h3>
              <FixedValue
                id={`then${d.id}`}
                ruleId={d.id}
                detail={toJS(d.then)}
                tagList={toJS(configTagList)}
                wrappedComponentRef={form => { this[`then${d.id}`] = form ? form.props.form : form }}
              />
            </div>
          </div>
        ))}
        <div className="condition-item-box">
          {
            store.ruleList.length ? <h3>否则</h3> : null
          }
          <FixedValue 
            id={elseId}
            detail={elseCondition}
            clearActionKey={this.clearActionKey}
            tagList={toJS(configTagList)}
            wrappedComponentRef={form => { this.else = form ? form.props.form : form }}
          />
        </div>
      </Fragment>
    )
  }

  render() {
    const {show} = this.props
    const {
      // configFuntionList, 
      configTagList,
      assObjId,
    } = this.bigStore
    const {tagTreeData, canEditCondition, clearAll, currentTag} = store

    return (
      <div className="logic-config" style={{display: show ? 'block' : 'none'}}>
        {/* <div className="FBH fs14 mb16">
          <div>
            <span>所属对象：</span>
            <span className="mr32">{this.getNameByObjId()}</span>
            {
              assObjId ? (
                <Fragment>
                  <span>源标签对象限制：</span>
                  <span>{this.getNameByAssObjId()}</span>
                </Fragment>
              ) : null
            }
          </div>
          {
            assObjId ? <a href className="abs" style={{right: '24px'}} onClick={this.setRule}>数据过滤规则设置 </a> : null
          }
        </div> */}
        <div className="logic-config-content">
          <Tree store={store} selectTag={this.selectTag} />
          <div className="logic-config-box">
            <div className="logic-config-header">
              <div>
                <Button type="primary" className="mr8" onClick={this.addRule} disabled={!tagTreeData.length || !canEditCondition}>添加条件表达式</Button>
                <Button disabled={!tagTreeData.length || !canEditCondition} onClick={() => clearAll()}>清空条件表达式</Button>
              </div>
              <div>
                <Button 
                  disabled={!tagTreeData.length || canEditCondition} 
                  onClick={this.editCondition}
                  className="mr8"
                >
                  编辑
                </Button>
                <Button 
                  type="primary"
                  disabled={!tagTreeData.length || !canEditCondition} 
                  onClick={this.confirm}
                >
                  校验
                </Button>
              </div>
            </div>
            <div className="logic-condition-box" key={+currentTag}>
              {
                tagTreeData.length ? this.renderRule() : null
              }
              {
                !canEditCondition ? <div className="logic-condition-mask" /> : null
              }
              
            </div>
          </div>  
        </div>
        <div className="bottom-button">
          <Button style={{marginRight: 16}} onClick={() => this.lastStep()}>上一步</Button>
          <Button
            type="primary"
            onClick={this.nextStep}
            disabled={!tagTreeData.length || tagTreeData.length !== tagTreeData.filter(d => d.canSubmit).length}
          >
            下一步
          </Button>
        </div>
        <ModalCreateTag 
          store={store}
          objId={this.bigStore.objId}
          tagCateSelectList={this.bigStore.tagCateSelectList}
        />
        <DrewerSetRule
          store={store}
          // funcList={configFuntionList}
          tagList={configTagList}
          visualId={this.bigStore.visualId}
        />
      </div>
    )
  }
}
