import React, { Component } from 'react'
const QRCode = require('qrcode.react')
import { edgeLogin } from '../Login.middleware'
import { closeLoading } from '../../Loader/Loader.action'

export default class QRCodeEdge extends Component {
  componentWillUnmount () {
    if (this.props.edgeObject) {
      this.props.edgeObject.cancelRequest()
    }
  }
  componentDidMount () {
    this.props.dispatch(
        edgeLogin((error, account) => {
          const abcuiCallback = window.parent.abcui
          if (!error) {
            if (abcuiCallback.loginCallback) {
              return abcuiCallback.loginCallback(null, account)
            }
            if (!window.parent.loginCallback) {
              this.props.dispatch(closeLoading())
              return this.props.history.push('/account')
            }
          }
        })
      )
  }
  _renderBarcode = () => {
    const { edgeId } = this.props
    if (edgeId) {
      const qrCodeVal = 'airbitz://edge/' + edgeId
      return <QRCode value={qrCodeVal} size={180} />
    } else {
      return null
    }
  }
  _renderLoginLink = () => {
    const { edgeId } = this.props
    if (edgeId) {
      return `https://airbitz.co/elf/?address=${edgeId}`
    }
  }
  render () {
    return (
      <a target='_blank' href={this._renderLoginLink()}>
        {this._renderBarcode()}
      </a>
    )
  }
}
