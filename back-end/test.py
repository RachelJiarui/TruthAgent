import google.generativeai as genai
import os

genai.configure(api_key=os.environ["API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# Input you test prompt here
prompt = "How long has it been since June 12, 2024 19:24?"

response = model.generate_content(prompt)
print(response)
