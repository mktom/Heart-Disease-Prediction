from ml import *
from dm import *
import pandas as pd

# test to see how many of the test data used for training are
# correctly predicted

# this passes all the training data to the model, 
# gets the result and compare with actual target value
# Gives count for Correct Prediction and Incorrect Prediction


def test_models(df, target, model):
    f_name = 'models/' + model[0]
    with open(f_name, 'rb') as f:
        m = pickle.load(f)
        pred = df.apply(
            lambda i: m.predict([i])[0], axis=1
        )

        n_df = pd.concat([pred, target], axis = 1)
        n_df.columns=['Prediction', 'Target']
        n_df['Match'] = n_df.apply(
            lambda x : 'Correct' if x['Prediction'] == x['Target'] else 'Incorrect', axis=1
        )

        print('Model : ', model[1])
        print('--------------------------------')
        print(n_df.groupby('Match').count(), '\n')



(_,_,_,_),df, t = prep_data()
for m in [('log_reg_model.pkl', 'Logistic Regression'), ('knn_model.pkl', 'kNN Model'),\
     ('svc_model.pkl', 'SVC Model'), ('dt_model.pkl', 'Decision Tree'), ('rf_model.pkl', 'Random Forest')]:
    test_models(df, t, m)

# (_,_,_,_),df, t = prep_data()

# with open('svc_model.pkl', 'rb') as f:
#     m = pickle.load(f)

# predictions = df.apply(
#     lambda i: m.predict([i])[0], axis=1
# )

# # print(type(predictions))
# # print(type(t))

# d = pd.concat([predictions, t], axis = 1)
# d.columns=['Prediction', 'Target']
# d['Match'] = d.apply(lambda x : 'Correct' if x['Prediction'] == x['Target'] else 'Incorrect', axis=1)
# # print_df_clean(d)

# print(d.groupby('Match').count())
# print(250/296)



def rand_test():
    # Execute store() before predic
    # predict('49.0,1.0,2.0,130.0,266.0,0.0,0.0,171.0,0.0,0.6,1.0,0.0,3.0') # target 0
    # predict('50.0,0.0,3.0,120.0,219.0,0.0,0.0,158.0,0.0,1.6,2.0,0.0,3.0') # target 0
    # predict('58.0,1.0,2.0,120.0,284.0,0.0,2.0,160.0,0.0,1.8,2.0,0.0,3.0') # target 1
    # predict('62.0,0.0,4.0,140.0,268.0,0.0,2.0,160.0,0.0,3.6,3.0,2.0,3.0') # target 3
    pass