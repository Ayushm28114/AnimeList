import React, { Component } from 'react'

export default class login extends Component {
  render() {
    return (
      <div id="login">
        <h1>Login Page</h1>
        <form id="login-form">
          <input type="text" id="username" placeholder="Username..." />
          <input type="password" id="password" placeholder="Password..." />
          <button type="submit" id="login-button">Login</button>
        </form>        
      </div>
    )
  }
}
