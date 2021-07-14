/**
 * @description 卡片包裹组件
 */
import {Component} from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import Card from './card'

const colors = ['#00caaa', '#3187ff', '#5c6df6']
const backgrounds = [
  'linear-gradient(180deg, #9D99FF 2%, #554EFD 100%)',
  'linear-gradient(180deg, #82CAF8 0%, #3192ED 86%)',
  'linear-gradient(180deg, #ACE493 0%, #5DBA41 77%)',
]

export default class CardWarp extends Component {
  static defaultProps = {
    cards: PropTypes.array,
  }

  static propTypes = {
    cards: [],
  }

  render() {
    const {cards, hasBorder, ...rest} = this.props

    return (
      <div className={cls({'o-card-wrap': true, 'box-border': hasBorder})} {...rest}>
        {
          cards.map((item, index) => (
            <div 
              className="FB1" 
              style={{
                borderLeft: index !== 0 ? '1px solid #E8E8E8' : '', 
                background: backgrounds[index % 3],
                boxShadow: '2px 4px 8px 2px rgba(223,237,244,0.50)',
                borderRadius: '4px',
              }}
            >
              <Card {...item} />
            </div>
          ))
        }
      </div>
    )
  }
}
