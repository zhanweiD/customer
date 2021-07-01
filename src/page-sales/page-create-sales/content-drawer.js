/* eslint-disable camelcase */
import {useState} from 'react'
import {
  Drawer, Button, Radio, Modal, Input, message,
} from 'antd'
import {successTip} from '@util'
import io from './io'

export default ({
  drawerVisible,
  closeDrawer,
  thumbMediaList = [],
  selectMedia,
  setSelectMedia,
  accountCode,
}) => {
  const [media, setMedia] = useState(selectMedia) // 暂存选择
  const [wechatAccount, setWechatAccount] = useState(null) // 微信账号
  const [modalVisible, setModalVisible] = useState(false) // 预览modal
  const [previewId, setPreviewId] = useState() // 预览modal_id
  const onSelect = () => {
    setSelectMedia(media)
    closeDrawer()
  }
  const wechatPreview = async () => {
    if (!wechatAccount) return message.warning('请输入微信号')
    try {
      const res = await io.wechatPreview({
        accountCode,
        towxname: wechatAccount,
        mediaId: previewId,
      })
      successTip('发送成功，请注意查收')
      setModalVisible(false)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Drawer
      title="选择内容"
      width={525}
      className="content-drawer"
      visible={drawerVisible}
      onClose={closeDrawer}
      destroyOnClose
      maskClosable={false}
      footer={(
        <div className="far">
          <Button onClick={closeDrawer} style={{marginRight: 8}}>
            取消
          </Button>
          <Button onClick={onSelect} type="primary">
            保存
          </Button>
        </div>
      )}
    >
      {
        thumbMediaList.map(item => {
          const {content, media_id, update_time} = item
          const {news_item = []} = content
          const data = news_item[0] || {}
          return (
            <div>
              <Radio.Group onChange={v => setMedia({media_id, mediaData: data, update_time})} value={media.media_id}>
                <Radio value={media_id}>
                  <div className="FBH content-item">
                    <div>
                      {data.thumb_url ? <img className="mr12" height={88} width={156} src={data.thumb_url} alt="" /> : null}
                    </div>
                    <div style={{width: 300}}>
                      <div className="item-title">{data.title}</div>
                      <div className="c65 item-descr">{data.digest}</div>
                    </div>
                  </div>
                </Radio>
              </Radio.Group>
              <div className="FBH FBJB item-preview mb12">
                <div className="c65">{`消息编辑时间: ${moment(+update_time * 1000).format('YYYY-MM-DD HH:mm:ss')}`}</div>
                <a onClick={() => {
                  setModalVisible(true)
                  setPreviewId(media_id)
                }}
                >
                  预览
                </a>
              </div>
            </div>
          )
        })
      }
      {/* <div>
        <Button>上一页</Button>
        <Button type="primary">下一页</Button>
      </div> */}
      <Modal
        title="消息预览" 
        getContainer
        visible={modalVisible}
        onOk={wechatPreview} 
        onCancel={() => setModalVisible(false)}
        maskClosable={false}
      >
        <div className="mb24">
          <Input onChange={v => setWechatAccount(v.target.value)} style={{width: 300}} placeHolder="请输入接收微信号" />
        </div>
      </Modal>
    </Drawer>
  )
}
