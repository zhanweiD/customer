import {useEffect} from 'react'
import {toJS} from 'mobx'
import {inject} from 'mobx-react'
import {Empty} from 'antd'
import {useObserver} from 'mobx-react-lite'
import Strategy from './strategy'
import NoData from '../../component/no-data'

export default inject('store')(({store}) => {
  useEffect(() => {
    store.getStrategyList(store.id)
  }, [])

  return useObserver(() => (
    <div>
      {
        store.strategyList.length > 0 
          ? <Strategy list={toJS(store.strategyList)} />
          : <div style={{marginTop: '100px'}}><NoData text="暂无数据" /></div>
      }
    </div>
  ))
})
