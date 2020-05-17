import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Nav from './Nav';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import '../css/DataPrediction.css';
//import { Table, TableHead } from '@material-ui/core';
// import { keys } from '@material-ui/core/styles/createBreakpoints';

class DataPrediction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current_entry: {},
            stashed_entries: [],
            MODELS: ['Logistic Regression', 'kNN Model (k=20)', 
              'Support Vector Classifier', 'Decision Tree', 'Random Forrest'],
            accuracies_value : {},
            loading: true,
            prediction_results: [],
            chosen_model: 'Random Forrest',
            show_error_flag: false,
            error_message: ''
        };
    }

    componentDidMount() {
      this.apiCall();
    }

    async apiCall() {
      await fetch('/api/prediction')
        .then(res => res.json())
        .then(res => {
          // Parse the data into male/female datasets
          this.parseData(res);
        })
        // .then(res => {
        //   Convert data into graphs
        // })
        .then(res => {
          // Show page, all work is done
          this.setState((prevState)=>{ 
            return {
              current_entry: prevState.current_entry,
              stashed_entries: prevState.stashed_entries,
              MODELS: prevState.MODELS,
              accuracies_value: prevState.accuracies_value,
              prediction_results: prevState.prediction_results,
              loading: false,
              chosen_model: prevState.chosen_model,
              show_error_flag: prevState.show_error_flag,
              error_message: prevState.error_message
            }
          });
        })
        .catch((error) => {
          console.log(error)
        })
    }
    
    parseData = (res) => {
      this.setState((prevState)=>{ 
        return {
          accuracies_value: res,
          current_entry: prevState.current_entry,
          stashed_entries: prevState.stashed_entries,
          MODELS: prevState.MODELS,
          prediction_results: prevState.prediction_results,
          loading: prevState.loading,
          chosen_model: prevState.chosen_model,
          show_error_flag: prevState.show_error_flag,
          error_message: prevState.error_message
        }
      });
    }


    handleChange = (event) => {
        let arr = this.state.current_entry;
        if (event.target.id === 'model') {
        this.setState((prevState) => {
          return {
            current_entry: prevState.current_entry,
            accuracies_value: prevState.accuracies_value,
            stashed_entries: prevState.stashed_entries,
            MODELS: prevState.MODELS,
            prediction_results: prevState.prediction_results,
            loading: prevState.loading,
            chosen_model: event.target.value,
            show_error_flag: prevState.show_error_flag,
            error_message: prevState.error_message
          }
        });
        } else {
          arr[event.target.id] = event.target.value;
          this.setState((prevState) => {
            return {
              current_entry: arr,
              accuracies_value: prevState.accuracies_value,
              stashed_entries: prevState.stashed_entries,
              MODELS: prevState.MODELS,
              prediction_results: prevState.prediction_results,
              loading: prevState.loading,
              chosen_model: prevState.chosen_model,
              show_error_flag: prevState.show_error_flag,
              error_message: prevState.error_message
            }
          });
        }
    }

    hidePrediction = () => {
      var div_element_predict = document.getElementById('datapred-predict-div');
      div_element_predict.classList.add('hide');
    }

    saveEntry = () => {
      //(log_reg_model, log_reg_model_cv, knn_model, knn_model_cv, svc_model, svc_model_cv, dt_model, dt_model_cv, rf_model, rf_model_cv): range(10)
      var keys_arr = ["age", "sex", "chest pain type", "resting blood pressure", "serum cholestrol (mg/dl)", "fasting blood sugar > 120 mg/dl",
        "resting electrocardiographic results", "maximum heart rate achieved", "exercise induced angina", "oldpeak = ST depression induced by exercise relative to rest",
        "the slope of the peak exercse ST segment", "number of major vessels coloured by fluroscopy", "thal"
        // , "target"
      ]
      var error_found = false;
      keys_arr.forEach(value=> {
        if (!(value in this.state.current_entry)){
          // ErrorEvent()
          error_found = true;
          this.setState((prevState) => {
            return {
              stashed_entries: prevState.stashed_entries,
              current_entry: prevState.current_entry,
              MODELS: prevState.MODELS,
              accuracies_value: prevState.accuracies_value,
              prediction_results: prevState.prediction_results,
              loading: prevState.loading,
              chosen_model: prevState.chosen_model,
              show_error_flag: true,
              error_message: 'Please enter the value for ' + value
            };
          });
          var div_element_predict = document.getElementById('error-message-id');
          div_element_predict.classList.remove('hide');
          window.scrollTo(0, 0);
        }
      });
      if (!error_found){
        this.setState((prevState)=>{
          var new_current_entry = {}
          keys_arr.forEach(value => {
            new_current_entry[value] = '';
          });
          return {
            stashed_entries: [...prevState.stashed_entries, prevState.current_entry],
            current_entry: new_current_entry,
            MODELS: prevState.MODELS,
            accuracies_value: prevState.accuracies_value,
            prediction_results: prevState.prediction_results,
            loading: prevState.loading,
            chosen_model: prevState.chosen_model,
            show_error_flag: false,
            error_message: ''
          };
        });
        var div_element_predict = document.getElementById('error-message-id');
        div_element_predict.classList.add('hide');
      }
    }

    postEntries = async () => {
        let postdata = this.state.stashed_entries;
        let model_value = this.state.chosen_model;
        // Show error data has not been saved
        if (postdata && postdata.length === 0){
          this.setState((prevState) => {
            return {
              stashed_entries: [],
              current_entry: prevState.current_entry,
              MODELS: prevState.MODELS,
              accuracies_value: prevState.accuracies_value,
              prediction_results: prevState.prediction_results,
              loading: prevState.loading,
              chosen_model: prevState.chosen_model,
              show_error_flag: true,
              error_message: 'Please save data first for prediction'
            };
          });
          var div_element_predict = document.getElementById('error-message-id');
          div_element_predict.classList.remove('hide');
          window.scrollTo(0, 0);
          return;
        }
        await fetch('/api/prediction', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: postdata,
            model: model_value
          })
        })
        .then(res => res.json())
        .then((res) => {
          this.setState((prevState) => {
            var div_element_predict = document.getElementById('datapred-predict-div');
            div_element_predict.classList.remove('hide');
            div_element_predict.scrollIntoView();
            return {
              stashed_entries: [],
              current_entry: prevState.current_entry,
              MODELS: prevState.MODELS,
              accuracies_value: prevState.accuracies_value,
              prediction_results: res.result,
              loading: prevState.loading,
              chosen_model: prevState.chosen_model,
              show_error_flag: prevState.show_error_flag,
              error_message: prevState.error_message
            };
          });
        });
        console.log("Posted entries to server");
    }

    render() {
      if (this.state.loading) {
        return (
          <div className="datadisplay-div">
            <Nav />
            <div className="datadisplay-progress-div">
              <CircularProgress className="datadisplay-progress" color="primary" />
            </div>
          </div>
        );
      } else {
        // let stored_data = this.state.stashed_entries.map((arr) => arr.join(",")).map((str, i) => <p key={i}>{str}</p>) ;
        let accuracies_value = this.state.accuracies_value;
        let models = this.state.MODELS;
        let keys_arr = ["age", "sex", "chest pain type", "resting blood pressure", "serum cholestrol (mg/dl)", "fasting blood sugar > 120 mg/dl",
          "resting electrocardiographic results", "maximum heart rate achieved", "exercise induced angina", "oldpeak = ST depression induced by exercise relative to rest",
          "the slope of the peak exercse ST segment", "number of major vessels coloured by fluroscopy", "thal"
          // , "target"
        ]
        let label_value = ['Age', 'Sex', 'Chest Pain', 'Blood Pressure', 
          'Serum Cholestoral', 'Fasting Blood Sugar', 'Resting ECG', 
          'Max Heart Rate', 'Exercise Ind. Angina', 'ST depression induced',
          'Slope of the peak exercise ST segment', 
          'Number of major vessels colored by flourosopy',
          'Thalassemia'
          ]
        let prediction_results = this.state.prediction_results;
        return (
          <div className="datapred-div">
            <Nav/>
            <div id="error-message-id" className="error-message hide">
              <p>{this.state.error_message}</p>
            </div>
            <h1>CS9321 19T1 Assignment 3</h1>
            <h2>Data Prediction</h2>
            <h3>Models And Their Accuracies</h3>
            <div className="datapred-table-div">
              <Table className="datapred-table">
                <TableHead className="datapred-table-head">
                  <TableRow className="datapred-table-row">
                    <TableCell className="datapred-table-cell">
                      Models
                    </TableCell>
                    <TableCell className="datapred-table-cell">
                      Accuracies
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="datapred-table-body">
                  {Object.keys(accuracies_value).map(function(key) {
                    return <TableRow className="datapred-table-row">
                              <TableCell className="datapred-table-cell">
                                {key}
                              </TableCell>
                              <TableCell className="datapred-table-cell">
                                {accuracies_value[key]}
                              </TableCell>
                            </TableRow>
                  })}
                </TableBody>
              </Table>
            </div>
            <form className="datapred-form">
              <h2 className="datapred-form-heading">Enter data for prediction</h2>

              <div className="row">
                <label label="model" className="col-25">Select Prediction Model:</label>
                {/* <Input type="Number" className="datapred-field col-75" id="model" value={this.state.current_entry['model']} onChange={this.handleChange}></Input> */}
                <select>
                  {models.map(value=>{
                    return <option value={value} onChange={this.handleChange}>{value}</option>
                  })}
                  {/* <option value="grapefruit">Grapefruit</option>
                  <option value="lime">Lime</option>
                  <option selected value="coconut">Coconut</option>
                  <option value="mango">Mango</option> */}
                </select>
              </div>


              <div className="row">
                <label label="age" className="col-25">Age:</label>
                <Input type="Number" className="datapred-field col-75"  id="age" value={this.state.current_entry['age']} onChange={this.handleChange}></Input>
              </div>

              <div className="row">
                <label label="sex" className="col-25">Sex:</label>
                <div className="col-75">
                  <Radio id="sex" label="Male" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['sex'] === '1'} value="1"></Radio>Male (1)
                  <Radio id="sex" label="Female" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['sex'] === '0'} value="0"></Radio>Female (0)
                </div>
              </div>

              <div className="row">
                <label label="chest pain type" className="col-25">Chest Pain:</label>
                <div className="col-75">
                  <Radio id="chest pain type" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['chest pain type'] === '1'} value="1"></Radio>Typical angin (1)
                  <Radio id="chest pain type" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['chest pain type'] === '2'} value="2"></Radio>Atypical angina (2)
                  <Radio id="chest pain type" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['chest pain type'] === '3'} value="3"></Radio>Non-anginal pain (3)
                  <Radio id="chest pain type" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['chest pain type'] === '4'} value="4"></Radio>Asymptomatic (4)
                </div>
              </div>

              <div className="row">
                <label label="resting blood pressure" className="col-25">Blood Pressure:</label>
                <Input type="Number" className="datapred-field col-75" id="resting blood pressure" value={this.state.current_entry['resting blood pressure']} onChange={this.handleChange}></Input>
              </div>

              <div className="row">
                <label label="serum cholestrol (mg/dl)" className="col-25">Serum Cholestoral:</label>
                <Input type="Number" className="datapred-field col-75" id="serum cholestrol (mg/dl)" value={this.state.current_entry['serum cholestrol (mg/dl)']} onChange={this.handleChange}></Input>
              </div>

              <div className="row">
                <label label="fasting blood sugar > 120 mg/dl" className="col-25">Fasting Blood Sugar:</label>
                <Radio id="fasting blood sugar > 120 mg/dl" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['fasting blood sugar > 120 mg/dl'] === '0'} value="0"></Radio>0
                <Radio id="fasting blood sugar > 120 mg/dl" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['fasting blood sugar > 120 mg/dl'] === '1'} value="1"></Radio>1
              </div>

              <div className="row">
                <label label="resting electrocardiographic results" className="col-25">Resting ECG:</label>
                <div className="col-75">
                  <Radio id="resting electrocardiographic results" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['resting electrocardiographic results'] === '0'} value="0"></Radio>Normal (0)
                  <Radio id="resting electrocardiographic results" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['resting electrocardiographic results'] === '1'} value="1"></Radio>Having ST-T Wave Abnormality (1)
                  <Radio id="resting electrocardiographic results" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['resting electrocardiographic results'] === '2'} value="2"></Radio>Showing probable or definite left ventricular hypertrophy by Estes’ criteria (2)
                </div>
              </div>

              <div className="row">
                <label label="maximum heart rate achieved" className="col-25">Max Heart Rate:</label>
                <Input type="Number" className="datapred-field col-75" id="maximum heart rate achieved" value={this.state.current_entry['maximum heart rate achieved']} onChange={this.handleChange}></Input>
              </div>

              <div className="row">
                <label label="exercise induced angina" className="col-25">Exercise Ind. Angina:</label>
                <Radio id="exercise induced angina" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['exercise induced angina'] === '0'} value="0"></Radio>0
                <Radio id="exercise induced angina" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['exercise induced angina'] === '1'} value="1"></Radio>1
              </div>

              <div className="row">
                <label label="oldpeak = ST depression induced by exercise relative to rest" className="col-25">ST depression induced:</label>
                <Input type="Number" className="datapred-field col-75" id="oldpeak = ST depression induced by exercise relative to rest" value={this.state.current_entry['oldpeak = ST depression induced by exercise relative to rest']} onChange={this.handleChange}></Input>
              </div>

              <div className="row">
                <label label="the slope of the peak exercse ST segment" className="col-25">Slope of the peak exercise ST segment:</label>
                <Radio id="the slope of the peak exercse ST segment" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['the slope of the peak exercse ST segment'] === '1'} value="1"></Radio>1
                <Radio id="the slope of the peak exercse ST segment" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['the slope of the peak exercse ST segment'] === '2'} value="2"></Radio>2
                <Radio id="the slope of the peak exercse ST segment" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['the slope of the peak exercse ST segment'] === '3'} value="3"></Radio>3
              </div>

              <div className="row">
                <label label="number of major vessels coloured by fluroscopy" className="col-25">Number of major vessels colored by flourosopy:</label>
                <div className="col-75">
                  <Radio id="number of major vessels coloured by fluroscopy" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['number of major vessels coloured by fluroscopy'] === '0'} value="0"></Radio>0
                  <Radio id="number of major vessels coloured by fluroscopy" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['number of major vessels coloured by fluroscopy'] === '1'} value="1"></Radio>1
                  <Radio id="number of major vessels coloured by fluroscopy" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['number of major vessels coloured by fluroscopy'] === '2'} value="2"></Radio>2
                  <Radio id="number of major vessels coloured by fluroscopy" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['number of major vessels coloured by fluroscopy'] === '3'} value="3"></Radio>3
                </div>
              </div>

              <div className="row">
                <div className="col-25">
                  <label label="thal">Thalassemia:</label>
                </div>
                <div className="col-75">
                  <Radio id="thal" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['thal'] === '3'} value="3"></Radio>Normal (3)
                  <Radio id="thal" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['thal'] === '6'} value="6"></Radio>Fixed Defect (6)
                  <Radio id="thal" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['thal'] === '7'} value="7"></Radio>Reversable Defect (7)
                </div>
              </div>


              {/* <div className="row">
                <label label="target" className="col-25">Heart Disease:</label>
                <div className="col-75">
                  <Radio id="target" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['target'] === '0'} value="0"></Radio>No
                  <Radio id="target" className="datapred-field" onChange={this.handleChange} checked={this.state.current_entry['target'] === '1'} value="1"></Radio>Yes
                </div>
              </div> */}

              <div className="row">
                <div className="col-25"></div>
                <div className="col-75">
                  <div className="datapred-btn-div">
                    <Button variant="contained" color="primary" className="datapred-btn" onClick={this.saveEntry}>Save Entry</Button>
                  </div>
                  <div className="datapred-btn2-div">
                    <Button variant="contained" color="secondary" className="datapred-btn2" onClick={this.postEntries}>Post Entries</Button>
                  </div>
                </div>
              </div>
            </form>
            <div id="datapred-predict-div" className="datapred-predict-table hide">
              <h2>
                Predictions Result
              </h2>
              <div className="row">
                <Button variant="contained" color="secondary" className="datapred-btn-hide" onClick={this.hidePrediction}>Hide</Button>
              </div>
              <div className="datapred-table-div">
                <Table className="datapred-table">
                  <TableHead className="datapred-table-head">
                    <TableRow className="datapred-table-row">
                      <TableCell className="datapred-table-cell">
                        Sr. Number
                      </TableCell>
                      {label_value.map((value)=> {
                        return <TableCell className="datapred-table-cell">
                          {value}
                        </TableCell>
                      })}
                      <TableCell className="datapred-table-cell">
                        Heart Disease:
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="datapred-table-body">
                    {prediction_results.map(function (prediction_value,key) {
                      return <TableRow className="datapred-table-row">
                        <TableCell className="datapred-table-cell">
                          {key}
                        </TableCell>
                        {keys_arr.map((value) => {
                          return <TableCell className="datapred-table-cell">
                            {prediction_value[value]}
                          </TableCell>
                        })}
                        <TableCell className="datapred-table-cell">
                          {prediction_value['target']}
                        </TableCell>
                      </TableRow>
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="datapred-stored">
                
              </div>
            </div>
          </div>
        );
      }
    }
}

export default DataPrediction;
