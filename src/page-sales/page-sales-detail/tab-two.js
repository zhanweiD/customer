import {useEffect} from 'react'
import {toJS} from 'mobx'
import {inject} from 'mobx-react'
import {Empty, Spin} from 'antd'
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
        store.isStrategyDone ? (
          <div>
            {
              store.strategyList.length > 0 
                ? <Strategy list={toJS(store.strategyList)} />
                : <div style={{marginTop: '100px'}}><NoData text="暂无数据" /></div>
            }
          </div>
        ) : (
          <div style={{width: '100%', textAlign: 'center', marginTop: '100px'}}>
            <Spin />
          </div>
        )
      }
    </div>
  ))
})
