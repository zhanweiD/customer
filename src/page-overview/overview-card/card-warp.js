/**
 * @description 卡片包裹组件
 */
import {Component} from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import Card from './card'

const colors = ['#00caaa', '#3187ff', '#5c6df6']

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
      <div className="new-overview-card">
        <div className={cls({'o-card-wrap': true, 'box-border': hasBorder})} {...rest}>
          {
            cards.map((item, index) => (
              <div 
                className="FB1" 
                style={{
                  border: '1px solid #e6ebf3', 
                  backgroundColor: '#fff',
                  boxShadow: '2px 4px 8px 2px rgba(223,237,244,0.5)',
                  borderRadius: 4,
                }}
              >
                <Card {...item} />
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
