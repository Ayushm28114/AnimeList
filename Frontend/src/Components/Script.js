import React from 'react';
import './style.css';
const click= document.querySelectorAll(".anime-title",".pic");
click.forEach(item => {
    item.onclick = function() {
        alert("Hello World");
    }
});