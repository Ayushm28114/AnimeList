import React, { Component } from 'react'
import './style.css'

export default class Posters extends Component {
  render() {
    return (
        <>
        <h1 id="ta">Trending Anime</h1>
        <div id = "box">
            <div className="posters">
                <a href="https://allmanga.to/bangumi/ReooPAxPMsHM4KPMY"><img className="pic" src="https://tse3.mm.bing.net/th/id/OIP.2Dp1yFCPT8zARby9yYzzTwHaEK?pid=Api&P=0&h=220" alt="One Piece" /></a>
                <a className="anime-title" href="https://allmanga.to/bangumi/ReooPAxPMsHM4KPMY">One Piece</a>
                <div className="anime-details">
                    <p><strong>Start Date:</strong> October 20, 1999</p>
                    <p><strong>Latest Season:</strong> Season 21 (2024)</p>
                    <p><strong>Next Season:</strong> Ongoing</p>
                    <p><strong>Genre:</strong> Adventure, Comedy, Shounen</p>
                    <p><strong>Status:</strong> Ongoing</p>
                </div>
            </div>
            <div className="posters">
                <a href="https://allmanga.to/bangumi/b3u5TprKSKHBPBcor"><img className="pic" src="https://tse3.mm.bing.net/th/id/OIP.dJF45TGGt-HQuuSxWqU2XwHaDs?pid=Api&P=0&h=220" alt="Oshi No Ko" /></a>
                <a className="anime-title" href="https://allmanga.to/bangumi/b3u5TprKSKHBPBcor">Oshi No Ko</a>
                <div className="anime-details">
                    <p><strong>Start Date:</strong> April 12, 2023</p>
                    <p><strong>Latest Season:</strong> Season 2 (2024)</p>
                    <p><strong>Next Season:</strong> January 2026</p>
                    <p><strong>Genre:</strong> Drama, Supernatural, Thriller</p>
                    <p><strong>Status:</strong> Ongoing</p>
                </div>
            </div>
            <div className="posters">
                <a href="https://allmanga.to/bangumi/vDTSJHSpYnrkZnAvG"><img className="pic" src="https://tse3.mm.bing.net/th/id/OIP.1uDwB0xwHooxgVLP6nhITgHaFj?pid=Api&P=0&h=220" alt="Naruto" /></a>
                <a className="anime-title" href="https://allmanga.to/bangumi/vDTSJHSpYnrkZnAvG">Naruto</a>
                <div className="anime-details">
                    <p><strong>Start Date:</strong> October 3, 2002</p>
                    <p><strong>End Date:</strong> February 8, 2017</p>
                    <p><strong>Total Episodes:</strong> 720</p>
                    <p><strong>Genre:</strong> Action, Adventure, Shounen</p>
                    <p><strong>Status:</strong> Completed (Naruto/Shippuden)</p>
                </div>
            </div>
            <div className="posters">
                <a href="https://allmanga.to/bangumi/uP4dqHNypYeYtTnzP"><img className="pic" src="https://tse3.mm.bing.net/th/id/OIP.U6wx6B4fklQSp4HuGxfMvQHaDt?pid=Api&P=0&h=220" alt="Bleach" /></a>
                <a className="anime-title" href="https://allmanga.to/bangumi/uP4dqHNypYeYtTnzP">Bleach</a>
                <div className="anime-details">
                    <p><strong>Start Date:</strong> October 5, 2004</p>
                    <p><strong>Latest Season:</strong> TYBW Part 3 (2024)</p>
                    <p><strong>Next Season:</strong> TYBW Part 4 (2025)</p>
                    <p><strong>Genre:</strong> Action, Supernatural, Shounen</p>
                    <p><strong>Status:</strong> Ongoing (Final Arc)</p>
                </div>
            </div>
        </div>
        </>
    )
  }
}
