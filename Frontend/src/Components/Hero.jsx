import React, { Component } from 'react'

export default class Hero extends Component {
  render() {
    return (
        <>
          <div id="hero">
            <h1 id="hero-title">Discover Your Next <br /> Favourite Anime</h1>
            <p id="hero-subtitle">Explore, Watch, and Enjoy current<br />Best Anime Series</p>
            <div id="hero-button">
                <h3 className="show">Start <br /> Watching</h3>
                <h3 className="show">Browse <br /> Genres</h3>
            </div>
            <div id="hero-number">
                <h3 className="number">1000+ Animes</h3>
                <h3 className="number">500+ Users</h3>
                <h3 className="number">200+ Genres</h3>
            </div>
          </div>
        </>
    )
  }
}
