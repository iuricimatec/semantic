import os
import sqlite3
import pandas as pd

df_words = pd.read_csv(path + 'dataset/Words_NoWordFreq.txt', sep=' ',header=None)
df_words = pd.DataFrame(df_words.iloc[:,0])
df_vectors = pd.read_csv(path + 'dataset/Vectors_NoWordFreq.txt', sep=' ',header=None)
df = pd.concat([df_words,df_vectors],axis=1)
df.to_csv(path + 'dataset/words-new.txt', sep=' ', index=False)