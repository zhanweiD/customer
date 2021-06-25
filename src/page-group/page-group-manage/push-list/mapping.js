import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {message} from 'antd'
import {ErrorEater} from '@dtwave/uikit'
import Mapping from '@dtwave/oner-mapping'
import {Loading} from '../../../component'

@observer
export default class DrawerMapping extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  value = []
  block = false
  id = ''

  componentDidMount() {
    this.store.loading = true
    this.getAllData()
  }

  getAllData = async () => {
    try {
      // await this.store.getResultData()
      await this.store.getFieldData()
      // await this.store.getTagData()

      this.value = this.store.result
      // this.store.resultValue = this.store.result

      this.store.loading = false
    } catch (error) {
      ErrorEater(
        error,
        'custom title',
        e => console.log(e),
      )
      
      this.store.loading = false
    }
  }

  @action changeValue = v => {
    this.store.changeList = v
  } 

  render() {
    const {
      source,
      target,
      result,
      loading,
    } = this.store
    return (
      <div className="tag-detail-drawer">
        {
          loading
            ? <Loading mode="block" height={200} /> 
            : (
              <Mapping
                style={{
                  display: 'inline-block',
                  width: '100%',
                  fontSize: '14px',
                }}
                source={source}
                target={target}
                sourceRowKey={record => record.tagId || record.id}
                targetRowKey={record => `${record.dataStorageId}${record.tableName}${record.fieldName}`}
                sourceSearchKey={record => record.tagName}
                targetSearchKey={record => record.fieldName}
                targetColumns={[
                  {
                    title: '字段名称',
                    dataIndex: 'fieldName',
                    width: 80,
                  },
                  {
                    title: '数据类型',
                    dataIndex: 'fieldNameType',
                    width: 80,
                  },
                  {
                    title: '数据表',
                    dataIndex: 'tableName',
                    width: 90,
                  },
                ]}
                sourceColumns={[
                  {
                    title: '标签标识',
                    dataIndex: 'tagEnName',
                    width: 90,
                  },
                  {
                    title: '标签名称',
                    dataIndex: 'tagName',
                    width: 90,
                  },
                  {
                    title: '数据类型',
                    dataIndex: 'tagType',
                    width: 100,
                  },
                ]}
                result={result}
                resultSourceColumns={[
                  {
                    title: '标签名称',
                    dataIndex: 'tagName',
                    width: 96,
                  },
                ]}
                resultTargetColumns={[
                  {
                    title: '字段标识',
                    dataIndex: 'fieldName',
                    width: 69,
                  },
                ]}
                resultSourceFullColumns={[
                  {
                    title: '标签英文名',
                    dataIndex: 'tagEnName',
                    width: 100,
                  },
                  {
                    title: '标签中文名',
                    dataIndex: 'tagName',
                    width: 80,
                  },
                  {
                    title: '数据类型',
                    dataIndex: 'tagType',
                    width: 80,
                  },
                ]}
                resultTargetFullColumns={[
                  {
                    title: '字段名称',
                    dataIndex: 'fieldName',
                    width: 60,
                  },
                  {
                    title: '字段类型',
                    dataIndex: 'fieldNameType',
                    width: 60,
                  },
                  {
                    title: '数据表',
                    dataIndex: 'tableName',
                    width: 130,
                  },
                ]}
                resultRowKey={record => record.tagId}
                mappingField={(
                  {
                    tagId,
                    tagName,
                    tagEnName,
                    tagType,
                    fieldName: tagFieldName,
                    matching: tagMatching,
                  },
                  {
                    tableName,
                    fieldName,
                    fieldNameType,
                    matching,
                  }
                ) => ({
                  tagId,
                  tagName,
                  tagEnName,
                  tableName,
                  fieldName,
                  tagFieldName,
                  fieldNameType,
                  tagType,
                  tagMatching,
                  matching,
                })}
                nameMappingField={['tagName', 'fieldName']}
                onChange={this.changeValue}
                sourceTitle="标签列表"
                targetTitle="字段列表"
                sourceTipTitle="字段："
                targetTipTitle="标签："
                sourceSearchPlaceholder="请输入名称搜索"
                targetSearchPlaceholder="请输入名称搜索"
                // sourceDisableKey={record => record.status === 2}
                // targetDisableKey={record => record.status === 2}
                // disableKey={record => record.isUsed === 1 || record.status === 2}
                // disableMsg={record => (record.status === 2 ? '标签已发布无法删除映射' : '使用中无法删除映射')}
                isShowMapping
                canMapping
                beforeMapping={v => {
                  const mappingItem = v[0]
                  if (mappingItem.tagMatching) {
                    if (mappingItem.tagMatching === mappingItem.matching || mappingItem.matching === 0) {
                      return new Promise(function (resolve, reject) {
                        resolve([])
                      })
                    } 
                    const mappingItemTagName = mappingItem.tagName
                    const mappingItemFieldName = mappingItem.fieldName
                    message.error({
                      content: `${mappingItemTagName}(标签)与${mappingItemFieldName}(字段)数据类型不匹配， 绑定失败`,
                      className: 'fs12',
                    })
                    return new Promise(function (resolve, reject) {
                      reject([])
                    })
                  }
                  if (mappingItem.tagMatching === mappingItem.matching) {
                    return new Promise(function (resolve, reject) {
                      resolve([])
                    })
                  }
                  const mappingItemTagName = mappingItem.tagName
                  const mappingItemFieldName = mappingItem.fieldName
                  message.error({
                    content: `${mappingItemTagName}(标签)与${mappingItemFieldName}(字段)数据类型不匹配， 绑定失败`,
                    className: 'fs12',
                  })
                  return new Promise(function (resolve, reject) {
                    reject([])
                  })
                }}
                // beforeNameMapping={v => {
                //   return new Promise(function (resolve, reject) {
                //     resolve()
                //   })
                // }}
              />
            )
        }
      </div>
    )
  }
}
