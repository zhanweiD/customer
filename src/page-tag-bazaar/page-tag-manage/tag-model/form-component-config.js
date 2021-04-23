/* type和相应antd组件映射 */
import React from 'react'
import * as antd from 'antd'

const createInputPlaceholder = label => (label ? `请输入${label}` : undefined) // 生成input默认的Placeholder值

const createSelectPlaceholder = label => (label ? `请选择${label}` : undefined) // 生成select默认的Placeholder值


const SelectTypes = ({
  label, placeholder, options = [], ...rest
}) => {
  const mergeOption = options
  if (Array.isArray(options) && !options.length && rest.defaultAll) {
    mergeOption.unshift({
      name: '全部',
      value: '',
    })
  }
  if (options.length && options[0].name !== '全部' && rest.defaultAll) {
    mergeOption.unshift({
      name: '全部',
      value: '',
    })
  }

  return (
    <antd.Select 
      showSearch
      size="small"
      placeholder={placeholder || createSelectPlaceholder(label)} 
      getPopupContainer={triggerNode => triggerNode.parentElement}
      // notFoundContent={rest.selectLoading ? <antd.Spin size="small" /> : <div>暂无数据源</div>}
      optionFilterProp="children"
      {...rest}
    >
      {
        mergeOption && mergeOption.map(({name, ...optionProps}) => (
          <antd.Select.Option style={{fontSize: '12px'}} key={optionProps.value} {...optionProps}>{name}</antd.Select.Option>
        ))
      }
    </antd.Select>
  )
}

const createTreeNode = (data = [], valueName, titleName, selectCon) => {
  if (!data.length) return null

  return data.map(node => (
    <antd.TreeSelect.TreeNode
      value={valueName ? node[valueName] : node.aId}
      title={titleName ? node[titleName] : node.name}
      key={node.aId}
      size="small"
      selectable={selectCon ? (node[selectCon[0]] === selectCon[1]) : node.isLeaf === 2}
    >
      {
        createTreeNode(node.children, valueName, titleName, selectCon)
      }
    </antd.TreeSelect.TreeNode>
  ))
}

/**
 * @description 根据type返回相应antd控件
 */ 
export default ({
  type, label, placeholder, options = [], radios = [], ...rest
}) => {
  const map = {
    text: <span>{options}</span>,
    input: <antd.Input size="small" placeholder={placeholder || createInputPlaceholder(label)} {...rest} />,
    textArea: <antd.Input.TextArea size="small" rows={4} placeholder={placeholder || createInputPlaceholder(label)} {...rest} />,
    select: <SelectTypes size="small" label={label} placeholder={placeholder || createSelectPlaceholder(label)} options={options} {...rest} />,
    radioGroup: <antd.Radio.Group size="small" {...rest}>{radios}</antd.Radio.Group>, // 单选按钮
    rangePicker: <antd.DatePicker.RangePicker size="small" {...rest} />,
    timePicker: <antd.TimePicker size="small" {...rest} />,
    selectTree: () => (
      options.length 
        ? (
          <antd.TreeSelect
            placeholder={placeholder || createSelectPlaceholder(label)}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            allowClear
            size="small"
            // multiple
            treeDefaultExpandAll
            treeNodeFilterProp="title"
            {...rest}
          >
            {
              createTreeNode(options, rest.valueName, rest.titleName, rest.selectCon)
            }
          </antd.TreeSelect>
        ) : (
          <antd.TreeSelect
            size="small"
            placeholder={placeholder || createSelectPlaceholder(label)}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
          />
        )
    ), 
    switch: <antd.Switch 
      size="small"
      checkedChildren={rest.checkedText || '是'} 
      unCheckedChildren={rest.unCheckedText || '否'} 
      {...rest}
    />,
    cascader: <antd.Cascader
      options={options}
      size="small"
      placeholder={placeholder || createSelectPlaceholder(label)}
      {...rest}
    />,
  }

  if (typeof map[type] === 'function') {
    return map[type]()
  }
  return map[type] || null
}


/** 
 * @description 导出规则合并函数
 * @param rules
 * @param label
 */
export const mergeRules = (rules, label) => {
  if (!rules) return rules
  const map = {
    '@transformTrim': {transform: value => value && value.trim()}, // 输入类型为string；校验时进行trim()去掉前后空格
    '@required': {required: true, whitespace: true, message: `请输入${label}`},
    '@rangeRequired': {type: 'array', required: true, whitespace: true, message: `请输入${label}`},
    '@timeRequired': {type: 'object', required: true, whitespace: true, message: `请输入${label}`},
    '@requiredSelect': {required: true, message: `请选择${label}`},
    '@max32': {max: 32, message: '输入不能超过32个字符'},
    '@max128': {max: 128, message: '输入不能超过128个字符'},
    '@enNamePattern': {pattern: /^[a-zA-Z][a-zA-Z0-9_]{0,}$/, message: '格式不正确，允许输入英文/数字/下划线，必须以英文开头'},
    '@namePattern': {pattern: /^[a-zA-Z0-9_()（）\u4e00-\u9fa5]+$/, message: '格式不正确，允许输入中文/英文/数字/下划线/()'},
    '@nameUnderline': {pattern: /^(?!_)/, message: '不允许下划线开头'},
    '@nameShuQi': {pattern: /^(?!数栖)/, message: '不允许数栖开头'},
  }

  return rules.map(rule => (typeof rule === 'string' ? map[rule] : rule))
}
