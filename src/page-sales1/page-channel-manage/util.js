import {Badge} from 'antd'

export const setColumns = (editPermissions, setEnable, name, type = null) => {
  return ([
    {
      title: name,
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: type === '短信' ? '' : type,
      dataIndex: 'accountType',
      key: 'accountType',
    },
    {
      title: '创建人',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '更新时间',
      dataIndex: 'mtime',
      key: 'mtime',
    },
    {
      title: '账号状态',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      render: text => {
        if (text) {
          return <Badge color="green" text="授权成功" />
        }
        return <Badge color="default" text="授权失败" />
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enable',
      key: 'enable',
      render: text => (text ? '启用' : '暂停'),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => ([
        <a onClick={() => setEnable(record)}>{record.enable ? '暂停' : '启用'}</a>,
        type === '短信' ? <a className="ml16" onClick={() => editPermissions(record)}>重新授权</a> : null,
        // <a onClick={() => editPermissions(record)}>重新授权</a>,
      ]),
    },
  ])
}

export const test = () => {

}
