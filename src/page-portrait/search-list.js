import {useEffect, useState} from 'react'

const SearchList = ({data, title, color}) => {
  // console.log(data)
  return (
    <div className="bgf mr16 mt16 search-list">
      <h2 style={{backgroundColor: color}} className="list-height">{title}</h2>
      {
        data.map(item => {
          return (
            <div className="dfsa item-content">
              {/* <div style={{lineHeight: '36px'}}>头像</div> */}
              <div>
                {/* <div>{`${item.客户姓名} ${item.type}`}</div> */}
                <div>{item.客户姓名}</div>
                <div className="c65">{item.手机号}</div>
              </div>
              {/* <div style={{lineHeight: '36px'}} className="c65">{item.time}</div> */}
            </div>
          )
        })
      }
    </div>
  )
}
export default SearchList
