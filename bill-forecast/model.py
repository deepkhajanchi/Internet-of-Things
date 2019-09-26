import pandas as pd
from sklearn import linear_model
import matplotlib.pyplot as plt
import pickle

# Getdataset
dataframe = pd.read_csv('data.csv')
x_values = dataframe[['units']]
y_values = dataframe[['price']]

#train model on data
model = linear_model.LinearRegression()
model.fit(x_values, y_values)

# save model
with open('price-forecast-model.pickle','wb') as f:
    pickle.dump(model, f)

print("model created")