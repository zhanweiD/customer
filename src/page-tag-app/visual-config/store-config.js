import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, successTip, failureTip, changeToOptions} from '../../common/util'
import io from './io'

class Store {
  @observable objId
  @observable visualId

  @observable treeSearchKey

  //* ****************** 标签树 start ********************* //
  @observable currentTag
  @observable currentTagData = {}
  @observable tagTreeData = []
  @observable visibleTag = false // 创建衍生标签弹窗
  @observable confirmTagLoading = false // 创建衍生标签弹窗 确认按钮loading
  @observable canEditCondition = true

  // 添加标签
  @action async addTag(value, cb) {
    const data = {
      ...value,
    }
    if (!this.tagTreeData.length) {
      this.currentTag = value.tagId || value.id
    }

    if (this.tagTreeData.filter(d => d.canSubmit).length === this.tagTreeData.length) {
      data.canEdit = 1
    }

    this.tagTreeData.push(data)

    if (cb) {
      cb()
    }
  }

  // 创建标签
  @action async createTag(params, cb) {
    this.confirmTagLoading = true

    try {
      const res = await io.createTag({
        objId: this.objId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('操作成功')
          if (cb) {
            cb()
          }

          const data = {
            tagId: res,
            ...params,
          }
          this.addTag(data)
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.confirmTagLoading = false
    }
  }

  @observable derivativeTagList = []
  @action async getDerivativeTagList() {
    try {
      const res = await io.getDerivativeTagList({
        objId: this.objId,
      })
      runInAction(() => {
        this.derivativeTagList = changeToOptions(res)('name', 'id')
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable tagDetail = {}
  // 标签详情
  @action async getTagDetail(params) {
    try {
      const res = await io.getTagDetail({
        ...params,
      })
      runInAction(() => {
        this.tagDetail = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 重名校验
  @action async checkTagName(params, cb) {
    try {
      const res = await io.checkTagName({
        objId: this.objId,
        ...params,
      })

      runInAction(() => {
        if (res.success) {
          cb('名称已存在')
        } else {
          cb()
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
  
 // 重名校验
 @action async deleteVisualExt(id, cb) {
    try {
      const res = await io.deleteVisualExt({
        id,
      })
      runInAction(() => {
        if (res) {
          successTip('删除成功')
          if (cb) cb()
        } else {
          failureTip('删除失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
  //* ****************** 标签树 end ********************* //

  //* ****************** 逻辑配置 start *********************** //
  relVisualExtRspList = {}
  configIdInfo = {}

  @action async saveVisualExt(data, cb) {
    try {
      let res

      if (this.configIdInfo[data.tagId || data.id]) {
        res = await io.updateVisualExt({
          derivativeSchemeId: this.visualId,
          ...data,
          id: +this.configIdInfo[data.tagId || data.id],
        })
      } else {
        res = await io.saveVisualExt({
          derivativeSchemeId: this.visualId,
          ...data,
        })
      }

      runInAction(() => {
        this.configIdInfo[data.tagId] = res 

        if (data.type) {
          if (cb) {
            cb(res)
          }
        } else {
          const tagTreeData = toJS(this.tagTreeData)
          this.canEditCondition = false
          for (let i = 0; i < tagTreeData.length; i += 1) {
            if (+tagTreeData[i].tagId === +this.currentTag) {
              tagTreeData[i].canEdit = 1
              tagTreeData[i].canSubmit = 1

              if (i + 1 < tagTreeData.length) {
                tagTreeData[i + 1].canEdit = 1
              }
            }
          }

          this.tagTreeData = tagTreeData
          this.relVisualExtRspList[+this.currentTag] = data
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
  //* ****************** 逻辑配置 end *********************** //

  //* ****************** 设置数据过滤规则 start ********************* //
  @observable drawerRuleVisible = false

  // 保存可视化条件表达式（条件页面）设置数据规则
  @action async saveVisualRule(data) {
    try {
      const res = await io.saveVisualRule({
        derivativeSchemeId: this.visualId,
        type: 1,
        ...data,
      })

      runInAction(() => {
        if (res) {
          successTip('操作成功')
          this.drawerRuleVisible = false
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 修改可视化条件表达式（条件页面）设置数据规则
  @action async updateVisualRule(data, cb) {
    try {
      const res = await io.updateVisualRule({
        derivativeSchemeId: this.visualId,
        type: 1,
        ...data,
      })

      runInAction(() => {
        if (res) {
          successTip('操作成功')
          this.drawerRuleVisible = false
        } else {
          failureTip('操作失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable ruleDetail = {}
  @observable ruleLoading = false
  // 设置数据规则详情
  @action async getVisualRuleDetail(data) {
    this.ruleLoading = true
    try {
      const res = await io.getVisualRuleDetail({
        id: this.visualId,
        ...data,
      })

      runInAction(() => {
        if (res.when) {
          this.ruleDetail = res
        } else {
          this.ruleDetail = {}
        }
      }) 
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.ruleLoading = false
      })
    }
  }

  //* ****************** 设置数据过滤规则 end *********************** //

  // 更新可视化方案（第一个页面
  @action async updateBaseInfo() {
    try {
      const res = await io.updateBaseInfo({
        id: this.visualId,
        displayable: 1,
      })

      runInAction(() => {
        console.log(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable ruleList = []
  @action.bound clearAll() {
    this.ruleList.clear()
  }
}

export default new Store()
