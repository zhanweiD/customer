import {useState} from 'react'
import {Button} from 'antd'
import AnalysisModal from './analysis-modal'

const SalesDetail = () => {
  const [visible, setVisible] = useState(false)
  const changeVisible = v => {
    setVisible(v)
  }
  return (
    <div className="oa">
      <Button onClick={() => changeVisible(true)}>分析配置</Button>
      <AnalysisModal visible={visible} setVisible={changeVisible} />
    </div>
  )
}

export default SalesDetail
