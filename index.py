##$env:FLASK_APP="wa-api.py"
# from types import NoneType
from flask import (
    Flask,
    request,
    jsonify,
    send_file,
    send_from_directory,
)
import sqlite3
import pickle


app = Flask(__name__)


@app.route("/")
def home():
    return send_file("static/index.html")


@app.route("/assets/<path:path>")
def send_static(path):
    return send_from_directory("static/assets", path)


@app.route("/model/<string:word>")
def word(word):
    try:
        con = sqlite3.connect("data.db")
        cur = con.cursor()
        res = cur.execute("SELECT vector FROM embedding WHERE word = ?", (word,))
        res = cur.fetchone()
        con.close()
        if isinstance(res, NoneType):
            return ""
        res = list(res)
        res = res[0]
        return jsonify(list(pickle.loads(res)))

    except Exception as e:
        print(e)
        return jsonify("Erro")


@app.route("/model2/<string:word_1>/<string:word_2>")
def model2(word_1, word_2):
    print('running Function model2')
    print('w1: ',word_1, 'w2: ', word_2)
        
    row = []
    try:
        con = sqlite3.connect("data.db")
        cur = con.cursor()
        res = cur.execute("SELECT vector FROM embedding WHERE word = ? ", (word_1,))
        row.append(cur.fetchone())
        res = cur.execute("SELECT vector FROM embedding WHERE word = ? ", (word_2,))
        res = cur.fetchone()
        print('w1: ',word_1, 'w2: ', word_2)
        
        # if isinstance(res, NoneType):
        #     return ""
        row.append(res)
        if row:
            row = list(row)
        con.close()
        if not row:
            return jsonify("")
        vec_1 = row[0]
        vec_2 = row[1]
        print('v1: ',vec_1, 'v2: ', vec_2)
        
        result = {
            "vec_1": list(pickle.loads(vec_1[0])),
            "vec_2": list(pickle.loads(vec_2[0])),
        }

        print('w1: ',word_1, 'w2: ', word_2)
        print(result);        
        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify("")


@app.route("/save_test/", methods=["GET", "POST"])
def save_teste():
    if request.method == "POST":
        try:
            json = request.get_json()
            id = json["id"]
            data = json["data"]
            tempo = json["tempo"]
            palavra_sonda = json["palavra_sonda"]
            palavra_respondida = json["palavra_respondida"]
            similaridade = json["similaridade"]

            with sqlite3.connect("data.db") as con:
                cur = con.cursor()
                cur.execute(
                    """INSERT INTO game values (?,?,?,?,?,?)""",
                    (id, data, tempo, palavra_sonda, palavra_respondida, similaridade),
                )
                con.commit()
                msg = "200"
        except:
            con.rollback()
            msg = "500"

        finally:
            con.close()
            return jsonify(msg)


@app.errorhandler(404)
def not_found(error):
    return "page not found"


@app.errorhandler(500)
def error_handler(error):
    return error


@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store"
    return response


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
