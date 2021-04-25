import {Link} from 'react-router-dom'
import {NoData} from '../component'

const SearchList = ({data, title, color, id}) => {
  // console.log(data)
  return (
    <div className="bgf mr16 mt16 search-list">
      <div style={{backgroundColor: color}} className="list-height">{title}</div>
      {
        data.length ? null : (
          <NoData 
            text="暂无数据" 
            size="small"
          />
        )
      }
      {
        data.map(item => {
          return (
            <div className="dfsa item-content">
              {/* <div style={{lineHeight: '36px'}}>头像</div> */}
              <div 
                className="FBH w100 FBJA ml8" 
                // onClick={() => window.location.href = `${window.__keeper.pathHrefPrefix}/portrait/${item.ident}/${id}`}
              >
                {/* <div>{`${item.客户姓名} ${item.type}`}</div> */}
                {/* <div>{item.客户姓名}</div> */}
                <Link className="w33" target="_blank" to={`/portrait/${item.ident}/${id}`}>{`${item.客户姓名}`}</Link>
                <div className="c65 w33">{item.手机号}</div>
                <div className="c65 w33">{item.recentTime}</div>
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
