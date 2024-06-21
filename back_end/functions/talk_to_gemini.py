import google.generativeai as genai
import os
from typing import Union
import json

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')
model_json = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})

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
        response = model_json.generate_content(user_prompt)
    else:
        response = model.generate_content(user_prompt)

    return response.text.strip()
