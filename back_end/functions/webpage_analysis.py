from pickle import REDUCE
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
        - red: If content is disputed by verifiable facts
        - orange: If content is disputed by other sources online and if AI disagrees
        - blue: If content contains highly manipulatory wording OR if its political charged
    :param: Body content of the webpage.
    :return: JSON object with the following structure:
        {
            "red": [(sentence, ai_analysis)]
            "orange": [(sentence, ai_analysis)]
            "blue": [(sentence, ai_analysis)]
        }
        Where `sentence` is the sentence in the webpage that needs to be highlighted, and the `ai_analysis` being the AI's reasoning.
    '''
    # Normalize white space
    text = re.sub(r'\s+', ' ', text)

    # Sentence tokenizer
    sentences = sent_tokenize(text)
    sentences = [sentence.strip() for sentence in sentences]

    result = {
        "red": [],
        "orange": [],
        "blue": []
    }

    orange_prompt = 'Given text, return a list of phrases or sentences from the given text that is highly misleading (dont get stuck up on semantics or something nonconsequential) or could be straight misinformation. Do not over do it. For each phrase or sentence you believe could be misleading or misinformation, pair it with a 1-2 sentence explanation of why you believe so. Each of these string pairings forms a list of length 2. Put these lists of length 2 into a list and give me your findings in the form of a valid JSON object with the following structure: { "orange": List[List[str]]] }. Here is the text: ' + text
    orange_resp = talk_to_gemini(orange_prompt, return_json=True)
    print(f"Orange resp: {orange_resp}")
    orange_json = json.loads(orange_resp)
    result["orange"] = orange_json["orange"]

    # Investigate orange flagged sentences
    # for red in orange_json["orange"]:
    #     investigate_red = is_red(red[0])
    #     if investigate_red[0]:
    #         result["red"].append((red[0], investigate_red[1]))
    #     else:
    #         result["orange"].append(red)

    red_prompt = 'Given text, return a word or a phrase (avoid selecting a whole sentence) from the given text that is highly manipulative and uses extreme language. Do not over do it. For each phrase or sentence you believe could be manipulative, pair it with a 1-2 sentence explanation of why. Each of these string pairings forms a list of length 2. Put these lists of length 2 into a list and give me your findings in the form of a valid JSON object with the following structure: { "red": List[List[str]]] }. Here is the text: ' + text
    red_resp = talk_to_gemini(red_prompt, return_json=True)
    print(f"Red resp: {red_resp}")
    red_json = json.loads(red_resp)
    result["red"] = red_json["red"]

    # blue_prompt = 'Given text, return a list of phrases or sentences from the given text that is politically charged or highly emotionally manipulative for a user.'
    # new_blue_prompt = 'Given text, return a list of phrases or sentences from the given text that contains complicated topics or vocabulary for someone who has only received high school education and knows little outside context.'
    blue_prompt ='Given text, return a list of phrases or sentences from the given text that mentions specific people, historical events, or other complex political, economical, cultural references that may require additional context for a typical reader of news. Do not over do it. For each phrase or sentence you believe is confusing or complex, pair it with a clear, concise and simple sentence providing the context needed. Each of these pairings forms a list of length 2. Put these lists of length 2 into a list and give me your findings in the form of a valid JSON object with the following structure: { "blue": List[List[str]] }. Here is the text: ' + text
    # instead of bias & manipulation, let's do complicated sentences
    blue_resp = talk_to_gemini(blue_prompt, return_json=True)
    print(f"blue resp: {blue_resp}")
    blue_json = json.loads(blue_resp)
    result["blue"] = blue_json["blue"]

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
