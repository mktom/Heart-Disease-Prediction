'''
COMP9321 19T1 Assignment 3 | Group Project: Heart Disease
Authors:
    Jonathan Charles, z5115933
    Mark Thomas,
    Sudhan Maharjan, z5196539
    Gagandeep Nain, z5137193

Description:
    Data Model
'''

import pandas as pd
from io import StringIO

# Constants
F_NAME = "processed.cleveland.data"

# FEATURE_IDX
(AGE, SEX, CP, BP, CHOL, BS, ECG, HR, EX, DEP, SLOPE, NUM_VES, THAL, TARGET) = range(14)

FEATURES =  ("age",
            "sex",
            "chest pain type",
            "resting blood pressure",
            "serum cholestrol (mg/dl)",
            "fasting blood sugar > 120 mg/dl",
            "resting electrocardiographic results",
            "maximum heart rate achieved",
            "exercise induced angina",
            "oldpeak = ST depression induced by exercise relative to rest",
            "the slope of the peak exercse ST segment",
            "number of major vessels coloured by fluroscopy",
            "thal",
            "target"
            )


# categorical columns
cat_cols = [FEATURES[SEX], FEATURES[CP], FEATURES[BS], FEATURES[ECG], FEATURES[EX], FEATURES[SLOPE],
FEATURES[NUM_VES], FEATURES[THAL], FEATURES[TARGET]]

# numeric columns
num_cols = [FEATURES[AGE], FEATURES[BP], FEATURES[CHOL],FEATURES[HR], FEATURES[DEP]]


def csv_df(f_name, no_target=False, col_header=False, cleanse=True):
    '''
    Reads CSV and returns data frame
    :param f_name: csv filename
    :param no_target: removes target column from the dataframe
    :col_header: adds column header
    :return: data frame from given csv
    '''

    # if f_name is None or not f_name.endswith(".csv"):
    #     print("Invalid CSV file.")
    #     return None

    df = pd.read_csv(f_name, na_values="?")

    if no_target:
        df = df.drop(TARGET)

    if col_header:
        df.columns = list(FEATURES)
    
    if cleanse and col_header:
        df = cleanse_df(df)
    return df

def string_csv_df(str_csv, col_header=False):
    '''
    Reads CSV data from a string
    '''
    # data = StringIO(str_csv)
    df = pd.read_csv(pd.compat.StringIO(str_csv), header=None)

    if col_header:
        df.columns = list(FEATURES[:13])
    
    return df


def cleanse_df(df, drop_dup=True, remove_missing=True):
    '''
    Cleansing of dataframe. Also updates Target columns to 1 for all 
    non-zero values
    :param drop_dup: removes duplicate records
    :param remove_missing: removes records with '?'

    '''
    # Remove duplicate
    if drop_dup:
        df=df.drop_duplicates()

    # Remove rows with "?"
    if remove_missing:
        df=df[~df.isnull().any(1)]

    # Sets target value to 1 for all the non zero values
    df[FEATURES[TARGET]] = (df[FEATURES[TARGET]] != 0).astype(int)
   
    return df


# DEBUG
def info_df(df):
    pd.set_option('display.expand_frame_repr', False)
    print ("Length : " , len(df))
    print(df.head().to_string(index=False))
    
    df.columns=FEATURES

    print('\n', 'Description :')
    print(df.describe())
    df.info()


def null_cols():
    df = csv_df(F_NAME, col_header=True,cleanse=False)
    
    # rows with null values
    print("Rows in null values")
    print(df[df.isnull().any(1)])

    #columns with null values
    print(df.isnull().sum())

#null_cols()

# DEBUG
def print_df_clean(df):
    print(df.to_string(index=False))

#info_df(csv_df(F_NAME, col_header=True))