import React, {Component} from 'react'

class EditNode extends Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.onChange = this.onChange.bind(this)
    document.onkeydown = function (e) {
      if (e.keyCode === 13) {
        e.preventDefault()
      }
    }
  }

  // copy过来的去掉样式
  textPaste(event) {
    event.preventDefault()
    let text
    const clp = (event.originalEvent || event).clipboardData
    // 兼容针对于opera ie等浏览器
    if (clp === undefined || clp === null) {
      text = window.clipboardData.getData('text') || ''
      if (text !== '') {
        if (window.getSelection) {
          // 针对于ie11 10 9 safari
          const newNode = document.createElement('span')
          newNode.innerHTML = text 
          window.getSelection().getRangeAt(0).insertNode(newNode)
        } else {
          // 兼容ie10 9 8 7 6 5
          document.selection.createRange().pasteHTML(text)
        }
      }
    } else {
    // 兼容chorme或hotfire
      text = clp.getData('text/plain') || ''
      if (text !== '') {
        document.execCommand('insertText', false, text)
      }
    }
  }

  onChange(e) {
    const {onCursorChange, onChange, onUpdateAttrList} = this.props
    const html = this.ref.current.innerHTML
    if (onChange && html !== this.lastHtml) {
      if (this.lastHtml.length - html.length > 100) {
        // 说明删除了 span 节点
        let tempLast = this.lastHtml
        const tempHtml = html
        tempLast = tempLast.replace(tempHtml, '') // 删除的内容

        const templateIds = tempLast.match(/id="[^"]+"/g)
        // eslint-disable-next-line no-useless-escape
        const templateKey = _.map(templateIds, j => j.replace('id=\"', '').replace('\"', ''))

        // 对应删除默认值
        onUpdateAttrList(templateKey)
      }

      onChange(html)
    }
    this.lastHtml = html

    const pos = this.getDivPosition(e.target)

    onCursorChange(pos)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.ref.current.innerHTML
  }

  componentDidUpdate() {
    if (this.props.value !== this.ref.current.innerHTML) {
      if (typeof this.props.value === 'undefined') {
        this.ref.current.innerHTML = ''
      } else {
        this.ref.current.innerHTML = this.props.value
        this.lastHtml = this.props.value
      }
    }
  }

  onClick() {
    console.log('是点击嘛')
  }

  getDivPosition(element) {
    let caretOffset = 0
    const doc = element.ownerDocument || element.document
    const win = doc.defaultView || doc.parentWindow
    let sel
    // 谷歌、火狐
    if (typeof win.getSelection !== 'undefined') {
      sel = win.getSelection()
      // 选中的区域
      if (sel.rangeCount > 0) {
        const range = win.getSelection().getRangeAt(0)
        // 克隆一个选中区域
        const preCaretRange = range.cloneRange()
        // 设置选中区域的节点内容为当前节点
        preCaretRange.selectNodeContents(element)
        // 重置选中区域的结束位置
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        caretOffset = preCaretRange.toString().length
      }
      // IE
    } else if ((sel = doc.selection) && sel.type !== 'Control') {
      const textRange = sel.createRange()
      const preCaretTextRange = doc.body.createTextRange()
      preCaretTextRange.moveToElementText(element)
      preCaretTextRange.setEndPoint('EndToEnd', textRange)
      caretOffset = preCaretTextRange.text.length
    }
    return caretOffset
  }

  getCursortPosition(e) {
    const pos = this.getDivPosition(e.target)
  }


  render() {
    const {value} = this.props
    return (
      <div
        className="edit-item"
        placeholder="请输入"
        contentEditable="true"
        spellCheck="false"
        ref={this.ref}
        dangerouslySetInnerHTML={{__html: value}}
        onInput={e => this.onChange(e)}
        onBlur={this.onChange}
        onPaste={e => this.textPaste(e)}
        onClick={e => this.getCursortPosition(e)}
      />
    )
  }
}

export default EditNode
