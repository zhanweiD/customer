import {observable, action, toJS} from 'mobx'
import _ from 'lodash'
import {errorTip, changeToOptions, userLog, listToTree} from '../../common/util'
import io from './io'

export default class Store {
  @observable id
  @observable objId

  // 客群基本信息
  @observable groupDetail = {
    name: '', // 客群名
    descr: '', // 客群描述
    logicExper: '', // 圈群规则表达式 TODO: 有点复杂
    nums: 0, // 覆盖客户数
    coveringRate: 0, // 客户覆盖率
  }

  // 显著特征 排名
  @observable topList = []

  // 显著特征 loading
  @observable tableLoading = false

  // 显著特征 - 特征分布数据
  @observable distributionData = []

  @observable chartVis = false
  @observable chartSpinning = false
  @observable tabOneTitle = ''

  // -----------------Tab 2 特征分布-------
  @observable usableTag = [] // 可用的标签集合

  // 显著特征 - 特征分布 option 数据
  // const option = {
  //   xAxis: {
  //     type: 'category',
  //     data: ['未知'],
  //   },
  //   yAxis: {
  //     type: 'value',
  //   },
  //   series: [{
  //     data: [5978],
  //     type: 'bar',
  //   }],
  // }

  @observable option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    xAxis: {
      type: 'category',
      data: ['未知'],
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      data: [5978],
      type: 'bar',
    }],
  }

  @observable chartInstance

  @observable treeData = []

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
      if (res && res.length && res.length > 0) {
        this.getDistributionByTag([res[0].tagId])
        this.tabOneTitle = `-${res[0].tagName}`
      } else {
        this.chartVis = false
      }
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
    this.chartSpinning = true
    try {
      const res = await io.getDistributionByTag({
        tagIds,
        groupId: this.id,
      })

      this.distributionData = res

      if (res && res.length && res.length > 0) {
        // 说明有标签值
        // 取第一个标签值

        const {data} = res[0]
        const xAxisData = {
          type: 'category',
          data: _.map(data, 'name'),
        }

        const seriesData = {
          type: 'bar',
          data: _.map(data, 'val'),
        }
        this.option.xAxis = xAxisData
        this.option.series = seriesData
        
        this.chartVis = true
        // 有数据去画图

        this.chartInstance.setOption(this.option)
      } else {
        this.chartVis = false
      }
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.chartSpinning = false
    }
  }

  // ---------------------- 特征分布 ------------------
  @observable originData = [] // 树的原始数据
  @observable tabTwoChartDatas = []
  @observable tabTwoChartSpining = false

  /**
   * 描述 根据对象 id，获取对应标签树
   * @date 2021-04-14
   * @param {number} objId objid
   * @returns {any} void
   */
  async getTagTree(objId) {
    try {
      const res = await io.getTagTree({
        objId,
      })

      this.originData = JSON.parse(JSON.stringify(res))

      res.forEach(item => {
        item.title = item.name
        item.key = item.id

        if (item.isCate === 0) {
          if (this.usableTag.indexOf(item.aid) === -1) {
            item.disabled = true
          }
        }
      })

      this.treeData = listToTree(res || [])

      this.treeData.forEach(item => {
        if (!item.children) {
          item.disabled = true
        } else {
          const {children} = item
          let isLevelTwoNoChildren = true

          children.forEach(e => {
            if (!e.children) {
              e.disabled = true
            } else {
              isLevelTwoNoChildren = false
            }
          })

          if (isLevelTwoNoChildren) {
            item.disabled = true
          }
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }


  /**
   * 描述 获得可用标签值
   * @date 2021-04-15
   * @param {any} id id
   * @returns {any} void
   */
  async getUsableTag(id) {
    try {
      const res = await io.getUsableTag({
        id,
      })

      // 根据 treeData 数据中的 aid 进行对应
      this.usableTag = res.tagIds
      this.getTagTree(this.objId)
    } catch (e) {
      errorTip(e.message)
    }
  }

  /**
   * 描述 特征分布，根据选择的标签求数据
   * @date 2021-04-16
   * @param {any} tagIds []
   * @returns {any} void
   */
  @action async getDistributionByTagTabTwo(tagIds) {
    this.tabTwoChartSpining = true

    // 处理成 tag 的 id
    const ids = []
    tagIds.forEach(item => {
      const target = _.find(this.originData, e => e.id === +item)
      // 只有叶子节点是标签
      if (target && target.aid && target.isCate === 0) {
        ids.push(target.aid)
      }
    })

    try {
      const res = await io.getDistributionByTag({
        tagIds: ids,
        groupId: this.id,
      })

      this.tabTwoChartDatas = res
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.tabTwoChartSpining = false
    }
  }

  @observable clientList = []
  @observable titleList = []
  @observable totalCount = 0
  @observable clientTableLoading = false

  // ---------------------- 客户列表 ------------------
  @action async getUnitList() {
    this.clientTableLoading = true
    try {
      const res = await io.getUnitList({
        id: this.id,
        queryDate: moment(new Date()).format('YYYY-MM-DD'),
      })

      this.clientList = res.data || []
      if (!res.data) return
      this.titleList = []
      const {title} = res
      this.totalCount = res.totalSize

      for (let i = 0; i < title.length; i += 1) {
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
    } catch (e) {
      errorTip(e.message)
    } finally {
      this.clientTableLoading = false
    }
  }
}
