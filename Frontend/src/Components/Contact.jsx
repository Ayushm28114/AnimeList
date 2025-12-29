import React, { Component } from 'react'
import './style.css'

export default class Contact extends Component {
  render() {
    return (
      <div id="contact-page">
        <div id="form">
            <div id="contact-box">
            <h1 id="contact-title">Contact Us</h1>                    
            </div>
            <div id="contact-info">
                <form>
                    <input type="text" id="name" placeholder="Your Name..."/>
                    <input type="email" id="mail" placeholder="Email Address"/>
                    <textarea id="msg" placeholder="Your Message..."></textarea>
                    <button id="submit" type="submit" className="contact-submit">Submit</button>
                </form>
            </div>
        </div>
      </div>
    )
  }
}
