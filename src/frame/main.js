import React, {Component} from 'react'
import {
  Layout, Menu, Modal, Dropdown, Input, Form, ConfigProvider, Affix, Spin,
} from 'antd'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'

import zhCN from 'antd/lib/locale/zh_CN'
import {
  DownOutlined,
  PieChartOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  TagsOutlined,
  HomeOutlined,
  FileSyncOutlined,
  TagOutlined,
} from '@ant-design/icons'
import ico from '../icon/dtwave.ico'
import store from './store'
import {errorTip} from '../common/util'
import defaultLightLogo from '../icon/default-light-logo.svg'

const {Header, Content, Sider} = Layout
const {SubMenu} = Menu

@observer
export default class Frame extends Component {
  formRef = React.createRef()
  constructor(props) {
    super(props)
    
    store.pathName = props.location.pathname
    store.menuName = store.pathName.split('/')[1]
  }

  componentDidMount() {
    store.getUserInfo()
    // 设置页面的ico图标
    // const tenantImageVO = res.tenantImageVO || {}
    const finalIco = ico
    const icoNode = document.createElement('link')
    icoNode.setAttribute('rel', 'shortcut icon')
    icoNode.setAttribute('type', 'image/x-icon')
    icoNode.setAttribute('href', finalIco)
    document.head.appendChild(icoNode)

    this.setTitle()
  }

  // 设置窗口title
  setTitle = () => {
    let title = '客户中心'
    switch (store.menuName) {
      case 'overview':
        title = '客户中心'
        break
      case 'tag-market':
        title = '标签集市'
        break
      case 'tag-manage':
        title = '标签维护'
        break
      case 'tag-sync':
        title = '标签同步'
        break
      case 'group':
        title = '客群管理'
        break
      case 'portrait':
        title = '客户画像'
        break
      case 'analyze':
        title = '场景管理'
        break
      case 'system':
        title = '系统管理'
        break
      default:
        title = '客户中心'
        break
    }
    document.title = title
  }

  onCollapse = collapsed => {
    store.collapsed = collapsed
  }

  changeMenu = v => {
    window.location.href = `${window.__keeper.pathHrefPrefix}${v.key}`
  }

  @action openModal = () => {
    store.visible = true
  }

  @action closeModal = () => {
    store.visible = false
  }

  // 修改密码
  @action submit = () => {
    this.formRef.current.validateFields().then(value => {
      store.modifyPwd(value)
    }).catch(err => {
      errorTip(err)
    })
  }
  
  @action onOpenChange = keys => {
    // 只允许一个展开
    const newKey = keys.pop()
    store.openKeys = newKey ? [newKey] : []
  }

  render() {
    // !localStorage.getItem('token')
    const {children} = this.props
    const {
      collapsed, pathName, visible, confirmLoading, userInfo, getPerLoading, menuName,
    } = store

    const layout = {
      labelCol: {span: 2},
      wrapperCol: {span: 22},
      maskClosable: false,
    }

    const modalConfig = {
      width: 525,
      title: '修改密码',
      visible,
      confirmLoading,
      maskClosable: false,
      okText: '确定',
      cancelText: '取消',
      onCancel: () => this.closeModal(),
      onOk: this.submit,
    }

    const userMenu = (
      <Menu>
        <Menu.Item>
          <a className="fs12" onClick={this.openModal}>
            修改密码
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            className="fs12"
            onClick={() => {
              store.goLogout(() => {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                localStorage.removeItem('userAccount')
              })
            }}
          >
            退出
          </a>
        </Menu.Item>
      </Menu>
    )

    return (
      <ConfigProvider locale={zhCN} componentSize="small">
        <Layout style={{minHeight: '100vh'}}>
          <Header className="site-layout-background w100" style={{padding: 0, position: 'fixed', zIndex: 100}}>
            <div className="frame_header">
              <div className="left">
                <img src={defaultLightLogo} alt="logo" width="36" height="28" />
                澜客
              </div>
              <Dropdown overlay={userMenu}>
                <div className="right hand">
                  <UserOutlined />
                  <span className="nickName">{userInfo.userName}</span>
                  <DownOutlined />
                </div>
              </Dropdown>
            </div>
          </Header>
          <Layout>
            <Affix>
              <Sider 
                className="innerbox"
                style={{
                  minHeight: 'calc(100vh - 96px)', 
                  overflow: 'auto', 
                  left: 0, 
                  top: '48px',
                  height: 'calc(100vh - 96px)',
                }} 
                collapsible 
                collapsed={collapsed} 
                onCollapse={this.onCollapse}
              >
                <Menu 
                  theme="dark" 
                  defaultOpenKeys={[`/${menuName}`]} 
                  defaultSelectedKeys={[pathName]} 
                  openKeys={store.openKeys.length ? store.openKeys : [`/${menuName}`]}
                  onOpenChange={this.onOpenChange}
                  mode="inline"
                  onClick={this.changeMenu}
                >
                  <Menu.Item key="/overview" icon={<HomeOutlined />}>
                    客户中心
                  </Menu.Item>
                  <Menu.Item key="/tag-market" icon={<TagsOutlined />}>
                    标签集市
                  </Menu.Item>
                  <Menu.Item key="/tag-manage" icon={<TagOutlined />}>
                    标签维护
                  </Menu.Item>
                  <Menu.Item key="/tag-sync" icon={<FileSyncOutlined />}>
                    标签同步
                  </Menu.Item>
                  <Menu.Item key="/group/manage" icon={<TeamOutlined />}>
                    客群管理
                  </Menu.Item>
                  <Menu.Item key="/portrait" icon={<UserOutlined />}>
                    客户画像
                  </Menu.Item>
                  <SubMenu key="/analyze" icon={<PieChartOutlined />} title="场景洞察">
                    <Menu.Item key="/analyze/clinch">成交分析</Menu.Item>
                    {/* <Menu.Item key="/analyze/consultant">顾问分析</Menu.Item> */}
                    <Menu.Item key="/analyze/supply-demand">供需分析</Menu.Item>
                    <Menu.Item key="/analyze/purchase">复购挖掘</Menu.Item>
                    <Menu.Item key="/analyze/channel">渠道拓客</Menu.Item>
                    <Menu.Item key="/analyze/satisfaction">满意度提升</Menu.Item>
                        
                  </SubMenu>
                  <SubMenu key="/system" icon={<SettingOutlined />} title="系统管理">
                    <Menu.Item key="/system/user-manage">用户管理</Menu.Item>
                    <Menu.Item key="/system/role-manage">角色管理</Menu.Item>
                    <Menu.Item key="/system/portrait">画像配置</Menu.Item>
                    <Menu.Item key="/system/business">业务配置</Menu.Item>
                    <Menu.Item key="/system/system-log">行为日志</Menu.Item>
                  </SubMenu>
                </Menu>
              </Sider>
            </Affix>
            <Content style={{overflow: 'initial', marginTop: '48px'}}>
              {
                getPerLoading ? children : (
                  <div style={{height: 'calc(100vh - 48px)'}} className="FBJC dfac">
                    <Spin spinning />
                  </div>
                )
              }
            </Content>
          </Layout>
          <Modal {...modalConfig}>
            <Form {...layout} ref={this.formRef}>
              <Form.Item
                label="密码"
                name="password"
              >
                <Input.Password size="small" placeHolder="请输入密码" />
              </Form.Item>
            </Form>
          </Modal>
        </Layout>
      </ConfigProvider>
    )
  }
}
