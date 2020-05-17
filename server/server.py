'''
COMP9321 19T1 Assignment 3 | Group Project: Heart Disease
Authors:
    Jonathan Charles, z5115933
    Mark Thomas, z5194597
    Sudhan Maharjan, z5196539
    Gagandeep Nain, z5137193

Description:
    Backend server
'''

import sys, json, re, requests, csv, platform, sqlite3, os, shutil
import matplotlib.pyplot as pypl
from flask import *
from flask_restplus import *
from flask_sqlalchemy import *
from flask_marshmallow import *
from ml import *
from pandas import *
from numpy import *
from sklearn import model_selection
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
import logging

app = Flask(__name__)
api = Api(app, version='1.0', title="Heart Disease Backend Server", description="Backend server for Heart Disease")
ns = api.namespace("api", description="Backend operations")

# Data Analysis Endpoint Setup
if platform.system() == 'Windows':
    fl_pth = "sqlite:///" + os.path.dirname(os.path.abspath(__file__)).strip('') + "/assn3.db"
else:
    fl_pth = "sqlite:////" + os.path.dirname(os.path.abspath(__file__)).strip('') + "/assn3.db"
app.config['SQLALCHEMY_DATABASE_URI'] = fl_pth
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHMEY_COMMIT_ON_TEARDOWN'] = True
db = SQLAlchemy(app)
marsh = Marshmallow(app)
logging.basicConfig(filename='Task_Two_Report.log', level=logging.INFO)

def build_db(nwdb_file):
    try:
        sql3 = sqlite3.connect(nwdb_file)
        print(sqlite3.version)
        sql3.close()

    except sqlite3.DatabaseError:
        print(sqlite3.DatabaseError)

class HeartData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    age = db.Column(db.Integer)
    sex = db.Column(db.Integer)
    chst_pn = db.Column(db.Integer)
    rst_bld_pres = db.Column(db.Integer)
    choles = db.Column(db.Integer)
    fst_bld_sug = db.Column(db.Integer)
    rst_electrocard = db.Column(db.Integer)
    mx_hrt_rt = db.Column(db.Integer)
    exer_ind_ang = db.Column(db.Integer)
    old_pk = db.Column(db.Float)
    slp_st_seg = db.Column(db.Integer)
    mjr_ves = db.Column(db.Integer)
    thal = db.Column(db.Integer)
    target = db.Column(db.Integer)

class HeartSchema(marsh.Schema):
    id = fields.fields.Int()
    age = fields.fields.Int(validate=lambda x: 21 > x <= 100)
    sex = fields.fields.Int(validate=lambda x: x == 0 or x == 1)
    chst_pn = fields.fields.Int(validate=lambda x: x in [0, 1, 2, 3])
    rst_bld_pres = fields.fields.Int(validate=lambda x: 70 >= x <= 190)
    choles = fields.fields.Int(validate=lambda x: 115 > x < 600)
    fst_bld_sug = fields.fields.Int(validate=lambda x: x == 0 or x == 1)
    rst_electrocard = fields.fields.Int(validate=lambda x: x in [0, 1, 2])
    mx_hrt_rt = fields.fields.Int(validate=lambda x: 70 >= x <= 220)
    exer_ind_ang = fields.fields.Int(validate=lambda x: x == 0 or x == 1)
    old_pk = fields.fields.Float(validate=lambda  x: 0.0 >= x <= 7.0)
    slp_st_seg = fields.fields.Int(validate=lambda x: x in [0, 1, 2])
    mjr_ves = fields.fields.Int(validate=lambda x: x in [0, 1, 2, 3])
    thal = fields.fields.Int(validate=lambda x: x in list(range(8)))
    target = fields.fields.Int(validate=lambda x: x == 0 or x == 1)

def cln_dta():
    dta_fl = [ky for ky in nem_ex.keys()]

    heart_schema = HeartSchema()
    nw_id = 1

    fh = open("processed.cleveland.data", "r")
    reader = csv.DictReader(fh, dta_fl)

    dup_rw = []

    for row in reader:
        hrt_dit = {}
        hrt_dit["id"] = nw_id
        nw_id += 1
        if row not in dup_rw:
            if '?' not in row.values():
                for ky, vl in row.items():
                    nw_vl = float(vl)
                    if ky not in ['old_pk', 'target']:
                        hrt_dit[ky] = int(nw_vl)
                    elif ky == 'target':
                        hrt_dit[ky] = int(str([1 if nw_vl != 0 else 0][0]))
                    else:
                        hrt_dit[ky] = nw_vl

                dup_rw.append(row)
                nw_rw = HeartData(**hrt_dit)
                valid = heart_schema.dump(nw_rw)

                if valid and db.session.query(HeartData).filter(HeartData.id == hrt_dit["id"]).first() is None:
                    db.session.add(nw_rw)
                    db.session.commit()
                elif valid and not db.session.query(HeartData).filter(HeartData.id == hrt_dit["id"]):
                    db.session.add(nw_rw)
                    db.session.commit()

    fh.close()

    gt_csv = db.session.query(HeartData)
    for itm in gt_csv:
        prt_rw.append({kys: vls for kys, vls in itm.__dict__.items() if kys not in ['_sa_instance_state', 'id']})

    return pandas.DataFrame.from_records(prt_rw)

