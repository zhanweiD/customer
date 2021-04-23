import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, successTip} from '../../common/util'
import io from './io'

class Store {
  @observable visible = false // 保存群体窗口
  @observable confirmLoading = false // 保存群体按钮
  // @observable unitLoading = false // 获取个体列表loading
  @observable id = null // 群体ID
  @observable objId = null // 实体ID
  @observable queryDate = null // 群体日期
  @observable projectId = null // 项目ID
  @observable titleList = [] // 个体列表表头
  @observable tableLoading = false // 获取个体列表loading
  @observable totalCount = 0
  // @observable pagination = {
  //   totalCount: 0,
  //   currentPage: 1,
  //   pageSize: 10,
  // }
  @observable list = []

  // 跳转到微观画像
  goPortrayal = (ident, id) => {
    window.location.href = `${window.__keeper.pathHrefPrefix}/customer/portrait/${ident}/${id}`
  }
  
  // 获取个体列表
  @action async getUnitList() {
    this.tableLoading = true
    try {
      const res = await io.getUnitList({
        id: this.id,
        queryDate: this.queryDate,
      })
      
      runInAction(() => {
        this.list = res.data || []
        if (!res.data) return
        this.titleList = []
        const {title} = res
        this.totalCount = res.totalSize
        // this.pagination = {
        //   totalCount: res.totalSize,
        //   currentPage: 1,
        //   pageSize: 10,
        // }
        
        for (let i = 0; i < title.length; i++) {
          if (title[i].toLowerCase() === res.mainTag.toLowerCase()) {
            // this.titleList.unshift({
            //   key: title[i],
            //   title: title[i],
            //   dataIndex: title[i],
            //   // render: (text, record) => (<a onClick={() => this.goPortrayal(record[title[i]])}>{text}</a>),
            // })
          } else {
            this.titleList.push({
              key: title[i],
              title: title[i],
              dataIndex: title[i],
            })
          }
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.tableLoading = false
    }
  }

  // 导出个体列表
  @action async outputUnitList() {
    try {
      const res = await io.outputUnitList({
        groupId: this.id,
        queryDate: this.queryDate,
      })
      if (res) {
        successTip('导出成功')
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 保存群体
  @action async saveUnitList(obj) {
    this.confirmLoading = true
    try {
      const res = await io.saveUnitList({
        id: this.id,
        queryDate: this.queryDate,
        ...obj,
      })
      runInAction(() => {
        if (res) {
          this.visible = false
          successTip('已保存')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmLoading = false
    }
  }

  // 重命名校验
  @action async checkName(name, callbak) {
    try {
      const res = await io.checkName({
        name,
        objId: this.objId,
        // id: this.id,
      })
      runInAction(() => {
        if (res.isExist) {
          callbak('群体名称重复')
        } else {
          callbak()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
