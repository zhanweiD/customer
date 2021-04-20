/**
 * @description 用户信息
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Spin} from 'antd'

@observer
export default class User extends Component {
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

  render() {
    const {basicLoading, defaultInfo, attention} = this.store
    return (
      <div className="basis-info-content ml16 mr16">
        <Spin spinning={basicLoading}>
          <div>
            <div className="herder">客户档案</div>
            <div className="fs12 c65 pb8 bbc">
              <div className="dfjc lh24">
                <div>{`姓名: ${defaultInfo.cust_name || '-'}`}</div>
                <Button onClick={this.focus}>{attention ? '取关' : '关注'}</Button>
              </div>
              <div className="lh24">{`业务身份: ${defaultInfo.identity || '-'}`}</div>
              <div className="lh24">{`联系电话: ${defaultInfo.iphone || '-'}`}</div>
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
