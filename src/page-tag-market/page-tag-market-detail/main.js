/**
 * @description 对象管理
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {ConfigProvider, Spin} from 'antd'
import {NoData, authView} from '../../component'
import Tree from './tree'
import ObjectDetail from './detail'
 
import store from './store'
 
@observer
class TagMarketDetail extends Component {
  constructor(props) {
    super(props)
    console.log(props)
 
    const {match: {params: {id}}} = props
 
    store.selectedKey = +id
    store.getObjDetailNew(id)
    store.getTreeData()
  }
   // @action changeTab = code => {
   //   store.typeCode = code
   //   store.objId = undefined
   //   store.tabId = '0'
   // }
   @action addObject = () => {
     store.addObjectUpdateKey = Math.random()
   }
 
   render() {
     const {
       objId, 
       updateDetailKey,
     } = store
     const noDataConfig = {
       text: '没有任何对象，请在当前页面新建对象！',
     }

     //  return (
     //    <div className="oa FBV">
     //       {/* <Tree store={store} /> */}
     //       <Spin spinning={store.isSpinning}>
     //         <ObjectDetail 
     //           updateDetailKey={updateDetailKey} 
     //           objId={objId} 
     //           store={store}
     //         /> 
     //       </Spin>
                       
     //     </div>
     //  )

     return (
       <ConfigProvider>
         <Provider store={store}>
           <div className="oa FBV">
             {/* <Tree store={store} /> */}
             <ObjectDetail 
               updateDetailKey={updateDetailKey} 
               objId={objId} 
               store={store}
             />              
           </div>
         </Provider>
       </ConfigProvider>
     )
   }
}
export default authView(TagMarketDetail)
