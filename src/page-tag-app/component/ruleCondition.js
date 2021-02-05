import {Component} from 'react'
import {Button, Popconfirm} from 'antd'
import {IconDel} from '../../icon-comp'

export default class RuleCondition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAnd: props.info ? props.info.logic === 1 : true,
    }
  }

  change = () => {
    const {changeCondition, info} = this.props
    const {isAnd} = this.state
    const data = !isAnd
    const result = {
      ...info,
      logic: data === false ? 2 : 1,
    }
    changeCondition(result)

    this.setState({
      isAnd: data,
    })
  }

  render() {
    const {isAnd} = this.state

    const {pos = [], delCon, info, type} = this.props

    const posStyle = {
      left: pos[0],
      top: pos[1],
    }
    
    return (
      <div style={posStyle} className="rule-condition">
        <Button onClick={this.change}>
          {isAnd ? '且' : '或'}
        </Button>
        {
          info.flag !== '0' && type !== 'detail' ? (
            <Popconfirm
              placement="topRight"
              title="确认删除联合条件？"
              onConfirm={() => delCon()} 
              okText="确认"
              cancelText="取消"
            >
              <IconDel size="16" className="delete-icon" />
            </Popconfirm>
          ) : null
        }
     
      </div>
    )
  }
}
