# 
# Use this one goober to launch rpgm games that support "www"
#


import flask
import subprocess
import os

app = flask.Flask("Runner")
TRANSLATOR_ENDPOINT_NAME = "tep.js"

@app.route("/")
def rt():
    with open("index.html", 'rb') as f:
        return f.read()

@app.route("/<path:pth>")
def req(pth):
    try:
        with open(pth, 'rb') as f:
            return f.read()
    except e: print(e)

if __name__ == "__main__":
    backsv = None
    if os.path.exists(TRANSLATOR_ENDPOINT_NAME):
        backsv = subprocess.Popen(f"node {TRANSLATOR_ENDPOINT_NAME}".split(" "))
    app.run(port=8080)