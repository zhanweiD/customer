import {Component} from 'react'
import {action, toJS} from 'mobx'
import {inject, observer} from 'mobx-react'
import {Table} from 'antd'

const colors = ['#1a98f3', '#59b7fb', '#a9d8fa', '#f3f4f9']

@observer
export default class List extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentDidMount() {
    // this.store.getTgiList()
  }
  
  columns = [
    {
      key: 'name',
      title: '',
      dataIndex: 'name',
      render: (record, index, i) => {
        return <div style={{color: i > 2 ? 'rgba(0,0,0,.65)' : '#fff', backgroundColor: colors[i > 3 ? 3 : i]}} className="tableBox">{i + 1}</div> 
      },
    }, {
      key: 'tag',
      title: '标签',
      dataIndex: 'tag',
    }, {
      key: 'tagValue',
      title: '标签属性',
      dataIndex: 'tagValue',
    }, {
      key: 'count',
      title: '标签用户数',
      dataIndex: 'count',
    }, 
  ]
 
  // 选中字段
  @action selectField = record => {
    console.log(record)
    this.store.getChart(record.tag)
  } 

  render() {
    const {
      tgiLoading,
      listDate,
    } = this.store
    
    return (
      <div className="list-content mt8" style={{width: '30%'}}>
        <Table
          columns={this.columns}
          dataSource={listDate}
          loading={tgiLoading}
          pagination={false}
          onRow={record => ({
            onClick: () => this.selectField(record),
          })}
        />
      </div>
    )
  }
}
