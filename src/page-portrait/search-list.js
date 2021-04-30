/* eslint-disable no-restricted-syntax */
import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {NoData} from '../component'

const SearchList = ({data, title, color, id}) => {
  const [domList, setDomList] = useState(data)
  const setList = () => {
    const newData = data.map(item => {
      const values = []
      // eslint-disable-next-line no-restricted-syntax
      // eslint-disable-next-line guard-for-in
      for (const key in item) {
        const value = item[key]
        values.push(value)
      }
      item.name = values[0]
      return item
    })
    setDomList(newData)
  }
  useEffect(() => {
    setList()
  }, [data])
  return (
    <div className="bgf mr16 mt16 search-list">
      <div style={{backgroundColor: color}} className="list-height">{title}</div>
      {
        domList.length ? null : (
          <NoData 
            text="暂无数据" 
            size="small"
          />
        )
      }
      {
        domList.map(item => {
          return (
            <div className="dfsa item-content">
              <div 
                className="FBH w100 FBJA ml8" 
                // onClick={() => window.location.href = `${window.__keeper.pathHrefPrefix}/portrait/${item.ident}/${id}`}
              >
                <Link className="w33" target="_blank" to={`/portrait/${item.ident}/${id}`}>{`${item.name}`}</Link>
                <div className="c65 w33">{item.手机号}</div>
                <div className="c65 w33">{item.recentTime}</div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
export default SearchList
