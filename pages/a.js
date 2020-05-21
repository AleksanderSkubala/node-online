import React, { Component } from 'react'
import io from 'socket.io-client'

export default class A extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: ''
    }
  }

  componentDidMount() {
    this.socket = io()
    this.socket.on('now', data => {
      this.setState({
        message: data.message
      })
    })
  }

  onEditorChange(event) {
    console.log(event.target.value);
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
