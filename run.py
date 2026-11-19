import flask

app = flask.Flask("Runner")

# Virginity - var: 201

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

app.run(port=8080)