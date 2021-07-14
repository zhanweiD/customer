import React from 'react'

export default ({datas}) => (
  datas.map(item => item && item.label && (
    <div className="FBH mb8 fs14">
      <div className="black45 nowrap">
        {item.label}
        ：
      </div>
      <div className="black65 breakAll" title={item.value}>
        {item.value ? item.value : <div className="black25">-</div>}
      </div>
    </div>
  ))
)
