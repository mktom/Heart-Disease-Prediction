import React, { Component } from 'react';
import { Scatter, Line } from 'react-chartjs-2';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Nav from './Nav';
import '../css/DataDisplay.css';

class DataDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
		  lineLabelList: "",
          male_data: "",
          male_scatter_graph: "",
		  male_line_graphs: "",
          female_data: "",
          female_scatter_graph: "",
		  female_line_graphs: ""
        };
    }

    componentDidMount() {
        this.apiCall();
    }
    
    async apiCall() {
      await fetch('/api/')
        .then(res => res.json())
        .then(res => {
	      // Parse the data into male/female datasets
          this.parseData(res);
        })
		.then(res => {
	      // Convert data into graphs
		  this.generateScatterGraphs();
          this.generateLineGraphs();
		})
		.then(res => {
		  // Show page, all work is done
          this.setState({loading: false});
		})
        .catch((error) => {
          console.log(error)
        })
    }

    parseData = (res) => {
        var male_data = [];
        var female_data = [];
        for (var i = 0; i < res.length; i++) {
            var currObj = JSON.parse(res[i]);
            if (currObj["sex"] === "1.0") {
                male_data.push(currObj);
            } else {
                female_data.push(currObj);
            }
        }
        
        // Sort on age
        male_data.sort((a,b) => a["age"] - b["age"]);
        female_data.sort((a,b) => a["age"] - b["age"]);
        
        // Convert back into Strings
        male_data = male_data.map(x => JSON.stringify(x));
        female_data = female_data.map(x => JSON.stringify(x));
        
        // Set result
        this.setState({male_data: male_data});
        this.setState({female_data: female_data});
    }

    generateScatterDataSet = (gender, dataLabel) => {    
        var data = []
		if (gender === "male") {
        	data = this.state.male_data.map(x => JSON.parse(x));
        } else {
        	data = this.state.female_data.map(x => JSON.parse(x));
        }
        data = data.map(a => ({x: a["age"], y: a[dataLabel]}))

        var dataset = {
            label: dataLabel,
            fill: true,
            hidden: true,
			backgroundColor: 'rgba(75,192,192,0.4)',
      		pointBackgroundColor: 'rgba(75,192,192,1)',
      		pointBorderColor: 'rgba(75,192,192,1)',
      		pointBorderWidth: 1,
      		pointHoverRadius: 4,
  		    pointHoverBackgroundColor: 'rgba(255, 206, 86, 1)',
     		pointHoverBorderColor: 'rgba(255, 206, 86, 1)',
      		pointHoverBorderWidth: 2,
      		pointRadius: 4,
      		pointHitRadius: 10,
			data: data,
        }

        return dataset;
    }

    generateLineDataSet = (gender, dataLabel, dataValue, ageBuckets, index) => {

        const colours = {
            "backgroundColor": ['rgba(0,190,120,0.4)', 'rgba(0,210,140,0.4)', 'rgba(0,230,160,0.4)', 'rgba(0,250,180,0.4)'],
            "borderColor": ['rgba(0,190,120,1)', 'rgba(0,210,140,1)', 'rgba(0,230,160,1)', 'rgba(0,250,180,1)'],
            "pointBorderColor": ['rgba(0,190,120,1)', 'rgba(0,210,140,1)', 'rgba(0,230,160,1)', 'rgba(0,250,180,1)'],
            "pointHoverBackgroundColor": ['rgba(0,190,120,1)', 'rgba(0,210,140,1)', 'rgba(0,230,160,1)', 'rgba(0,250,180,1)'],
            "pointHoverBorderColor": ['rgba(220,220,220,1)', 'rgba(220,220,220,1)', 'rgba(220,220,220,1)', 'rgba(220,220,220,1)'],
        }

        // Transform data into gender based list of values for specified dataLabel
        var data = []
		if (gender === "male") {
        	data = this.state.male_data.map(x => JSON.parse(x));
        } else {
        	data = this.state.female_data.map(x => JSON.parse(x));
        }
        data = data.filter( (a, idx, arr) => {
            return a[dataLabel] === dataValue;
        });
        
        // Tally count of dataValue occurence for dataLabel per age
        var dataArray = new Array(ageBuckets.length).fill(0);
        for (var j = 0; j < data.length; j++) {
			var idx = ageBuckets.indexOf(data[j]["age"]);
			dataArray[idx] += 1;			
		}

        // Construct dataset
        var dataSet = {
            label: dataValue,
            fill: true,
            lineTension: 0.3,
			backgroundColor: colours["backgroundColor"][index],
      		borderColor: colours["borderColor"][index],
      		borderCapStyle: 'round',
      		borderDash: [],
      		borderDashOffset: 0.0,
      		borderJoinStyle: 'miter',
      		pointBorderColor: colours["pointBorderColor"][index],
      		pointBackgroundColor: '#fff',
      		pointBorderWidth: 1,
      		pointHoverRadius: 5,
      		pointHoverBackgroundColor: colours["pointHoverBackgroundColor"][index],
      		pointHoverBorderColor: colours["pointHoverBorderColor"][index],
      		pointHoverBorderWidth: 2,
      		pointRadius: 1,
      		pointHitRadius: 10,
			data: dataArray
        }
        return dataSet;
    }

    generateScatterGraphs = () => {
        const comparisonLabels = [
            "resting blood pressure",
            "serum cholestrol (mg/dl)",
            "maximum heart rate achieved",
            "oldpeak = ST depression induced by exercise relative to rest"
        ];

        var male_datasets = [];
        var female_datasets = [];
        for (var i = 0; i < comparisonLabels.length; i++) {
            male_datasets.push(this.generateScatterDataSet("male", comparisonLabels[i]));
            female_datasets.push(this.generateScatterDataSet("female", comparisonLabels[i]));
        }

        // Set the first dataset to be visible so we have something showing on render
        male_datasets[0]["hidden"] = false
        female_datasets[0]["hidden"] = false

		var male_scatter_graph = {
			labels: comparisonLabels,
			datasets: male_datasets
		}
		var female_scatter_graph = {
			labels: comparisonLabels,
			datasets: female_datasets
		}
		this.setState({
            male_scatter_graph: male_scatter_graph,
            female_scatter_graph: female_scatter_graph    
        });
		return true;
    }

    generateLineGraphs = () => {
        const comparisonMap = {
            "chest pain type": ["1.0","2.0","3.0","4.0"],
            "fasting blood sugar > 120 mg/dl": ["0.0", "1.0"],
            "resting electrocardiographic results": ["0.0", "1.0", "2.0"],
            "exercise induced angina": ["0.0", "1.0"],
            "the slope of the peak exercse ST segment": ["1.0","2.0","3.0"],
            "number of major vessels coloured by fluroscopy": ["0.0","1.0","2.0","3.0"],
            "thal": ["3.0", "6.0", "7.0"]
        }
		this.setState({lineLabelList: Object.keys(comparisonMap)});

        var maleLineGraphList = [];
        var maleLineLabels = this.yieldAgeList("male");
        var femaleLineGraphList = [];
        var femaleLineLabels = this.yieldAgeList("female");
        // For each entry in map make a graph
        // Iterate through value of map to make each data set
        Object.keys(comparisonMap).forEach((key) => {
            var maleLineGraphDataSets = []
            var femaleLineGraphDataSets = []
            for (var i = 0; i < comparisonMap[key].length; i++) {
                maleLineGraphDataSets.push(this.generateLineDataSet("male", key, comparisonMap[key][i], maleLineLabels, i));
                femaleLineGraphDataSets.push(this.generateLineDataSet("female", key, comparisonMap[key][i], femaleLineLabels, i));
            }
            var maleGraph = {
                labels: maleLineLabels,
                datasets: maleLineGraphDataSets
            }
            var femaleGraph = {
                labels: femaleLineLabels,
                datasets: femaleLineGraphDataSets
            }
            maleLineGraphList.push(maleGraph);
            femaleLineGraphList.push(femaleGraph);
        });
        this.setState({
            male_line_graphs: maleLineGraphList,
            female_line_graphs: femaleLineGraphList
        });
    }

    yieldAgeList = (gender) => {
        var data = []
		if (gender === "male") {
        	data = this.state.male_data.map(x => JSON.parse(x));
        } else {
        	data = this.state.female_data.map(x => JSON.parse(x));
        }
        data = [...new Set(data.map(a => a["age"]))];
		return data;
    }

	generateScatterGraph = (data) => {
		var opts = {
			scales: {
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Age",
                        fontStyle: "bold",
                        fontSize: 16
					},
				}],
			}
		}
		return <Scatter data={data} options={opts}/>
	}
	
	generateLineGraph = (data, idx) => {
		var opts = {
			maintainAspectRatio: false
		};
		var uniqueKey = this.state.lineLabelList[idx] + "_" + idx;
		return (
			<div key={uniqueKey}>
				<Typography className="datadisplay-line" variant="h3">{this.state.lineLabelList[idx]}</Typography>
				<Line data={data} options={opts}/>
                <br/>
			</div>
		);
	}


    render() {
        if (this.state.loading) {
          return (
            <div className="datadisplay-div">
              <Nav/>
              <div className="datadisplay-progress-div">
                <CircularProgress className="datadisplay-progress" color="primary"/>
              </div>
            </div>
          ); 
        } else {
		  let maleLineGraphs = this.state.male_line_graphs.map((x,i) => {
		  	  return this.generateLineGraph(x, i);
		  });
          let femaleLineGraphs = this.state.female_line_graphs.map((x,i) => {
		  	  return this.generateLineGraph(x, i);
		  });
		  let maleScatterGraph = this.generateScatterGraph(this.state.male_scatter_graph);
		  let femaleScatterGraph = this.generateScatterGraph(this.state.female_scatter_graph);
          return (
            <div className="datadisplay-div">
              <Nav/>
              <Typography className="datadisplay-male" variant="h2" gutterBottom>Male Data</Typography>
			  <div className="datadisplay-male-body-div">
				{maleScatterGraph} 
			    {maleLineGraphs}
			    <br/>
			  </div>
              <Typography className="datadisplay-female" variant="h2" gutterBottom>Female Data</Typography>
			  <div className="datadisplay-female-body-div">
			    {femaleScatterGraph} 
			    {femaleLineGraphs}
			  </div>
            </div>
          );
        }
    }
}

export default DataDisplay;