def mdl_selc():
    y_val = pnda_data['target']
    x_val = pnda_data.drop(columns='target')

    x_trn, x_vldtn, y_trn, y_vldtn = model_selection.train_test_split(x_val, y_val, test_size=0.2, random_state=42)

    mdls = {}
    mdls['LogReg'] = LogisticRegression
    mdls['LinDiscrAnly'] = LinearDiscriminantAnalysis
    mdls['KNrNeigh'] = KNeighborsClassifier
    mdls['CART'] = DecisionTreeClassifier
    mdls['NB'] = GaussianNB
    mdls['SgVlMch'] = SVC

    res = []
    best_mn = 0
    best_mdl = ''

    logging.info("-*"*22)
    for ky in mdls.keys():
        kfld = model_selection.KFold(n_splits=10, random_state=10)
        if ky == 'LogReg':
            cv_res = model_selection.cross_val_score(mdls[ky](solver='liblinear', multi_class='ovr'),
                                                        x_trn, y_trn, cv=kfld, scoring='accuracy')
        else:
            cv_res = model_selection.cross_val_score(mdls[ky](), x_trn, y_trn, cv=kfld, scoring='accuracy')
        res.append(cv_res)
        logging.info(f"Name: {ky}  Mean: {cv_res.mean()} STD: {cv_res.std()}")
        if cv_res.mean() > best_mn:
            best_mdl = ky
            best_mn = cv_res.mean()
    logging.info("\n")

    nw_fig = pypl.figure()
    ax = nw_fig.add_subplot(111)
    pypl.boxplot(res)
    pypl.xticks(ticks=list(range(1, len(mdls.keys()) + 1)), labels=list(mdls.keys()))
    pypl.ylabel("Percentage")
    pypl.suptitle("Performance of Selected SciLearn Models on Heart Disease Data")
    nw_fig.savefig('plot_performance_scilearn_models.png', dpi=100)

    logging.info(f"This is the best model: {best_mdl}\n")
    logging.info(f"This is the best mean: {best_mn}\n")
    logging.info("-*"*22)

    rand_for = RandomForestClassifier()
    rand_for.fit(x_trn, y_trn)
    rand_for.score(x_vldtn, y_vldtn)

    feat_imp = pandas.DataFrame(rand_for.feature_importances_, index=x_trn.columns,
                                    columns=['importance']).sort_values('importance', ascending=False)

    logging.info("Feature Importance using Random Forest:\n", feat_imp, "\n-*"*22)
    return mdls, best_mdl, feat_imp, y_val

def prscn_chk():
    mdls, best_mdl, feat_imp, y_val = mdl_selc()
    prsc_acc = [(0, "")]
    i = 1
    prsc_y_vl = y_val
    fnl_feat = []

    while i <= feat_imp.shape[0] + 1:
        prsc_x_vl = pnda_data[list(feat_imp.index.values[:i])]
        x_trn, x_vldtn, y_trn, y_vldtn = model_selection.train_test_split(prsc_x_vl, prsc_y_vl, test_size=0.2, random_state=42)
        if best_mdl == 'LogReg':
            mdl_tst = mdls['LogReg'](solver='liblinear', multi_class='ovr')
        else:
            mdl_tst = mdls[best_mdl]()
        mdl_tst.fit(x_trn, y_trn)
        prdtn = mdl_tst.predict(x_vldtn)
        curr_acc = accuracy_score(y_vldtn, prdtn)

        sct_fig = pypl.figure(figsize=(14,14))
        ax = sct_fig.subplots(nrows=1, ncols=len(list(prsc_x_vl)), sharex=False, sharey=True)
        plt_1 = 0
        plt_2 = 0

        if len(list(prsc_x_vl)) == 1:
            plt_1 = ax.scatter(prsc_x_vl[list(prsc_x_vl)[0]].values, prsc_y_vl.values, cmap='B', alpha=0.1)
            sme_ax = pypl.axis()
            plt_2 = ax.scatter(x_vldtn.values[:, 0], prdtn, cmap='R', alpha=0.1)
            ax.set_xlabel(nem_ex[list(prsc_x_vl)[0]])
            pypl.axis(sme_ax)
        else:
            for all_clms in range(i):
                plt_1 = ax[all_clms].scatter(prsc_x_vl[list(prsc_x_vl)[all_clms]].values,
                                                    prsc_y_vl.values, cmap='B', alpha=0.15)
                sme_ax = pypl.axis()
                plt_2 = ax[all_clms].scatter(x_vldtn.values[:, all_clms], prdtn, cmap='R', alpha=0.1)
                ax[all_clms].set_xlabel(nem_ex[list(prsc_x_vl)[all_clms]], wrap=True)
                pypl.axis(sme_ax)
        pypl.ylabel(nem_ex['target'])
        pypl.figlegend([plt_1, plt_2], ['Actual', 'Predicted'], loc='best')
        pypl.suptitle(f"The Actutal vs Prediction for {len(list(prsc_x_vl))} "
                            f"variable{'s' if len(list(prsc_x_vl)) != 1 else ''}")

        if curr_acc - prsc_acc[-1][0] >= 0:
            logging.info("-*" * 22)
            logging.info(f"Columns considered from Feature_Importance: {list(prsc_x_vl)}\n")
            logging.info(f"Accuracy Report: {curr_acc}\n")
            logging.info(f"Difference between current and precious precision: {curr_acc - prsc_acc[-1][0]}\n")
            prsc_acc.append((curr_acc, f'plot_Accuracy_at_{prsc_acc[-1][0]}.png'))
            sct_fig.savefig(f'plot_Accuracy_at_{prsc_acc[-1][0]:.3f}.png', dpi=100)
            logging.info("Confusion Matrix:\n", confusion_matrix(y_vldtn, prdtn), "\n")
            logging.info("Classification Matrix\n:", classification_report(y_vldtn, prdtn), "\n")
            logging.info("-*" * 22)
        else:
            fnl_feat = list(prsc_x_vl)[:-1]
            logging.info("-*" * 22)
            logging.info(f"Columns considered from Feature_Importance: {list(prsc_x_vl)}\n")
            logging.info(f"Accuracy Report: {curr_acc}\n")
            logging.info(f"Difference between current and precious precision: {curr_acc - prsc_acc[-1][0]}\n")
            logging.info("Confusion Matrix:\n", confusion_matrix(y_vldtn, prdtn), "\n")
            logging.info("Classification Matrix\n:", classification_report(y_vldtn, prdtn), "\n")
            logging.info(f"The precision at this attribute has not improved the model any further, and therefore, "
                         f"the most important features are {[nem_ex[rep] for rep in fnl_feat]}.")
            logging.info("-*" * 22)
            break

        i += 1
    logging.shutdown()
    return [nem_ex[rep] for rep in fnl_feat], prsc_acc[1:]

