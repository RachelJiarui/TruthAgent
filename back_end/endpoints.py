from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from functions.talk_to_gemini import talk_to_gemini
from functions.parse_webpage import parse_webpage
from functions.ai_analysis import ai_analysis

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Talk directly with Gemini AI
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

# Returns the webpage parsed
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

# Process of AI reading over shoulder
# Returns JSON object that follows this structure:
'''
{
	"author": author content,
	"publisher": publish content,
	"date": date content,
	"webpage-annotations": [
		"red": [sentences]
		"orange": [sentences]
		"blue": [sentences]
	]
}
'''
@app.route('/ai-reading', methods=['GET'])
def ai_process():
    # Extract URL
    url = request.args.get('url')
    result = None
    if url != None:
        result = ai_analysis(url)
    else:
        abort(400, "Did not send over string URL to perform AI reading")

    response = {
        "data": result
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
