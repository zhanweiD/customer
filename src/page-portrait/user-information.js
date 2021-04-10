/**
 * @description 用户信息
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Loading, NoData, OmitTooltip} from '../component'

@observer
export default class User extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    this.store.getUnitBasic()
  }

  render() {
    return (
      <div className="basis-info-content ml16 mr16">
        {
          this.store.unitBasic.map((item, index) => {
            return (
              <div className="basis-info-content-list">
                <div className="info-title">
                  {item.cat}
                  {/* <span className="title">{item.cat}</span> */}
                  {/* <div className="line" /> */}
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
    )
  }
}