@ns.route('/')
class DataSource(Resource):
    
    def get(self):
        with open("processed.cleveland.data", "r") as fh:    
            reader = csv.DictReader(fh,FEATURES)
            data = []
            for row in reader:
                data.append(json.dumps(row))
        return data

@ns.route('/analysis')
class AnalysisResource(Resource):

    def get(self):
        files = os.listdir(".")
        cwd = os.getcwd()
        dest = os.path.abspath("../client/public/images/")
        images = []
        for name in files:
            if (name.endswith(".png")):
                images.append(name)
                #print("Source: " + str(cwd) + "/" + str(name))
                #print("Dest: " + str(dest) + "/" +  str(name))
                shutil.copyfile(os.path.join(cwd,name), os.path.join(dest, name))
        with open("Task_Two_Report.log") as f:
            logData = f.readlines()
        ret = {
            "data": images,
            "logs": logData
        }
        return ret

@ns.route('/prediction')
class PredictionResource(Resource):

    def get(self):
        res = model_accuracy_scores()
        response = jsonify(res)
        response.status_code = 200
        return response

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('data', required=True, help="data payload")
        parser.add_argument('model', required=True, help="ml model")
        args = parser.parse_args()
        data = None
        model = None
        request_data = request.get_json(force=True)
        if (args['data'] and args['model']):
            data = request_data['data']
            model = request_data['model']
            data_string = ''
            for data_value in data:
                for key in FEATURES:
                    if (key == 'target'):
                        pass
                    elif(key == 'thal'):
                        data_string += str(data_value[key])
                    else:
                        data_string += str(data_value[key]) + ','
                data_string.rstrip(",")
                data_string += '\n'
            data_string.rstrip('\n')
            predict_target_value = predict(data_string, model)
            for i in range(len(predict_target_value)):
                data[i]['target'] = predict_target_value[i]
            res = {
                'result' : data
            }
            response = jsonify(res)
            response.status_code = 200
            return  response
        else:
            return 'Bad request as params are missing', 400

if __name__ == '__main__':
    # Running training model and storing in svc_model.pkl
    store_all()
    db.create_all()
    nem_ex = {"age": "Age",
            "sex": "Sex",
            "chst_pn": "Chest Pain",
            "rst_bld_pres": "Resting Blood Pressure",
            "choles": "Serum Cholesterol in mg/dl",
            "fst_bld_sug": "Fasting Blood sugar > 120 mg/dl",
            "rst_electrocard": "Resting Electrocardiograph Results",
            "mx_hrt_rt": "Max Heart Rate",
            "exer_ind_ang": "Exercise Induced Angina",
            "old_pk": "ST Depression Induced by Exercise Relative to Rest",
            "slp_st_seg": "Slope of the Peak Exercise ST Segment",
            "mjr_ves": "Number of Major Vessels Colored by Fluoroscopy",
            "thal": "Thalassemia",
            "target": "Has Heart Disease"}
    prt_rw = []
    pnda_data = cln_dta()
    prscn_chk()
    build_db("assn3.db")
    app.run(debug=True, port=5000)
