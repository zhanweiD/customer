import {useEffect, useState} from 'react'
import {Input, Steps, Button, message} from 'antd'
import {PlusOutlined, CheckCircleFilled} from '@ant-design/icons'
import {DetailHeader, Tag} from '../../component'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'

const {Step} = Steps

export default () => {
  const [itemCount, setItemCount] = useState(1)
  const [current, setCurrent] = useState(0)
  const baseInfo = [
    {
      title: '实体',
      value: '测试',
    },
    {
      title: '群体类型',
      value: '实时群体',
    },
    {
      title: '创建方式',
      value: 'ID集合创建',
    },
    {
      title: '创建人',
      value: '111',
    },
  ]
  // 0 未生效、1 已生效、2 已暂停 、3 已结束
  const tagMap = {
    0: <Tag status="default" text="未生效" />,
    1: <Tag status="green" text="已生效" />,
    2: <Tag status="orange" text="暂停" />,
    3: <Tag status="blue" text="已结束" />,
  }

  const nextStep = () => {
    setCurrent(current + 1)
  }

  const prevStep = () => {
    setCurrent(current - 1)
  }

  const setLeftItem = () => {
    const itemList = []
    for (let i = 0; i < itemCount; i++) {
      itemList.push((
        <div className="left-item-select mb16" style={{minHeight: 72}}>
          <div className="left-item-header-select pl16 pt8 pb8 fs14">{`策略${i + 1}`}</div>
          <div className="mt8 mb8 ml16 mr16 c45">配置受众用户、触达条件及触达渠道</div>
        </div>
      ))
    }
    return itemList
  } 
  return (
    <div className="create-sales">
      <DetailHeader
        name="测试"
        descr="描述"
        // btnMinWidth={230}
        baseInfo={baseInfo}
        tag={tagMap[0]}
      />
      <div className="m16 create-content">
        <div className="content-left bgf mr16 p16">
          <div className="left-header mb12">策略配置</div>
          {setLeftItem()}
          <Button 
            type="dashed" 
            onClick={() => setItemCount(itemCount + 1)} 
            block 
            icon={<PlusOutlined />}
          >
            添加
          </Button>
        </div>
        
        <div className="content-right bgf">
          <div className="pt12 pb12 pl16 right-header">
            <Input style={{width: 160}} placeholder="请输入策略名称" />
          </div>
          <Steps style={{padding: '24px 60px'}} current={current}>
            <Step key={0} title="用户筛选" />
            <Step key={1} title="触发条件" />
            <Step key={2} title="触达设置" />
          </Steps>
          <div className="fac mt72" style={{display: current === 3 ? 'block' : 'none'}}>
            <CheckCircleFilled style={{color: '#52C41A', fontSize: 72}} />
            <div className="fs24 mt12 bold">完成策略配置</div>
          </div>
          <StepOne 
            nextStep={nextStep} 
            current={current} 
          />
          <StepTwo 
            nextStep={nextStep} 
            prevStep={prevStep}
            current={current}
          />
          <StepThree
            prevStep={prevStep}
            current={current}
            nextStep={nextStep}
          />
        </div>
      </div>
    </div>
  )
}
