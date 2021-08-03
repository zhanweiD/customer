import React, {Component} from 'react'
import {action, toJS, observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import {Button, message, Form, Input} from 'antd'
import {RuleContent} from '../component'
import SetRule from './drawer-analysis'
import {formatData, getRenderData} from '../component/util'
import {debounce} from '../../common/util'
import DrawerAnalysis from './drawer'

const formItemLayout = {
  labelCol: {span: 2},
  wrapperCol: {span: 8},
  colon: false,
}

@inject('store')
@observer
export default class StepTwo extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.formRef = React.createRef()
    this.nameRef = React.createRef()
    this.ruleContentRef = React.createRef()

    this.wherePosMap = toJS(props.store.wherePosMap) || {}
    this.whereMap = toJS(props.store.whereMap) || {}
  }

  @observable visible = false

  @action pre = () => {
    this.store.current -= 1
  }

  @action next = () => {
    this.nameRef.current.validateFields().then(value => {
      this.store.oneForm = value
      this.formRef.current
        .validateFields()
        .then(values => {
          if (JSON.stringify(values) !== '{}') {
            this.store.logicExper = formatData(values, this.ruleContentRef, this.whereMap)
            this.store.posList = getRenderData(values, this.ruleContentRef, this.wherePosMap, this.whereMap)

            this.store.whereMap = this.whereMap
            this.store.wherePosMap = this.wherePosMap
            // this.store.getOutputTags()
            this.props.save()
          } else {
            message.error('请添加规则配置')
          }
        })
        .catch(info => {
          console.log('Validate Failed:', info)
        })
    }).catch(err => {
      console.log(err)
    })
  }

  @action openDrawer = (flag, relId) => {
    this.store.getOtherEntity({
      relationId: relId,
    })

    this.store.getDrawerConfigTagList({
      objId: relId,
    }, () => {
      this.drawerFlag = flag
      this.visible = true
    })
  }

  @action submitRule = (posData, data) => {
    if (!posData && !data) {
      if (this.wherePosMap[this.drawerFlag]) {
        delete this.wherePosMap[this.drawerFlag]
      }

      if (this.whereMap[this.drawerFlag]) {
        delete this.whereMap[this.drawerFlag]
      }
      this.onClose()
      return 
    }

    this.wherePosMap[this.drawerFlag] = posData
    this.whereMap[this.drawerFlag] = data
    this.onClose()
  }

  @action onClose = () => {
    this.visible = false
    this.drawerFlag = undefined
  }

  @action reset = () => {
    this.store.posList = {}
    this.store.whereMap = {}
    this.store.wherePosMap = {}
  }

  @action changeRuleConfig = (before, now) => {
    if (before && !now) {
      delete this.wherePosMap[before]
      delete this.whereMap[before]
    }

    if (this.wherePosMap[before] && now) {
      this.wherePosMap[now] = this.wherePosMap[before]
      delete this.wherePosMap[before]
    }

    if (this.whereMap[before] && now) {
      this.whereMap[now] = this.whereMap[before]
      delete this.whereMap[before]
    }
  }

  @action changeRelWithRuleConfig = key => {
    if (this.wherePosMap[key]) {
      delete this.wherePosMap[key]
    }

    if (this.whereMap[key]) {
      delete this.whereMap[key]
    }
  }

  // 数据分析
  @action openAysDrawer = () => {
    this.formRef.current
      .validateFields()
      .then(values => {
        if (JSON.stringify(values) !== '{}') {
          this.store.logicExper = formatData(values, this.ruleContentRef, this.whereMap)
          this.store.posList = getRenderData(values, this.ruleContentRef, this.wherePosMap, this.whereMap)

          this.store.whereMap = this.whereMap
          this.store.wherePosMap = this.wherePosMap

          this.store.aysVisible = true
          this.store.getTagTree()
          this.store.getUseTag()
        } else {
          message.error('请添加规则配置')
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  @action checkName = (rule, value, callback) => {
    if (!value) return callback('')
    const {objId, isCopy, detail} = this.store
    const params = {
      name: value,
      objId,
    }

    if (detail.id) {
      params.id = isCopy ? null : detail.id
    }
    
    // 防抖
    debounce(() => this.store.checkName(params, callback), 500)
  }

  render() {
    const {
      current, 
      configTagList, 
      drawerConfigTagList, 
      relList, 
      posList, 
      objId, 
      detail, 
      isCopy, 
      groupId,
      submitLoading,
    } = this.store
    return (
      // <div className="step-two" style={{display: current === 1 ? 'block' : 'none'}}>
      <div className="step-two">
        <Form
          name="three"
          // onFinish={onFinish}
          // form={form}
          ref={this.nameRef}
          {...formItemLayout}
        >
          <Form.Item
            label="客群名称"
            name="name"
            rules={[{
              required: true,
              message: '请输入名称',
            }, {
              validator: this.checkName,
            }]}
            initialValue={isCopy ? undefined : detail.name}
          >
            <Input disabled={!objId || (groupId && !isCopy)} placeholder="请输入名称" />
          </Form.Item>
        </Form>
        {/* 圈选规则box */}
        <RuleContent 
          formRef={this.formRef} 
          onRef={ref => { this.ruleContentRef = ref }}
          configTagList={toJS(configTagList)}
          drawerConfigTagList={toJS(drawerConfigTagList)}
          relList={toJS(relList)}
          openDrawer={this.openDrawer}
          posList={toJS(posList)}
          reset={this.reset}
          changeRuleConfig={this.changeRuleConfig}
          changeRelWithRuleConfig={this.changeRelWithRuleConfig}
          stepOneObjId={objId}
          type="config"
        />
        {/* 设置筛选条件弹窗 */}
        <SetRule 
          visible={this.visible} 
          onClose={this.onClose}
          submit={this.submitRule} 
          posList={this.wherePosMap[this.drawerFlag]}
        />
        <div className="steps-action">
          {/* <Button style={{marginRight: 16}} onClick={this.pre}>取消</Button> */}
          <Button style={{marginRight: 16}} onClick={this.openAysDrawer}>数据分析</Button>

          <Button 
            style={{marginRight: 16}}
            onClick={() => window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/group/manage`}
          >
            返回
          </Button>
          <Button
            type="primary"
            onClick={this.next}
            loading={submitLoading}
          >
            确定
          </Button>
        </div>
        <DrawerAnalysis />
      </div>
    )
  }
}
