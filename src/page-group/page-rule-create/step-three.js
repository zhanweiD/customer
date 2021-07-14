
import React, {Fragment} from 'react'
import {Form, Select, Input, Button, DatePicker} from 'antd'
import {CheckCircleOutlined, CheckCircleTwoTone} from '@ant-design/icons'
import {dataType} from '../../common/dict'


const StepThree = ({
  current, 
  type,
  objId,
  saveInfo, 
}) => {
  const onFinish = value => {
    const {scheduleType, scheduleExpression, isStart, rangePicker, outputTags} = value
    const params = {
      outputTags,
    }

    params.isStart = +params.scheduleType === 2 ? 1 : isStart

    // save(params)
  }

  console.log(saveInfo)
  return (
    <div className="step-three" style={{display: current === 2 ? 'block' : 'none'}}>
      <CheckCircleTwoTone twoToneColor="#52c41a" style={{fontSize: 72}} />
      <h1 className="fs28 mt24">保存成功</h1>
      <div className="save-info">
        <div className="fs14 h32 FBH">
          <div className="c85 far w50">客群名称：</div>
          <div className="c65 fal w50">{saveInfo.name}</div>
        </div>
        <div className="fs14 h32 FBH">
          <div className="c85 far w50">客群描述：</div>
          <div className="c65 fal w50">{saveInfo.descr || '-'}</div>
        </div>
        <div className="fs14 h32 FBH">
          <div className="c85 far w50">覆盖人群：</div>
          <div className="c65 fal w50">{saveInfo.nums || 0}</div>
        </div>
        <div className="fs14 h32 FBH">
          <div className="c85 far w50">责任人：</div>
          <div className="c65 fal w50">{saveInfo.cUserName}</div>
        </div>
      </div>
      <div className="steps-action">
        <Button 
          style={{marginRight: 16}}
          onClick={() => window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/group/manage`}
        >
          客群列表
        </Button>
        {/* /group/manage/${record.id}/${record.objId} */}
        <Button
          type="primary"
          onClick={() => window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/group/manage/${saveInfo.id}/${objId}`}
        >
          客群分析
        </Button>
      </div>
    </div>
  )
}

export default StepThree
