from typing import Dict, List
import nltk
import re
from nltk.tokenize import sent_tokenize
from nltk.tokenize.punkt import PunktBaseClass
import requests
from dotenv import load_dotenv
import os
from functions.talk_to_gemini import talk_to_gemini
import json

load_dotenv()
nltk.download('punkt')

def webpage_annotations(text: str) -> Dict[str, List[tuple[str, str]]]:
    '''
    Given the body content of a website, return sentences that are annotated. A sentence is annotated by the following rules:
        - Red: If content is disputed by verifiable facts
        - Orange: If content is disputed by other sources online and if AI disagrees
        - Blue: If content contains highly manipulatory wording OR if its political charged
    :param: Body content of the webpage.
    :return: JSON object with the following structure:
        {
            "Red": [(sentence, ai_analysis)]
            "Orange": [(sentence, ai_analysis)]
            "Blue": [(sentence, ai_analysis)]
        }
        Where `sentence` is the sentence in the webpage that needs to be highlighted, and the `ai_analysis` being the AI's reasoning.
    '''
    # Normalize white space
    text = re.sub(r'\s+', ' ', text)

    # Sentence tokenizer
    sentences = sent_tokenize(text)
    sentences = [sentence.strip() for sentence in sentences]

    result = {
        "Red": [],
        "Orange": [],
        "Blue": []
    }

    # Variables helpful for testing
    len_sentences = len(sentences)
    count = -1
    for sentence in sentences:
        count += 1
        print(f"Analyzing sentence {count}/{len_sentences}: {sentence}")
        # If the sentence is disputed by verifiable facts
        investigate_red = is_red(sentence)
        if investigate_red[0]:
            result["Red"].append((sentence, investigate_red[1]))
            continue

        # If the sentence is disputed by other sources the AI finds or by the AI itself
        investigate_orange = is_orange(sentence)
        if investigate_orange[0]:
            result["Orange"].append((sentence, investigate_orange[1]))
            continue

        # If the sentence contains highly manipulatory wording OR if its politically charged
        investigate_blue = is_blue(sentence)
        if investigate_blue[0]:
            result["Blue"].append((sentence, investigate_blue[1]))
            continue

    return result

def is_red(sentence: str) -> tuple[bool, str]:
    '''
    Determines if this sentence is worthy of code red, a.k.a it is verifiably false.
    :param sentence: Sentence to examine.
    :return: True if it is code red, false if it's not as well as the ai's analysis.
    '''
    # TODO: Do some initial check of whether or not the sentence is actually making a substantial claim or not
    return check_fact_check_api(sentence)

def check_fact_check_api(query: str) -> tuple[bool, str]:
    '''
    Calls Google's Fact Check API to verify the query.
    '''
    api_key = os.getenv('FACT_CHECKER_API_KEY')  # Get the API key from the environment variables
    if not api_key:
        raise ValueError("API_KEY not found in environment variables")
    url = "https://factchecktools.googleapis.com/v1alpha1/claims:search"
    params = {
        'query': query,
        'languageCode': 'en',
        'key': api_key
    }

    response = requests.get(url, params=params)
    '''
    {
       "claims": [
          {
             "text": title,
             "claimant": publisher,
             "claimDate": time,
             "claimReview":[
                {
                   "publisher":{
                      "name": name,
                      "site": .com url of publisher
                   },
                   "url": url of article,
                   "title": title,
                   "textualRating": false, mostly false, inaccurate, etc.
                   "languageCode": "en"
                }
             ]
          }, ...
    '''
    resp_json = json.loads(response.content)
    if "claims" in resp_json:
        # go through each claim and check if top
        loc = resp_json["claims"]
        for claim in loc:
            # TODO: Compare relationship between title and the sentence
            # TODO: If they agree, check textualRating and if it's any variety of false, flag
            # TODO: If they contradict, check textualRating and if it's any variety of true, flag and return the URL of the article that says it's true
            pass

    return False, "test"

def is_orange(sentence: str) -> tuple[bool, str]:
    '''
    Determines if the sentence is worthy of code orange.
    :param sentence: Sentence to examine.
    :return: True if it is code orange, false if it's not as well as the ai's analysis.
    '''
    prompt = 'Given a claim, determine if it could be misleading or misinformation. If you believe that it is misinformation, give me a 2 sentence explanation, else respond with "N/A". Give me your response in the form of a JSON object with the following structure: { "is_misinfo": boolean, "explanation": str }.'
    resp = talk_to_gemini(prompt, return_json=True)
    resp_json = json.loads(resp)
    return resp_json["is_misinfo"], resp_json["explanation"]

def is_blue(sentence: str) -> tuple[bool, str]:
    '''
    Determines if the sentence is worthy of code blue.
    :param sentence: Sentence to examine.
    :return: True if it is code blue, false if it's not as well as the ai's analysis.
    '''
    prompt = 'Given a claim, determine if it is politically charged or highly emotionally manipulative for a user. If you believe that the claim is, give me a 2 sentence explanation, else response with "N/A". Give me your response in the form of a JSON object with the following structure: { "is_political_manipulative": boolean, "explanation": str }.'
    resp = talk_to_gemini(prompt, return_json=True)
    resp_json = json.loads(resp)
    return resp_json["is_political_manipulative"], resp_json["explanation"]
