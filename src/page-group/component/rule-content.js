/**
 * @description 圈选规则
 */
import {Component} from 'react'
import {Button, Form} from 'antd'
import {PlusOutlined, QuestionCircleOutlined} from '@ant-design/icons'
import Group from './group'
import WrapRuleCondition from './wrap-rule-condition'

import './index.styl'

const originalData = {
  whereMap: {},
  selfCon: 1,
  rule: [{
    flag: '0',
    logic: 1,
  }],
}

export default class RuleContent extends Component {
  constructor(props) {
    super(props)

    const {posList = {}} = props

    const {rule, pos, selfCon, logicMap} = originalData

    this.state = {
      renderData: posList.rule || rule,
      firstConditionH: 0,
      firstConditionT: 21,
      key: 0,
    }

    this.renderData = posList.rule || rule || {}
    this.pos = posList.pos || pos || {}
    this.selfCon = posList.selfCon || selfCon || 1
    this.logicMap = posList.logicMap || logicMap || {}
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this)
    }
  }

  refreshLineH = d => {
    const {type} = this.props
    this.pos = {...this.pos, ...d}
    const data = this.renderData

    const len = data.length

    this.heightFirst = document.getElementById(`${type}-second-rule-condition0`).getBoundingClientRect()
    this.heightEnd = document.getElementById(`${type}-second-rule-condition${data[len - 1].flag}`).getBoundingClientRect()

    const firstConditionT = 21 + this.heightFirst.height / 2
    const firstConditionH = (this.heightEnd.top + this.heightEnd.height / 2) - (this.heightFirst.top + this.heightFirst.height / 2)

    this.setState({
      firstConditionT,
      firstConditionH,
    })
  }

  changeSelfCondition = (data, i) => {
    if (typeof i === 'undefined') {
      this.selfCon = data
    } else {
      this.renderData[i].logic = data

      this.setState({
        renderData: this.renderData,
      })
    }
  }

  changeCondition = (data, flag) => {
    const currentFlag = `${flag}-${data.flag}`
    this.logicMap[currentFlag] = data.logic
  }

  addGroup = () => {
    const {renderData} = this.state
    const current = _.cloneDeep(renderData)

    const obj = {
      type: 0,
      // flag: renderData.length,
      flag: Math.floor(Math.random() * 1000),
      logic: 1,
    }

    current.push(obj)

    this.renderData = current

    this.setState({
      renderData: current,
    }, () => {
      this.refreshLineH(current)
    })
  }

  delGroupItem = props => {
    const data = _.cloneDeep(this.state.renderData)
   
    data.splice(+props.groupIndex, 1)

    this.renderData = data 
    this.setState({
      renderData: data,
    }, () => {
      this.refreshLineH(data)
    })
  }

  reset = () => {
    const {type, reset} = this.props

    if (type === 'config') {
      reset()
    }

    this.setState({
      renderData: originalData.rule,
      key: Math.random(),
    }, () => {
      this.renderData = originalData.rule
      this.refreshLineH()
    }) 
  }

  // goToExplain = () => {
  //   window.location.href = `${window.__keeper.pathHrefPrefix}/group/explain`
  // }

  render() {
    const {
      key,
      renderData, 
      firstConditionH, 
      firstConditionT, 
    } = this.state

    const {
      type,
      formRef,
      relList,
      openDrawer,
      otherEntity,
      configTagList,
      drawerConfigTagList,
      page,
      changeRuleConfig,
      changeRelWithRuleConfig,
      stepOneObjId,
    } = this.props

    return (
      <div>
        {
          page === 'detail' ? null : (
            <div className="mb24">
              <span className="mr8 ml28 c85">客群圈选</span>
              <Button type="primary" icon={<PlusOutlined />} onClick={this.addGroup} disabled={renderData.length === 10}>添加</Button>
              <Button className="ml8 mr8" onClick={this.reset}>重置条件</Button>
              {/* <a target="_blank" rel="noopener noreferrer" href={`${window.__keeper.pathHrefPrefix}/group/explain`}><QuestionCircleOutlined /></a>  */}
            </div>
          )
        }
    
        <div className="group">
          <Form
            key={key}
            ref={formRef}
          > 
            {
              renderData.map((d, i) => (
                <Group 
                  key={d.flag}
                  groupIndex={i}
                  ml={80} 
                  id={`group-combine${d.flag}`}
                  showLine={renderData.length > 1}
                  changeCondition={this.changeCondition}
                  refreshContentLineH={this.refreshLineH}
                  changeSelfCondition={d => this.changeSelfCondition(d, i)}
                  openDrawer={openDrawer}
                  pos={d.pos}
                  flag={d.flag}
                  logic={d.logic}
                  configTagList={configTagList}
                  drawerConfigTagList={drawerConfigTagList}
                  relList={relList}
                  otherEntity={otherEntity}
                  type={type}
                  page={page}
                  delGroupItem={this.delGroupItem}
                  formRef={formRef}
                  stepOneObjId={stepOneObjId}
                  changeRuleConfig={changeRuleConfig}
                  changeRelWithRuleConfig={changeRelWithRuleConfig}
                />
              ))
            }
          </Form>
          {
            renderData.length > 1 ? (
              <WrapRuleCondition 
                showLine={false}
                logic={this.selfCon}
                pos={[64, firstConditionT, firstConditionH]}
                changeCondition={this.changeSelfCondition}
                page={page}
              />
            ) : null
          }
       
        </div>
      </div>
     
    )
  }
}
