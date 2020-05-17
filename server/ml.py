'''
COMP9321 19T1 Assignment 3 | Group Project: Heart Disease
Authors:
    Jonathan Charles, z5115933
    Mark Thomas, z5194597
    Sudhan Maharjan, z5196539
    Gagandeep Nain, z5137193

Description:
    ML Models


Steps : 
--------------
- Load and cleanse available dataset
- Visualise and analyse data, Feature Selections
- Train the model using dataset, dataset can be divided into training set and test set (80/20)
- Make Prediction on testing set
- Trained Model can be stored/dump with pickle 
- Use the trained model to predict the new data 


Refs:
https://scikit-learn.org
https://medium.freecodecamp.org/a-beginners-guide-to-training-and-deploying-machine-learning-models-using-python-48a313502e5a
https://github.com/kochansky/heart-disease-prediction/blob/master/Heart_Disease_project.ipynb
https://towardsdatascience.com/predicting-presence-of-heart-diseases-using-machine-learning-36f00f3edb2c
'''
from collections import defaultdict

import numpy as np
import pandas as pd
import pickle

# Graphs/Charts
import matplotlib.pyplot as plt
import seaborn as sb

# ML
from sklearn.linear_model import LogisticRegression
from sklearn.linear_model import LinearRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import KFold, cross_val_score, cross_val_predict
from sklearn import metrics

# DataModel
from dm import *

# Supress Warnings about future deprecation
import warnings
warnings.filterwarnings('ignore')

(log_reg_model, log_reg_model_cv, knn_model, knn_model_cv, svc_model, svc_model_cv, dt_model, dt_model_cv, rf_model, rf_model_cv) = range(10)
MODELS  =   ('Logistic Regression', 'Logistic Regression CV',
            'kNN Model (k=20)', 'kNN Model (k=20) CV',
            'Support Vector Classifier', 'Support Vector Classifier CV',
            'Decision Tree', 'Decision Tree CV',
            'Random Forrest', 'Random Forrest CV'
            )
FILE_NAMES = {
    MODELS[log_reg_model]:      'log_reg_model.pkl',
    MODELS[knn_model]:          'knn_model.pkl',
    MODELS[svc_model]:          'svc_model.pkl',
    MODELS[dt_model]:           'dt_model.pkl',
    MODELS[rf_model]:           'rf_model.pkl',
}

# Visualise
def Visualise():
    df = csv_df(F_NAME, col_header=True, no_target=True)
    sb.pairplot(df, x_vars=FEATURES[:13], y_vars='Target', size=7, aspect =0.7, kind='reg')
    plt.show()

# Visualise()

# Analysis
def corr():
    df = csv_df(F_NAME, col_header=True, no_target=True)

    # rcParams['figure.figsize'] = 20, 14
    plt.matshow(df.corr())
    plt.yticks(np.arange(df.shape[1]), df.columns)
    plt.xticks(np.arange(df.shape[1]), df.columns)
    plt.colorbar()
    plt.show()
# corr()


def hist():
    data = csv_df(F_NAME, col_header=True, no_target=True)
    data.hist()
#hist()


# Preparation for ML Models
def prep_data():
    '''
    Returns data splited for training and testing
    Using 20% split
    '''
    df = csv_df(F_NAME, col_header=True, cleanse=True)
    t = df.target                    # target

    # Scaling
    f = StandardScaler().fit_transform(df)
    f = df[list(FEATURES)[:13]]      # features

    # random_state for reproducibility
    return train_test_split(f, t, random_state=42, test_size=0.2), f, t


def train_ml_model(classifier, **classifier_args):
    '''
    Model Accuracy check with Train Test
    '''
    (X_train, X_test, y_train, y_test), _,_ = prep_data()

    m = classifier(**classifier_args)
    m.fit(X_train, y_train)

    y_pred = m.predict(X_test)

    return m, metrics.accuracy_score(y_test, y_pred)


def train_ml_model_cv(classifier, **classifier_args):
    '''
    Model Accuracy check with cross validation
    '''
    (_, _, _, _), X, y = prep_data()
    m = classifier(**classifier_args)
    cv_logreg_score = cross_val_score(m, X, y, cv=10, scoring='accuracy').mean()

    return m, cv_logreg_score


# Model : Logistic Regression
def log_reg():
    m, acc = train_ml_model(LogisticRegression)
    # print(acc) # 0.9166666666666666
    return m, acc
# log_reg()


def log_reg_cv():
    m, acc_cv = train_ml_model_cv(LogisticRegression)
    # print(acc_cv) #0.8312315270935962
    return m, acc_cv
# log_reg_cv()


# Model : kNN
def knn():
    m, acc = train_ml_model(KNeighborsClassifier, n_neighbors=20)
    # print(acc) # 0.7
    return m, acc
#knn()

def knn_cv():
    m, acc_cv = train_ml_model_cv(KNeighborsClassifier, n_neighbors=20)
    # print(acc_cv) #0.6758949096880132
    return m, acc_cv
#knn_cv()


