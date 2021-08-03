/**
 * @description 列表内搜索框
 * @author  mahua
 */

import {Component} from 'react'
import PropTypes from 'prop-types'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Button, Row, Col} from 'antd'
import ControlComponent, {mergeRules} from '../form-component-config'


const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    sm: {span: 6},
    md: {span: 7},
    lg: {span: 9},
    xl: {span: 6},
    xxl: {span: 5},
  },
  wrapperCol: {
    sm: {span: 18},
    md: {span: 17}, // >=768
    lg: {span: 15}, // >=992
    xl: {span: 18}, // >=1200
    xxl: {span: 19}, // >=1600
  },
  colon: false,
}

@Form.create()
export default class SearchContent extends Component {
  static propTypes = {
    params: PropTypes.instanceOf(Array),
    onSearch: PropTypes.func,
    onReset: PropTypes.func,
    simple: PropTypes.bool,
  }

  static defaultProps = {
    params: [],
    simple: false,
    onReset: () => {},
    onSearch: () => {},
  }

  getWarperComponent = ({
    label,
    key,
    initialValue,
    rules,
    component: type,
    control,
    ...rest
  }) => {
    const {form} = this.props
    const {getFieldDecorator} = form
    return (
      <Col span={8}>
        <FormItem {...formItemLayout} key={key} label={label}>
          {getFieldDecorator(key, {
            initialValue, 
            rules: mergeRules(rules, label),
            validateFirst: true,
          })(<ControlComponent type={type || 'input'} label={label} {...control} {...rest} />)}
        </FormItem>
      </Col>
    )
  }

  /**
   * 搜索框重置
   * @param {object} 
   */
  handleReset = e => {
    e.preventDefault()
    const {form, onReset} = this.props
    form.resetFields()
    const values = form.getFieldsValue()
    onReset(values)
  }

  /**
   * 搜索
   * @param {object} value 搜索内容  
   * @param {object} e   
   */
  handleSubmit = (value, e) => {
    if (value.preventDefault) value.preventDefault()
    if (e) e.preventDefault()

    const {form, onSearch} = this.props

    form.validateFields((err, values) => {
      if (err) return
      onSearch(values)
    })
  }

  render() {
    const {params: searchParams} = this.props

    if (!searchParams || !searchParams.length) {
      // 如果没有，则返回内容
      return null
    }

    return (
      <Form className="dt-form-column comp-list-search" onSubmit={this.handleSubmit} colon={false}>
        <Row>
          {searchParams.map(item => this.getWarperComponent(item))}
          <Col span={24 - (searchParams.length % 3) * 8} className="far mb16 mt4">
            <Button htmlType="submit" type="primary">查询</Button>
            <Button
              className="ml8"
              // htmlType="button"
              // ghost
              onClick={this.handleReset}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
