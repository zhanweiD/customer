import {Component} from 'react'
import {toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Drawer, Button, Tabs, message} from 'antd'
import {ErrorEater} from '@dtwave/uikit'
import Mapping from '@dtwave/oner-mapping'
import {Loading} from '../../../../component'

import Store from './store'
import {errorTip} from '../../../../common/util'

const {TabPane} = Tabs

@observer
export default class DrawerTagConfig extends Component {
  value = []
  state = {
    submitting: false,
  }

  block = false
  id = ''

  onClose = () => {
    const {onClose} = this.props
    onClose()
  }

  componentWillMount() {
    const {objId, visible} = this.props
    this.treeStore = this.props.treeStore
    this.store = new Store({
      objId,
    })
    this.visible = visible
    
    this.getAllData()
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.info !== this.props.info)) {
      this.store.tagIds = [+this.props.info.id]
      this.getAllData()
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const {
  //     // info,
  //     visible,
  //   } = this.props

  //   if (!_.isEqual(visible !== nextProps.visible) && nextProps.visible) {
  //     this.store.objId = nextProps.info.objId
  //     this.store.tagIds = [+nextProps.info.id]
  //     this.store.configType = nextProps.info.configType

  //     this.setState({
  //       loading: true,
  //     })
  //     this.getAllData()
  //   }
  // }

  getAllData = async () => {
    this.setState({
      loading: true,
    })
    try {
      await this.store.getResultData()
      await this.store.getFieldData()
      await this.store.getTagData()

      this.value = this.store.result

      this.setState({
        loading: false,
      })
    } catch (error) {
      this.setState({
        loading: false,
      })
      errorTip(error.message)
    }
  }

  submit = () => {
    if (this.block) {
      return
    }

    this.block = true

    this.setState({
      submitting: true,
    }, () => {
      this.store.saveResult(this.value, this.treeStore.getList).then(() => {
        this.setState({
          submitting: false,
        })
        setTimeout(() => {
          this.block = false
          const {
            onUpdate,
          } = this.props
          if (onUpdate) {
            onUpdate()
          }
        }, 200)
      })
    })
  }

  render() {
    const {
      visible,
      type,
    } = this.props

    const {
      loading,
      submitting,
    } = this.state

    const {
      source,
      target,
      result,
    } = this.store

    return (
      <div className="tag-detail-drawer">
        <Drawer
          title="????????????"
          placement="right"
          closable
          onClose={this.onClose}
          visible={visible}
          width={1120}
          maskClosable={false}
          destroyOnClose
        >
          {
            type === 'more' ? (
              <Tabs onChange={null} type="card">  
                <TabPane tab="??????????????????" key="1" />
                <TabPane tab="??????????????????" key="2" />
              </Tabs>
            ) : null
          }
         
          {
            loading
              ? <Loading mode="block" height={200} /> 
              : (
                <Mapping
                  style={{
                    display: 'inline-block',
                    width: '100%',
                  }}
                  source={source}
                  target={target}
                  sourceRowKey={record => record.tagId || record.id}
                  targetRowKey={record => `${record.dataStorageId}${record.dataTableName}${record.dataFieldName}`}
                  sourceSearchKey={record => record.name || record.tagName}
                  targetSearchKey={record => record.dataFieldName}
                  targetColumns={[
                    {
                      title: '????????????',
                      dataIndex: 'dataFieldName',
                      width: 80,
                    },
                    {
                      title: '????????????',
                      dataIndex: 'dataFieldType',
                      width: 80,
                    },
                    {
                      title: '?????????',
                      dataIndex: 'dataTableName',
                      width: 90,
                    },
                  ]}
                  sourceColumns={[
                    {
                      title: '????????????',
                      dataIndex: 'enName',
                      width: 90,
                    },
                    {
                      title: '????????????',
                      dataIndex: 'name',
                      width: 90,
                    },
                    {
                      title: '????????????',
                      dataIndex: 'valueTypeName',
                      width: 100,
                    },
                  ]}
                  result={result}
                  resultSourceColumns={[
                    {
                      title: '????????????',
                      dataIndex: 'tagName',
                      width: 96,
                    },
                  ]}
                  resultTargetColumns={[
                    {
                      title: '????????????',
                      dataIndex: 'dataFieldName',
                      width: 69,
                    },
                  ]}
                  resultSourceFullColumns={[
                    {
                      title: '???????????????',
                      dataIndex: 'tagEnName',
                      width: 100,
                    },
                    {
                      title: '???????????????',
                      dataIndex: 'tagName',
                      width: 80,
                    },
                    {
                      title: '????????????',
                      dataIndex: 'tagValueTypeName',
                      width: 80,
                    },
                  ]}
                  resultTargetFullColumns={[
                    {
                      title: '????????????',
                      dataIndex: 'dataFieldName',
                      width: 60,
                    },
                    {
                      title: '????????????',
                      dataIndex: 'dataFieldType',
                      width: 60,
                    },
                    {
                      title: '?????????',
                      dataIndex: 'dataTableName',
                      width: 130,
                    },
                  ]}
                  resultRowKey={record => record.tagId}
                  mappingField={(
                    {
                      id: tagId,
                      name: tagName,
                      enName: tagEnName,
                      valueType: tagValueType,
                      valueTypeName: tagValueTypeName,
                    },
                    {
                      dataStorageId,
                      dataDbName,
                      dataDbType,
                      dataTableName,
                      dataFieldName,
                      isUsed,
                      schemeId,
                      dataFieldType,
                      tagType,
                    }
                  ) => ({
                    tagId,
                    tagName,
                    tagEnName,
                    tagValueType,
                    tagValueTypeName,
                    dataStorageId,
                    dataDbName,
                    dataDbType,
                    dataTableName,
                    dataFieldName,
                    dataFieldType,
                    isUsed,
                    tagType,
                    tagDerivativeSchemeId: schemeId,
                  })}
                  nameMappingField={['enName', 'dataFieldName']}
                  onChange={value => {
                    this.value = value
                    // this.store.result = value
                  }}
                  sourceTitle="????????????"
                  targetTitle="????????????"
                  sourceTipTitle="?????????"
                  targetTipTitle="?????????"
                  sourceSearchPlaceholder="?????????????????????"
                  targetSearchPlaceholder="?????????????????????"
                  sourceDisableKey={record => record.status === 2}
                  targetDisableKey={record => record.status === 2}
                  disableKey={record => record.isUsed === 1 || record.status === 2}
                  disableMsg={record => (record.status === 2 ? '?????????????????????????????????' : '???????????????????????????')}
                  // hasSearchSelect
                  // searchSelectList={configType === 1 ? schemeList : tableList}
                  // searchSelectPlaceholder={configType === 1 ? '?????????????????????' : '??????????????????'}
                  // searchSelectKey={configType === 1 ? 'schemeName' : 'dataTableName'}
                  isShowMapping
                  canMapping
                  beforeMapping={v => {
                    const mappingItem = v[0]
                    if (mappingItem.tagValueType !== mappingItem.tagType) {   
                      message.error(`${mappingItem.tagName}(??????)???${mappingItem.dataFieldName}(??????)???????????????????????? ????????????`)
                      return new Promise(function (resolve, reject) {
                        reject([])
                      })
                    } 
                    return new Promise(function (resolve, reject) {
                      resolve([])
                    })
                  }}
                  beforeNameMapping={v => {
                    const successResult = v.filter(d => (d.tagValueType === d.tagType) || d.status === 2 || d.isUsed)
                      
                    const errorResult = v.filter(d => (d.tagValueType !== d.tagType) && !d.isUsed && d.status !== 2)
                    message.info(`${successResult.length}????????????????????????${errorResult.length}?????????????????????`)
          
                    return new Promise(function (resolve, reject) {
                      resolve(successResult)
                    })
                  }}
                />
              )
              
          }
          {
            !loading
            && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e8e8e8',
                  padding: '10px 16px',
                  textAlign: 'right',
                  left: 0,
                  background: '#fff',
                }}
              >
                <Button onClick={this.onClose} className="mr8">??????</Button>
                <Button
                  type="primary"
                  onClick={this.submit}
                  loading={submitting}
                  style={{float: 'right'}}
                >
                  ??????
                </Button>
              </div>
            )
          }
        </Drawer>
      </div>
    )
  }
}
