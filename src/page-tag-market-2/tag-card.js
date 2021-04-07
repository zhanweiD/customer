import React from 'react'
import {Divider} from 'antd'
import QuestionTooltip from '../component/question-tooltip'

export default ({
  tooltipText,
  title,
  nums,
  subTitle,
}) => {
  return (
    <div className="p12" style={{border: '1px solid #e9e9e9'}}>
      <div className="FBH FBJB">
        <div>
          {title}
        </div>
        <div>
          {
            tooltipText ? (
              <QuestionTooltip tip={tooltipText} />
            ) : null
          }
        </div>
      </div>
      <div style={{fontSize: '20px'}}>
        {nums}
      </div>
      <Divider style={{margin: '8px 0'}} />
      <div>
        {subTitle}
      </div>
    </div>
  )
}
