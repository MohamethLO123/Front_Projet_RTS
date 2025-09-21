from flask import Flask, request, jsonify
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)  # Autorise les requêtes depuis React

@app.route("/api/hertzien", methods=["POST"])
def bilan_hertzien():
    data = request.json
    pe = float(data["pe"])
    g1 = float(data["g1"])
    g2 = float(data["g2"])
    d = float(data["d"]) * 1000
    f = float(data["f"]) * 1e9
    pertes = float(data["pertes"])

    lambd = 3e8 / f
    L = 20 * math.log10((4 * math.pi * d) / lambd)
    pr = pe + g1 + g2 - L - pertes
    pr_mw = 10 ** (pr / 10)

    return jsonify({"pr": pr, "pr_mw": pr_mw})

@app.route("/api/optique", methods=["POST"])
def bilan_optique():
    data = request.json
    pe = float(data["pe"])
    longueur = float(data["longueur"])
    att = float(data["attenuation"])
    pertes = float(data["pertes"])

    pr = pe - (longueur * att + pertes)
    pr_mw = 10 ** (pr / 10)

    return jsonify({"pr": pr, "pr_mw": pr_mw})

if __name__ == "__main__":
    app.run(debug=True)
