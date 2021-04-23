import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {
  Spin, Alert,
} from 'antd'

import {Time} from '../../common/util'
import {Tag, DetailHeader, TabRoute} from '../../component'
import ModalEditScene from '../page-scene-manage/modal'

import SelectTag from './select-tag'

import store from './store-scene-detail'

@observer
class SceneDetail extends Component {
  constructor(props) {
    super(props)

    // store.projectId = props.projectId
    const {match: {params}} = props
    store.sceneId = +params.sceneId
  }

  componentWillMount() {
    store.getDetail()
  }

  @action.bound sceneDetailVisible() {
    store.isEdit = true
    store.modalVisible = true
  }

  // @action.bound onTabChange(e) {
  //   store.currentKey = e
  // }

  componentWillUnmount() {
    store.info = {}
  }

  render() {
    const info = toJS(store.info)
    const {
      storageType,
      dataStorageName,
      cuser,
      cdate,
      descr,
      used,
      name,
    } = info

    // 详情信息
    const baseInfo = [{
      title: '创建者',
      value: cuser,
    }, 
    {
      title: '数据源类型',
      value: storageType,
    },
    {
      title: '数据源',
      value: dataStorageName,
    },
    {
      title: '创建时间',
      value: <Time timestamp={cdate} />,
    },
    ]


    // 不同状态的相应map
    const tagMap = {
      0: <Tag status="wait" text="未使用" />,
      1: <Tag status="success" text="使用中" />,
    }

    const actions = [
      // <Button>
      //   <a target="_blank" href={`${window.__keeper.pathHrefPrefix}/scene/${store.sceneId}/tags/${store.projectId}`}>标签列表</a>
      // </Button>,
      // <Authority
      //   authCode="tag_app:config_data_service[c]"
      // >
      //   <Button type="primary" className="ml8">
      //     <a target="_blank" rel="noopener noreferrer" href="/data/index.html#/api-development">数据服务</a>
      //   </Button>
      // </Authority>,
    ]

    const tabConfig = {
      tabs: [{name: '标签选择', value: 1}],
      changeUrl: false,
    }

    return (
      <div className="scene-detail">    
        {
          used ? (
            <Alert
              showIcon
              closable
              type="warning"
              className="fs12"
              message="场景使用中，无法在场景中继续选择或移除对象，添加、编辑或删除类目，选择或移除标签，只能查看类目与标签详情。"
            />
          ) : null
        }

        <Spin spinning={store.loading}>
          <DetailHeader
            name={name}
            descr={descr}
            btnMinWidth={230}
            baseInfo={baseInfo}
            tag={tagMap[used]}
            actions={actions}
          />
        </Spin>
        <div>
          <TabRoute {...tabConfig} />
          <SelectTag
            sceneId={store.sceneId}
            projectId={store.projectId}
            sceneDetailStore={store}
          />
          <ModalEditScene store={store} />
        </div>     
      </div>
    )
  }
}

export default props => {
  // const ctx = OnerFrame.useFrame()

  // useEffect(() => {
  //   ctx.useProject(true, null, {visible: false})
  // }, [])

  return (
    <SceneDetail {...props} />
  )
}
