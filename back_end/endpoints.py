from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from functions.talk_to_gemini import talk_to_gemini
from functions.parse_webpage import parse_webpage
from functions.ai_analysis import ai_analysis
from datetime import datetime

from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection URI
mongo_uri = "mongodb://127.0.0.1:27017/aianalysis"
client = MongoClient(mongo_uri)
db = client.aianalysis
collection = db.analysis_results

@app.route('/get-msgs', methods=['GET'])
def get_msgs():
    url = request.args.get('url')
    focus_type = request.args.get('focusType')
    focus_sentence = request.args.get('focusSentence')

    if not url or not focus_sentence or not focus_type:
        return jsonify({"error": "URL, focus sentence and focus type parameter is required"}), 400

    ai_analysis = collection.find_one({"url": url})

    if not ai_analysis:
        return jsonify({"error": "No analysis found for the given URL"}), 404

    annotations = ai_analysis.get("webpage_annotations", {}).get(focus_type, [])

    for annotation in annotations:
        if annotation["sentence"] == focus_sentence:
            messages = annotation.get("messages", [])
            return jsonify({"messages": messages}), 200

    return jsonify({"error": "Focus sentence not found"}), 404

@app.route('/post-msg-pairing', methods=['POST'])
def post_msg_pairing():
    data = request.json  # Access the JSON payload
    if not data:
        return jsonify({"error": "Data is required"}), 400

    url = data.get('url')
    focus_type = data.get('focusType')
    focus_sentence = data.get('focusSentence')
    user_msg = data.get('userMsg')
    ai_msg = data.get('aiMsg')

    if not url or not focus_type or not focus_sentence or not user_msg or not ai_msg:
        return jsonify({"error": "Did not fulfill parameter requirements"}), 400

    ai_analysis = collection.find_one({"url": url})

    if not ai_analysis:
        return jsonify({"error": "No analysis found for the given URL"}), 404

    annotations = ai_analysis.get("webpage_annotations", {}).get(focus_type, [])

    for annotation in annotations:
        if annotation["sentence"] == focus_sentence:
            timestamp = datetime.utcnow().isoformat()
            annotation["messages"].append({
                "id": f"{user_msg}-user-{timestamp}",
                "actor": "user",
                "msg": user_msg
            })
            annotation["messages"].append({
                "id": f"{ai_msg}-ai-{timestamp}",
                "actor": "ai",
                "msg": ai_msg
            })
            break
    else:
        return jsonify({"error": "Focus sentence not found"}), 404

    collection.update_one({"url": url}, {"$set": {"webpage_annotations": ai_analysis["webpage_annotations"]}})

    return jsonify({"status": "success", "message": "Messages added successfully"})

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
