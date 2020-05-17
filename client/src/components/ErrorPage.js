import React, { Component } from 'react';
import '../css/ErrorPage.css'

class ErrorPage extends Component {
    
    render() {
      return (
        <div className="error-div">
          <h1 className="error-title">
            Error: Unknown Page
          </h1>
        </div>
      );
    }
};

export default ErrorPage
