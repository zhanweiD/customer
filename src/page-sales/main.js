import {Button} from 'antd'
import {
  Tag, Search, Authority, Card, DtGrid,
} from '../component'
import {IconDel, IconEdit} from '../icon-comp'

export default () => {
  const list = [
    {
      id: 1,
      name: '测试',
      cuser: '永久',
      cdate: '2021-5-20',
      used: 1,
      tagCount: 11,
      apiCount: 11,
      descr: '1111',
    },
  ]
  const searchParams = [
    {
      label: '计划类型',
      key: 'planType',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
        ],
      },
      component: 'select',
    }, 
    {
      label: '创建人',
      key: 'cuser',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
        ],
      },
      component: 'select',
    }, 
    {
      label: '最近状态',
      key: 'status',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
        ],
      },
      component: 'select',
    },
    {
      label: '触达渠道',
      key: 'cuserAccount',
      initialValue: '',
      control: {
        defaultAll: true,
        options: [
          {name: '全部', value: ''},
        ],
      },
      component: 'select',
    },
    {
      label: '计划名称',
      key: 'keyword',
      control: {
        placeholder: '请输入计划名称',
      },
      component: 'input',
    },
  ]
  return (
    <div className="p16 m16 bgf" style={{height: 'calc(100vh - 80px)'}}>
      <div>
        <Search
          onReset={() => console.log('重置')}
          onSearch={v => console.log(v)}
          params={searchParams}
        />
      </div>
      <Button
        className="mb16"
        type="primary"
      >
        创建计划
      </Button>
      <div>
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
                // link={`${window.__keeper.pathHrefPrefix}/scene/${id}/${store.projectId}`}
                tag={[<Tag status={used ? 'process' : 'wait'} text={used ? '使用中' : '未使用'} className="mr8" />]}
                labelList={[{
                  label: '有效期',
                  value: cdate,
                }]}
                descr={descr}
                countList={[{
                  label: '计划触达',
                  value: tagCount,
                }, {
                  label: '完成率',
                  value: apiCount,
                }]}
                actions={[
                  <Button
                    type="link" // antd@Button 属性
                    disabled={used}
                    className="p0"
                  // onClick={() => this.handleModalVisible('edit', list[d])}
                  >
                    <IconEdit size="14" className={used ? 'i-used' : ''} />
                  </Button>,
                  <Button
                    type="link" // antd@Button 属性
                    disabled={used}
                    className="p0"
                  // onClick={() => this.handleDel(id)}
                  >
                    <IconDel size="14" className={used ? 'i-used' : ''} />
                  </Button>,
                ]}
              />
            )) 
          }
        </DtGrid>
      </div>
    </div>
  )
}
