import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import io from './io'
import {ListContentStore} from '../../component/list-content'

// eslint-disable-next-line new-cap
class Store extends ListContentStore(io.getList) {
  @observable tableLoading = true
  @observable selectedKeys = []
  @observable publishRowKeys = []
  @observable entityList = []
  @observable nodata = '没有数据'
  @observable reqData = {}
}
export default new Store()
