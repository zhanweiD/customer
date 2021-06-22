import React from 'react'
import PropTypes from 'prop-types'
import {QuestionCircleOutlined} from '@ant-design/icons'
import {Tooltip} from 'antd'

export default class QuestionTooltip extends React.Component {
  static defaultProps = {
    tip: null,
    placement: 'top',
  }

  static propTypes = {
    tip: PropTypes.node, // 提示文字，也可以是ReactNode，必传
    placement: PropTypes.string,
  }

  render() {
    const {placement, tip} = this.props
    return (
      <Tooltip placement={placement} title={tip}>
        <QuestionCircleOutlined className="ml4 mt4" style={{color: 'rgba(22, 50, 78, 0.45)'}} />
      </Tooltip>
    )
  }
}
