/**
 * @description 登录
 */
import {Component} from 'react'
import {observer} from 'mobx-react'

import {action, toJS} from 'mobx'
import NoBorderInput from '../component/noborder-input-svg'
import ErrorField from '../component/error-field'
import Button from '../component/button'
import banner from './icon/banner.gif'
import bgImage from './icon/bg.svg'
import user from './icon/user.svg'
import lock from './icon/lock.svg'
import './icon'
import store from './store'

@observer
export default class Login extends Component {
  componentDidMount() {
    window.addEventListener('keyup', this.handleSubmit)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleSubmit)
  }

  @action.bound handleSubmit(e) {
    if (e.keyCode && e.keyCode === 13 && !store.isSubmitting) {
      store.validate()
    }
  }

  handleUserNameChange(e) {
    // 备注：这里加一个trim, 主要是为了处理复制手机号填写时多复制了一个空格导致登录不上的问题（正常登录不需要加，因为手机号校验里有判断非空格）
    store.userName = e.target.value.trim()
  }

  handlePasswordChange(e) {
    store.password = e.target.value
  }

  handleCodeChange(e) {
    store.code = e.target.value.trim()
  }

  @action.bound handleFocus(messageType) {
    store[messageType] = ''
  }

  // 获取placehoder文字拼接icon图标
  getPlaceholder(iconName, text) {
    return (
      <span className="FBH FBAC">
        <img width="15px" height="15px" src={iconName} alt="" />
        <span className="ml4">{text}</span>
      </span>
    )
  }

  render() {
    return (
      <div
        className="page-login FBV"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
        }}
      >
        <div className="inner-area FB1 FBH FBAC FBJC">
          <div className="content FBH">
            <div className="main-pic FB1 animated fadeIn">
              <div className="title-container FBV FBJ FBAC">
                {/* <div className="dt-title">彰泰</div> */}
                <div className="dt-title">慧营客</div>
                <div className="dt-subtitle">客户洞察</div>
              </div>
              <img src={banner} alt="" />
            </div>
            <div className="operation FBV FBJC">
              <div className="component-new-operation">
                <div className="action">
                  <div className="tab active">
                    {/* <div className="caret-blue" />
                    <div className="caret-white" /> */}
                    登录
                  </div>
                </div>

                <form className="form">
                  <ErrorField className="error-msg" message={store.errorMsg} />
                  <div className="formItem">
                    <NoBorderInput
                      label={this.getPlaceholder(user, '账号')}
                      type="text"
                      onChange={e => this.handleUserNameChange(e)}
                      onFocus={() => this.handleFocus('verifyUserNameMsg')}
                    />
                    <ErrorField message={store.verifyUserNameMsg} />
                  </div>
                  <div className="formItem">
                    <NoBorderInput
                      label={this.getPlaceholder(lock, '密码')}
                      type="password"
                      autoComplete="current-password"
                      onChange={e => this.handlePasswordChange(e)}
                      onFocus={() => this.handleFocus('verifyPwdMsg')}
                    />
                    <ErrorField message={store.verifyPwdMsg} />
                  </div>

                  <div className="btn-box">
                    {/* <Button disabled={this.store.isSubmitting || this.store.failCount >= 6} onClick={this.store.validate}>登录</Button> */}
                    <Button disabled={store.isSubmitting} onClick={store.validate}>登录</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
