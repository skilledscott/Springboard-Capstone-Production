from flask import Flask

app = Flask(__name__)

@app.route('/detect-api')
def detect_api():
    prediction = {
        'boxes': [[100, 100, 200, 200]],
        'labels': ['car'],
        'scores': [1.0]
    }

    return prediction, 200
