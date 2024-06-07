from flask import Flask, jsonify, request
from flask_cors import CORS
from functions.talk_to_gemini import talk_to_gemini  # Ensure this is correctly imported

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

if __name__ == '__main__':
    app.run(debug=True)