# Model : SVM
def svm():
    # max_svc_acc = 0
    # for k in ['linear', 'rbf', 'poly', 'sigmoid']: # kernels
    #     m, acc = train_ml_model(SVC, kernel=k)
    #     if acc > max_svc_acc:
    #         max_svc_acc = acc
    # return m, max_svc_acc

    m, acc = train_ml_model(SVC, kernel='linear')
    # print(acc) #0.9166666666666666
    return m, acc
# svm()

def svm_cv():
    m, acc_cv = train_ml_model_cv(SVC, kernel='linear')
    # print(acc_cv) # 0.8276683087027916
    return m, acc_cv
# svm_cv()



# Model : Decision Trees
def dt():
    m, acc = train_ml_model(DecisionTreeClassifier, random_state=42)
    # print(acc) # 0.7833333333333333
    return m, acc
# dt()

def dt_cv():
    m, acc_cv = train_ml_model_cv(DecisionTreeClassifier, random_state=42)
    # print(acc_cv) # 0.7366091954022989
    return m, acc_cv
# dt_cv() 


# Model : Random Forest
def rf():
    m, acc = train_ml_model(RandomForestClassifier, random_state=42)
    # print(acc) #0.8666666666666667
    return m, acc
# rf()

def rf_cv():
    m, acc_cv = train_ml_model_cv(RandomForestClassifier, random_state=42)
    # print(acc_cv) # 0.7936371100164203
    return m, acc_cv
# rf_cv()

def model_accuracy_scores():
    m_s = {}
    m_s['Logistic Regression'] = log_reg()[1]
    m_s['Logistic Regression CV'] = log_reg_cv()[1]
    m_s['K-Nearest Neighbours(KNN)'] = knn()[1]
    m_s['K-Nearest Neighbours(KNN) CV'] = knn_cv()[1]
    m_s['Support Vector Classifier'] = svm()[1]
    m_s['Support Vector Classifier CV'] = svm_cv()[1]
    m_s['Decision Tree'] = dt()[1]
    m_s['Decision Tree CV'] = dt_cv()[1]
    m_s['Random Forrest'] = rf()[1]
    m_s['Random Forrest CV'] = rf_cv()[1]

    return m_s


# mas = model_accuracy_scores()
# print("Model Accuracies")
# print("==================")
# for k, v in mas.items():
#     print('{:30}'.format(k), v)


# Model Accuracies (Without Scaling)
# ==================
# Logistic Regression            0.9166666666666666
# Logistic Regression CV         0.9166666666666666
# K-Nearest Neighbours(KNN)      0.7
# K-Nearest Neighbours(KNN) CV   0.7
# Support Vector Classifier      0.9166666666666666
# Support Vector Classifier CV   0.8276683087027916
# Decision Tree                  0.7833333333333333
# Decision Tree CV               0.7366091954022989
# Random Forrest                 0.8666666666666667
# Random Forrest CV              0.7936371100164203

# Best model seems to be SVC


# Model Accuracies (With Scaling)
# ==================
# Logistic Regression            0.9
# Logistic Regression CV         0.9
# K-Nearest Neighbours(KNN)      0.9
# K-Nearest Neighbours(KNN) CV   0.9
# Support Vector Classifier      0.9
# Support Vector Classifier CV   0.8311165845648605
# Decision Tree                  0.7833333333333333
# Decision Tree CV               0.7366091954022989
# Random Forrest                 0.8666666666666667
# Random Forrest CV              0.7936371100164203

def store(X_train, y_train, mname, filename, classifier, **classifier_args):
    print('Storing ', mname, ' ... ', end="")
    
    m = classifier(**classifier_args)
    m.fit(X_train, y_train)

    with open(filename, 'wb') as f:
        pickle.dump(m, f)
        print('DONE. Filename :', filename)


def store_all():
    (X_train, X_test, y_train, y_test), _,_ = prep_data()

    store(X_train, y_train, "Logistic Regression", "log_reg_model.pkl", LogisticRegression)
    store(X_train, y_train, "kNN Model (k=20)", "knn_model.pkl", KNeighborsClassifier, n_neighbors=20)
    store(X_train, y_train, "Support Vector Classifier", "svc_model.pkl", SVC, kernel='linear')
    store(X_train, y_train, "Decision Tree Classifier", "dt_model.pkl", DecisionTreeClassifier, random_state=42)
    store(X_train, y_train, "Random Forest Classifier", "rf_model.pkl", RandomForestClassifier, random_state=42)

# store_all()

def predict(test_str, model):
    filename = FILE_NAMES[model]
    with open(filename, 'rb') as f:
        m = pickle.load(f)
    
    # m, _ = log_reg()

    X_test = string_csv_df(test_str, col_header=True)
    y_pred = m.predict(X_test)
    return get_target(y_pred)
    
def get_target(y_pred):
    return_target_array = []
    for y in y_pred:
        if (y == 0):
            return_target_array.append('Not Present')
        else:
            return_target_array.append('Present')
    return return_target_array

