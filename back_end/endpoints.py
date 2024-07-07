from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from functions.talk_to_gemini import talk_to_gemini
from functions.parse_webpage import parse_webpage
from functions.ai_analysis import ai_analysis

from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection URI
mongo_uri = "mongodb://127.0.0.1:27017/aianalysis"
client = MongoClient(mongo_uri)
db = client.aianalysis
collection = db.analysis_results

# Retrieve existing ai analysis at a URL if it exists, otherwise return False
@app.route('/check-cache', methods=['GET'])
def get_existing_ai_analysis():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "URL parameter is required"}), 400

    print("Got to checking cache. Looking to find if there's something stored at the url...")
    ai_analysis = collection.find_one({"url": url})
    if ai_analysis:
        ai_analysis.pop("_id")  # remove the ObjectId
        print("We found cache w/o id:", ai_analysis)
        response = {
            "data": ai_analysis
        }
        return jsonify(response)
    else:
        print("We didn't find cache.")
        return jsonify(False)

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

# creates ai analysis and TODO: stores it in the database
@app.route('/ai-reading', methods=['GET'])
def ai_process():
    # Extract URL
    url = request.args.get('url')
    result = None
    if url != None:
        result = ai_analysis(url)
        collection.insert_one(result)
    else:
        abort(400, "Did not send over string URL to perform AI reading")

    result.pop("_id")
    response = {
        "data": result
    }
    print("Response from /ai-reading", response)
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
