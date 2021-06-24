import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {NoData} from '../component'

const SearchList = ({data = [], title, color, id}) => {
  const [domList, setDomList] = useState(data)

  const setList = () => {
    let listData = []
    listData = data.map(item => {
      const keyList = []
      const valueList = []
      const domItem = []

      /* eslint-disable no-restricted-syntax */
      for (const key in item) {
        if (key !== 'ident') {
          keyList.push(key)
          valueList.push(item[key])
        }
      }

      valueList.forEach((sitem, index) => {
        if (index > 0) {
          domItem.push(
            <div className="c65 w33">{sitem}</div>
          )
        } else {
          domItem.push(
            <Link className="w33" target="_blank" to={`/portrait/${item.ident}/${id}`}>{`${sitem}`}</Link>
          )
        }
      })

      return domItem
    })

    setDomList(listData)
  }

  useEffect(() => {
    setList()
  }, [data])
  console.log(domList)
  return (
    <div className="bgf mr16 mt16 search-list">
      <div style={{backgroundColor: color}} className="list-height">{title}</div>
      {
        domList.length ? null : (
          <NoData 
            text="暂无数据" 
          />
        )
      }
      {
        domList.map(item => (
          <div className="dfsa item-content">
            <div 
              className="FBH w100 FBJA ml8" 
            >
              {Array.isArray(item) ? item : null}
            </div>
          </div>
        ))
      }
    </div>
  )
}
export default SearchList
