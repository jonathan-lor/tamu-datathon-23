import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow import keras
from tensorflow.keras import layers

# Equation for Cleaning data
def clean_Sex(x):
    if x.lower() == "male" or x.lower() == "m" or x == 1:
        return "male"
    elif x.lower() == "female" or x.lower() == "f":
        return "female"

def fill_na(x):
    if math.isnan(x):
        return 0
    else:
        return x

def data_preprocessing(df):
    #Apply fill_na to numeric columns
    for col in df.columns:
        if df[col].dtype in [np.int64, np.float64]:
            df[col] = df[col].apply(fill_na)

    #ONE HOT ENCODING
    encoding_columns = ["sex", "dnr", "primary", "disability", "extraprimary", "cancer", "race"]

    for i in encoding_columns:
        newCols = pd.get_dummies(df[i], prefix=i)
        df = pd.concat([df, newCols], axis=1)
        df = df.drop(columns=[i])
    
    #drop un important features
    drop_cols = ["cost", "income", "pdeath"]
    df = df.drop(columns=drop_cols)

    #change columns type for model training
    for i in df.columns:
    try:
        df[i] = df[i].astype(float)
    except ValueError:
        pass
        
    return df
    
def split_feature_label(df):
    y = df['death']
    X = df.drop(columns=['death'])
    return y, X
    

def standardize(X):
    scaler = StandardScaler()
    scaler.fit(X)
    X = scaler.transform(X)
    return X

def train_model(X, y):

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    #Random Forest
    rf = RandomForestClassifier()
    param_grid_RF = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20],
        'min_samples_split': [2, 5, 10],
        'criterion': ['gini', 'entropy']
    }

    # Perform GridSearchCV for hyperparameter tuning
    rf_model = GridSearchCV(rf, param_grid_RF, cv=3, n_jobs=-1)
    rf_model.fit(X_train, y_train)

    y_pred_RF = rf_model.predict_proba(X_test)[:,1]

    #XG Boost
    xgb = XGBClassifier()
    param_grid_XGB = {
        'n_estimators': [50, 100, 200, 500, 1000],
        'learning_rate': [0.01, 0.1, 0.2, 0.4, 0.7, 1],
        'max_depth': [3, 4, 5, 8, 10],
        'booster': ['gbtree', 'gblinear', 'dart']
    }

    xgb_model = GridSearchCV(xgb, param_grid_XGB, cv=3, n_jobs=-1)
    xgb_model.fit(X_train, y_train)

    y_pred_XGB = xgb_model.predict_proba(X_test)[:,1]

    #AdaBoost
    ada = AdaBoostClassifier()

    param_grid_ADA = {'n_estimators': [50, 100, 200, 300, 400, 500, 1000],
                'learning_rate': [ 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                'algorithm': ['SAMME', 'SAMME.R']}

    ada_model = GridSearchCV(ada, param_grid_ADA, cv=5)
    ada_model.fit(X_train, y_train)

    y_pred_ADA = ada_model.predict_proba(X_test)[:,1]

    #Print Results
    rocauc_RF = roc_auc_score(y_test, y_pred_RF)
    rocauc_XGB = roc_auc_score(y_test, y_pred_XGB)
    rocauc_ADA = roc_auc_score(y_test, y_pred_ADA)
    print("Random Forest: ", rocauc)
    print("XGBoost: ", rocauc_XGB)
    print("AdaBoost: ", rocauc_ADA)

    #Save best model
    best_model = None
    if(rocauc_RF > rocauc_XGB and rocauc_RF > rocauc_ADA):
        best_model = rf_model
    elif(rocauc_XGB > rocauc_RF and rocauc_XGB > rocauc_ADA):
        best_model = xgb_model
    else:
        best_model = ada_model

    model_filename = 'best_model.pkl' 
    joblib.dump(best_model, model_filename)

    
    #PLotting 
    import matplotlib.pyplot as plt
    from sklearn.metrics import roc_auc_score, roc_curve

    fpr_rf, tpr_rf, thresholds_rf = roc_curve(y_test, y_pred_RF)
    fpr_xgb, tpr_xgb, thresholds_xgb = roc_curve(y_test, y_pred_XGB)
    fpr_ada, tpr_ada, thresholds_ada = roc_curve(y_test, y_pred_ADA)
    plt.figure(figsize=(8, 6))
    plt.plot(fpr_rf, tpr_rf, color='green', lw=2, label=f'ROC curve Random Forest (area = {rocauc_RF:.2f})')
    plt.plot(fpr_xgb, tpr_xgb, color='red', lw=2, label=f'ROC curve XGBoost(area = {rocauc_XGB:.2f})')
    plt.plot(fpr_ada, tpr_ada, color='blue', lw=2, label=f'ROC curve AdaBoost(area = {rocauc_ADA:.2f})')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (ROC) Curve')
    plt.legend(loc="lower right")
    plt.show()



if __name__ == "__main__":
    data_path = './TD_HOSPITAL_TRAIN.csv'
    df = pd.read_csv(data_path)
    cleaned_data = data_preprocessing(df)
    y, X = split_feature_label(cleaned_data)
    X = standardize(X)
    train_model(X, y)
    