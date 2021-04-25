import {
  observable, action, runInAction, toJS,
} from 'mobx'
import md5 from 'md5'
import {successTip, errorTip} from '../common/util'
import io from './io'

class Store {
  @observable userStatus = false // 登录状态
  @observable collapsed = false
  @observable pathName = '' // 根据url选中菜单
  @observable visible = false // 修改密码
  @observable getPerLoad = false // 权限是否加载完毕
  @observable userInfo = {} // 用户信息
  @observable openKeys = [] // 打开菜单

  @action async getParams() {
    try {
      const res = await io.getParams()
      runInAction(() => {
        window.defaultParams = res || {}
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async getUserInfo() {
    try {
      const res = await io.getUserInfo()
      runInAction(() => {
        window.frameInfo = res
        this.userInfo = res
        this.getPerLoad = true
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async goLogout(cb) {
    try {
      await io.goLogout()
      runInAction(() => {
        if (cb) cb()
        localStorage.setItem('url', window.location.hash)
        window.location.href = `${window.__keeper.pathHrefPrefix}/login`
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 修改密码
  @action async modifyPwd(obj) {
    try {
      await io.modifyPwd({
        password: md5(obj.password),
      })
      runInAction(() => {
        localStorage.removeItem('token')
        successTip('修改成功，请重新登录')
        window.location.href = `${window.__keeper.pathHrefPrefix}/login`
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  listToTreePro(data) {
    const newData = _.cloneDeep(data)
  
    newData.forEach(item => {
      const children = newData.filter(sitem => sitem.parent === item.name)
      if (children.length && !item.children) item.children = children
    })
    return newData.filter(item => item.parent === -1)
  }

  // 全部项目
  @action async getProject() {
    try {
      const res = await io.getProject()
      runInAction(() => {
        const list = res || []
        const proList = list.filter(item => item.name !== '')
        window.__keeper.projectTree = this.listToTreePro(proList)
      })
    } catch (e) {
      errorTip(e.message)
    } 
  }
}

export default new Store()
