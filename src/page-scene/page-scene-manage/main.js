import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Spin, Modal, Button} from 'antd'
import {
  Tag, NoData, Authority, Card, DtGrid,
} from '../../component'
import {IconDel, IconEdit} from '../../icon-comp'

import ModalAdd from './modal'

import store from './store'

const {confirm} = Modal

@observer
class Scene extends Component {
  componentWillMount() {
    store.getList()
  }

  @action handleModalVisible(type, data = {}) {
    store.isEdit = !!type

    // store.getStorageType()

    if (type) {
      store.getDetail({
        occasionId: data.id,
      })
    }
    store.modalVisible = true
  }

  @action handleDel(id) {
    confirm({
      title: '确认删除 ？',
      content: '所属该场景的类目都会被删除，标签也会被移除',
      onOk: () => {
        store.delScene(id)
      },
      onCancel: () => {},
    })
  } 

  render() {
    const {loading, list = []} = store
    
    const noDataConfig = {
      btnText: '添加场景',
      text: '没有任何场景，去新建场景吧',
      onClick: () => this.handleModalVisible(),
      code: 'scene:add-scene',
      isCommon: false,
      noAuthText: '暂无数据',
      // myFunctionCodes: functionCodes,
      isLoading: loading,
    }

    return (
      <div className="scene-wrap oa">
        <div className="content-header">标签使用场景</div>
        <Spin spinning={loading}>
          <div className="scene-box mt72">
            {
              list.length ? (
                <Fragment>
                  <Authority authCode="scene:add-scene">
                    <Button
                      className="mb16"
                      type="primary"
                      onClick={() => this.handleModalVisible()}
                    >
                      添加场景
                    </Button>
                  </Authority>
                 
                  <DtGrid row={3} fixedHeight={192}>
                    {
                      list.map(({
                        id,
                        name,
                        cuser,
                        cdate,
                        used,
                        tagCount,
                        apiCount,
                        descr,
                      }, d) => (
                        <Card 
                          className="card"
                          title={name}
                          // eslint-disable-next-line no-underscore-dangle
                          link={`${window.__keeper.pathHrefPrefix}/scene/list/${id}`}
                          tag={[<Tag status={used ? 'process' : 'wait'} text={used ? '使用中' : '未使用'} className="mr8" />]}
                          labelList={[{
                            label: '创建者',
                            value: cuser,
                          }, {
                            label: '创建时间',
                            value: moment(+cdate).format('YYYY-MM-DD'),
                          }]}
                          descr={descr}
                          countList={[{
                            label: '标签数',
                            value: tagCount,
                          }, {
                            label: 'API数',
                            value: apiCount,
                          }]}
                          actions={[
                            <Authority authCode="scene:add-scene">
                              <Button
                                type="link" // antd@Button 属性
                                disabled={used}
                                className="p0"
                                onClick={() => this.handleModalVisible('edit', list[d])}
                              >
                                <IconEdit size="14" className={used ? 'i-used' : ''} />
                              </Button>
                              <Button
                                type="link" // antd@Button 属性
                                disabled={used}
                                className="p0"
                                onClick={() => this.handleDel(id)}
                              >
                                <IconDel size="14" className={used ? 'i-used' : ''} />
                              </Button>
                            </Authority>,                              
                          ]}
                        />
                      )) 
                    }
                  </DtGrid>
                </Fragment>
              ) : (
                <div className="header-page" style={{paddingTop: '15%', margin: 0}}>
                  <NoData
                    {...noDataConfig}
                    // style={{marginTop: '15%'}}
                  />
                </div>
              )
            }
            <ModalAdd store={store} />
          </div>
        </Spin>
      </div>
    )
  }
}

export default Scene
