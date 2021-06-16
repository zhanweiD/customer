import {useEffect} from 'react'
import {toJS} from 'mobx'
import {inject} from 'mobx-react'
import {useObserver} from 'mobx-react-lite'
import Strategy from './strategy'

export default inject('store')(({store}) => {
  useEffect(() => {
    store.getStrategyList(store.id)
  }, [])

  return useObserver(() => (
    <div>
      <Strategy list={toJS(store.strategyList)} />
    </div>
  ))
})
