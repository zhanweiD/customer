import React, {Component, useState} from 'react'
import {Dropdown, Menu, Button, message} from 'antd'
import {action, observable, toJS} from 'mobx'
import {observer} from 'mobx-react'
import EditNode from './editnode'
import './wechat.styl'
import Link from '../../icon/wechat-link.svg'
import Attr from '../../icon/wechat-attr.svg'


const menu = (
  <Menu>
    <Menu.Item key="0">
      1st menu item
    </Menu.Item>
    <Menu.Item key="1">
      2nd menu ite
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
)

@observer
class SomeCompoent extends Component {
  @observable id = 100 // 自增 id，用于 span

  // @observable html = '12345<span class="tag-drop" contentEditable="false" id="6">66666</span>6789'
  @observable html = ''
  @observable clickedId = ''
  @observable visibility = 'hidden'
  @observable top = 0
  @observable left = 0
  @observable cursorPos = 0

  @action.bound clickEvent(e) {
    // TODO: 为何触发了多次
    e.stopPropagation()
    const rect = e.target.getClientRects()[0]

    this.clickedId = e.target.id

    if (rect) {
      const {height} = rect

      this.top = e.target.offsetTop + height + 4
      this.left = e.target.offsetLeft

      this.visibility = 'visible'
    }
  }

  generateSpan(text) {
    this.id += 1
    return `<span class="tag-drop" contentEditable="false" id="${this.id}">${text}</span>`
  }

  @action.bound windowClickEvent(e) {
    if (this.visibility === 'visible') {
      console.log('window')

      this.visibility = 'hidden'
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.windowClickEvent)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.windowClickEvent)

    const drops = document.getElementsByClassName('tag-drop')
    for (let i = 0; i < drops.length; i += 1) {
      drops[i].removeEventListener('click', this.clickEvent)
    }
  }

  componentDidUpdate() {
    const {id} = this.props
    const drops = document.getElementById(id).getElementsByClassName('tag-drop')

    for (let i = 0; i < drops.length; i += 1) {
      drops[i].addEventListener('click', this.clickEvent)
    }
  }

  dropdownClick(e) {
    const {onChange} = this.props
    e.stopPropagation()

    // 要替换的内容
    const targetText = e.target.innerText

    // 现在展示的内容
    const currentHtml = this.html

    const currentHtmlArray = currentHtml.split('</span>')
    const newArray = []
    currentHtmlArray.forEach(item => {
      if (item.indexOf(`id="${this.clickedId}"`) > -1) {
        item = item.replace(/>([\s\S]*)$/g, `>${targetText}`)
      }
      newArray.push(item)
    })

    this.html = newArray.join('</span>')
    onChange(this.html)

    this.visibility = 'hidden'
  }

  // 要处理含有 span 的情况
  mySlice(str, newStr, start) {
    let myIndex = 0
    let finalStr = ''
    let isChanged = false // 判断是否是中途改变的
    let isInSpan = false

    for (let i = 0; i < str.length; i += 1) {
      if (str[i] === '<') {
        // 要判断是不是进入 <span>或者<br/>了
        // 回车感觉不太行
        // 与<span class 进行匹配
        if (str.substring(i, i + 11) === '<span class' || str.substring(i, i + 7) === '</span>') {
          console.log('前面匹配到了')
          isInSpan = true
        }
      }

      if (str[i] === '>') {
        // 要判断是不是结束了
        // 与</span>进行匹配
        if (str.substring(i - 1, i + 1) === '">' || str.substring(i - 6, i + 1) === '</span>') {
          console.log('后面匹配到了')
          isInSpan = false
        }
      }

      if (myIndex === start) {
        // 要判断后面是不是 </span>
        if (str.substring(i, i + 7) === '</span>') {
          // 说明是span后面加的
          finalStr = str.slice(0, i + 7) + newStr + str.slice(i + 7)
        } else {
          finalStr = str.slice(0, i) + newStr + str.slice(i)
        }

        isChanged = true
        break
      }

      if (!isInSpan && str[i] !== '>') {
        myIndex += 1
      }
    }

    if (myIndex === start && !isChanged) {
      finalStr = str + newStr
    }
    // 判断是后面加的

    return finalStr
  }

  add(type) {
    const {onChange} = this.props
    this.html = this.mySlice(this.html, this.generateSpan(type), this.cursorPos)
    onChange(this.html)
  }

  render() {
    const {value, onChange, id, tagList} = this.props

    return (
      <div className="wechat-node" id={id}>
        <div 
          style={{
            height: '32px',
            lineHeight: '32px',
            backgroundColor: '#f6f9fb',
            borderBottom: '1px solid #E7EFF6',
          }}
        >
          <div className="FBH FBAC">
            <div
              className="ml8 mr8 hand"
              onClick={() => {
                if (tagList && tagList.length && tagList.length > 0) {
                  this.add(tagList[0].objNameTagName)
                } else {
                  console.error('没有属性')
                  message.error('暂无属性')
                }
              }}
            >
              <img src={Attr} alt="属性" />
              <span className="ml4 fs12">插入属性</span>
            </div>
            {/* <div className="hand" onClick={() => this.add('link')}>
              <img src={Link} alt="链接" />
              <span className="ml4 fs12">插入链接</span>
            </div> */}
          </div>
        </div>
        <div className="p8">
          <EditNode
            // value={this.html}
            value={value}
            onChange={val => {
              this.html = val
              onChange(val)
            }}
            onCursorChange={pos => {
              this.cursorPos = pos
            }}
          />
        </div>
        <div
          className="select-dropdown"
          style={{
            top: this.top,
            left: this.left,
            visibility: this.visibility,
          }}
          onClick={e => this.dropdownClick(e)}
        >
          {
            tagList.map(item => <div className="dropdown-item">{item.objNameTagName}</div>)
          }
        </div>
      </div>
    )
  }
}

export default SomeCompoent
