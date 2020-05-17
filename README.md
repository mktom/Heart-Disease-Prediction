# COMP9321 19T1 Assignment 3

## Heart Disease Group Project

### Getting Started

To install all dependencies, execute the following (or equivalent):
```
sudo yarn install
cd client
sudo yarn install
cd server
python -m pip install -r requirements
```

To then run the application, execute the following (or equivalent):
```
yarn start
```

The Web Application will be running on ```localhost:3000``` and the Flask Backend server on ```localhost:5000```

### Deployment

### Development Stack

We used a variety of technologies in our web application and as such, they have been divided by the component of our app they were used in.

#### General Development Stack

* [Yarn](https://yarnpkg.com/en/) - Package Management
    * [Concurrently](https://github.com/kimmobrunfeldt/concurrently) - Task Support

#### Front End Development Stack

* [React](https://reactjs.org/) - Front End Framework
    * [create-react-app](https://github.com/facebook/create-react-app) - Boilerplate client app
    * [Material-UI](http://material-ui.com) - UI
    * [react-chartjs-2](https://github.com/jerairrest/react-chartjs-2) - Graphs 

#### Back End Development Stack

* [pip](https://pip.pypa.io/en/stable/) - Python Package Management
    * [Flask](http://flask.pocoo.org/) - Web Services
    * [Flask-restplus](http://flask-restplus.readthedocs.io/) - Web Services
    * [Pandas](https://pandas.pydata.org/) - Data Manipulation
    * [Numpy](http://www.numpy.org/) - Data Manipulation
    * [Scikit-learn](https://scikit-learn.org) - Data Manipulation

### Design

We utilise a simple client-server model for our web application. The client was built with react and various components written for React and the server was written in Python-Flask utilising the Rest-plus extensions.
Using various python libraries we were able to process the data file provided with machine learning and yield an indicator of the most important features and a means to predict if a patient has heart disease.

### Models
Various Machine Learning Models were analysed and were trained and tested with train/test split method and cross validation method. The model accuracies are computed and listed. The trained models are then serialised with pickle for later use during prediction. The models are already available with the project and the models are regenerated during the server start.

The trained models can be regenerated and stored in backend by calling ```store_all()``` method available in ```ml.py```

```$ cd /server```<br/>
```$ python3 -c 'import ml; ml.store_all()'```

### Authors

* Jonathan Charles, z5115933
* Mark Thomas, z5194597
* Sudhan Maharjan, z5196539
* Gagandeep Nain, z5137193
