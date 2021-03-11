import {Component} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'antd'
import nodata from '../../icon/noData.svg'

export default class NoData extends Component {
  static propTypes = {
    text: PropTypes.string, // 说明文案；不传视为不需
    btnText: PropTypes.string, // 按钮文案；不传视为不需按钮
    btnDisabled: PropTypes.bool, // 按钮是否被禁用
    onClick: PropTypes.func, // 按钮点击事件
    isLoading: PropTypes.bool, // 判断当前页面是否在loading; 若页面正在loading 则空组件隐藏处理；避免出现loading 空组件同时出现的情况
    code: PropTypes.string, // 权限code
    isCommon: PropTypes.bool, // 判断使用的是租户下code 还是 项目下的权限code. true: 租户下 false: 项目下
    noAuthText: PropTypes.string, // 没权限对应的文案提示
  }

  static defaultProps = {
    text: '',
    btnText: '',
    code: '',
    noAuthText: '',
    isLoading: false,
    btnDisabled: false,
    onClick: () => {},
    isCommon: false,
  }

  constructor(props) {
    super(props)
    const {code} = props
    if (code) {
      const {userProductFunctionCode = [], projectFunctionCode = []} = window.frameInfo || {}
      // const functionCodes = props.isCommon ? userProductFunctionCode : projectFunctionCode
      const functionCodes = window.frameInfo.perms

      this.auth = functionCodes.includes(code)
      // this.auth = true
    }
  }

  onClick = () => {
    const {onClick} = this.props

    // 点击回调函数
    if (onClick) onClick()
  }

  renderText() {
    const {text, noAuthText} = this.props

    // 渲染没权限对应文案
    if (typeof this.auth === 'boolean' && !this.auth) {
      return noAuthText ? <div className="text">{noAuthText}</div> : null
    }

    // 渲染说明文字
    if (text) {
      return (
        <div className="text">
          {text}
        </div>
      )
    }

    return null
  }


  renderBtn() {
    const {btnText, code, btnDisabled} = this.props
    
    // 渲染按钮
    if (btnText) {
      //  按钮存在情况 判断按钮权限
      if (code) { 
        return this.getBtnAutn()
      } 

      return <Button type="primary" disabled={btnDisabled} onClick={this.onClick}>{btnText}</Button>
    }

    // 无按钮
    return null
  }

  // 获取按钮权限
  getBtnAutn = () => {
    const {btnText, btnDisabled} = this.props
    
    // 拥有权限
    if (this.auth) {
      return <Button type="primary" disabled={btnDisabled} onClick={this.onClick}>{btnText}</Button>
    }

    // 没有权限
    return null
  }

  render() {
    const {isLoading, size = 'big', style} = this.props

    const imgWidth = size === 'small' ? '200px' : '300px'

    return (
      <div className={`nodata ${isLoading ? 'no-show' : ''}`} style={style}>
        <div>
          <div className="mb16">
            <img width={imgWidth} src={nodata} alt="暂无数据" />
          </div>
          {
            this.renderText()
          }
          {
            this.renderBtn()
          }
        </div>
      </div>
    )
  }
}
