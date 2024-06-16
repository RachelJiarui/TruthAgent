from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from functions.talk_to_gemini import talk_to_gemini
from functions.parse_webpage import parse_webpage

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/gemini_resp', methods=['GET'])
def gemini_resp():
    # Extract the query parameter from the request
    value = request.args.get('value')

    # Call the talk_to_gemini function with the extracted value
    result = talk_to_gemini(value)

    # Prepare the response
    response = {
        'result': result
    }
    return jsonify(response)

@app.route('/parse_webpage', methods=['GET'])
def parse_web():
    # Extract URL
    url = request.args.get('url')

    # Process url to get web page info
    result = None
    if url != None:
        result = parse_webpage(url)
    else:
        abort(400, "Did not send over string URL to parse webpage")

    response = {
        "data": result
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
