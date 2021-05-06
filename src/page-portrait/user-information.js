/* eslint-disable guard-for-in */
/**
 * @description 用户信息
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Spin} from 'antd'

@observer
export default class User extends Component {
  infoName = ''
  nameValue = ''
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.store.getUnitBasic()
  }

  @action focus = () => {
    this.store.actionFocus()
  }

  setInfo = () => {
    const {defaultInfo} = this.store
    const valueData = []
    const keyData = []
    const infoDom = []
    
    // 取出key和value
    // eslint-disable-next-line no-restricted-syntax
    for (const key in defaultInfo) {
      if (key !== 'ident') {
        valueData.push(defaultInfo[key])
        keyData.push(key)
      }
    }

    // 遍历key生成dom
    keyData.forEach((item, index) => {
      if (index > 0) {
        infoDom.push(
          <div className="lh24">{`${item}: ${valueData[index] || '-'}`}</div>
        )
      } else {
        this.infoName = item
        this.nameValue = valueData[index]
      }
    })
    return infoDom
  }

  render() {
    const {basicLoading, attention} = this.store
    return (
      <div className="basis-info-content ml16 mr16">
        <Spin spinning={basicLoading}>
          <div>
            <div className="herder">客户档案</div>
            <div className="fs12 c65 pb8 bbc">
              <div className="dfjc lh24">
                <div>{`${this.infoName}: ${this.nameValue || '-'}`}</div>
                <Button onClick={this.focus}>{attention ? '取关' : '关注'}</Button>
              </div>
              {
                this.setInfo()
              }
            </div>
            {
              this.store.unitBasic.map(item => {
                return (
                  <div className="basis-info-content-list">
                    <div className="info-title">
                      {item.cat}
                    </div>
                    <div>
                      {item.list && item.list.map(content => {
                        return (
                        // <p className="info-content">
                        //   <div className="p-tag">{`${content.tag}:`}</div>
                        //   <div className="p-val"><OmitTooltip text={content.val} maxWidth={160} /></div>
                        // </p>
                          <span className="mr8 mb8 fs12 c65 info-tag">{content.val}</span>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Spin>
      </div>
    )
  }
}
