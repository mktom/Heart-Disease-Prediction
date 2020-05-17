import React, { Component } from 'react';
import Nav from './Nav';
import '../css/HomePage.css';

class HomePage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
      return (
        <div className="homepage-div">
          <Nav/>
          <h1>CS9321 19T1 Assignment 3</h1>
          <p>
            Jonathan Charles, z5115933<br/>
            Mark Thomas, z5194597<br/>
            Sudhan Maharjan, z5196539<br/>
            Gagandeep Nain, z5137193<br />
          </p>
        </div>
      ); 
    }
}

export default HomePage;
