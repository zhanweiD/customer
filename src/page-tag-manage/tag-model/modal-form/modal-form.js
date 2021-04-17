/**
 * @description 封装modol中常用form
 */
import {Component, Fragment} from 'react'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import PropTypes from 'prop-types'
import {inject} from 'mobx-react'
import {toJS} from 'mobx'
import {Input} from 'antd'
import MultiCascader from 'antd-multi-cascader'
import QuestionTooltip from '../../../component/question-tooltip'
import ControlComponent, {mergeRules} from '../form-component-config'

const FormItem = Form.Item


@inject('bigStore')
@Form.create()
export default class ModalForm extends Component {
  static propTypes = {
    selectContent: PropTypes.instanceOf(Array),
    formItemLayout: PropTypes.instanceOf(Object),
  }

  static defaultProps = {
    selectContent: [],
    formItemLayout: {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      colon: false,
    },
  }

  createItemContent = () => {
    const {selectContent, formItemLayout, form: {getFieldDecorator}} = this.props
    if (!selectContent && !selectContent.length) return null
    return selectContent.map(({
      label,
      labelTooltip,
      key,
      initialValue,
      valuePropName = 'value', // 兼容Switch
      rules,
      component: type,
      control,
      hide,
      extra,
      mode,
      ...rest
    }) => (
      <Fragment>
        {
          hide ? null : (
            <FormItem
              {...formItemLayout}
              key={key}
              label={labelTooltip ? (
                <span>
                  {label}
                  <QuestionTooltip tip={labelTooltip} />
                </span>
              ) : label}
              extra={extra}
            >
              {getFieldDecorator(key, {
                initialValue, 
                valuePropName,
                rules: mergeRules(rules, label),
                validateFirst: true,
              })(<ControlComponent mode={mode} type={type} label={label} {...control} {...rest} autoComplete="off" />)}
            </FormItem>
          )
        }
      </Fragment>
    ))
  }

  createItemContentUp = () => {
    const {selectContent, formItemLayout, form: {getFieldDecorator}} = this.props
    if (!selectContent && !selectContent.length) return null
    return selectContent.slice(0, 5).map(({
      label,
      labelTooltip,
      key,
      initialValue,
      valuePropName = 'value', // 兼容Switch
      rules,
      component: type,
      control,
      hide,
      extra,
      mode,
      ...rest
    }) => (
      <Fragment>
        {
          hide ? null : (
            <FormItem
              {...formItemLayout}
              key={key}
              label={labelTooltip ? (
                <span>
                  {label}
                  <QuestionTooltip tip={labelTooltip} />
                </span>
              ) : label}
              extra={extra}
            >
              {getFieldDecorator(key, {
                initialValue,
                valuePropName,
                rules: mergeRules(rules, label),
                validateFirst: true,
              })(<ControlComponent mode={mode} type={type} label={label} {...control} {...rest} autoComplete="off" />)}
            </FormItem>
          )
        }
      </Fragment>
    ))
  }

  createItemContentDown = () => {
    const {selectContent, formItemLayout, form: {getFieldDecorator}} = this.props
    if (!selectContent && !selectContent.length) return null
    return selectContent.slice(-1).map(({
      label,
      labelTooltip,
      key,
      initialValue,
      valuePropName = 'value', // 兼容Switch
      rules,
      component: type,
      control,
      hide,
      extra,
      mode,
      ...rest
    }) => (
      <Fragment>
        {
          hide ? null : (
            <FormItem
              {...formItemLayout}
              key={key}
              label={labelTooltip ? (
                <span>
                  {label}
                  <QuestionTooltip tip={labelTooltip} />
                </span>
              ) : label}
              extra={extra}
            >
              {getFieldDecorator(key, {
                initialValue,
                valuePropName,
                rules: mergeRules(rules, label),
                validateFirst: true,
              })(<ControlComponent mode={mode} type={type} label={label} {...control} {...rest} autoComplete="off" />)}
            </FormItem>
          )
        }
      </Fragment>
    ))
  }


  render() {
    const {formItemLayout, form, bigStore, ...rest} = this.props
    const {getFieldDecorator} = form

    return (
      <Form {...rest}>
        {
          this.createItemContentUp()
        }
        <FormItem
          label="业务类型"
          name="biz"
          key="biz"
          {...formItemLayout}
        >
          {getFieldDecorator('biz', {
            initialValue: bigStore.drawerTagInfo.biz,
            rules: [
              {required: true, message: '请选择'},
            ],
          })(
            <MultiCascader
              data={toJS(bigStore.bizList)}
              placeholder="请选择"
            />
          )}
        </FormItem>
        {
          this.createItemContentDown()
        }
      </Form>
    )
  }
}
