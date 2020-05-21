import React, { Component } from 'react'
import io from 'socket.io-client'
import debounce from 'lodash.debounce'

export default class A extends Component {
  constructor(props) {
    super(props)

    this.socket = io()
    this.state = {
      message: '',
      code: ''
    }

    this.handleEditorChange = debounce((value) => {
      console.log(value)
      this.socket.emit('code', value);
    }, 3000)

    this.onEditorChange = this.onEditorChange.bind(this)
  }

  componentDidMount() {
    this.socket.on('now', data => {
      this.setState({
        message: data.message
      })
    })
  }

  onEditorChange(event) {
    this.setState({ code: event.target.value })
    this.handleEditorChange(event.target.value)
  }

  render() {
    return(
      <>
        <h1>{this.state.message}</h1>
        <input name="editor" onChange={this.onEditorChange} placeholder="console.log('Hello world')"/>
      </>
    )
  }
}
