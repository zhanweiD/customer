import React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import {QuestionTooltip} from '../../component'

export default class OverviewCard extends React.Component {
  static defaultProps = {
    tooltipText: null,
    valueTexts: null,
    fontStyle: {
      // color: 'rgba(0, 0, 0, 0.65)',
      color: 'rgba(22, 50, 78, 0.85)',
      // size: 12, // 整体的字体大小，先不给设置，直接继承父类好了
      active: {
        // color: '#0078FF',
        color: 'rgba(22, 50, 78, 1)',
        fontWeight: '500',
        size: 30, // 仅仅用于高亮的数值
        viceSize: 16,
      },
    },
    className: '',
  }

  static propTypes = {
    title: PropTypes.string.isRequired, // 标题
    tooltipText: PropTypes.string, // 提示文本
    values: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ])
    ).isRequired, // 值数组，至少1个，可以是数值或字符串；展示时会高亮第一个
    valueTexts: PropTypes.arrayOf(PropTypes.string), // 对值做解释的文本，如果有，那么应该和values一一对应
    fontStyle: PropTypes.instanceOf(Object), // 字体相关样式，（没做细化校验了）
    className: PropTypes.string, // 卡片的类
  }


  render() {
    const {
      title, tooltipText, values, valueTexts, icon, fontStyle: {color, active},
    } = this.props
    return (
      <div className={`${cls({'overview-card': true})} FBH FBAC FBJB`} style={{color: color || 'inherit'}}>
        <div>
          <div>
            {/* ml4 mt1 对齐微调 */}
            {/* <span className="ml4 mt1"> */}
            <span>
              {title}
              {/* {
              tooltipText ? (
                <QuestionTooltip tip={tooltipText} />
              ) : null
            } */}
            </span>
            {
              tooltipText ? (
                <QuestionTooltip tip={tooltipText} />
              ) : null
            }
          </div>
          <div>
            <div className="mb8">
              {
                values.map((value = '--', index) => (
                  index === 0
                    ? (<span style={{color: active.color || '#0078FF', fontSize: active.size || 30, fontWeight: active.fontWeight}}>{value}</span>)
                    : (<span style={{fontSize: active.viceSize || 16}}>{`/${value}`}</span>)
                ))
              }
            </div>
            {
              valueTexts && valueTexts.length > 0 && (
                <div>
                  {
                    valueTexts.map((text, index) => <div>{text}</div>)
                  }
                  {/* {
                valueTexts.map((text, index) => (
                  index === 0
                    ? (<span style={{color: active.color || '#0078FF'}}>{text}</span>)
                    : (<span>{` / ${text}`}</span>)
                ))
              } */}
                </div>
              )
            }
          </div>
        </div>
        <div>{icon}</div>
      </div>
    )
  }
}
