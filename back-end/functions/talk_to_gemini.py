import google.generativeai as genai
import os
from typing import Union

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')
model_json = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})

def talk_to_gemini(user_prompt: Union[str, None], return_json=False) -> str:
    '''
    Talk to Gemini AI.
    :param:
        user_prompt: What you want to prompt Gemini AI.
        return_json: Default is set of false. If set true, the model will return a JSON object.
    :return: Gemini AI response.
    '''
    response = None
    if return_json:
        response = model_json.generate_content(user_prompt)
    else:
        response = model.generate_content(user_prompt)

    return response.text
