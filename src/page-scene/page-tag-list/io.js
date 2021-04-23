import ioContext from '../../common/io-context'
import {sceneApi, post} from '../../common/util'

const api = {
  getList: post(`${sceneApi}/tagList`), // 标签列表
  getObjList: post(`${sceneApi}/objs`), // 对象下拉
}

ioContext.create('sceneTags', api)

export default ioContext.api.sceneTags
