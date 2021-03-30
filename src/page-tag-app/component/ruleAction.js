import {Component} from 'react'
import {Button} from 'antd'

export default class RuleAction extends Component {
  render() {
    const {pos = [], addCon, addCombineCon, ...rest} = this.props
    const posStyle = {
      left: pos[0],
      top: pos[1],
    }

    return (
      <div className="FBH abs" style={posStyle} {...rest}>
        <Button className="mr8" type="primary" onClick={() => addCon()}>添加条件</Button>
        {
          rest.level.length < 5 ? <Button type="primary" onClick={() => addCombineCon()}>添加联合条件</Button> : null
        } 
      </div>
    )
  }
}
