# http://nilc.icmc.usp.br/nilc/index.php/repositorio-de-word-embeddings-do-nilc
# https://github.com/explosion/spaCy/issues/2298

# http://nilc.icmc.usp.br/nilc/index.php/repositorio-de-word-embeddings-do-nilc

# Como Utilizar
# Agora os modelos estão corrigidos para serem carregados somente utilizando o KeyedVectors do gensim.
# Além disso, todas as embeddings estão sendo carregadas como unicode.
# Para executar os modelos e utilizar os vetores pré-treinados, siga os passos abaixo.
#  	Instalar
# pip install gensim==4.3.1 #última versão validada mas deve funcionar com versões mais recentes...seguimos acompanhando
# Rodar
# from gensim.models import KeyedVectors
# model = KeyedVectors.load_word2vec_format(‘model.txt’)
#

import sqlite3
import pickle

import numpy as np
from numpy import array


def create_word2vec_table():
    con = sqlite3.connect("data.db")
    con.execute("PRAGMA journal_mode=WAL")
    cur = con.cursor()
    cur.execute(
        """create table if not exists embedding (word TEXT PRIMARY KEY, vector BLOB)"""
    )
    cur.execute(
        """create table if not exists tests (id INTEGER NOT NULL,
                                            date DATETIME NOT NULL,
                                            time TIME NOT NULL, 
                                            palavra_sonda TEXT NOT NULL,
                                            palavra_respondida TEXT,
                                            similaridade FLOAT NOT NULL)"""
    )
    con.commit()


def upload_embedding():
    con = sqlite3.connect("data.db")
    con.execute("PRAGMA journal_mode=WAL")
    cur = con.cursor()
    con.execute("DELETE FROM embedding")
    # with open("glove_s100.txt", "r", encoding="utf-8") as w2v_file:
    with open("words-new.txt", "r", encoding="utf-8") as w2v_file:

        _ = w2v_file.readline()
        for n, line in enumerate(w2v_file):

            words = line.rstrip().split(" ")
            word = words[0]
            vector = array([float(w1) for w1 in words[1:]])

            print('word', word, '\nvector: ', vector)
            cur.execute(
                """INSERT INTO embedding values (?, ?)""", (word, pickle.dumps(vector))
            )
            if n % 100000 == 0:
                print(f"processed {n} (+1) lines")
                con.commit()
    con.commit()
    con.close()


def main():
    create_word2vec_table()
    upload_embedding()


if __name__ == "__main__":
    main()
