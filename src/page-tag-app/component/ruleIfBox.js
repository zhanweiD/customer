import {Component} from 'react'
import RuleCondition from './ruleCondition'
import RuleItem from './ruleItem'
import RuleAction from './ruleAction'
import './index.styl'

// RuleCondition w:44 h:32 
// line w:60

const COMP_RULE_CONDITION_W = 44 // 条件组件宽
const COMP_RULE_CONDITION_H = 32 // 条件组件高
const COMP_DISTANCE = 60 // 组件间纵向距离
const PATH_WIDTH = 60 // 曲线宽度

const originalData = [{
  type: 1,
  flag: '0',
  level: [0],
  x: 0,
  y: 50,
  source: null,
  target: null,
  logic: 1,
},
{
  type: 2,
  flag: '0-0',
  level: [0, 0],
  x: 104,
  y: 20,
  source: [44, 66],
  target: [104, 36],
}, 
{
  type: 3,
  flag: '0-1',
  level: [0, 1],
  x: 104,
  y: 80,
  source: [44, 66],
  target: [104, 96],
}]

export default class RuleIfBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.detail || originalData,
    }

    if (document.getElementById(props.id) && props.detail) {
      const height = props.detail.filter(d => d.type !== 1).length * 60
      document.getElementById(props.id).style.height = `${height > 130 ? height : 130}px`
    }
  }

  componentWillReceiveProps(next) {
    const {
      clearActionKey, 
      submitActionKey, 
      id, 
      submit, 
      ruleId, 
      type,
      detail,
    } = this.props

    const data = _.cloneDeep(this.state.data)
    const copyData = _.cloneDeep(this.state.data)
    const currectData = []

    if (!_.isEqual(detail, next.detail)) {
      this.setState({
        data: next.detail || originalData,
      })
    }
 
    // 全部清空
    if (clearActionKey && !_.isEqual(+clearActionKey, next.clearActionKey)) {
      console.log('clearActionKey')
      this.setState({
        data: originalData,
      })
      document.getElementById(id).style.height = '130px'
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].type === 2) {
          this[`ruleItem${data[i].flag}`].resetFields()
        }
      }
    }

    if (!_.isEqual(+submitActionKey, next.submitActionKey)) {
      for (let i = 0; i < data.length; i += 1) {
        if (data[i].type === 2) {
          let flag = false
          this[`ruleItem${data[i].flag}`].validateFields((err, values) => {
            if (!err) {
              const item = {
                flag: data[i].flag,
                level: data[i].level,
                type: data[i].type,
                source: data[i].source,
                x: data[i].x,
                y: data[i].y,
                ...values,
              }
              currectData.push(item)

              copyData[i] = {...data[i], ...item}
            } else {
              flag = true
            }
          })
  
          if (flag) {
            break
          }
        }
      }

      if (!(type === 'detail') && currectData.length === data.filter(d => d.type === 2).length) {
        submit(currectData, copyData, next.ruleId)
      }
    }
  }

  renderLine = () => {
    const {data} = this.state

    return data.map(d => {
      if (d.source && d.source) {
        const path = `M${+d.source[0]}, ${+d.source[1]} C${+d.source[0] + 30} ${+d.source[1]}, ${+d.source[0] + 30} ${+d.target[1]}, ${+d.target[0]} ${+d.target[1]}`
      
        return (
          <path
            key={`path${d.flag}`}
            d={path}
            stroke="#d9d9d9"
            fill="none"
            strokeWidth="1"
          />
        )
      }
      return null
    })
  }

  renderRuleCondition = () => {
    const {data} = this.state
    const {type} = this.props

    return data.map((d, i) => {
      if (d.type === 1) {
        return (
          <RuleCondition 
            key={`ruleCondition${d.flag}`}
            pos={[d.x, d.y]} 
            delCon={() => this.delCombineCon(d, i)} 
            changeCondition={d => this.changeCondition(d, i)}
            info={d}
            type={type}
          />
        ) 
      }
      return null
    })
  }

  renderRuleItem = () => {
    const {data} = this.state
    const {type} = this.props
    
    const {
      // funcList, 
      tagList,
    } = this.props

    return data.map((d, i) => {
      if (d.type === 2) {
        return (
          <RuleItem 
            key={`ruleItem${d.flag}`} 
            pos={[d.x, d.y]} 
            delCon={() => this.delCon(d, i)}
            info={d}
            // funcList={funcList}
            tagList={tagList}
            wrappedComponentRef={form => { this[`ruleItem${d.flag}`] = form ? form.props.form : form }} 
            type={type}
          />
        ) 
      }
      return null
    })
  }

  renderRuleAction = () => {
    const {data} = this.state

    return data.map((d, i) => {
      if (d.type === 3) {
        return (
          <RuleAction 
            pos={[d.x, d.y]}
            addCon={() => this.addCon(d, i)}
            addCombineCon={() => this.addCombineCon(d, i)}
            key={`ruleAction${d.flag}`}
            {...d} 
          />
        ) 
      }
      return null
    })
  }

  changeCondition = (sdata, index) => {
    const {data} = this.state
    const newData = _.cloneDeep(data)
    newData[index] = sdata

    this.setState({
      data: newData,
    })
  }

  // type:add加 / subtract减
  updateLevel = (current, type, free) => {
    const {data} = this.state

    let newData = []

    const currentLevel = current.level

    const len = currentLevel.length

    const levelIndex = len - 1

    if (type === 'add') {
      newData = _.cloneDeep(data).map(d => {
        // 更新level
        if (
          d.level[levelIndex] 
          && d.level.length === currentLevel.length
          && d.source[1] === current.source[1]
          && (d.level[levelIndex] >= currentLevel[levelIndex])) {
          const {level} = d

          level[levelIndex] = d.level[levelIndex] + 1
   
          return {
            flag: level.join('-'),
            level,
            source: d.source,
            target: [d.target[0], d.target[1] + COMP_DISTANCE],
            type: d.type,
            x: d.x,
            y: d.y + COMP_DISTANCE,
          }
        }

        // 不改变source 只改变target
        if (d.y > current.y && d.level.length === 2) {
          return {
            flag: d.flag,
            level: d.level,
            source: d.source,
            target: [d.target[0], d.target[1] + COMP_DISTANCE],
            type: d.type,
            x: d.x,
            y: d.y + COMP_DISTANCE,
          }
        }

        // 改变source 改变target
        if (d.y > current.y && d.level.length > 2 && d.source[1] < current.y) {
          return {
            flag: d.flag,
            level: d.level,
            source: d.source,
            target: [d.target[0], d.target[1] + COMP_DISTANCE],
            type: d.type,
            x: d.x,
            y: d.y + COMP_DISTANCE,
          }
        }

        // 改变source 改变target
        if (d.y > current.y && d.level.length > 2 && d.source[1] > current.y) {
          return {
            flag: d.flag,
            level: d.level,
            source: [d.source[0], d.source[1] + COMP_DISTANCE],
            target: [d.target[0], d.target[1] + COMP_DISTANCE],
            type: d.type,
            x: d.x,
            y: d.y + COMP_DISTANCE,
          }
        }

        return d
      })
    }

    if (type === 'add' && free) {
      newData.push(free)
    }

    if (type === 'subtract') {
      const subtractData = _.cloneDeep(data)

      subtractData.splice(free, 1)

      newData = subtractData.map(d => {
        // 同一个根分支 更新level 不改变source 改变target
        if (
          d.level[levelIndex] 
          && d.level.length === currentLevel.length
          && d.source[1] === current.source[1]
          && (d.level[levelIndex] > currentLevel[levelIndex])
        ) {
          const {level} = d
          level[levelIndex] = d.level[levelIndex] - 1

          return {
            flag: level.join('-'),
            level,
            source: d.source,
            target: [d.target[0], d.target[1] - COMP_DISTANCE],
            type: d.type,
            x: d.x,
            y: d.y - COMP_DISTANCE,
          }
        }

        // 第二层树节点 更新level 不改变source 只改变target
        if (d.y > current.y && d.level.length === 2) {
          return {
            flag: d.flag,
            level: d.level,
            source: d.source,
            target: [d.target[0], d.target[1] - COMP_DISTANCE],
            type: d.type,
            x: d.x,
            y: d.y - COMP_DISTANCE,
          }
        }

        if (
          d.y > current.y 
          && d.level.length > 2 
          && d.source[1] < current.y
        ) {
          const {level} = d

          if (level[levelIndex] && d.flag.slice(0, len - 2) === current.flag.slice(0, len - 2)) {
            level[levelIndex] = d.level[levelIndex] - 1
          }

          return {
            flag: level.join('-'),
            level,
            source: d.source,
            target: [d.target[0], d.target[1] - COMP_DISTANCE],
            type: d.type,
            x: d.x,
            y: d.y - COMP_DISTANCE,
          }
        }

        if (d.y > current.y && d.level.length > 2 && d.source[1] > current.y) {
          const {level} = d

          if (level[levelIndex] && d.flag.slice(0, current.flag.length - 2) === current.flag.slice(0, current.flag.length - 2)) {
            level[levelIndex] = d.level[levelIndex] - 1
          }

          return {
            flag: level.join('-'),
            level,
            source: [d.source[0], d.source[1] - COMP_DISTANCE],
            target: [d.target[0], d.target[1] - COMP_DISTANCE],
            type: d.type,
            x: d.x,
            y: d.y - COMP_DISTANCE,
          }
        }

        return d
      })
    }

    this.setState({
      data: newData,
    })
  }

  // 添加条件
  addCon = (d, i) => {
    const current = _.cloneDeep(d)

    const newItem = {
      flag: current.flag,
      level: current.level,
      source: current.source,
      target: current.target,
      type: 2,
      x: current.x,
      y: current.y,
    }

    this.updateLevel({...d}, 'add', {...newItem})
  }

  // 添加联合条件
  addCombineCon = (itemData, i) => {
    const {data} = this.state

    const current = _.cloneDeep(itemData)

    const lastLevel = current.level[itemData.level.length - 1]

    current.level[itemData.level.length - 1] = lastLevel + 1

    const newData = _.cloneDeep(data).map(d => {
      // 不改变source 只改变target
 
      if (d.y > current.y && d.level.length === 2 && d.flag !== current.flag) {
        return {
          flag: d.flag,
          level: d.level,
          source: d.source,
          target: [d.target[0], d.target[1] + COMP_DISTANCE * 2],
          type: d.type,
          x: d.x,
          y: d.y + COMP_DISTANCE * 2,
        }
      }

      // 改变source 改变target
      if (d.y > current.y && d.level.length > 2 && d.source[1] < current.y) {
        return {
          flag: d.flag,
          level: d.level,
          source: d.source,
          target: [d.target[0], d.target[1] + COMP_DISTANCE * 2],
          type: d.type,
          x: d.x,
          y: d.y + COMP_DISTANCE * 2,
        }
      }

      // 改变source 改变target(多层)
      if (d.y > current.y && d.level.length > 2 && d.source[1] > current.y) {
        return {
          flag: d.flag,
          level: d.level,
          source: [d.source[0], d.source[1] + COMP_DISTANCE * 2],
          target: [d.target[0], d.target[1] + COMP_DISTANCE * 2],
          type: d.type,
          x: d.x,
          y: d.y + COMP_DISTANCE * 2,
        }
      }

      return d
    })

    const updateItem = {
      flag: current.level.join('-'),
      level: current.level,
      source: current.source,
      target: [current.target[0], current.target[1] + COMP_DISTANCE * 2],
      type: current.type,
      x: current.x,
      y: current.y + COMP_DISTANCE * 2,
    }
    
    const newItem = {
      flag: itemData.flag,
      level: itemData.level,
      source: current.source,
      target: [current.target[0], current.target[1] + COMP_DISTANCE / 2],
      type: 1,
      x: current.x,
      y: current.y + COMP_DISTANCE / 2,
      logic: 1,
    }

    const newItemChildLevel = itemData.level.concat([0])

    const newItemChild = {
      flag: newItemChildLevel.join('-'),
      level: newItemChildLevel,
      source: [current.x + COMP_RULE_CONDITION_W, newItem.y + COMP_RULE_CONDITION_H / 2],
      target: [current.target[0] + COMP_RULE_CONDITION_W + PATH_WIDTH, current.target[1]],
      type: 2,
      x: current.x + COMP_RULE_CONDITION_W + PATH_WIDTH,
      y: current.y,
    }

    const newItemActionLevel = itemData.level.concat([1])

    const newItemAction = {
      flag: newItemActionLevel.join('-'),
      level: newItemActionLevel,
      source: [current.x + COMP_RULE_CONDITION_W, newItem.y + COMP_RULE_CONDITION_H / 2],
      target: [current.target[0] + COMP_RULE_CONDITION_W + PATH_WIDTH, current.target[1] + COMP_DISTANCE],
      type: 3,
      x: current.x + COMP_RULE_CONDITION_W + PATH_WIDTH,
      y: current.y + COMP_DISTANCE,
    }

    newData.push(newItem)
    newData.push(newItemChild)
    newData.push(newItemAction)

    newData[i] = updateItem

    this.setState({
      data: newData,
    })
  }

  // 删除单个条件
  delCon = (d, i) => {
    this.updateLevel({...d}, 'subtract', i)
  }

  // 删除联合条件
  delCombineCon = (current, i) => {
    const {data} = this.state

    const currentLevel = current.level

    const len = currentLevel.length

    const levelIndex = len - 1

    const restData = _.cloneDeep(data).filter(d => d.flag !== current.flag && d.flag.slice(0, current.flag.length) !== current.flag)

    const subtractData = _.cloneDeep(data).filter(d => d.flag === current.flag || d.flag.slice(0, current.flag.length) === current.flag)
   
    const subtractCount = subtractData.filter(d => d.type !== 1).length

    const newData = restData.map(d => {
      // 同级
      if (
        d.level.length === len 
        && d.source[1] === current.source[1]
        && d.y > current.y 
      ) {
        const {level} = d

        if (level[levelIndex] && d.flag.slice(0, current.flag.length - 2) === current.flag.slice(0, current.flag.length - 2)) {
          level[levelIndex] = d.level[levelIndex] - 1
        }
        return {
          flag: level.join('-'),
          level,
          source: d.source,
          target: [d.target[0], d.target[1] - subtractCount * COMP_DISTANCE],
          type: d.type,
          x: d.x,
          y: d.y - subtractCount * COMP_DISTANCE,
        }
      }

      // 第二级
      if (
        d.level.length === 2
        && d.y > current.y 
      ) {
        return {
          flag: d.flag,
          level: d.level,
          source: d.source,
          target: [d.target[0], d.target[1] - subtractCount * COMP_DISTANCE],
          type: d.type,
          x: d.x,
          y: d.y - subtractCount * COMP_DISTANCE,
        }
      }

      // 多级
      if (
        d.level.length > 2
        && d.y > current.y 
        && d.source[1] > current.source[1]
      ) {
        const {level} = d

        if (level[levelIndex] && d.flag.slice(0, current.flag.length - 2) === current.flag.slice(0, current.flag.length - 2)) {
          level[levelIndex] = d.level[levelIndex] - 1
        }
 
        return {
          flag: level.join('-'),
          level,
          source: [d.source[0], d.source[1] - subtractCount * COMP_DISTANCE],
          target: [d.target[0], d.target[1] - subtractCount * COMP_DISTANCE],
          type: d.type,
          x: d.x,
          y: d.y - subtractCount * COMP_DISTANCE,
        }
      }

      // 多级
      if (
        d.level.length > 2
        && d.y > current.y 
        && d.source[1] < current.source[1]
      ) {
        const {level} = d

        if (level[levelIndex] && d.flag.slice(0, current.flag.length - 2) === current.flag.slice(0, current.flag.length - 2)) {
          level[levelIndex] = d.level[levelIndex] - 1
        }
 
        return {
          flag: level.join('-'),
          level,
          source: d.source,
          target: [d.target[0], d.target[1] - subtractCount * COMP_DISTANCE],
          type: d.type,
          x: d.x,
          y: d.y - subtractCount * COMP_DISTANCE,
        }
      }

      return d
    })

    this.setState({
      data: newData,
    })
  }

  render() {
    const {data} = this.state

    const {id} = this.props
    const heightComp = data.filter(d => d.type !== 1).length * 60
    const height = `${heightComp > 130 ? heightComp : 130}px`
    return (
      <div className="rule-if-box" id={id} style={{height}}>
              
        <svg style={{height: '100%', width: '100%'}}>
          {
            this.renderLine()
          }

        </svg>
        <div className="rule-if-content">

          {
            this.renderRuleCondition()
          }

          {
            this.renderRuleItem()
          }

          {
            this.renderRuleAction()
          }
        </div>
      </div>
    )
  }
}
