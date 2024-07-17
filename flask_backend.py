from flask import Flask, request, render_template
from flask_cors import CORS, cross_origin
import model

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def my_form():
    return render_template('input.html')

@app.route('/health')
def health():
    return 'Health check!'

# @app.route('/predict')
# def predict():
#     input_data = 'Sample text 1 is the shortest. Colorado\'s seasons vary widely: cold, snowy winters; mild, sometimes snowy springs; warm, dry summers; and crisp, colorful autumns. Each season offers unique weather and stunning landscapes.'
#     predictions = model.load_model(input_data)
#     return predictions[0]

#Sample text 1 is the shortest. Colorado's seasons vary widely: cold, snowy winters; mild, sometimes snowy springs; warm, dry summers; and crisp, colorful autumns. Each season offers unique weather and stunning landscapes.

@app.route('/', methods=['POST'])
def predict():
    # input_data = request.form['text']
    input_data = request.get_json()['answer']
    predictions = model.load_model(input_data)
    return predictions[0]
    # return "response"


if __name__ == '__main__':
    app.run(debug=True, port=5000)
