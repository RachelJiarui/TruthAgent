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

CONTENT_SETTINGS = {
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_UNSPECIFIED: HarmBlockThreshold.BLOCK_NONE
}

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
            safety_settings=CONTENT_SETTINGS
        )
    else:
        response = model.generate_content(
            user_prompt,
            safety_settings=CONTENT_SETTINGS
        )

    return response.text.strip()
