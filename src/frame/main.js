import React, {Component} from 'react'
import {Layout, Menu, Modal, Dropdown, Input, Form, ConfigProvider, Affix} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import zhCN from 'antd/lib/locale/zh_CN'
import {
  DownOutlined,
  PieChartOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  TagsOutlined,
  DeploymentUnitOutlined,
  FileSyncOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import ico from '../icon/dtwave.ico'
import store from './store'
import {errorTip, codeInProduct} from '../common/util'

const {Header, Content, Sider} = Layout
const {SubMenu} = Menu

@observer
export default class Frame extends Component {
  constructor(props) {
    super(props)
    
    const pathList = props.location.pathname.split('/')
    store.pathName = `/${pathList[1]}/${pathList[2]}`
  }

  componentDidMount() {
    store.getUserInfo()
    store.getParams()
    store.getProject()

    // 设置页面的ico图标
    // const tenantImageVO = res.tenantImageVO || {}
    const finalIco = ico
    const icoNode = document.createElement('link')
    icoNode.setAttribute('rel', 'shortcut icon')
    icoNode.setAttribute('type', 'image/x-icon')
    icoNode.setAttribute('href', finalIco)
    document.head.appendChild(icoNode)
  }

  formRef = React.createRef()

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
    if (!store.getPerLoad || !localStorage.getItem('token')) return null

    const {children} = this.props
    const {collapsed, pathName, visible, confirmLoading, userInfo} = store
    const menuName = pathName.split('/')[1]

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

    // eslint-disable-next-line max-len
    const showAnalyze = codeInProduct('analyze:channel:view') || codeInProduct('analyze:chinch:view') || codeInProduct('analyze:consultant:view') || codeInProduct('analyze:supply-demand:view') || codeInProduct('analyze:purchase:view') || codeInProduct('analyze:satisfaction:view') || codeInProduct('analyze:group:view')
    // eslint-disable-next-line max-len
    const showSystem = codeInProduct('system:user-manage:view') || codeInProduct('system:role-manage:view') || codeInProduct('system:system-log:view') || codeInProduct('system:push-manage:view') || codeInProduct('system:portrait:view')
    return (
      <ConfigProvider locale={zhCN} componentSize="small">
        <Layout style={{minHeight: '100vh'}}>
          <Header className="site-layout-background" style={{padding: 0}}>
            <div className="frame_header">
              <div className="left">
                {/* <img src="//cdn.dtwave.com/land-customer-center/source/junfa/junfa_logo.svg" alt="logo" width="138" height="17" /> */}
                logo
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
            {/* <Affix> */}
            <Sider style={{minHeight: 'calc(100vh - 48px)', overflow: 'auto'}} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
              {/* <div className="logo" /> */}
              <Menu 
                theme="dark" 
                defaultOpenKeys={[`/${menuName}`]} 
                defaultSelectedKeys={[pathName]} 
                openKeys={store.openKeys.length ? store.openKeys : [`/${menuName}`]}
                onOpenChange={this.onOpenChange}
                mode="inline"
                onClick={this.changeMenu}
              >
                {
                  codeInProduct('tag-manage:view') && (
                    <Menu.Item key="/tag/manage" icon={<TagsOutlined />}>
                      标签管理
                    </Menu.Item>
                  )
                }
                {/* {
                  codeInProduct('tag-model:view') && (
                    <Menu.Item key="/tag/sync" icon={<FileSyncOutlined />}>
                      标签同步
                    </Menu.Item>
                  )
                }
                {
                  codeInProduct('tag-app:view') && (
                    <Menu.Item key="/tag/app" icon={<DeploymentUnitOutlined />}>
                      标签应用
                    </Menu.Item>
                  )
                } */}
                {
                  codeInProduct('group-manage:view') && (
                    <Menu.Item key="/overview/customer" icon={<TeamOutlined />}>
                      客户中心
                    </Menu.Item>
                  )
                }
                {
                  codeInProduct('portrait:view') && (
                    <Menu.Item key="/customer/portrait" icon={<UserOutlined />}>
                      客户画像
                    </Menu.Item>
                  )
                }
                {
                  codeInProduct('group-manage:view') && (
                    <Menu.Item key="/group/manage" icon={<TeamOutlined />}>
                      客群管理
                    </Menu.Item>
                  )
                }
                {
                  codeInProduct('group-manage:view') && (
                    <Menu.Item key="/tag/market" icon={<TeamOutlined />}>
                      标签集市
                    </Menu.Item>
                  )
                }
                {/* {
                  showAnalyze && (
                    <SubMenu key="/analyze" icon={<PieChartOutlined />} title="场景洞察">
                      {
                        codeInProduct('analyze:chinch:view') && (
                          <Menu.Item key="/analyze/clinch">成交分析</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('analyze:consultant:view') && (
                          <Menu.Item key="/analyze/consultant">顾问分析</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('analyze:supply-demand:view') && (
                          <Menu.Item key="/analyze/supply-demand">供需分析</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('analyze:purchase:view') && (
                          <Menu.Item key="/analyze/purchase">复购挖掘</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('analyze:channel:view') && (
                          <Menu.Item key="/analyze/channel">渠道拓客</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('analyze:satisfaction:view') && (
                          <Menu.Item key="/analyze/satisfaction">满意度提升</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('analyze:group-portrait:view') && (
                          <Menu.Item key="/analyze/group">群体画像</Menu.Item>
                        )
                      }
                    </SubMenu>
                  )
                } */}
                {/* {
                  codeInProduct('scene:view') && (
                    <Menu.Item key="/scene/list" icon={<AppstoreOutlined />}>
                      场景管理
                    </Menu.Item>
                  )
                } */}
                {
                  showSystem && (
                    <SubMenu key="/system" icon={<SettingOutlined />} title="系统管理">
                      {
                        codeInProduct('system:user-manage:view') && (
                          <Menu.Item key="/system/user-manage">用户管理</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('system:role-manage:view') && (
                          <Menu.Item key="/system/role-manage">角色管理</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('system:system-log:view') && (
                          <Menu.Item key="/system/system-log">系统日志</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('system:portrait:view') && (
                          <Menu.Item key="/system/portrait">画像配置</Menu.Item>
                        )
                      }
                    </SubMenu>
                  )
                }
              </Menu>
            </Sider>
            {/* </Affix> */}
            <Content>
              {children}
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
