import React, {Component} from 'react'
import {
  Layout, Menu, Modal, Dropdown, Input, Form, ConfigProvider, Affix, Spin,
} from 'antd'
import {action, toJS, observable} from 'mobx'
import {observer} from 'mobx-react'
import cls from 'classnames'

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
  DeploymentUnitOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import ico from '../icon/dtwave.ico'
import store from './store'
import {errorTip, codeInProduct} from '../common/util'
import defaultLightLogo from '../icon/default-light-logo.svg'

const {Header, Content, Sider} = Layout
const {SubMenu} = Menu

@observer
export default class Frame extends Component {
  formRef = React.createRef()

  @observable collapsed = false

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

  @action.bound changeFold = () => {
    this.collapsed = !this.collapsed
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

    // eslint-disable-next-line max-len
    const showAnalyze = codeInProduct('/analyze/clinch') || codeInProduct('/analyze/supply-demand') || codeInProduct('/analyze/purchase') || codeInProduct('/analyze/channel') || codeInProduct('/analyze/satisfaction')
    // eslint-disable-next-line max-len
    const showSystem = codeInProduct('/system/user-manage') || codeInProduct('/system/role-manage') || codeInProduct('/system/portrait') || codeInProduct('/system/business') || codeInProduct('/system/system-log')
    const showSales = codeInProduct('/sales/list') || codeInProduct('/channel-manage') || codeInProduct('/event-manage')
 
    return (
      <ConfigProvider locale={zhCN}>
        <div className="FBH h100 frame-main">
          <div className={cls({'frame-sider': true, FBV: true, 'frame-sider-fold': this.collapsed})}>
            <div
              className="sider-button FBH FBAC"
            >
              <div className="sider-fold FBH FBAV FBJC" onClick={this.changeFold}>
                {
                  this.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                }
              </div>
            </div>
            <div className="FB1 sider-box innerbox">
              <Menu 
                className="sider-menu"
                theme="dark" 
                defaultOpenKeys={[`/${menuName}`]} 
                defaultSelectedKeys={[pathName]} 
                openKeys={store.openKeys.length ? store.openKeys : [`/${menuName}`]}
                onOpenChange={this.onOpenChange}
                mode="inline"
                onClick={this.changeMenu}
                inlineCollapsed={this.collapsed}
                inlineIndent={8}
              >
                {
                  codeInProduct('/overview') && (
                    <Menu.Item key="/overview" icon={<HomeOutlined />}>
                      客户分析
                    </Menu.Item>
                  )
                }
                {
                  codeInProduct('/tag-market') && (
                    <Menu.Item key="/tag-market" icon={<TagsOutlined />}>
                      标签集市
                    </Menu.Item>
                  )
                }                  
                {
                  codeInProduct('/tag-manage') && (
                    <Menu.Item key="/tag-manage" icon={<TagOutlined />}>
                      标签维护
                    </Menu.Item>
                  )
                }
                {
                  codeInProduct('/tag-sync') && (
                    <Menu.Item key="/tag-sync" icon={<FileSyncOutlined />}>
                      标签同步
                    </Menu.Item>
                  )
                }
                {
                  codeInProduct('/group/manage') && (
                    <Menu.Item key="/group/manage" icon={<TeamOutlined />}>
                      客群管理
                    </Menu.Item>
                  )
                }
                {
                  codeInProduct('/portrait/:ident?/:id?/:isConsultant?') && (
                    <Menu.Item key="/portrait" icon={<UserOutlined />}>
                      客户画像
                    </Menu.Item>
                  )
                }
                {
                  showAnalyze && (
                    <SubMenu key="/analyze" icon={<PieChartOutlined />} title="场景洞察">
                      {
                        codeInProduct('/analyze/clinch') && (
                          <Menu.Item key="/analyze/clinch">成交分析</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/analyze/supply-demand') && (
                          <Menu.Item key="/analyze/supply-demand">供需分析</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/analyze/purchase') && (
                          <Menu.Item key="/analyze/purchase">复购挖掘</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/analyze/channel') && (
                          <Menu.Item key="/analyze/channel">渠道拓客</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/analyze/satisfaction') && (
                          <Menu.Item key="/analyze/satisfaction">满意度提升</Menu.Item>
                        )
                      }
                      {/* <Menu.Item key="/analyze/consultant">顾问分析</Menu.Item> */}
                    </SubMenu>
                  )
                }
                {
                  showSales && (
                    <SubMenu key="/sales" icon={<DeploymentUnitOutlined />} title="自动化营销">
                      {
                        codeInProduct('/sales/list') && (
                          <Menu.Item key="/sales/list">营销计划</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/channel-manage') && (
                          <Menu.Item key="/channel-manage">渠道管理</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/event-manage') && (
                          <Menu.Item key="/event-manage">事件管理</Menu.Item>
                        )
                      }
                    </SubMenu>
                  )
                }
                {
                  showSystem && (
                    <SubMenu key="/system" icon={<SettingOutlined />} title="系统管理">
                      {
                        codeInProduct('/system/user-manage') && (
                          <Menu.Item key="/system/user-manage">用户管理</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/system/role-manage') && (
                          <Menu.Item key="/system/role-manage">角色管理</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/system/portrait') && (
                          <Menu.Item key="/system/portrait">画像配置</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/system/business') && (
                          <Menu.Item key="/system/business">业务配置</Menu.Item>
                        )
                      }
                      {
                        codeInProduct('/system/system-log') && (
                          <Menu.Item key="/system/system-log">行为日志</Menu.Item>
                        )
                      }
                    </SubMenu>
                  )
                }
              </Menu>
            </div>
            
          </div>
          <div className="FBV FB1">
            <div className="frame-header FBH FBJB FBAC">
              <div className="FBH FBAC ml24">
                <img src={defaultLightLogo} alt="logo" width="36" height="28" />
                <div className="fcf fs18">慧营客</div>
              </div>
              <div className="mr24">
                <Dropdown overlay={userMenu}>
                  <div className="hand fcf">
                    <UserOutlined />
                    <span className="nickName">{userInfo.userName}</span>
                    <DownOutlined />
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="FB1" style={{overflowY: 'auto'}}>
              {
                getPerLoading ? children : (
                  <div className="w100 h100" style={{textAlign: 'center', marginTop: '40%'}}>
                    <Spin spinning />
                  </div>
                )
              }
              <Modal {...modalConfig}>
                <Form {...layout} ref={this.formRef}>
                  <Form.Item
                    label="密码"
                    name="password"
                  >
                    <Input.Password placeHolder="请输入密码" />
                  </Form.Item>
                </Form>
              </Modal>
            </div>  
          </div>
        </div>
      </ConfigProvider>
    )
  }
}
