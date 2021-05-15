import {
  action, observable, runInAction, toJS,
} from 'mobx'
import md5 from 'md5'
import {
  errorTip,
} from '../common/util'
import io from './io'

class Store {
  // 用户名
  @observable userName = ''

  // 用户名相关错误消息
  @observable verifyUserNameMsg = ''

  // 密码
  @observable password = ''

  // 密码相关错误消息
  @observable verifyPwdMsg = ''

  // 总的错误信息
  @observable errorMsg = ''
  @observable loginErr = ''

  // 是否已经发送提交请求
  @observable isSubmitting = false

  // 校验
  @action.bound validate() {
    const {
      userName, password,
    } = this

    if (!userName.length) {
      this.verifyUserNameMsg = '请输入账号'
    } else if (userName.length < 2 || userName.length > 50) {
      this.verifyUserNameMsg = '长度不正确，请重新输入'
    } else {
      this.verifyUserNameMsg = ''
    }

    if (!password.length) {
      this.verifyPwdMsg = '请输入密码'
    } else {
      this.verifyPwdMsg = ''
    }

    // 用户名、密码校验正确，并且不处于提交状态
    if (this.isSubmitting || this.verifyUserNameMsg || this.verifyPwdMsg || this.verifyCodeMsg) {
      return
    }
    this.goLogin()
  }

  // 登录
  @action goLogin = async () => {
    try {
      this.isSubmitting = true
      const res = await io.goLogin({
        username: this.userName,
        password: md5(this.password),
      })
      runInAction(() => {
        localStorage.setItem('token', res.token)
        localStorage.setItem('userAccount', res.userAccount)
        this.goRedirect()
      })
    } catch (e) {
      this.errorMsg = e.message
    } finally {
      this.isSubmitting = false
    }
  }

  // 登出
  @action goLogout = async cb => {
    try {
      const res = await io.goLogout()
      runInAction(() => {
        if (cb) cb(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 跳转操作
  @action.bound goRedirect() {
    if (localStorage.getItem('url') && localStorage.getItem('url') !== '#/login') {
      window.location.replace(localStorage.getItem('url'))
      window.location.reload() // 强制刷新页面
    } else {
      window.location.href = `${window.__keeper.pathHrefPrefix}/overview`
      // window.location.reload() // 强制刷新页面
    }
    // window.location.reload()
  }
}

export default new Store()
