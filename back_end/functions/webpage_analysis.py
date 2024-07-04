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
    # len_sentences = len(sentences)
    # count = -1
    # for sentence in sentences:
    #     count += 1
    #     print(f"Analyzing sentence {count}/{len_sentences} for code red: {sentence}")
    #     # If the sentence is disputed by verifiable facts
    #     investigate_red = is_red(sentence)
    #     if investigate_red[0]:
    #         result["Red"].append((sentence, investigate_red[1]))

    orange_prompt = 'Given text, return a list of phrases or sentences from the given text that is highly misleading or could be straight misinformation. For each phrase or sentence you believe could be misleading or misinformation, pair it with a 1-2 sentence explanation of why you believe so. Each of these string pairings forms a list of length 2. Put these lists of length 2 into a list and give me your findings in the form of a valid JSON object with the following structure: { "Orange": List[List[str]]] }. Here is the text: ' + text
    orange_resp = talk_to_gemini(orange_prompt, return_json=True)
    print(f"Orange resp: {orange_resp}")
    orange_json = json.loads(orange_resp)

    # Investigate orange flagged sentences
    for red in orange_json["Orange"]:
        investigate_red = is_red(red[0])
        if investigate_red[0]:
            result["Red"].append((red[0], investigate_red[1]))
        else:
            result["Orange"].append(red)
    result["Orange"] = orange_json["Orange"]

    blue_prompt = 'Given text, return a list of phrases or sentences from the given text that is politically charged or highly emotionally manipulative for a user. For each phrase or sentence you believe is politically charged or highly emotionally manipulative for a user, pair it with a 1-2 sentence explanation of why you believe so. Each of these pairings forms a list of length 2. Put these lists of length 2 into a list and give me your findings in the form of a valid JSON object with the following structure: { "Blue": List[List[str]] }. Here is the text: ' + text
    blue_resp = talk_to_gemini(blue_prompt, return_json=True)
    print(f"Blue resp: {blue_resp}")
    blue_json = json.loads(blue_resp)
    result["Blue"] = blue_json["Blue"]

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

        # TODO: Need to create mechanism for returning fact check information so that the annotation can be created.
        # Ex. "Flagged for being false by Snopes[URL]"

    return False, "The sentence is not verifiably false."

# TESTING
webpage_content = '''Since the beginning of the pandemic, key pieces of medical guidance from the World Health Organization have proven to be disastrously false — false enough to cost lives. It was the WHO, you’ll remember, that told us COVID couldn’t be transmitted between people, even as the virus was spreading into the United States. It was the WHO that worked in stealth with the Chinese government to obscure the source of the outbreak at the beginning, and then hide its origins from the world. We’re not attacking the WHO. Those are statements of fact. You’d think. they’d be disqualifying. Just the opposite. For more than a year, the tech monopolies of Silicon Valley have used the World Health Organization’s official statements to determine what American news consumers are allowed to know — and what they should be prohibited from knowing — about COVID. Facebook even announced a formal partnership with the WHO to "bring up to date and accurate information to billions of people. That partnership — between a China-controlled NGO, and the China-beholden tech platforms — continued smoothly until just a few days ago. That’s when bureaucrats at the WHO published new vaccine guidance. Here’s what it says: children should not take the coronavirus vaccine. Why? The drugs are too dangerous. There's not nearly enough data to understand the long-term effects or to show that the benefits are worth the risk that they bring. This is terrible news, of course, for the pharmaceutical industry. Big Pharma has been planning to test the vaccine on six-month-olds. It’s deeply embarrassing for much of the news media, which have taken a break from ginning up hysteria about Russian spies to sell vaccines to their viewers. And above all, it is a shocking repudiation of the American health establishment, which has been relentlessly pushing universal vaccination, including for children. Biden's top coronavirus adviser, Zeke Emanuel, declared that young people should be required to get the shot.'''
# print(webpage_annotations(webpage_content))

resp = '''{"Orange": [[""Hello world," he said", ""What should we do." The professor "said""],
                      ["awdW's is crazy", ""What!" How are you doing"]]}'''
# print(clean_analysis(resp))
