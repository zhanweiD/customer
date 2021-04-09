/**
 * @description 封装modol中常用form
 */
import {Component, Fragment} from 'react'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import PropTypes from 'prop-types'
import QuestionTooltip from '../question-tooltip'
import ControlComponent, {mergeRules} from '../form-component-config'

const FormItem = Form.Item

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

  render() {
    const {...rest} = this.props
    return (
      <Form {...rest}>
        {
          this.createItemContent()
        }
      </Form>
    )
  }
}
