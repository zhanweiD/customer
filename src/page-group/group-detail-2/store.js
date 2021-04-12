import {observable, action, toJS} from 'mobx'
import {errorTip, changeToOptions, userLog} from '../../common/util'
import io from './io'

export default class Store {
  // 客群基本信息
  @observable groupDetail = {
    name: '', // 客群名
    descr: '', // 客群描述
    logicExper: '', // 圈群规则表达式
    nums: 0, // 覆盖客户数
    coveringRate: 0, // 客户覆盖率
  }

  // 显著特征 排名
  @observable topList = []

  // 显著特征 loading
  @observable tableLoading = false
  
  /**
   * 描述 获取客群详情
   * @date 2021-04-09
   * @param {any} id 客群id
   * @returns {any} void
   */
  @action async getGroupDetail(id) {
    try {
      const res = await io.getGroupDetail({
        id,
      })

      this.groupDetail = res
    } catch (e) {
      errorTip(e.message)
    }
  }


  /**
   * 描述 获取客群标签top榜单
   * @date 2021-04-09
   * @param {any} id 客群id
   * @param {number} limit 显示数，默认10
   * @returns {any} void
   */
  @action async getTopList(id) {
    this.tableLoading = true
    try {
      const res = await io.getTopList({
        groupId: id,
        limit: 10,
      })

      this.topList = res
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.tableLoading = false
    }
  }


  /**
   * 描述 根据传入的标签，输出标签值分析
   * @date 2021-04-09
   * @param {any} tagIds 标签 id 的集合
   * @returns {Array} [{tagName: '', tagId: 1, data: [{name: '', val: ''}]}]
   */
  @action async getDistributionByTag(tagIds) {
    console.log(tagIds)
    // try {
    //   const res = await io.getDistributionByTag({
    //     tagIds,
    //   })
    // } catch (e) {
    //   errorTip(e.message)
    // }
  }

  @action setData() {
    this.tableLoading = true

    setTimeout(() => {
      this.topList = [
        {
          tagName: '热爱户外类活动',
          nums: 1000,
          tagId: 22,
        }, {
          tagName: '工专路一号',
          nums: 2000,
        }, {
          tagName: '工专路二号',
          nums: 3000,
        }, {
          tagName: '工专路三号',
          nums: 4000,
        }, {
          tagName: '工专路四号',
          nums: 5000,
        }, {
          tagName: '工专路四号',
          nums: 5000,
        }, {
          tagName: '工专路四号',
          nums: 5000,
        }, {
          tagName: '工专路四号',
          nums: 5000,
        }, {
          tagName: '工专路四号',
          nums: 5000,
        }, {
          tagName: '工专路四号',
          nums: 5000,
        },
      ]

      this.tableLoading = false
    }, 2000)    
  }
}
