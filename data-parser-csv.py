import os
import pandas as pd

df = pd.read_csv('../bkps/20231011/flask_wa/DataBaseOct2023.csv', sep=',',header=None, low_memory=False)
df.iloc[1:].to_csv('./words20231011.txt', sep=' ', header=None, index=False)

rows, cols = df.iloc[1:].shape 
print('rows: ', rows, 'cols: ', cols)


with open('./words20231011.txt', 'r') as file:
    content = file.read()

with open('./words20231011.txt', 'w') as file:
    file.write(str(rows) + ' ' + str(cols) + '\n' + content)

