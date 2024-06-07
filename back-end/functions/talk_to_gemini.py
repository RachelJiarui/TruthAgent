import google.generativeai as genai
import os

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

def talk_to_gemini(user_prompt: str) -> str:
  response = model.generate_content(user_prompt)

  return response.text