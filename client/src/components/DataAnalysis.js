import React, { Component } from 'react';
import Nav from './Nav';
import '../css/DataAnalysis.css';

class DataAnalysis extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            logs: []
        }
    }

    componentDidMount() {
        this.apiCall();
    }

    
    async apiCall() {
        await fetch('/api/analysis')
            .then(res => res.json())
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ 
                    data: res.data, 
                    logs: res.logs
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    

    render() {
        let data = this.state.data;
        let output = [];
        for (var i = 0; i < data.length; i++) {
            let name = data[i];
            let entry = <img key={i} src={process.env.PUBLIC_URL + "/images/" + name}/>
            output.push(entry);
        }
        let logOutput = this.state.logs.map((data, idx) => {
            return (<li key={idx}>{data}</li>);
        });
        return (
        <div className="dataanalysis-div">
          <Nav/>
          {output}
          <br/>
          <ul>
            {logOutput}
          </ul>
        </div>
      ); 
    }
}

export default DataAnalysis;
