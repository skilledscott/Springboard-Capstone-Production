from flask import Flask

app = Flask(__name__)

@app.route('/detect-api')
def detect_api():
    return 'Welcome to the Detect api'
