import React from 'react'
import ReactDOM from 'react-dom'

const previewRoot = document.getElementById('root')

class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
  }
  componentDidMount() {
    previewRoot.appendChild(this.el)
  }
  componentWillUnmount() {
    previewRoot.removeChild(this.el)
  }
  render() {
    const {children} = this.props

    return ReactDOM.createPortal(
      children,
      this.el,
    )
  }
}

export default Preview
