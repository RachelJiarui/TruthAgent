import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from dotenv import load_dotenv
import os
from typing import Union
import json

load_dotenv()
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')
model_json = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})

SAFETY_SETTINGS = [
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": 4},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": 4},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": 4},
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": 4}
]

def talk_to_gemini(user_prompt: Union[str, None], return_json=False) -> str:
    '''
    Talk to Gemini AI.
    :param:
        user_prompt: What you want to prompt Gemini AI.
        return_json: Default is set of false. If set true, the model's response will abide by JSON rules that you establish.
    :return: Gemini AI response, always a string.
    '''
    response = None
    if return_json:
        response = model_json.generate_content(
            user_prompt,
            safety_settings=SAFETY_SETTINGS
        )
    else:
        response = model.generate_content(
            user_prompt,
            safety_settings=SAFETY_SETTINGS
        )

    if response is None or not response.parts:
        print("The response was blocked due to safety settings.")
        return "The response was blocked due to safety settings."

    return response.text.strip()
